import { render, screen, fireEvent } from '@testing-library/react';
import Button from './button';
import '@testing-library/jest-dom';

describe('Button', () => {
    it('should render a button', () => {
        render(<Button onClick={() => {}} text="" />);

        const buttonCount = screen.queryAllByRole('button').length;
        expect(buttonCount).toEqual(1);
    });

    it('should render a button with proper text', () => {
        render(<Button onClick={() => {}} text="Hello, World!" />);

        const buttonText = screen.getByText('Hello, World!');
        expect(buttonText).toBeInTheDocument();
    });

    it('should perform its provided callback function when clicked', () => {
        const mock = jest.fn();

        render(<Button onClick={mock} text="Hello, World!" />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mock).toHaveBeenCalledTimes(1);
    });
});
