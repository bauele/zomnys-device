import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SleepSession } from 'shared';
import Button from '../components/button';

type SleepLogProps = {};

export default function SleepLog({}: SleepLogProps) {
    const [sleepSessions, setSleepSessions] = useState(
        new Array<SleepSession>(),
    );

    useEffect(() => {
        //  Make call to server for all sleep sessions
        (async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_SERVER_ADDRESS}/sleep-sessions`,
                    //'http://localhost:50100/sleep-sessions',
                    {
                        method: 'GET',
                    },
                );

                //  Parse the response and update the state

                const sleepSessionsResponse = await response.json();
                const sleepSessionsArray = new Array<SleepSession>();
                sleepSessionsResponse.forEach((sleepSession: SleepSession) =>
                    sleepSessionsArray.push(sleepSession),
                );
                setSleepSessions(sleepSessionsArray);
            } catch (e) {
                console.error('Error getting sleep sessions: ', e);
            }
        })();
    }, []);

    return (
        <>
            <h1>Sleep Log</h1>

            <ol>
                {sleepSessions.map((sleepSession: SleepSession) => {
                    return (
                        <li key={sleepSession.timestampStart.toString()}>
                            Sleep Start:{' '}
                            {new Date(
                                sleepSession.timestampStart,
                            ).toLocaleTimeString()}
                            {' ~ '}
                            Sleep End:{' '}
                            {new Date(
                                sleepSession.timestampEnd,
                            ).toLocaleTimeString()}
                            {' ~ '}
                            Awakenings: {sleepSession.awakeningCount}
                        </li>
                    );
                })}
            </ol>

            <Link to="/">
                <Button text="Back" onClick={() => {}} />
            </Link>
        </>
    );
}
