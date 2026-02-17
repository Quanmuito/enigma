import React, { useState, useMemo } from 'react';
import { assemble, getDailySettings } from 'libs/enigma';
import type { AppState } from 'types';
import Header from './Layouts/Header';
import Enigma from './Enigma';
import ConfigForm from './ConfigForm/ConfigForm';

function getInitialConfig() {
    const today = new Date().getDate();
    try {
        return getDailySettings(today);
    } catch {
        return getDailySettings(0);
    }
}

export default function App() {
    const [appState, setAppState] = useState<AppState>(() => ({
        config: getInitialConfig(),
        showMachine: false,
    }));

    const configedMachine = useMemo(
        () => assemble(appState.config),
        [appState.config]
    );

    return (
        <div className="App">
            <Header />
            { appState.showMachine ? (
                <Enigma configedMachine={ configedMachine } setAppState={ setAppState } appState={ appState } />
            ) : (
                <ConfigForm config={ appState.config } setAppState={ setAppState } />
            ) }
        </div>
    );
}
