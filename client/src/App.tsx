import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import ClockFace from './pages/clockFace';
import LogAwakening from './pages/logAwakening';

import { SleepSession } from 'shared';
import Button from './components/button';
import SleepLog from './pages/sleepLog';

if (process.env.REACT_APP_MODE === 'development') {
    console.log('App is in development mode');
    const { worker } = require('./mocks/browser');
    worker.listen();
}

export default function App() {
    //  Timer that is used to update the clock
    let timerId: NodeJS.Timer;

    const [currentDate, setCurrentDate] = useState(new Date());
    const [sleepingModeActive, setSleepingModeActive] = useState(false);
    const [sleepingModeStart, setSleepingModeStart] = useState(new Date());
    const [awakeningCount, setAwakeningCount] = useState(0);
    const [awakeningLog, setAwakeningLog] = useState(
        Array<{ timestamp: Date; reason: String }>,
    );

    useEffect(() => {
        //  Get the current date immediately
        setCurrentDate(new Date());

        //  Continue to update the current date every second
        timerId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => {
            //  Release the timer when unmounting component
            clearInterval(timerId);
        };
    }, []);

    function toggleSleepingMode() {
        //  If sleeping mode was not already active, get a current timestamp
        if (!sleepingModeActive) {
            setSleepingModeStart(new Date());
        }
        //  Otherwise, reset the awakening states
        else {
            setSleepingModeStart(new Date(0));
            setAwakeningCount(0);
            setAwakeningLog(Array<{ timestamp: Date; reason: String }>());
        }

        setSleepingModeActive(!sleepingModeActive);
    }

    function logAwakening(timestamp: Date, reason: String) {
        //  Add the reported awakening entry into the log
        const newAwakeningEntry = { timestamp: timestamp, reason: reason };
        setAwakeningLog([...awakeningLog, newAwakeningEntry]);
        setAwakeningCount(awakeningCount + 1);
    }

    async function saveSleepSession() {
        try {
            //  Create a new sleep session
            const sleepSession = new SleepSession(
                sleepingModeStart,
                new Date(),
                awakeningCount,
            );

            //  Post the sleep session to the server
            await fetch(
                `${process.env.REACT_APP_SERVER_ADDRESS}/save-sleep-session`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sleepSession,
                    }),
                },
            );

            //  Once sleep session has been saved, turn off sleeping mode
            toggleSleepingMode();
        } catch (e) {
            console.error('Error saving sleep session: ', e);
        }
    }

    return (
        <main>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Link to="/pages/sleep-log">
                                <Button onClick={() => {}} text="Sleep Log" />
                            </Link>

                            <ClockFace
                                currentDate={currentDate}
                                sleepingModeActive={sleepingModeActive}
                                sleepingModeStart={sleepingModeStart}
                                toggleSleepingMode={() => toggleSleepingMode()}
                                saveSleepSession={saveSleepSession}
                                awakeningCount={awakeningCount}
                            ></ClockFace>
                        </>
                    }
                />
                <Route
                    path="pages/log-awakening"
                    element={
                        <LogAwakening
                            onAwakeningLogged={(
                                timestamp: Date,
                                reason: String,
                            ) => {
                                logAwakening(timestamp, reason);
                            }}
                        />
                    }
                ></Route>
                <Route path="pages/sleep-log" element={<SleepLog />}></Route>
            </Routes>
        </main>
    );
}
