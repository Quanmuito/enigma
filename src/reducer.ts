import {
    getConfiguredMachine,
    getClone,
    getDisplayMachineState,
    getEncryptedMessage,
    getReflectorByName,
    getRotorByName,
    getAppStateByDate
} from 'enigma';
import { isEmpty } from 'global';
import { AppState, Action, Machine } from 'types';
import { validateSettingInput } from 'validation';

export const ACTION_MACHINE_SETTINGS = 'ACTION_MACHINE_SETTINGS';
export const ACTION_RING_SETTINGS = 'ACTION_RING_SETTINGS';
export const ACTION_START_SETTINGS = 'ACTION_START_SETTINGS';
export const ACTION_PLUGBOARD_SETTINGS = 'ACTION_PLUGBOARD_SETTINGS';
export const ACTION_DATE = 'ACTION_DATE';
export const ACTION_MESSAGE = 'ACTION_MESSAGE';

export const reducer = (state: AppState, action: Action): AppState => {
    let value = action.payload.value.toUpperCase();
    let error = validateSettingInput(action.type, value);

    switch (action.type) {
        case ACTION_MACHINE_SETTINGS: {
            let id = action.payload['id'];
            switch (id) {
                case 'reflector':
                    state.referenceMachine.reflector = getReflectorByName(value);
                    break;
                case 'rotor-1':
                    state.referenceMachine.rotor1 = getRotorByName(value);
                    break;
                case 'rotor-2':
                    state.referenceMachine.rotor2 = getRotorByName(value);
                    break;
                case 'rotor-3':
                    state.referenceMachine.rotor3 = getRotorByName(value);
                    break;
                default:
                    break;
            }
            break;
        }

        case ACTION_RING_SETTINGS: {
            state.setting.ringSettings = value.trim();
            state.setting.ringError = error;
            break;
        }

        case ACTION_START_SETTINGS: {
            state.setting.startSettings = value.trim();
            state.setting.startError = error;
            break;
        }

        case ACTION_PLUGBOARD_SETTINGS: {
            state.setting.plugboardSettings = value;
            state.setting.plugboardError = error;
            break;
        }

        case ACTION_DATE: {
            let date = parseInt(value);
            let newState = getAppStateByDate(date);
            return { ...newState };
        }

        case ACTION_MESSAGE: {
            state.message.entry = value;
            state.message.error = error;
            break;
        }

        default:
            break;
    }

    if (isEmpty(error)) {
        state.configuredMachine = getConfiguredMachine(state.setting, getClone<Machine>(state.referenceMachine));
        state.displayMachine = getDisplayMachineState(getClone<Machine>(state.configuredMachine), state.message.entry);
        state.message.output = getEncryptedMessage(getClone<AppState>(state), state.message.entry);
    }

    return { ...state };
};
