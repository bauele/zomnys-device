import { SleepAwakening } from 'shared';

//  This interface describes all of the behaviors needed to be implemented
//  by any class facilitating interaction between sleep session objects
//  and a database
export interface ISleepAwakeningDAO {
    addSleepAwakening: (sleepAwakening: SleepAwakening) => void;
    getAllSleepAwakenings: () => Promise<SleepAwakening[]>;
}
