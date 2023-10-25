import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SleepLog from './sleepLog';

describe('Sleep Log', () => {
    //  This test uses a mocked api call to get sleep sessions, then
    //  verifies that the correct number of listitems are rendered
    //  onto the page
    it('should get a list of sleep sessions on render', async () => {
        render(
            //  The SleepLog component contains a Link component,
            //  so it needs to be wrapped in a BrowserRouter
            <BrowserRouter>
                <SleepLog />
            </BrowserRouter>,
        );

        //  findAllBy returns a promise, so this is used to give the
        //  server mock some time to complete.
        const listItemCount = await screen.findAllByRole('listitem');

        //  Based on the mock test, expect a total of 7 <li /> elements
        //  to be rendered
        expect(listItemCount.length).toBe(7);
    });

    it('should properly delete a sleep awakening on button click', async () => {});
});
