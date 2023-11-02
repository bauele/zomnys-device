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
let sleepAwakeningDAO = new SleepAwakeningDAO();
sleepAwakeningDAO.initalize(sleepAwakeningsDatabasePath).then(() => {
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
app.get('/sleep-sessions', async (req: Request, res: Response) => {
    const sleepSessions = await sleepSessionDAO?.getAllSleepSessions();
    res.send(sleepSessions);
});

//  Get all of the available sleep awakenings
app.get('/sleep-awakenings', (req: Request, res: Response) => {
    const sleepAwakenings = sleepAwakeningDAO?.getAllSleepAwakenings();
    res.send(sleepAwakenings);
});

//  Get all of the available sleep sessions and sleep awakenings. These
//  will be returned as separate fields in a joint objec
app.get('/sleep-log', async (req: Request, res: Response) => {
    const sleepSessions = await sleepSessionDAO?.getAllSleepSessions();
    const sleepAwakenings = await sleepAwakeningDAO?.getAllSleepAwakenings();

    res.send({
        sleepSessions: sleepSessions,
        sleepAwakenings: sleepAwakenings,
    });
});

//  TODO: Error checking on request body parameters
app.post('/save-sleep-session', (req: Request, res: Response) => {
    console.log('request sent to /save-sleep-session');

    console.log(req.body);
    const sleepSession = req.body.sleepSession;
    const sleepAwakenings = req.body.sleepAwakenings;
    console.log(sleepAwakenings);

    sleepSessionDAO.addSleepSession(sleepSession);

    sleepAwakenings.forEach((awakening: SleepAwakening) => {
        sleepAwakeningDAO.addSleepAwakening(awakening);
    });

    res.send();
});

app.delete('/delete-sleep-awakening', async (req: Request, res: Response) => {
    console.log('request sent to /delete-sleep-awakening');

    //  TODO: Do not assume that this object is what is being sent
    const sleepAwakening = req.body.sleepAwakening;

    const deletedSleepAwakenings =
        await sleepAwakeningDAO.deleteSleepAwakening(sleepAwakening);

    //  If one sleep awakening was deleted, then the request was successful
    if (deletedSleepAwakenings === 1) {
        res.sendStatus(200);
    }

    //  Otherwise, there was an error
    else {
        res.sendStatus(404);
    }
});

app.delete('/delete-sleep-session', async (req: Request, res: Response) => {
    console.log('request sent to /delete-sleep-session');

    //  TODO: Do not assume that this object is what is being sent
    const sleepSession: SleepSession = req.body.sleepSession;

    const deletedSleepSessions =
        await sleepSessionDAO.deleteSleepSession(sleepSession);

    //  Return an error if no deletions were made. This indicates
    //  that the resource to be deleted was not found
    console.log(deletedSleepSessions);
    if (deletedSleepSessions == 0) {
        res.sendStatus(404);
        return;
    }

    //  Get all of the sleep awakenings in the sleep session
    const sleepAwakeningsInSession =
        await sleepAwakeningDAO.getAwakeningsBetweenTimestamps(
            sleepSession.timestampStart,
            sleepSession.timestampEnd,
        );

    //  Declare a function to delete a sleep awakening
    const deleteSleepAwakening = async (sleepAwakening: SleepAwakening) => {
        return sleepAwakeningDAO.deleteSleepAwakening(sleepAwakening);
    };

    //  Filter the sleep awakenings to ensure all elements are valid, then
    //  delete each sleep awakening and return an array of deletion results
    const sleepAwakeningsDeletionResults = await Promise.all(
        sleepAwakeningsInSession
            .filter((sleepAwakenings) => sleepAwakenings)
            .map(deleteSleepAwakening),
    );

    //  Filter the results to include only results that returned a numerical value
    const deletedSleepAwakenings = sleepAwakeningsDeletionResults.filter(
        (sleepAwakening) => typeof sleepAwakening === 'number',
    );

    //  If the amount of deleted sleep awakening records matches the inital number
    //  of sleep awakenings in the session, then all of the sleep awakenings were
    //  successfully deleted
    if (deletedSleepAwakenings.length === sleepAwakeningsInSession.length) {
        console.log('Deletion successful');
        res.sendStatus(200);
    } else {
        console.log('Error processing deletions');
        res.sendStatus(500);
    }
});
