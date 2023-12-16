import express from 'express'
import dotenv from "dotenv";
import pg from 'pg';
import fs from 'fs';
import cors from 'cors';
import bp from 'body-parser';

dotenv.config();

const PORT = process.env.SERVERPORT;
//App setup.
const app = express();
app.use(cors());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json())

//DB connection setup.
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
    //Query DB to make Note information available on the API.
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
        //Insert single Note in DB
        console.log('Adding to DB')
        const text = `INSERT INTO Notes(title, content) VALUES ('${data.note.title}', '${data.note.content}')`;
        pool.query(text).then(res.sendStatus(200));
    }
    else if(data.type==='delete'){
        //Delete single Note from DB.
        console.log('Deleting from DB.')
        const text = `DELETE FROM Notes WHERE nid=${data.nid}`;
        pool.query(text).then(res.sendStatus(200));
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
