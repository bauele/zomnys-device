import express, { Request, Response } from 'express';
const cors = require('cors');
require('dotenv').config();

import { SleepSessionDAO } from './server/src/sleepSessionDao';
import { SleepSession } from './shared/sleepSession';

const app = express();
const port = 5000;

//  Read in the path set for the sleep sessions database from the environment
//  variables file. If not available, throw an error and terminate
let sleepSessionsDatabasePath = process.env.SLEEP_SESSIONS_DATABASE_PATH;
if (!sleepSessionsDatabasePath) {
    console.error(
        'Database path for sleep sessions database not properly set. Terminating.',
    );
    process.exit(1);
}
let sleepSessionDAO = new SleepSessionDAO();
sleepSessionDAO.initialize(sleepSessionsDatabasePath).then(() => {
    console.log('Database ready');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
app.use(
    cors({
        origin: '*',
    }),
);
app.use(express.json());

//  Get all of the available sleep sessions
app.get('/sleep-sessions', (req: Request, res: Response) => {
    const getAllSleepSessionsPromise = sleepSessionDAO?.getAllSleepSessions();

    getAllSleepSessionsPromise.then((sleepSessions: SleepSession[]) => {
        res.send(sleepSessions);
    });
});

//  TODO: Error checking on request body parameters
app.post('/save-sleep-session', (req: Request, res: Response) => {
    console.log('Request recieved');

    const sleepSession = req.body.sleepSession;
    const awakeningLog = req.body.awakeningLog;

    sleepSessionDAO.addSleepSession(sleepSession);
    res.send();
});
