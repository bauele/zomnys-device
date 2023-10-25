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
app.get('/sleep-sessions', (req: Request, res: Response) => {
    const getAllSleepSessionsPromise = sleepSessionDAO?.getAllSleepSessions();

    getAllSleepSessionsPromise.then((sleepSessions: SleepSession[]) => {
        res.send(sleepSessions);
    });
});

//  Get all of the available sleep awakenings
app.get('/sleep-awakenings', (req: Request, res: Response) => {
    const getAllSleepAwakeningsPromise =
        sleepAwakeningDAO?.getAllSleepAwakenings();

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
            sleepAwakeningDAO?.getAllSleepAwakenings();

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

app.delete('/delete-sleep-awakening', (req: Request, res: Response) => {
    console.log('request sent to /delete-sleep-awakening');

    const sleepAwakening = req.body.sleepAwakening;

    const deleteSleepAwakeningPromise =
        sleepAwakeningDAO.deleteSleepAwakening(sleepAwakening);
    deleteSleepAwakeningPromise.then((changes) => {
        console.log('Changes: ', changes);

        if (changes == 0) {
            res.sendStatus(404);
        } else if (changes == 1) {
            res.sendStatus(200);
        }
    });
});

//  Try to see if this could be an async function
app.delete('/delete-sleep-session', (req: Request, res: Response) => {
    console.log('request sent to /delete-sleep-session');

    const sleepSession: SleepSession = req.body.sleepSession;

    const deleteSleepSessionPromise =
        sleepSessionDAO.deleteSleepSession(sleepSession);
    deleteSleepSessionPromise.then((changes) => {
        console.log('Sleep Session Changes: ', changes);

        if (changes == 0) {
            res.sendStatus(404);
        } else if (changes == 1) {
            //  Delete all associated sleep awakenings
            const associatedSleepAwakeningsPromise =
                sleepAwakeningDAO.getAwakeningsBetweenTimestamps(
                    sleepSession.timestampStart,
                    sleepSession.timestampEnd,
                );

            let promiseArray = new Array<Promise<number | Error | void>>();

            associatedSleepAwakeningsPromise.then((sleepAwakenings) => {
                for (let i = 0; i < sleepAwakenings.length; i++) {
                    const sleepAwakening = sleepAwakenings.at(i);

                    if (sleepAwakening) {
                        const deleteSleepAwakeningPromise =
                            sleepAwakeningDAO.deleteSleepAwakening(
                                sleepAwakening,
                            );

                        promiseArray.push(
                            deleteSleepAwakeningPromise.then((changes) => {
                                return changes;
                            }),
                        );
                    }
                }

                Promise.all(promiseArray).then((promiseResults) => {
                    let deletions = 0;

                    promiseResults.forEach((result) => {
                        if (typeof result === 'number') {
                            deletions += result;
                        }
                    });

                    console.log(
                        `Deleted ${deletions} out of ${sleepAwakenings.length} sleep awakenings`,
                    );
                    if (deletions === sleepAwakenings.length) {
                        res.sendStatus(200);
                    } else {
                        console.log();
                        res.sendStatus(500);
                    }
                });
            });
        }
    });
});
