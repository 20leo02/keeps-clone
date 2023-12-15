import express from 'express'
import http from 'http';
import dotenv from "dotenv";
import pg from 'pg';
import fs from 'fs';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors);
app.use(express.json());


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

await client.connect()

console.log(await client.query('SELECT NOW()'))

await client.end()
//await client.connect()

app.get("/api", (req, res) => {
    res.send({ message: "Hello from Express!" });
});
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));