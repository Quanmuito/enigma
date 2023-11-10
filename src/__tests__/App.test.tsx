import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

test('renders learn react link', () => {
    render(<App />);

    expect(screen.getByText(/Enigma I simulator/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reflector/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rotor 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rotor 2/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rotor 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ring Settings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Settings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Plugboard Settings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Input your message/i)).toBeInTheDocument();
    expect(screen.getByText(/MESSAGE:/i)).toBeInTheDocument();
    expect(screen.getByText(/OUTPUT:/i)).toBeInTheDocument();
});

test('handle user event', () => {
    render(<App />);

    userEvent.type(
        screen.getByLabelText(/Input your message/i),
        'ABCDEFG'
    );

    let match = screen.getAllByText(/ABCDEFG/i);

    expect(match[0]).toBeInTheDocument();
    expect(match[1]).toBeInTheDocument();
});

test('handle user event error', () => {
    render(<App />);

    userEvent.type(
        screen.getByLabelText(/Input your message/i),
        'ABCÖÄÅ'
    );

    expect(screen.getByText(/Contain not supported character/i)).toBeInTheDocument();
});

test('handle user select date', () => {
    render(<App />);

    userEvent.selectOptions(
        screen.getByLabelText(/Date/i),
        '20'
    );

    expect(screen.getByDisplayValue(/XOM/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/DKV/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/BX IS LY NF QO WA/i)).toBeInTheDocument();
});
