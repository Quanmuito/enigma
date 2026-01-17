import React, { useState } from 'react';
import { assemble, Config } from 'libs/enigma';
import Header from './Layouts/Header';
import Enigma from './Enigma';

export default function App() {
    const [config] = useState<Config>({
        rotors: ['I', 'II', 'III'],
        reflector: 'UKW-B',
        ring: 'AAA',
        start: 'AAA',
        plugboard: '',
    });

    const configedMachine = assemble(config);

    return (
        <div className="App">
            <Header />
            <Enigma configedMachine={ configedMachine } />
        </div>
    );
}
