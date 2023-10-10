import { ISleepSessionDAO } from './iSleepSessionDao';
import { ISleepAwakeningDAO } from './iSleepAwakeningDao';

export type DAOType = ISleepSessionDAO | ISleepAwakeningDAO;
