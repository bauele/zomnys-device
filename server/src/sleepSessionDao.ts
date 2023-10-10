import { SleepSession } from 'shared';
import { iDAOSqlite } from './iDaoSqlite';
import { ISleepSessionDAO } from './iSleepSessionDao';

export class SleepSessionDAO extends iDAOSqlite implements ISleepSessionDAO {
    private tableName = 'sleep_sessions';

    constructor() {
        super();
    }

    initalize(path: string) {
        const createOpenTableStatement = `CREATE TABLE IF NOT EXISTS 
            ${this.tableName}
            (   sleep_start INTEGER, 
                sleep_end INTEGER,
                awakening_count INTEGER, 
                PRIMARY KEY(sleep_start, sleep_end))`;

        return new Promise((success: Function) => {
            super.initializeDao(path, createOpenTableStatement);
            success();
        });
    }

    addSleepSession(sleepSession: SleepSession) {
        this.database?.run(`INSERT INTO ${this.tableName} VALUES (?, ?, ?)`, [
            sleepSession.timestampStart,
            sleepSession.timestampEnd,
            sleepSession.awakeningCount,
        ]);
    }

    getAllSleepSessions() {
        return new Promise(
            (completion: (sleepSessions: SleepSession[]) => void) => {
                let sleepSessions = new Array<SleepSession>();

                super
                    .getAllDaoType(
                        this.tableName,

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
                    )
                    .then(() => {
                        return completion(sleepSessions);
                    });
            },
        );
    }
}
