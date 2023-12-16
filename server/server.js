import express from 'express'
import dotenv from "dotenv";
import pg from 'pg';
import fs from 'fs';
import cors from 'cors';
import bp from 'body-parser';

dotenv.config();

const PORT = process.env.SERVERPORT;

const app = express();
app.use(cors());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json())

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
console.log('Connected to database.')

app.get("/api", (req, res) => {
    const text = 'SELECT * FROM Notes';
    pool.query(text).then(result =>{
        res.send(result.rows)
    }).catch(err => {
        console.log(err);
        res.sendStatus(501)
    })

});

app.post("/api", (req, res) => {
    const data = req.body
    if(data.type==='add'){
        console.log('Adding to DB')
        const text = `INSERT INTO Notes(title, content) VALUES (${data.note.title}, ${data.note.content})`;
        pool.query(text).then(res.sendStatus(200));
    }
    else if(data.type==='delete'){
        console.log('Deleting from DB.')
        console.log(data.nid)
        const text = `DELETE FROM Notes WHERE nid=${data.nid}`;
        pool.query(text).then(res.sendStatus(200));
    }

});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
