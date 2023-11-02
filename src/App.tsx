import React, { useState } from 'react';
import { EnigmaI } from 'data/machines';
import { Rotor, Gear, Plugboard, StringSettings } from 'types';
import { adjustRing, plug } from 'engineSetup';
import { getPlugboardSignal } from 'engine';
import { validatePlugboardSettingsInput } from 'validation';

function App() {
    const keyboard: string[] = EnigmaI.keyboard.split('');
    const gear_1: string[] = 'EKMFLGDQVZNTOWYHXUSPAIBRCJ'.split('');
    const gear_2: string[] = 'AJDKSIRUXBLHWTMCQGZNPYFVOE'.split('');
    const gear_3: string[] = 'BDFHJLCPRTXVZNYEIWGAKMUSQO'.split('');
    const gear_reflector: string[] = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split('');

    type GearSettings = {
        ring: string,
        start: string,
    }
    type RotorSettings = {
        gear1: GearSettings,
        gear2: GearSettings,
        gear3: GearSettings,
    }
    const gear1: Gear = {
        original: [...keyboard],
        shuffled: [...gear_1],
        notch: 'Q',
    };
    const gear2: Gear = {
        original: [...keyboard],
        shuffled: [...gear_2],
        notch: 'E',
    };
    const gear3: Gear = {
        original: [...keyboard],
        shuffled: [...gear_3],
        notch: 'V',
    };
    const reflector: Gear = {
        original: [...keyboard],
        shuffled: [...gear_reflector],
        notch: '',
    };
    const [rotor, setRotor] = useState(
        {
            gear1: JSON.parse(JSON.stringify(gear1)) as typeof gear1,
            gear2: JSON.parse(JSON.stringify(gear2)) as typeof gear2,
            gear3: JSON.parse(JSON.stringify(gear3)) as typeof gear3,
            reflector: { ...reflector },
        }
    );
    const initialSetting = (settings: RotorSettings): void => {
        /** Ring setting */
        rotor.gear1 = adjustRing(
            rotor.gear1,
            rotor.gear1.original.indexOf(settings.gear1.ring)
        );
        rotor.gear2 = adjustRing(
            rotor.gear2,
            rotor.gear2.original.indexOf(settings.gear2.ring)
        );
        rotor.gear3 = adjustRing(
            rotor.gear3,
            rotor.gear3.original.indexOf(settings.gear3.ring)
        );

        // /** Rotate to the initial position */
        rotor.gear1 = rotateGear(
            rotor.gear1,
            rotor.gear1.original.indexOf(settings.gear1.start)
        );
        rotor.gear2 = rotateGear(
            rotor.gear2,
            rotor.gear2.original.indexOf(settings.gear2.start)
        );
        rotor.gear3 = rotateGear(
            rotor.gear3,
            rotor.gear3.original.indexOf(settings.gear3.start)
        );

        setRotor({ ...rotor });
    };

    const rotateGear = (gear: Gear, rounds: number = 1): Gear => {
        let i = 0;
        while (i < rounds) {
            let originalFirstLetter = gear.original[0];
            gear.original.shift();
            gear.original.push(originalFirstLetter);

            let shuffledFirstLetter = gear.shuffled[0];
            gear.shuffled.shift();
            gear.shuffled.push(shuffledFirstLetter);
            i++;
        }
        return gear;
    };

    /** Gears and reflector are opposite direction with plugboard */
    const getGearSignal = (gear: Gear, signal: number, isBackward: boolean = false): number => {
        if (isBackward) {
            let letter = gear.original[signal];
            return gear.shuffled.indexOf(letter);
        }

        let letter = gear.shuffled[signal];
        return gear.original.indexOf(letter);
    };
    const getRotorSignal = (signal: number): number => {
        let g3Signal = getGearSignal(rotor.gear3, signal);
        let g2Signal = getGearSignal(rotor.gear2, g3Signal);
        let g1Signal = getGearSignal(rotor.gear1, g2Signal);
        let refSignal = getGearSignal(rotor.reflector, g1Signal);
        let g1BSignal = getGearSignal(rotor.gear1, refSignal, true);
        let g2BSignal = getGearSignal(rotor.gear2, g1BSignal, true);
        let g3BSignal = getGearSignal(rotor.gear3, g2BSignal, true);
        return g3BSignal;
    };

    const encrypt = (letter: string): string => {
        if (
            rotor.gear2.original[0] === rotor.gear2.notch ||
            (rotor.gear3.original[0] === rotor.gear3.notch && rotor.gear2.original[0] === rotor.gear2.notch)
        ) {
            rotateGear(rotor.gear1);
            rotateGear(rotor.gear2);
            rotateGear(rotor.gear3);
        }
        else if (
            rotor.gear3.original[0] === rotor.gear3.notch
        ) {
            rotateGear(rotor.gear2);
            rotateGear(rotor.gear3);
        }
        else {
            rotateGear(rotor.gear3);
        }

        let kbSignal = keyboard.indexOf(letter);
        let pbSignal = getPlugboardSignal(plugboard, kbSignal);
        let rotorSignal = getRotorSignal(pbSignal);
        let pbBSignal = getPlugboardSignal(plugboard, rotorSignal, true);
        let outputLetter = keyboard[pbBSignal];
        return outputLetter;
    };

    const run = (): void => {
        /** Plugboard initial setting */
        let letterPairs = plugboardSettings.settings.split(' ');
        setPlugboard(plug(plugboard, letterPairs));

        initialSetting(
            {
                gear1: {
                    ring: 'D',
                    start: 'A',
                },
                gear2: {
                    ring: 'E',
                    start: 'B',
                },
                gear3: {
                    ring: 'F',
                    start: 'C',
                },
            }
        );

        let message = 'DXXVPJRXZHGKHQLKKCNBFFJBIJ';
        let message2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let encrypted = '';
        for (let i = 0; i < message.length; i++) {
            encrypted += encrypt(message.charAt(i));
        }
        console.log(encrypted);
        console.log(message2);
    };

    const [plugboardSettings, setPlugboardSettings] = useState<StringSettings>(
        {
            settings: 'MT',
            valid: true,
        }
    );
    const changePlugboardSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
        let input = event.target.value.toUpperCase();
        setPlugboardSettings({ settings: input, valid: validatePlugboardSettingsInput(input) });
    };

    const [ringSettings, setRingSettings] = useState<StringSettings>(
        {
            settings: '',
            valid: true,
        }
    );
    const changeRingSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
        let input = event.target.value.toUpperCase();
        setRingSettings({ settings: input, valid: (input.length === 0) || (input.length === 3) });
    };


    const [plugboard, setPlugboard] = useState<Plugboard>(
        {
            entry: JSON.parse(JSON.stringify(keyboard)),
            output: JSON.parse(JSON.stringify(keyboard)),
        }
    );

    return (
        <div className="App">
            <div className="mb-3">
                <label
                    className="form-label"
                    htmlFor="plugboardSettings"
                >
                    Plugboard settings
                </label>
                <input
                    className={ 'form-control ' + (plugboardSettings.valid ? '' : 'is-invalid') }
                    type="text"
                    id="plugboardSettings"
                    onChange={ changePlugboardSettings }
                    value={ plugboardSettings.settings }
                />
                <div id="plugboardSettings" className="invalid-feedback">
                    Invaid plugboard settings. Example: AO HI MU SN WX ZO
                </div>
            </div>

            <div className="mb-3">
                <label
                    className="form-label"
                    htmlFor="ringSettings"
                >
                    Ring settings
                </label>
                <input
                    className={ 'form-control ' + (ringSettings.valid ? '' : 'is-invalid') }
                    type="text"
                    id="ringSettings"
                    onChange={ changeRingSettings }
                    value={ ringSettings.settings }
                />
                <div id="ringSettings" className="invalid-feedback">
                    Invaid ring settings. Example: ABC or DHK, etc
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label" htmlFor="rotor1">Rotor 1 settings</label>
                <select className="form-select" id="rotor1" >
                    <option defaultValue={ '' }>Select rotor for position 1</option>
                    {
                        EnigmaI.rotors.map((rotor, index) => <option key={ rotor.name } value={ index }>{ rotor.name }</option>)
                    }
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label" htmlFor="rotor2">Rotor 2 settings</label>
                <select className="form-select" id="rotor2" >
                    <option defaultValue={ '' }>Select rotor for position 2</option>
                    {
                        EnigmaI.rotors.map((rotor, index) => <option key={ rotor.name } value={ index }>{ rotor.name }</option>)
                    }
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label" htmlFor="rotor3">Rotor 3 settings</label>
                <select className="form-select" id="rotor3" >
                    <option defaultValue={ '' }>Select rotor for position 3</option>
                    {
                        EnigmaI.rotors.map((rotor, index) => <option key={ rotor.name } value={ index }>{ rotor.name }</option>)
                    }
                </select>
            </div>
            <br />{ plugboardSettings.settings }<br />
            <button onClick={ run }>Run</button>
        </div>
    );
}

export default App;
