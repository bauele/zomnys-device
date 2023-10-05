export class SleepSession {
    timestampStart: Date;
    timestampEnd: Date;
    awakeningCount: number;

    constructor(
        timestampStart: Date,
        timestampEnd: Date,
        awakeningCount: number,
    ) {
        this.timestampStart = timestampStart;
        this.timestampEnd = timestampEnd;
        this.awakeningCount = awakeningCount;
    }
}
