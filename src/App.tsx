import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Clock from './components/clock';
import SleepingModeTimer from './components/sleepingModeTimer';
import Button from './components/button';

export default function App() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [sleepingModeActive, setSleepingModeActive] = useState(false);
    const [sleepingModeStart, setSleepingModeStart] = useState(new Date());

    //  Obtain a new date object with the current time every second
    setInterval(() => {
        setCurrentDate(new Date());
    }, 1000);

    function toggleSleepingMode() {
        if (!sleepingModeActive) {
            setSleepingModeStart(new Date());
        }

        setSleepingModeActive(!sleepingModeActive);
    }

    return (
        <main>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Clock date={currentDate} />
                            {sleepingModeActive ? (
                                <div>
                                    <SleepingModeTimer
                                        currentDate={currentDate}
                                        sleepingModeStart={sleepingModeStart}
                                    />
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
                        </>
                    }
                />
            </Routes>
        </main>
    );
}
