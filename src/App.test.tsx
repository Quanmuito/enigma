import React from 'react';
import { getByText, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders learn react link', () => {
    render(<App />);
    const header = screen.getByText(/Enigma I simulator/i);
    const messageInput = screen.getByLabelText(/Input your message/i);

    expect(header).toBeInTheDocument();
    expect(messageInput).toBeInTheDocument();
});

test('handle user event', async () => {
    render(<App />);

    await userEvent.type(
        screen.getByLabelText(/Input your message/i),
        'ABCDEFG'
    );

    // await expect(screen.getByText(/ABCDEFG/i)).toBeInTheDocument();
});

test('handle user event error', async () => {
    render(<App />);

    await userEvent.type(
        screen.getByLabelText(/Input your message/i),
        'ABCÖÄÅ'
    );

    // await expect(screen.getByLabelText(/Contain not supported character(s): Ö Ä Å/i)).toBeInTheDocument();
});
