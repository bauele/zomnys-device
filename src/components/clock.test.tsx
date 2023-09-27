import { render, screen } from '@testing-library/react';
import Clock from './clock';
import '@testing-library/jest-dom';

describe('Clock', () => {
    const date = new Date();

    it('renders a heading', () => {
        render(<Clock date={date} />);

        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
    });

    it('renders the current time', () => {
        render(<Clock date={date} />);

        const currentTimeString = date.toLocaleTimeString();
        const element = screen.getByText(currentTimeString);

        expect(element).toBeInTheDocument();
    });
});
