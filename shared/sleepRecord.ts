export class SleepRecord {
    id: string;
    timestampStart: Date;
    timestampEnd: Date;
    awakeningCount: number;

    constructor(
        id: string,
        timestampStart: Date,
        timestampEnd: Date,
        awakeningCount: number,
    ) {
        this.id = id;
        this.timestampStart = timestampStart;
        this.timestampEnd = timestampEnd;
        this.awakeningCount = awakeningCount;
    }
}
