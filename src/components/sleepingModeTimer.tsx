type SleepingModeTimerProps = {
    currentDate: Date;
    sleepingModeStart: Date;
};

export default function SleepingModeTimer({
    currentDate,
    sleepingModeStart,
}: SleepingModeTimerProps) {
    function getSleepingModeTime() {
        //  Allow for some wiggle room in the date objects, but if the current date is set to
        //  more than a second earlier than the time sleeping mode was activated, throw an
        //  error
        if (currentDate.getTime() - sleepingModeStart.getTime() < -1000) {
            throw Error(
                'Sleeping mode cannot be activated before the current time'
            );
        }

        //  Get the amount of time sleeping mode has been active in milliseconds
        let sleepingModeTimeMs = Math.abs(
            currentDate.getTime() - sleepingModeStart.getTime()
        );

        let sleepingSeconds = Math.floor(sleepingModeTimeMs / 1000);
        let sleepingMinutes = 0;
        let sleepingHours = 0;

        while (sleepingSeconds >= 60) {
            sleepingSeconds -= 60;
            sleepingMinutes++;
        }

        while (sleepingMinutes >= 60) {
            sleepingMinutes -= 60;
            sleepingHours++;
        }

        return `You have been sleeping for ${sleepingHours} hr, ${sleepingMinutes} min, ${sleepingSeconds} sec`;
    }

    return <p>{getSleepingModeTime()}</p>;
}
