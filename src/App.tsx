import React, { useState } from 'react';
import ConfiguredMachine from 'components/Enigma/ConfiguredMachine';
import { assemble, getDailySettings } from 'enigma';
import ConfigForm from 'components/Enigma/ConfigForm';
import { getTodayDate } from 'utils';
import { AppState } from 'types';

export default function App() {
    const [appState, setAppState] = useState<AppState>({
        config: getDailySettings(getTodayDate()),
        showMachine: false,
    });

    const configedMachine = assemble(appState.config);

    return (
        <div className="App">
            <div className="wrapper">
                <div className="container">
                    {
                        appState.showMachine
                            ? <ConfiguredMachine configedMachine={ configedMachine } setAppState={ setAppState } />
                            :<ConfigForm config={ appState.config } setAppState={ setAppState } />
                    }
                </div>
            </div>
        </div>
    );
}
