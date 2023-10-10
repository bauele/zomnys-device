import express, { Request, Response } from 'express';
const cors = require('cors');
require('dotenv').config();

import { SleepSessionDAO } from './server/src/sleepSessionDao';
import { SleepAwakeningDAO } from './server/src/sleepAwakeningDao';
import { SleepSession } from './shared/sleepSession';
import { SleepAwakening } from './shared/sleepAwakening';

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
sleepSessionDAO.initalize(sleepSessionsDatabasePath).then(() => {
    console.log('Sleep session database ready');
});

//  Read in the path set for the sleep awakening database from the environment
//  variables file. If not available, throw an error and terminate
let sleepAwakeningsDatabasePath = process.env.SLEEP_AWAKENINGS_DATABASE_PATH;
if (!sleepAwakeningsDatabasePath) {
    console.error(
        'Database path for sleep awakenings database not properly set. Terminating.',
    );
    process.exit(1);
}
let sleepAwakeningDao = new SleepAwakeningDAO();
sleepAwakeningDao.initalize(sleepAwakeningsDatabasePath).then(() => {
    console.log('Sleep awakening database ready');
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

//  Get all of the available sleep awakenings
app.get('/sleep-awakenings', (req: Request, res: Response) => {
    const getAllSleepAwakeningsPromise =
        sleepAwakeningDao?.getAllSleepAwakenings();

    getAllSleepAwakeningsPromise.then((sleepAwakenings: SleepAwakening[]) => {
        res.send(sleepAwakenings);
    });
});

//  Get all of the available sleep sessions and sleep awakenings. These
//  will be returned as separate fields in a joint objec
app.get('/sleep-log', (req: Request, res: Response) => {
    const getAllSleepSessionsPromise = sleepSessionDAO?.getAllSleepSessions();

    getAllSleepSessionsPromise.then((sleepSessions: SleepSession[]) => {
        const getAllSleepAwakeningsPromise =
            sleepAwakeningDao?.getAllSleepAwakenings();

        getAllSleepAwakeningsPromise.then(
            (sleepAwakenings: SleepAwakening[]) => {
                res.send({
                    sleepSessions: sleepSessions,
                    sleepAwakenings: sleepAwakenings,
                });
            },
        );
    });
});

//  TODO: Error checking on request body parameters
app.post('/save-sleep-session', (req: Request, res: Response) => {
    console.log('Request recieved');

    console.log(req.body);
    const sleepSession = req.body.sleepSession;
    const sleepAwakenings = req.body.sleepAwakenings;
    console.log(sleepAwakenings);

    sleepSessionDAO.addSleepSession(sleepSession);

    sleepAwakenings.forEach((awakening: SleepAwakening) => {
        sleepAwakeningDao.addSleepAwakening(awakening);
    });

    res.send();
});
