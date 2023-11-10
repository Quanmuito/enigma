import { getReflectorByName, getRotorByName, getTodayAppState } from "enigma";
import {
    ACTION_MACHINE_SETTINGS,
    ACTION_MESSAGE,
    ACTION_PLUGBOARD_SETTINGS,
    ACTION_RING_SETTINGS,
    ACTION_START_SETTINGS,
    reducer
} from "reducer";

describe('Update state with invalid action type or id', () => {
    test('Set reflector to %p', () => {
        let action = {
            type: 'ACTION_NOT_EXIST',
            payload: {
                value: 'DUMMY',
                id: 'reflector',
            },
        };

        let updatedState = reducer(getTodayAppState(), action);
        expect(updatedState).toEqual(getTodayAppState());
    });

    test('Set reflector to %p', () => {
        let action = {
            type: ACTION_MACHINE_SETTINGS,
            payload: {
                value: 'DUMMY',
                id: 'id-not-exist',
            },
        };

        let updatedState = reducer(getTodayAppState(), action);
        expect(updatedState).toEqual(getTodayAppState());
    });
});

const reflectors = [
    ['UKW-A', 'UKW-A'],
    ['UKW-B', 'UKW-B'],
    ['UKW-C', 'UKW-C'],
    ['UKW-D', 'DUMMY'],
];
describe('Update reflector', () => {
    test.each(reflectors)(
        'Set reflector to %p and result should be %p',
        (reflector, result) => {
            let action = {
                type: ACTION_MACHINE_SETTINGS,
                payload: {
                    value: reflector,
                    id: 'reflector',
                },
            };

            let updatedState = reducer(getTodayAppState(), action);
            expect(updatedState.referenceMachine.reflector).toEqual(getReflectorByName(result));
            expect(updatedState.configuredMachine.reflector).toEqual(getReflectorByName(result));
            expect(updatedState.displayMachine.reflector).toEqual(getReflectorByName(result));
        }
    );
});

let rotors = [
    ['I', 'I'],
    ['II', 'II'],
    ['III', 'III'],
    ['IV', 'IV'],
    ['V', 'V'],
    ['VI', 'DUMMY'],
];
describe('Update rotors', () => {
    test.each(rotors)(
        'Set rotor1 to %p and result should be %p',
        (rotor, result) => {
            let action = {
                type: ACTION_MACHINE_SETTINGS,
                payload: {
                    value: rotor,
                    id: 'rotor-1',
                },
            };

            let updatedState = reducer(getTodayAppState(), action);
            expect(updatedState.referenceMachine.rotor1).toEqual(getRotorByName(result));
            expect(updatedState.configuredMachine.rotor1).toEqual(getRotorByName(result));
            expect(updatedState.displayMachine.rotor1).toEqual(getRotorByName(result));
        }
    );

    test.each(rotors)(
        'Set rotor2 to %p',
        (rotor) => {
            let action = {
                type: ACTION_MACHINE_SETTINGS,
                payload: {
                    value: rotor,
                    id: 'rotor-2',
                },
            };

            let updatedState = reducer(getTodayAppState(), action);
            expect(updatedState.referenceMachine.rotor2).toEqual(getRotorByName(rotor));
            expect(updatedState.configuredMachine.rotor2).toEqual(getRotorByName(rotor));
            expect(updatedState.displayMachine.rotor2).toEqual(getRotorByName(rotor));
        }
    );

    test.each(rotors)(
        'Set rotor3 to %p',
        (rotor) => {
            let action = {
                type: ACTION_MACHINE_SETTINGS,
                payload: {
                    value: rotor,
                    id: 'rotor-3',
                },
            };

            let updatedState = reducer(getTodayAppState(), action);
            expect(updatedState.referenceMachine.rotor3).toEqual(getRotorByName(rotor));
            expect(updatedState.configuredMachine.rotor3).toEqual(getRotorByName(rotor));
            expect(updatedState.displayMachine.rotor3).toEqual(getRotorByName(rotor));
        }
    );
});

