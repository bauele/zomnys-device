import { Link } from 'react-router-dom';

import Clock from '../components/clock';
import Button from '../components/button';
import SleepingModeTimer from '../components/sleepingModeTimer';

type ClockFaceProps = {
    currentDate: Date;
    sleepingModeActive: Boolean;
    sleepingModeStart: Date;
    toggleSleepingMode: Function;
    awakeningCount: number;
};

export default function ClockFace({
    currentDate,
    sleepingModeActive,
    sleepingModeStart,
    toggleSleepingMode,
    awakeningCount,
}: ClockFaceProps) {
    return (
        <div>
            <Clock date={currentDate} />
            {sleepingModeActive ? (
                <div>
                    <SleepingModeTimer
                        currentDate={currentDate}
                        sleepingModeStart={sleepingModeStart}
                        awakeningCount={awakeningCount}
                    />
                    <Link to="/pages/log-awakening">
                        <Button onClick={() => {}} text="Log Awakening" />
                    </Link>
                </div>
            ) : (
                <></>
            )}
            <Button
                onClick={() => {
                    toggleSleepingMode();
                }}
                text="Toggle Sleeping Mode"
            />
        </div>
    );
}
