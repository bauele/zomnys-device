import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import ClockFace from './pages/clockFace';
import LogAwakening from './pages/logAwakening';

import { SleepLog, SleepSession } from 'shared';

let sl = new SleepLog();
sl.print();

let sr = new SleepSession('1', new Date(), new Date(), 3);

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
        //  Obtain a new date object with the current time every second
        timerId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => {
            //  Release the timer when unmounting component
            clearInterval(timerId);
        };
    });

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

    return (
        <main>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <p>Sleep Log</p>
                            <ClockFace
                                currentDate={currentDate}
                                sleepingModeActive={sleepingModeActive}
                                sleepingModeStart={sleepingModeStart}
                                toggleSleepingMode={() => toggleSleepingMode()}
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
            </Routes>
        </main>
    );
}
