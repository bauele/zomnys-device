import { rest } from 'msw';
import { SleepAwakening, SleepSession } from 'shared';

export const handlers = [
    //  Handles a GET /sleep-sessions request
    rest.get(
        `${process.env.REACT_APP_SERVER_ADDRESS}/sleep-sessions`,
        (request, response, context) => {
            const sleepSessions = new Array<SleepSession>();

            const ss1 = new SleepSession(
                new Date(2020, 11, 1, 1, 0, 0),
                new Date(2020, 11, 1, 9, 0, 0),
                6,
            );
            const ss2 = new SleepSession(
                new Date(2020, 11, 5, 3, 0, 0),
                new Date(2020, 11, 5, 11, 30, 0),
                6,
            );

            sleepSessions.push(ss1);
            sleepSessions.push(ss2);

            return response(context.json(sleepSessions));
        },
    ),

    rest.get(
        `${process.env.REACT_APP_SERVER_ADDRESS}/sleep-log`,
        (request, response, context) => {
            const sleepSessions = new Array<SleepSession>();
            const sleepAwakenings = new Array<SleepAwakening>();

            const ss1 = new SleepSession(
                new Date(2020, 11, 1, 1, 0, 0),
                new Date(2020, 11, 1, 9, 0, 0),
                6,
            );
            const ss2 = new SleepSession(
                new Date(2020, 11, 5, 3, 0, 0),
                new Date(2020, 11, 5, 11, 30, 0),
                6,
            );

            const sa1 = new SleepAwakening(
                new Date(2020, 11, 1, 3, 30, 0),
                'General',
            );
            const sa2 = new SleepAwakening(
                new Date(2020, 11, 1, 4, 15, 10),
                'Bathroom',
            );
            const sa3 = new SleepAwakening(
                new Date(2020, 11, 1, 4, 25, 10),
                'General',
            );
            const sa4 = new SleepAwakening(
                new Date(2020, 11, 5, 4, 25, 10),
                'Nightmare',
            );
            const sa5 = new SleepAwakening(
                new Date(2020, 11, 5, 4, 25, 11),
                'Hunger / Thirst',
            );
            const sa6 = new SleepAwakening(
                new Date(2020, 11, 8, 4, 25, 11),
                'Hunger / Thirst',
            );

            sleepSessions.push(ss1, ss2);
            sleepAwakenings.push(sa1, sa2, sa3, sa4, sa5, sa6);

            return response(
                context.json({
                    sleepSessions: sleepSessions,
                    sleepAwakenings: sleepAwakenings,
                }),
            );
        },
    ),

    rest.delete(
        `${process.env.REACT_APP_SERVER_ADDRESS}/delete-sleep-awakening`,
        (request, response, context) => {
            return response(context.status(200));
        },
    ),

    rest.delete(
        `${process.env.REACT_APP_SERVER_ADDRESS}/delete-sleep-session`,
        (request, response, context) => {
            return response(context.status(200));
        },
    ),
];
