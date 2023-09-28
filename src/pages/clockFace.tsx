import { Link } from 'react-router-dom';
import { useState } from 'react';

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
    const [promptEndSleep, setPromptEndSleep] = useState(false);

    return (
        <div>
            <Clock date={currentDate} />

            {sleepingModeActive ? (
                //  If sleeping mode is active, then show the duration that
                //  the sleep timer has been active, along with any logged
                //  awakenings
                <div>
                    <SleepingModeTimer
                        currentDate={currentDate}
                        sleepingModeStart={sleepingModeStart}
                        awakeningCount={awakeningCount}
                    />
                </div>
            ) : (
                <></>
            )}

            {sleepingModeActive && !promptEndSleep ? (
                //  If sleeping mode is active and the user is not being
                //  prompted to confirm that they want to end their sleep
                //  session, show the clock face action buttons
                <div>
                    <Link to="/pages/log-awakening">
                        <Button onClick={() => {}} text="Log Awakening" />
                    </Link>
                </div>
            ) : (
                <></>
            )}

            {promptEndSleep ? (
                //  If the user is being prompted to end their sleep session,
                //  show the elements to allow them to do so
                <>
                    <p>Save sleep session?</p>
                    <Button onClick={() => {}} text="Yes" />
                    <Button
                        onClick={() => {
                            setPromptEndSleep(false);
                            toggleSleepingMode();
                        }}
                        text="No"
                    />
                    <Button
                        onClick={() => {
                            setPromptEndSleep(false);
                        }}
                        text="Continue Sleeping"
                    />
                </>
            ) : (
                <></>
            )}

            {!promptEndSleep ? (
                //  If the user is not being prompted to end their sleeping
                //  session, show the button to toggle sleeping mode
                <>
                    <Button
                        onClick={() => {
                            if (sleepingModeActive) {
                                //toggleSleepingMode();
                                setPromptEndSleep(true);
                            } else {
                                toggleSleepingMode();
                            }
                        }}
                        text="Toggle Sleeping Mode"
                    />
                </>
            ) : (
                <></>
            )}
        </div>
    );
}
