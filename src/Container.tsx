import React, { useState, RefObject, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { connect } from 'utils';
import { buildGenerator, getKeyboard, Machine } from 'v2/enigma';
import { NodeRefObjectType } from 'types';
import CharacterColumn, { CharacterColumnRefObjectType } from 'components/Enigma/CharacterColumn';

type ContainerPropsType = {
    configedMachine: Machine
}
export default function Container({ configedMachine }: ContainerPropsType) {
    const [message, setMessage] = useState<string>('A');

    const generator = buildGenerator(configedMachine);
    const [encryptedMessage, machine, nodePositions] = generator(message);
    const { reflector, rotor1, rotor2, rotor3, plugboard } = machine;

    const keyboardRefs: CharacterColumnRefObjectType = {
        node1: { id: nodePositions[0], ref: useRef<HTMLSpanElement>(null) },
        node2: { id: nodePositions[9], ref: useRef<HTMLSpanElement>(null) },
    };

    const plugboardRefs: SectionRefsType = {
        rNode1: { id: nodePositions[0], ref: useRef<HTMLSpanElement>(null) },
        lNode1: { id: nodePositions[1], ref: useRef<HTMLSpanElement>(null) },
        lNode2: { id: nodePositions[8], ref: useRef<HTMLSpanElement>(null) },
        rNode2: { id: nodePositions[9], ref: useRef<HTMLSpanElement>(null) },
    };

    const rotor3Refs: SectionRefsType = {
        rNode1: { id: nodePositions[1], ref: useRef<HTMLSpanElement>(null) },
        lNode1: { id: nodePositions[2], ref: useRef<HTMLSpanElement>(null) },
        lNode2: { id: nodePositions[7], ref: useRef<HTMLSpanElement>(null) },
        rNode2: { id: nodePositions[8], ref: useRef<HTMLSpanElement>(null) },
    };

    const rotor2Refs: SectionRefsType = {
        rNode1: { id: nodePositions[2], ref: useRef<HTMLSpanElement>(null) },
        lNode1: { id: nodePositions[3], ref: useRef<HTMLSpanElement>(null) },
        lNode2: { id: nodePositions[6], ref: useRef<HTMLSpanElement>(null) },
        rNode2: { id: nodePositions[7], ref: useRef<HTMLSpanElement>(null) },
    };

    const rotor1Refs: SectionRefsType = {
        rNode1: { id: nodePositions[3], ref: useRef<HTMLSpanElement>(null) },
        lNode1: { id: nodePositions[4], ref: useRef<HTMLSpanElement>(null) },
        lNode2: { id: nodePositions[5], ref: useRef<HTMLSpanElement>(null) },
        rNode2: { id: nodePositions[6], ref: useRef<HTMLSpanElement>(null) },
    };

    const rNode1 = useRef<HTMLSpanElement>(null);
    const rNode2 = useRef<HTMLSpanElement>(null);
    const lNode1 = useRef<HTMLSpanElement>(null);
    const reflectorRefs: SectionRefsType = {
        rNode1: { id: nodePositions[4], ref: rNode1 },
        lNode1: { id: nodePositions[5], ref: lNode1 },
        lNode2: { id: nodePositions[5], ref: lNode1 },
        rNode2: { id: nodePositions[5], ref: rNode2 },
    };

    const lineFwRotor1Reflector = useRef<HTMLDivElement>(null);
    const lineBwRotor1Reflector = useRef<HTMLDivElement>(null);

    const lineFwRotor2Rotor1 = useRef<HTMLDivElement>(null);
    const lineBwRotor2Rotor1 = useRef<HTMLDivElement>(null);

    const lineFwRotor3Rotor2 = useRef<HTMLDivElement>(null);
    const lineBwRotor3Rotor2 = useRef<HTMLDivElement>(null);

    const lineFwPlugboardRotor3 = useRef<HTMLDivElement>(null);
    const lineBwPlugboardRotor3 = useRef<HTMLDivElement>(null);

    const lineFwKeyboardPlugboard = useRef<HTMLDivElement>(null);
    const lineBwKeyboardPlugboard = useRef<HTMLDivElement>(null);

    useEffect(() => {
        connect(plugboardRefs.rNode1.ref, keyboardRefs.node1.ref, lineFwKeyboardPlugboard);
        connect(plugboardRefs.rNode2.ref, keyboardRefs.node2.ref, lineBwKeyboardPlugboard);

        connect(rotor3Refs.rNode1.ref, plugboardRefs.lNode1.ref, lineFwPlugboardRotor3);
        connect(rotor3Refs.rNode2.ref, plugboardRefs.lNode2.ref, lineBwPlugboardRotor3);

        connect(rotor2Refs.rNode1.ref, rotor3Refs.lNode1.ref, lineFwRotor3Rotor2);
        connect(rotor2Refs.rNode2.ref, rotor3Refs.lNode2.ref, lineBwRotor3Rotor2);

        connect(rotor1Refs.rNode1.ref, rotor2Refs.lNode1.ref, lineFwRotor2Rotor1);
        connect(rotor1Refs.rNode2.ref, rotor2Refs.lNode2.ref, lineBwRotor2Rotor1);

        connect(reflectorRefs.rNode1.ref, rotor1Refs.lNode1.ref, lineFwRotor1Reflector);
        connect(reflectorRefs.rNode2.ref, rotor1Refs.lNode2.ref, lineBwRotor1Reflector);
    });

    return (
        <div className="container d-flex flex-column justify-content-evenly align-items-center" style={ { height: '100%' } }>
            <section className="input-container">
                <input id="output" readOnly type="text" value={ encryptedMessage } />
            </section>
            <section className="visual-container">
                <Section name="reflector" leftColumn={ reflector.ingang } rightColumn={ reflector.engang } refs={ reflectorRefs } />
                <div id="lineFwRotor1Reflector" className="forward-line" ref={ lineFwRotor1Reflector }></div>
                <div id="lineBwRotor1Reflector" className="backward-line" ref={ lineBwRotor1Reflector }></div>

                <Section name="rotor1" leftColumn={ rotor1.ingang } rightColumn={ rotor1.engang } refs={ rotor1Refs } />
                <div id="lineFwRotor2Rotor1" className="forward-line" ref={ lineFwRotor2Rotor1 }></div>
                <div id="lineBwRotor2Rotor1" className="backward-line" ref={ lineBwRotor2Rotor1 }></div>

                <Section name="rotor2" leftColumn={ rotor2.ingang } rightColumn={ rotor2.engang } refs={ rotor2Refs } />
                <div id="lineFwRotor3Rotor2" className="forward-line" ref={ lineFwRotor3Rotor2 }></div>
                <div id="lineBwRotor3Rotor2" className="backward-line" ref={ lineBwRotor3Rotor2 }></div>

                <Section name="rotor3" leftColumn={ rotor3.ingang } rightColumn={ rotor3.engang } refs={ rotor3Refs } />
                <div id="lineFwPlugboardRotor3" className="forward-line" ref={ lineFwPlugboardRotor3 }></div>
                <div id="lineBwPlugboardRotor3" className="backward-line" ref={ lineBwPlugboardRotor3 }></div>

                <Section name="plugboard" leftColumn={ plugboard.engang } rightColumn={ plugboard.ingang } refs={ plugboardRefs } />
                <div id="lineFwKeyboardPlugboard" className="forward-line" ref={ lineFwKeyboardPlugboard }></div>
                <div id="lineBwKeyboardPlugboard" className="backward-line" ref={ lineBwKeyboardPlugboard }></div>

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
                <input id="input" type="text" value={ message } onChange={ (e) => setMessage(e.target.value.toUpperCase()) } />
            </section>
        </div>
    );
}

type SectionRefsType = {
    rNode1: NodeRefObjectType
    lNode1: NodeRefObjectType
    rNode2: NodeRefObjectType
    lNode2: NodeRefObjectType
}
type SectionPropsType = {
    name: string,
    leftColumn: string[],
    rightColumn: string[],
    refs: SectionRefsType
}
const Section = forwardRef<SectionRefsType, SectionPropsType>(
    ({ name, leftColumn, rightColumn, refs }, ref) => {

        useImperativeHandle(ref, () => refs);

        const [leftColumnRefs, rightColumnRefs] = getColumnRefs(refs);
        const lineRef1 = useRef<HTMLDivElement>(null);
        const lineRef2 = useRef<HTMLDivElement>(null);

        useEffect(() => {
            connect(leftColumnRefs.node1.ref, rightColumnRefs.node1.ref, lineRef1);
            connect(leftColumnRefs.node2.ref, rightColumnRefs.node2.ref, lineRef2);
        });

        return (
            <div className="section">
                <div className="name-container">
                    <h5>{ name.toUpperCase() }</h5>
                </div>
                <div className="character-container">
                    <CharacterColumn name={ name } characters={ leftColumn } refs={ leftColumnRefs } />
                    <CharacterColumn name={ name } characters={ rightColumn } refs={ rightColumnRefs } />
                    <div id={ `${name}-forward-line` } className="forward-line" ref={ lineRef1 }></div>
                    <div id={ `${name}-backward-line` } className="backward-line" ref={ lineRef2 }></div>
                </div>
            </div>
        );
    }
);
Section.displayName = 'Section';

function getColumnRefs({ rNode1, rNode2, lNode1, lNode2 }: SectionRefsType) {
    const leftColumnRefs = {
        node1: lNode1,
        node2: lNode2,
    };
    const rightColumnRefs = {
        node1: rNode1,
        node2: rNode2,
    };
    return [leftColumnRefs, rightColumnRefs];
}
