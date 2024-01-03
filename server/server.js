import express from 'express'
import dotenv from "dotenv";
import pg from 'pg';
import fs from 'fs';
import cors from 'cors';
import bp from 'body-parser';
import apm from 'elastic-apm-node'
import { ecsFormat } from '@elastic/ecs-pino-format'
import pino from 'pino'

dotenv.config();
const agent = apm.start({
    serviceName: process.env.APM_SN,

    secretToken: process.env.APM_ST,

    serverUrl: process.env.APM_URL,

    environment: process.env.APM_ENV,
});
const PORT = process.env.SERVERPORT;
//App setup.
const app = express();
app.use(cors());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json())
const log = pino(
    ecsFormat({}),
    pino.destination('./app.log'));

log.info(`APM Agent status: ${agent.isStarted()?'Online':'Offline'}`)

//DB connection setup.
const con_tr = apm.startTransaction('DB connection')
const con_span = con_tr.startSpan('db connect')
log.info('Connecting to database...')
var pool = new pg.Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: 5432,
    host: process.env.PGHOST,
    ssl: {
        require: true,
        ca: fs.readFileSync("./certs/global-bundle.pem").toString()
    }
});

await pool.connect()
log.info('Connected to database.')
if(con_span) con_span.end()
if(con_tr) con_tr.end()

app.get("/api", (req, res) => {
    const fetch_tr = agent.startTransaction('DB fetch')
    //Query DB to make Note information available on the API.
    const f_span = fetch_tr.startSpan('db notes api data');
    log.info('inserting into api...')
    const text = 'SELECT * FROM Notes';
    pool.query(text).then(result =>{
        res.send(result.rows)
    }).catch(err => {
        log.info(err);
        res.sendStatus(501)
    })
    log.info('insertion successful')
    if(f_span) f_span.end();
    if(fetch_tr) fetch_tr.end()
});


app.post("/api", (req, res) => {
    const edit_tr = agent.startTransaction('DB edit')
    const data = req.body
    if(data.type==='add'){
        const add_span = edit_tr.startSpan('api add');
        //Insert single Note in DB
        log.info('Adding to DB')
        const text = `INSERT INTO Notes(title, content) VALUES ('${data.note.title}', '${data.note.content}')`;
        pool.query(text).then(res.sendStatus(200));
        log.info('Added to DB')
        if(add_span) add_span.end();
    }
    else if(data.type==='delete'){
        //Delete single Note from DB.
        const del_span = edit_tr.startSpan('api delete');
        log.info('Deleting from DB.')
        const text = `DELETE FROM Notes WHERE nid=${data.nid}`;
        pool.query(text).then(res.sendStatus(200));
        log.info('Deleted from DB')
        if(del_span) del_span.end();
    }
    if(edit_tr) edit_tr.end()
});

app.use(agent.middleware.connect())
app.listen(PORT, () => {
    log.info(`Listening on port ${PORT}`)
});
