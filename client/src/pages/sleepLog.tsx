import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SleepAwakening, SleepSession } from 'shared';
import Button from '../components/button';

type SleepLogProps = {};

export default function SleepLog({}: SleepLogProps) {
    const [sleepSessions, setSleepSessions] = useState(
        new Array<SleepSession>(),
    );

    const [sleepAwakenings, setSleepAwakenings] = useState(
        new Array<SleepAwakening>(),
    );

    useEffect(() => {
        //  Make call to server for all sleep sessions
        (async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_SERVER_ADDRESS}/sleep-log`,
                    {
                        method: 'GET',
                    },
                );

                //  Parse the response and update the state
                const sleepLogResponse = await response.json();
                const sleepSessionsResponse = sleepLogResponse.sleepSessions;
                const sleepAwakeningsResponse =
                    sleepLogResponse.sleepAwakenings;

                const sleepSessionsArray = new Array<SleepSession>();
                const sleepAwakeningsArray = new Array<SleepAwakening>();

                sleepSessionsResponse.forEach((sleepSession: SleepSession) =>
                    sleepSessionsArray.push(sleepSession),
                );

                sleepAwakeningsResponse.forEach(
                    (sleepAwakening: SleepAwakening) => {
                        sleepAwakeningsArray.push(sleepAwakening);
                    },
                );

                setSleepSessions(sleepSessionsArray);
                setSleepAwakenings(sleepAwakeningsArray);
            } catch (e) {
                console.error('Error getting sleep sessions: ', e);
            }
        })();
    }, []);

    function mapSleepAwakenings(sleepSession: SleepSession) {
        const associatedSleepAwakenings = sleepAwakenings.filter(
            (awakening) =>
                awakening.timestamp >= sleepSession.timestampStart &&
                awakening.timestamp <= sleepSession.timestampEnd,
        );

        return (
            <ol>
                {associatedSleepAwakenings.map(
                    (sleepAwakening: SleepAwakening) => {
                        return (
                            <li
                                key={new Date(
                                    sleepAwakening.timestamp,
                                ).toLocaleTimeString()}
                            >
                                {new Date(
                                    sleepAwakening.timestamp,
                                ).toLocaleTimeString()}
                                -{sleepAwakening.reason}
                            </li>
                        );
                    },
                )}
            </ol>
        );
    }

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
                            {mapSleepAwakenings(sleepSession)}
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
