import React, { useState } from 'react';

function App() {
    const NUMBER_OF_CHARACTERS = 26;
    const keyboard: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const gear_1: string[] = 'BDFHJLCPRTXVZNYEIWGAKMUSQO'.split('');
    const gear_2: string[] = 'AJDKSIRUXBLHWTMCQGZNPYFVOE'.split('');
    const gear_3: string[] = 'EKMFLGDQVZNTOWYHXUSPAIBRCJ'.split('');
    const gear_reflector: string[] = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split('');

    const [plugboard, setplugboard] = useState(
        {
            original: [...keyboard],
            shuffled: [...keyboard],
        }
    );
    const plug = (letter_1: string, letter_2: string): void => {
        let pos_1 = plugboard.original.indexOf(letter_1);
        let pos_2 = plugboard.original.indexOf(letter_2);
        plugboard.shuffled[pos_1] = letter_2;
        plugboard.shuffled[pos_2] = letter_1;
        setplugboard(plugboard);
    };
    const getPlugboardSignal = (signal: number, isBackward: boolean = false): number => {
        if (isBackward) {
            let letter = plugboard.shuffled[signal];
            return plugboard.original.indexOf(letter);
        }

        let letter = plugboard.original[signal];
        return plugboard.shuffled.indexOf(letter);
    };

    type Gear = {
        original: string[],
        shuffled: string[],
        notch: string,
    }
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
        notch: 'V',
    };
    const gear2: Gear = {
        original: [...keyboard],
        shuffled: [...gear_2],
        notch: 'E',
    };
    const gear3: Gear = {
        original: [...keyboard],
        shuffled: [...gear_3],
        notch: 'Q',
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
    const adjustRing = (gear: Gear, ringPosition: number): Gear => {
        let i = 0;
        while (i < ringPosition) {
            /** Shift the letter in `shuffled` up by 1. Eg: A -> B, E -> F */
            gear.shuffled = gear.shuffled.map((letter: string) => {
                let letterPos = gear.original.indexOf(letter);
                let shiftedLetterPos = letterPos + 1;
                return gear.original[(NUMBER_OF_CHARACTERS + shiftedLetterPos) % NUMBER_OF_CHARACTERS];
            });
            /** Rotate backward */
            let shuffledLastLetter = gear.shuffled[NUMBER_OF_CHARACTERS - 1];
            gear.shuffled.pop();
            gear.shuffled.unshift(shuffledLastLetter);
            i++;
        }

        return gear;
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
        let g1Signal = getGearSignal(rotor.gear1, signal);
        let g2Signal = getGearSignal(rotor.gear2, g1Signal);
        let g3Signal = getGearSignal(rotor.gear3, g2Signal);
        let refSignal = getGearSignal(rotor.reflector, g3Signal);
        let g3BSignal = getGearSignal(rotor.gear3, refSignal, true);
        let g2BSignal = getGearSignal(rotor.gear2, g3BSignal, true);
        let g1BSignal = getGearSignal(rotor.gear1, g2BSignal, true);
        return g1BSignal;
    };

    const encrypt = (letter: string): string => {
        if (
            rotor.gear2.original[0] === rotor.gear2.notch ||
            (rotor.gear1.original[0] === rotor.gear1.notch && rotor.gear2.original[0] === rotor.gear2.notch)
        ) {
            rotateGear(rotor.gear1);
            rotateGear(rotor.gear2);
            rotateGear(rotor.gear3);
        }
        else if (
            rotor.gear1.original[0] === rotor.gear1.notch
        ) {
            rotateGear(rotor.gear1);
            rotateGear(rotor.gear2);
        }
        else {
            rotateGear(rotor.gear1);
        }

        let kbSignal = keyboard.indexOf(letter);
        let pbSignal = getPlugboardSignal(kbSignal);
        let rotorSignal = getRotorSignal(pbSignal);
        let pbBSignal = getPlugboardSignal(rotorSignal, true);
        let outputLetter = keyboard[pbBSignal];
        return outputLetter;
    };

    const run = (): void => {
        initialSetting(
            {
                gear1: {
                    ring: 'C',
                    start: 'A',
                },
                gear2: {
                    ring: 'A',
                    start: 'A',
                },
                gear3: {
                    ring: 'A',
                    start: 'A',
                },
            }
        );

        plug('M', 'T');

        let message = 'EFGHIJKLMNOPQRSTUVWXYZ';
        let encrypted = '';
        for (let i = 0; i < message.length; i++) {
            encrypted += encrypt(message.charAt(i));
        }
        console.log(encrypted);
        // OEQACMFJPCSPTTPVKFUDBKSMGE
        console.log(gear1);
        console.log(gear2);
        console.log(gear3);
        console.log(rotor);
    };

    return (
        <div className="App">
            <button onClick={ run }>Run</button>
        </div>
    );
}

export default App;
