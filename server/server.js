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

var client = new pg.Client({
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

// await client.connect()
// console.log('Connected to database.')
// await client.end()

app.get("/api", (req, res) => {
    res.json({content: 'hello'})
});

app.post("/api", (req, res) => {
   const data = req.body.json()
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
