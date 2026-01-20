import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useCharacterRef from 'hooks/useCharacterRef';
import useLineRef from 'hooks/useLineRef';
import useLineRedraw from 'hooks/useLineRedraw';
import { buildGenerator, Machine, KEYBOARD } from 'libs/enigma';
import { connect } from 'libs/utils';
import { Input } from 'components/Forms/Input';
import Section, { SectionRefsType } from './Section';
import style from './style.module.css';

type EnigmaPropsType = {
    configedMachine: Machine
}

const REFLECTOR_NODE_POSITIONS = [5, 4, 5, 5];
const ROTOR1_NODE_POSITIONS = [4, 3, 5, 6];
const ROTOR2_NODE_POSITIONS = [3, 2, 6, 7];
const ROTOR3_NODE_POSITIONS = [2, 1, 7, 8];
const PLUGBOARD_NODE_POSITIONS = [1, 0, 8, 9];
const KEYBOARD_NODE_POSITIONS = [0, 0, 9, 9];

export default function Enigma({ configedMachine }: EnigmaPropsType) {
    const [message, setMessage] = useState<string>('ENIGMA');

    const generator = useMemo(() => buildGenerator(configedMachine), [configedMachine]);
    const [encryptedMessage, machine, nodePositions] = useMemo(() => generator(message), [generator, message]);
    const { reflector, rotor1, rotor2, rotor3, plugboard } = machine;

    const { t } = useTranslation();

    const reflectorRefs: SectionRefsType = useCharacterRef(nodePositions, REFLECTOR_NODE_POSITIONS);
    const rotor1Refs: SectionRefsType = useCharacterRef(nodePositions, ROTOR1_NODE_POSITIONS);
    const rotor2Refs: SectionRefsType = useCharacterRef(nodePositions, ROTOR2_NODE_POSITIONS);
    const rotor3Refs: SectionRefsType = useCharacterRef(nodePositions, ROTOR3_NODE_POSITIONS);
    const plugboardRefs: SectionRefsType = useCharacterRef(nodePositions, PLUGBOARD_NODE_POSITIONS);
    const keyboardRefs: SectionRefsType = useCharacterRef(nodePositions, KEYBOARD_NODE_POSITIONS);

    const [lineFwReflectorRotor1, lineBwReflectorRotor1] = useLineRef();
    const [lineFwRotor1Rotor2, lineBwRotor1Rotor2] = useLineRef();
    const [lineFwRotor2Rotor3, lineBwRotor2Rotor3] = useLineRef();
    const [lineFwRotor3Plugboard, lineBwRotor3Plugboard] = useLineRef();
    const [lineFwPlugboardKeyboard, lineBwPlugboardKeyboard] = useLineRef();

    const redrawLines = useCallback(() => {
        connect(reflectorRefs.rNode1.ref, rotor1Refs.lNode1.ref, lineFwReflectorRotor1);
        connect(reflectorRefs.rNode2.ref, rotor1Refs.lNode2.ref, lineBwReflectorRotor1);

        connect(rotor1Refs.rNode1.ref, rotor2Refs.lNode1.ref, lineFwRotor1Rotor2);
        connect(rotor1Refs.rNode2.ref, rotor2Refs.lNode2.ref, lineBwRotor1Rotor2);

        connect(rotor2Refs.rNode1.ref, rotor3Refs.lNode1.ref, lineFwRotor2Rotor3);
        connect(rotor2Refs.rNode2.ref, rotor3Refs.lNode2.ref, lineBwRotor2Rotor3);

        connect(rotor3Refs.rNode1.ref, plugboardRefs.lNode1.ref, lineFwRotor3Plugboard);
        connect(rotor3Refs.rNode2.ref, plugboardRefs.lNode2.ref, lineBwRotor3Plugboard);

        connect(plugboardRefs.rNode1.ref, keyboardRefs.lNode1.ref, lineFwPlugboardKeyboard);
        connect(plugboardRefs.rNode2.ref, keyboardRefs.lNode2.ref, lineBwPlugboardKeyboard);
    }, [
        reflectorRefs.rNode1.ref, reflectorRefs.rNode2.ref,
        rotor1Refs.lNode1.ref, rotor1Refs.lNode2.ref, rotor1Refs.rNode1.ref, rotor1Refs.rNode2.ref,
        rotor2Refs.lNode1.ref, rotor2Refs.lNode2.ref, rotor2Refs.rNode1.ref, rotor2Refs.rNode2.ref,
        rotor3Refs.lNode1.ref, rotor3Refs.lNode2.ref, rotor3Refs.rNode1.ref, rotor3Refs.rNode2.ref,
        plugboardRefs.lNode1.ref, plugboardRefs.lNode2.ref, plugboardRefs.rNode1.ref, plugboardRefs.rNode2.ref,
        keyboardRefs.lNode1.ref, keyboardRefs.lNode2.ref,
        lineFwReflectorRotor1, lineBwReflectorRotor1,
        lineFwRotor1Rotor2, lineBwRotor1Rotor2,
        lineFwRotor2Rotor3, lineBwRotor2Rotor3,
        lineFwRotor3Plugboard, lineBwRotor3Plugboard,
        lineFwPlugboardKeyboard, lineBwPlugboardKeyboard,
    ]);

    useLineRedraw(redrawLines);

    useEffect(() => {
        redrawLines();
    }, [redrawLines, nodePositions]);

    return (
        <div className={ style.container }>
            <div className={ style.outputContainer }>
                { encryptedMessage }
            </div>

            <div className={ style.rotorStepContainer }>
                <div className={ style.rotorStep } id="rotor-step-1">{ rotor1.ingang[0] }</div>
                <div className={ style.rotorStep } id="rotor-step-2">{ rotor2.ingang[0] }</div>
                <div className={ style.rotorStep } id="rotor-step-3">{ rotor3.ingang[0] }</div>
            </div>

            <div className={ style.visualContainer }>
                <Section name="reflector" leftColumn={ reflector.ingang } rightColumn={ reflector.engang } refs={ reflectorRefs } />

                <div id="lineFwReflectorRotor1" className={ style.forwardLine } ref={ lineFwReflectorRotor1 }></div>
                <div id="lineBwReflectorRotor1" className={ style.backwardLine } ref={ lineBwReflectorRotor1 }></div>

                <Section name="rotor1" leftColumn={ rotor1.ingang } rightColumn={ rotor1.engang } notch={ rotor1.notch } refs={ rotor1Refs } />

                <div id="lineFwRotor1Rotor2" className={ style.forwardLine } ref={ lineFwRotor1Rotor2 }></div>
                <div id="lineBwRotor1Rotor2" className={ style.backwardLine } ref={ lineBwRotor1Rotor2 }></div>

                <Section name="rotor2" leftColumn={ rotor2.ingang } rightColumn={ rotor2.engang } notch={ rotor2.notch } refs={ rotor2Refs } />

                <div id="lineFwRotor2Rotor3" className={ style.forwardLine } ref={ lineFwRotor2Rotor3 }></div>
                <div id="lineBwRotor2Rotor3" className={ style.backwardLine } ref={ lineBwRotor2Rotor3 }></div>

                <Section name="rotor3" leftColumn={ rotor3.ingang } rightColumn={ rotor3.engang } notch={ rotor3.notch } refs={ rotor3Refs } />

                <div id="lineFwRotor3Plugboard" className={ style.forwardLine } ref={ lineFwRotor3Plugboard }></div>
                <div id="lineBwRotor3Plugboard" className={ style.backwardLine } ref={ lineBwRotor3Plugboard }></div>

                <Section name="plugboard" leftColumn={ plugboard.engang } rightColumn={ plugboard.ingang } refs={ plugboardRefs } />

                <div id="lineFwPlugboardKeyboard" className={ style.forwardLine } ref={ lineFwPlugboardKeyboard }></div>
                <div id="lineBwPlugboardKeyboard" className={ style.backwardLine } ref={ lineBwPlugboardKeyboard }></div>

                <Section name="keyboard" leftColumn={ KEYBOARD } rightColumn={ KEYBOARD } refs={ keyboardRefs } />
            </div>

            <div className={ style.inputContainer }>
                <Input
                    name="messageInput"
                    type="text"
                    value={ message }
                    onChange={ (e) => setMessage(e.target.value.toUpperCase()) }
                    aria-label={ t('labelMessageInput') }
                    autoFocus
                    className={ style.messageInput }
                />
            </div>
        </div>
    );
}
