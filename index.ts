import express, { Request, Response } from 'express';
const app = express();
const port = 5000;

import sqlite3 from 'sqlite3';
import { SleepRecord } from './shared/sleepRecord';

//  Create database if it doesn't already exist
let db = new sqlite3.Database('data/sleep_log.db', (error) => {
    console.log(error);
});

let sr = new SleepRecord('1', new Date(), new Date(), 3);

db.exec(
    'CREATE TABLE IF NOT EXISTS sleep_sessions(id INTEGER PRIMARY KEY AUTOINCREMENT, sleep_start INTEGER, sleep_end INTEGER, awakening_count INTEGER)',
);
db.exec('INSERT INTO sleep_sessions VALUES (NULL, 112, 112, 3)');
db.each('SELECT * FROM sleep_sessions', (err, row) => {
    if (err) {
        console.log(err);
    }

    console.log(row);
});

db.close();

app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/', (req: Request, res: Response) => {
    res.send('Home');
});
