import { SleepSession } from 'shared';

//  This interface describes all of the behaviors needed to be implemented
//  by any class facilitating interaction between sleep session objects
//  and a database
export interface ISleepSessionDAO {
    addSleepSession: (sleepSession: SleepSession) => void;
    deleteSleepSession: (sleepSession: SleepSession) => void;
    getAllSleepSessions: () => Promise<SleepSession[]>;
}