const rings = [
    ['AAA', ''],
    ['ABC', ''],
    ['QMT', ''],
    ['ÖÄÅ', 'Contain invalid character(s): Ö Ä Å'],
    ['123', 'Contain invalid character(s): 1 2 3'],
    [',.;', 'Contain invalid character(s): , . ;'],
    ['AA', 'Should contain 3 characters.'],
];
describe('Update ring setting', () => {
    test.each(rings)(
        'Set rings to %p and error should be %p',
        (value, error) => {
            let action = {
                type: ACTION_RING_SETTINGS,
                payload: {
                    value: value,
                },
            };

            let updatedState = reducer(getTodayAppState(), action);
            expect(updatedState.setting.ringSettings).toEqual(value);
            expect(updatedState.setting.ringError).toEqual(error);
        }
    );
});

const starts = [
    ['AAA', ''],
    ['ABC', ''],
    ['QMT', ''],
    ['ÖÄÅ', 'Contain invalid character(s): Ö Ä Å'],
    ['123', 'Contain invalid character(s): 1 2 3'],
    [',.;', 'Contain invalid character(s): , . ;'],
    ['AA', 'Should contain 3 characters.'],
];
describe('Update start setting', () => {
    test.each(starts)(
        'Set start to %p and error should be %p',
        (value, error) => {
            let action = {
                type: ACTION_START_SETTINGS,
                payload: {
                    value: value,
                },
            };

            let updatedState = reducer(getTodayAppState(), action);
            expect(updatedState.setting.startSettings).toEqual(value);
            expect(updatedState.setting.startError).toEqual(error);
        }
    );
});


const plugboards = [
    ['', ''],
    ['AB CD EF', ''],
    ['GH IK LM NO PQ', ''],
    ['ÖÄ Å1 23', 'Contain invalid character(s): Ö Ä Å 1 2 3'],
    ['AA', 'A character cannot be swapped twice: A'],
    ['AB CD EF CF', 'A character cannot be swapped twice: C F'],
    ['A', 'A letter pair should have 2 characters'],
    ['AB CD E', 'A letter pair should have 2 characters'],
    ['AB CD E FG HI', 'A letter pair should have 2 characters'],
];
describe('Update plugboard setting', () => {
    test.each(plugboards)(
        'Set plugboard to %p and error should be %p',
        (value, error) => {
            let action = {
                type: ACTION_PLUGBOARD_SETTINGS,
                payload: {
                    value: value,
                },
            };

            let updatedState = reducer(getTodayAppState(), action);
            expect(updatedState.setting.plugboardSettings).toEqual(value);
            expect(updatedState.setting.plugboardError).toEqual(error);
        }
    );
});

const messages = [
    ['', ''],
    ['AAAAA', ''],
    ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''],
    ['AA AA ,.; 1234', ''],
    ['ÖÄÅ', 'Contain not supported character(s): Ö Ä Å'],
];
describe('Update message input', () => {
    test.each(messages)(
        'Set message to %p and error should be %p',
        (value, error) => {
            let action = {
                type: ACTION_MESSAGE,
                payload: {
                    value: value,
                },
            };

            let updatedState = reducer(getTodayAppState(), action);
            expect(updatedState.message.entry).toEqual(value);
            expect(updatedState.message.error).toEqual(error);
        }
    );
});

const startAndResult = [
    ['AAA', 'AAB'],
    ['AAV', 'ABW'],
    ['QEV', 'RFW'],
];
describe('Test rotor rotate', () => {
    test.each(startAndResult)(
        'Set start position to %p and the start after input should be %p',
        (start, result) => {
            let state = getTodayAppState();

            let setStartAction = {
                type: ACTION_START_SETTINGS,
                payload: {
                    value: start,
                },
            };

            let updatedState = reducer(state, setStartAction);
            expect(updatedState.setting.startSettings).toEqual(start);
            expect(updatedState.setting.startError).toEqual('');


            let inputMessageAction = {
                type: ACTION_MESSAGE,
                payload: {
                    value: 'A',
                },
            };
            updatedState = reducer(state, inputMessageAction);
            expect(updatedState.displayMachine.rotor1.entry[0]).toEqual(result.charAt(0));
            expect(updatedState.displayMachine.rotor2.entry[0]).toEqual(result.charAt(1));
            expect(updatedState.displayMachine.rotor3.entry[0]).toEqual(result.charAt(2));
        }
    );
});
