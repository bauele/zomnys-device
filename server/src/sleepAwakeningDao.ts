import { SleepAwakening } from 'shared';
import { iDAOSqlite } from './iDaoSqlite';
import { ISleepAwakeningDAO } from './iSleepAwakeningDao';

export class SleepAwakeningDAO
    extends iDAOSqlite
    implements ISleepAwakeningDAO
{
    private tableName = 'sleep_awakenings';

    constructor() {
        super();
    }

    initalize(path: string) {
        const createOpenTableStatement = `CREATE TABLE IF NOT EXISTS 
            ${this.tableName}
            (   timestamp DATE, 
                reason STRING, 
                PRIMARY KEY(timestamp))`;

        return new Promise((success: Function) => {
            super.initializeDao(path, createOpenTableStatement);
            success();
        });
    }

    addSleepAwakening(sleepAwakening: SleepAwakening) {
        this.database?.run(`INSERT INTO ${this.tableName} VALUES (?, ?)`, [
            sleepAwakening.timestamp,
            sleepAwakening.reason,
        ]);
    }

    deleteSleepAwakening(sleepAwakening: SleepAwakening) {
        return new Promise((completion: (changes: number | Error) => void) => {
            this.database?.run(
                `DELETE FROM ${this.tableName} WHERE timestamp = (?) and reason = (?)`,
                [sleepAwakening.timestamp, sleepAwakening.reason],

                //  Callback function must be in this form in order to preserve
                //  the "this" binding used by sqlite
                function (error) {
                    if (error) {
                        completion(
                            new Error('Failed to delete sleep awakening'),
                        );
                    } else {
                        completion(this.changes);
                    }
                },
            );
        });
    }

    getAllSleepAwakenings() {
        return new Promise(
            (completion: (sleepAwakenings: SleepAwakening[]) => void) => {
                let sleepAwakenings = new Array<SleepAwakening>();

                super
                    .getAllDaoType(
                        this.tableName,

                        (
                            err: Error,
                            row: {
                                timestamp: any;
                                reason: any;
                            },
                        ) => {
                            if (err) {
                                console.error(err);
                            }

                            let sleepAwakening = new SleepAwakening(
                                row.timestamp,
                                row.reason,
                            );

                            sleepAwakenings.push(sleepAwakening);
                        },
                    )
                    .then(() => {
                        return completion(sleepAwakenings);
                    });
            },
        );
    }

    getAwakeningsBetweenTimestamps(start: Date, end: Date) {
        return new Promise(
            (completion: (sleepAwakenings: SleepAwakening[]) => void) => {
                //  Each row will contain fields matching the table
                let values = new Array<SleepAwakening>();

                try {
                    this.database?.all(
                        // SQL query to run
                        `SELECT * FROM ${this.tableName} WHERE timestamp BETWEEN (?) AND (?);`,

                        [
                            new Date(start).toISOString(),
                            new Date(end).toISOString(),
                        ],

                        //  Callback performed on completion of query
                        //  TODO: Checking on this? Can it be safe to assume that
                        //  this will be a SleepAwakening array? What if only
                        //  one row is returned?
                        (err: Error, rows: SleepAwakening[]) => {
                            if (err) {
                                console.error(err);
                            }

                            return completion(rows);
                        },
                    );
                } catch (e) {
                    console.error('Error getting from database: ' + e);
                }
            },
        );
    }
}
