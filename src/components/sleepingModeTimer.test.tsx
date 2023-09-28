import { render, screen } from '@testing-library/react';
import SleepingModeTimer from './sleepingModeTimer';
import '@testing-library/jest-dom';

describe('SleepingModeTimer', () => {
    it('should show 0 hr, 0 min, 0 sec when just started', () => {
        const currentDate = new Date(2023, 1, 1, 11, 0, 0);
        const sleepingModeStartDate = new Date(2023, 1, 1, 11, 0, 0);

        render(
            <SleepingModeTimer
                currentDate={currentDate}
                sleepingModeStart={sleepingModeStartDate}
                awakeningCount={0}
            />,
        );

        const sleepingModeTimerString = screen.getByText(
            'You have been sleeping for 0 hr, 0 min, 0 sec',
        );
        expect(sleepingModeTimerString).toBeInTheDocument();
    });

    it('should show the correct duration when sleeping mode was activated after starting time', () => {
        const currentDate = new Date(2023, 1, 1, 16, 43, 13);
        const sleepingModeStartDate = new Date(2023, 1, 1, 11, 0, 0);

        render(
            <SleepingModeTimer
                currentDate={currentDate}
                sleepingModeStart={sleepingModeStartDate}
                awakeningCount={0}
            />,
        );

        const sleepingModeTimerString = screen.getByText(
            'You have been sleeping for 5 hr, 43 min, 13 sec',
        );
        expect(sleepingModeTimerString).toBeInTheDocument();
    });

    it('should show throw an error if sleeping mode was activated before starting time', () => {
        const currentDate = new Date(2023, 1, 1, 16, 43, 13);
        const sleepingModeStartDate = new Date(2023, 1, 1, 16, 44, 13);

        expect(() => {
            render(
                <SleepingModeTimer
                    currentDate={currentDate}
                    sleepingModeStart={sleepingModeStartDate}
                    awakeningCount={0}
                />,
            );
        }).toThrowError(
            'Sleeping mode cannot be activated before the current time',
        );
    });

    it('should show show the correct amount of awakenings', () => {
        const currentDate = new Date(2023, 5, 12, 23, 46, 0);
        const sleepingModeStartDate = new Date(2023, 5, 12, 23, 30, 15);
        const awakeningCount = 3;

        render(
            <SleepingModeTimer
                currentDate={currentDate}
                sleepingModeStart={sleepingModeStartDate}
                awakeningCount={awakeningCount}
            />,
        );

        const sleepingModeTimerString = screen.getByText(
            'You have been sleeping for 0 hr, 15 min, 45 sec with 3 awakenings',
        );
        expect(sleepingModeTimerString).toBeInTheDocument();
    });

    it('should show throw an error if awakenings is less than 0', () => {
        const currentDate = new Date(2023, 5, 12, 23, 46, 0);
        const sleepingModeStartDate = new Date(2023, 5, 12, 23, 30, 15);
        const awakeningCount = -1;

        expect(() => {
            render(
                <SleepingModeTimer
                    currentDate={currentDate}
                    sleepingModeStart={sleepingModeStartDate}
                    awakeningCount={awakeningCount}
                />,
            );
        }).toThrowError('Awakening count cannot be less than 0');
    });
});
