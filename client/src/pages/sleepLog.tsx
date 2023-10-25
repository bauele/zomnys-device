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
                                <Button
                                    text="Delete"
                                    onClick={() => {
                                        deleteSleepAwakening(sleepAwakening);
                                    }}
                                />
                            </li>
                        );
                    },
                )}
            </ol>
        );
    }

    async function deleteSleepSession(sleepSession: SleepSession) {
        try {
            //  Send request to delete sleep awakening
            const deleteSleepSessionResponse = await fetch(
                `${process.env.REACT_APP_SERVER_ADDRESS}/delete-sleep-session`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sleepSession,
                    }),
                },
            );

            if (deleteSleepSessionResponse.status !== 200) {
                throw new Error();
            } else {
                //  Filter the array to every element except for the one with the same timestamp
                //  matching supplied argument
                const newSleepSessions = sleepSessions.filter(
                    (element) =>
                        new Date(element.timestampStart).getTime() !==
                        new Date(sleepSession.timestampStart).getTime(),
                );

                //  Remove sleep awakening from state
                setSleepSessions(newSleepSessions);
            }
        } catch (e) {
            console.error('Error deleteing sleep awakening: ', e);
        }
    }

    async function deleteSleepAwakening(sleepAwakening: SleepAwakening) {
        try {
            //  Send request to delete sleep awakening
            const deleteSleepAwakeningResponse = await fetch(
                `${process.env.REACT_APP_SERVER_ADDRESS}/delete-sleep-awakening`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sleepAwakening,
                    }),
                },
            );

            if (deleteSleepAwakeningResponse.status !== 200) {
                throw new Error();
            } else {
                //  Filter the array to every element except for the one with the same timestamp
                //  matching supplied argument
                const newSleepAwakenings = sleepAwakenings.filter(
                    (element) =>
                        new Date(element.timestamp).getTime() !==
                        new Date(sleepAwakening.timestamp).getTime(),
                );

                //  Remove sleep awakening from state
                setSleepAwakenings(newSleepAwakenings);
            }
        } catch (e) {
            console.error('Error deleteing sleep awakening: ', e);
        }
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
                            <Button
                                text="Delete"
                                onClick={() => {
                                    deleteSleepSession(sleepSession);
                                }}
                            />
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
