import React, { useState, useRef, useEffect } from 'react';
import CharacterColumn, { CharacterColumnRefObjectType } from 'components/Enigma/CharacterColumn';
import Section, { SectionRefsType } from 'components/Enigma/Section';
import { buildGenerator, getKeyboard, Machine } from 'enigma';
import useCharacterRef from 'hooks/useCharacterRef';
import { connect } from 'utils';

type ContainerPropsType = {
    configedMachine: Machine
}
export default function Container({ configedMachine }: ContainerPropsType) {
    const [message, setMessage] = useState<string>('A');

    const generator = buildGenerator(configedMachine);
    const [encryptedMessage, machine, nodePositions] = generator(message);
    const { reflector, rotor1, rotor2, rotor3, plugboard } = machine;

    const reflectorRefs: SectionRefsType = useCharacterRef(nodePositions, [5, 4, 5, 5]);
    const rotor1Refs: SectionRefsType = useCharacterRef(nodePositions, [4, 3, 5, 6]);
    const rotor2Refs: SectionRefsType = useCharacterRef(nodePositions, [3, 2, 6, 7]);
    const rotor3Refs: SectionRefsType = useCharacterRef(nodePositions, [2, 1, 7, 8]);
    const plugboardRefs: SectionRefsType = useCharacterRef(nodePositions, [1, 0, 8, 9]);

    const keyboardRefs: CharacterColumnRefObjectType = {
        node1: { id: nodePositions[0], ref: useRef<HTMLSpanElement>(null) },
        node2: { id: nodePositions[9], ref: useRef<HTMLSpanElement>(null) },
    };

    const lineFwReflectorRotor1 = useRef<HTMLDivElement>(null);
    const lineBwReflectorRotor1 = useRef<HTMLDivElement>(null);

    const lineFwRotor1Rotor2 = useRef<HTMLDivElement>(null);
    const lineBwRotor1Rotor2 = useRef<HTMLDivElement>(null);

    const lineFwRotor2Rotor3 = useRef<HTMLDivElement>(null);
    const lineBwRotor2Rotor3 = useRef<HTMLDivElement>(null);

    const lineFwRotor3Plugboard = useRef<HTMLDivElement>(null);
    const lineBwRotor3Plugboard = useRef<HTMLDivElement>(null);

    const lineFwPlugboardKeyboard = useRef<HTMLDivElement>(null);
    const lineBwPlugboardKeyboard = useRef<HTMLDivElement>(null);

    useEffect(() => {
        connect(reflectorRefs.rNode1.ref, rotor1Refs.lNode1.ref, lineFwReflectorRotor1);
        connect(reflectorRefs.rNode2.ref, rotor1Refs.lNode2.ref, lineBwReflectorRotor1);

        connect(rotor1Refs.rNode1.ref, rotor2Refs.lNode1.ref, lineFwRotor1Rotor2);
        connect(rotor1Refs.rNode2.ref, rotor2Refs.lNode2.ref, lineBwRotor1Rotor2);

        connect(rotor2Refs.rNode1.ref, rotor3Refs.lNode1.ref, lineFwRotor2Rotor3);
        connect(rotor2Refs.rNode2.ref, rotor3Refs.lNode2.ref, lineBwRotor2Rotor3);

        connect(rotor3Refs.rNode1.ref, plugboardRefs.lNode1.ref, lineFwRotor3Plugboard);
        connect(rotor3Refs.rNode2.ref, plugboardRefs.lNode2.ref, lineBwRotor3Plugboard);

        connect(plugboardRefs.rNode1.ref, keyboardRefs.node1.ref, lineFwPlugboardKeyboard);
        connect(plugboardRefs.rNode2.ref, keyboardRefs.node2.ref, lineBwPlugboardKeyboard);
    });

    return (
        <div className="container d-flex flex-column justify-content-evenly align-items-center" style={ { height: '100%' } }>
            <section className="output-container">
                { encryptedMessage }
            </section>

            <section className="visual-container">
                <Section name="reflector" leftColumn={ reflector.ingang } rightColumn={ reflector.engang } refs={ reflectorRefs } />
                <div id="lineFwReflectorRotor1" className="forward-line" ref={ lineFwReflectorRotor1 }></div>
                <div id="lineBwReflectorRotor1" className="backward-line" ref={ lineBwReflectorRotor1 }></div>

                <Section name="rotor1" leftColumn={ rotor1.ingang } rightColumn={ rotor1.engang } notch={ rotor1.notch } refs={ rotor1Refs } />
                <div id="lineFwRotor1Rotor2" className="forward-line" ref={ lineFwRotor1Rotor2 }></div>
                <div id="lineBwRotor1Rotor2" className="backward-line" ref={ lineBwRotor1Rotor2 }></div>

                <Section name="rotor2" leftColumn={ rotor2.ingang } rightColumn={ rotor2.engang } notch={ rotor2.notch } refs={ rotor2Refs } />
                <div id="lineFwRotor2Rotor3" className="forward-line" ref={ lineFwRotor2Rotor3 }></div>
                <div id="lineBwRotor2Rotor3" className="backward-line" ref={ lineBwRotor2Rotor3 }></div>

                <Section name="rotor3" leftColumn={ rotor3.ingang } rightColumn={ rotor3.engang } notch={ rotor3.notch } refs={ rotor3Refs } />
                <div id="lineFwRotor3Plugboard" className="forward-line" ref={ lineFwRotor3Plugboard }></div>
                <div id="lineBwRotor3Plugboard" className="backward-line" ref={ lineBwRotor3Plugboard }></div>

                <Section name="plugboard" leftColumn={ plugboard.engang } rightColumn={ plugboard.ingang } refs={ plugboardRefs } />
                <div id="lineFwPlugboardKeyboard" className="forward-line" ref={ lineFwPlugboardKeyboard }></div>
                <div id="lineBwPlugboardKeyboard" className="backward-line" ref={ lineBwPlugboardKeyboard }></div>

                <div className="section">
                    <div className="name-container">
                        <h5>Keyboard/Lamb</h5>
                    </div>
                    <div className="character-container" style={ { justifyContent: 'center' } }>
                        <CharacterColumn name="keyboard" characters={ getKeyboard() } refs={ keyboardRefs } />
                    </div>
                </div>
            </section>

            <section className="input-container">
                <input type="text" id="input" className="input-box" value={ message } onChange={ (e) => setMessage(e.target.value.toUpperCase()) } />
            </section>
        </div>
    );
}
