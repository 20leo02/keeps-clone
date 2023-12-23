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
    serviceName: 'keeps',

    secretToken: 'Nmz6vpHwFXnOXdKO3w',

    serverUrl: 'https://0ec13320672f44ac9c92b32d94cd58b7.apm.us-east-2.aws.elastic-cloud.com:443',

    environment: 'keeps-env',

    active: true,
});

agent.startTransaction('keeps-transaction');
const traceparent = agent.currentTraceparent
agent.endTransaction();
const PORT = process.env.SERVERPORT;
//App setup.
const app = express();
app.use(cors());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json())

// Add this to the very top of the first file loaded in your app
const log = pino(
    ecsFormat({
        serviceName: 'keeps',
    }),
    pino.destination('./app.log'));

log.info(`APM Agent status: ${apm.isStarted()?'Online':'Offline'}`)

//DB connection setup.
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

app.get("/api", (req, res) => {
    //Query DB to make Note information available on the API.
    const span = agent.startSpan('db notes api data');
    const text = 'SELECT * FROM Notes';
    pool.query(text).then(result =>{
        res.send(result.rows)
    }).catch(err => {
        log.info(err);
        res.sendStatus(501)
    })
    log.info('Opened API')
    if(span) span.end();

});


app.post("/api", (req, res) => {
    const data = req.body
    if(data.type==='add'){
        const span = agent.startSpan('api add');
        //Insert single Note in DB
        log.info('Adding to DB')
        const text = `INSERT INTO Notes(title, content) VALUES ('${data.note.title}', '${data.note.content}')`;
        pool.query(text).then(res.sendStatus(200));
        if(span) span.end();
    }
    else if(data.type==='delete'){
        //Delete single Note from DB.
        const span = agent.startSpan('api delete');
        log.info('Deleting from DB.')
        const text = `DELETE FROM Notes WHERE nid=${data.nid}`;
        pool.query(text).then(res.sendStatus(200));
        if(span) span.end();
    }
});

app.listen(PORT, () => {
    log.info(`Listening on port ${PORT}`)
});
