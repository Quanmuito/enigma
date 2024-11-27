import React from 'react';
import Container from 'Container';
import { assemble, Config } from 'enigma';

export default function App() {
    const config: Config = {
        rotors: ['I', 'II', 'III'],
        reflector: 'UKW-B',
        ring: 'AAA',
        start: 'AAA',
        plugboard: '',
    };
    const configedMachine = assemble(config);

    return (
        <div className="App">
            <div className="wrapper">
                <Container configedMachine={ configedMachine } />
            </div>
        </div>
    );
}
