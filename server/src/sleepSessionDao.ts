import { ISleepSessionDAO } from './iSleepSessionDao';
import { SleepSession } from 'shared';
import { sqlite3 } from 'sqlite3';

export class SleepSessionDAO implements ISleepSessionDAO {
    constructor() {}

    //  Add a sleep session into the local database
    //  sleepSession -  SleepSession object to be added
    addSleepSession(sleepSession: SleepSession) {}

    //  Get all sleep sessions stored in local database
    getAllSleepSessions() {
        return new Array<SleepSession>();
    }
}
