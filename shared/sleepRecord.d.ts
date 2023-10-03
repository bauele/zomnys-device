export default class SleepRecord {
    id: string;
    timestampStart: Date;
    timestampEnd: Date;
    awakeningCount: number;
    constructor(id: string, timestampStart: Date, timestampEnd: Date, awakeningCount: number);
}
