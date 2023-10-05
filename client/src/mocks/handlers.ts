import { rest } from 'msw';
import { SleepSession } from 'shared';

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
];
