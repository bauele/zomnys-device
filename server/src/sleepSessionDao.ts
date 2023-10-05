import { create } from 'domain';
import { ISleepSessionDAO } from './iSleepSessionDao';
import { SleepSession } from 'shared';
import sqlite3, { OPEN_READWRITE } from 'sqlite3';

export class SleepSessionDAO implements ISleepSessionDAO {
    database: sqlite3.Database | null;

    constructor() {
        this.database = null;
    }

    //  Attempts to create or open the database. If successful, also attempts
    //  to create the table if it doesn't already exist
    //  path -  Location of where to create or open database
    //  Returns a promise
    initialize(path: string) {
        const createOpenDatabase = (success: () => void) => {
            //  Create database if it doesn't already exist
            this.database = new sqlite3.Database(
                path,
                sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
                (error) => {
                    if (error) {
                        console.error(
                            'Error creating sleep_sessions database: ' + error,
                        );
                    } else {
                        success();
                    }
                },
            );
        };

        const createOpenTable = (success: () => void) => {
            //  Create table if it doesn't already exist
            this.database?.exec(
                'CREATE TABLE IF NOT EXISTS sleep_sessions(sleep_start INTEGER, sleep_end INTEGER, awakening_count INTEGER, PRIMARY KEY(sleep_start, sleep_end))',
                (error) => {
                    if (error) {
                        console.error(
                            'Error creating sleep_sessions table: ' + error,
                        );
                    } else {
                        success();
                    }
                },
            );
        };

        return new Promise((success: Function) => {
            createOpenDatabase(() => {
                createOpenTable(() => {
                    success();
                });
            });
        });
    }

    //  Add a sleep session into the local database
    //  sleepSession -  SleepSession object to be added
    addSleepSession(sleepSession: SleepSession) {
        this.database?.run('INSERT INTO sleep_sessions VALUES (?, ?, ?)', [
            sleepSession.timestampStart,
            sleepSession.timestampEnd,
            sleepSession.awakeningCount,
        ]);
    }

    //  Get all sleep sessions stored in local database
    //  Returns a promise containing the found sleep sessions
    getAllSleepSessions() {
        return new Promise(
            (completion: (sleepSession: SleepSession[]) => void) => {
                let sleepSessions = new Array<SleepSession>();

                //  Each row will contain fields matching the table
                try {
                    this.database?.each(
                        // SQL query to run
                        'SELECT * FROM sleep_sessions',

                        // Callback performed on each returned row
                        (
                            err: Error,
                            row: {
                                sleep_start: any;
                                sleep_end: any;
                                awakening_count: any;
                            },
                        ) => {
                            if (err) {
                                console.error(err);
                            }

                            let sleepSession = new SleepSession(
                                row.sleep_start,
                                row.sleep_end,
                                row.awakening_count,
                            );

                            sleepSessions.push(sleepSession);
                        },

                        //  Callback performed on completion of query
                        () => {
                            return completion(sleepSessions);
                        },
                    );
                } catch (e) {
                    console.error(
                        'Error getting sleep sessions from database: ' + e,
                    );
                }
            },
        );
    }
}
