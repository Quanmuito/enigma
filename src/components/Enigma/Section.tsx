import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { connect } from 'utils';
import { NodeRefObjectType } from 'types';
import CharacterColumn from 'components/Enigma/CharacterColumn';

export type SectionRefsType = {
    lNode1: NodeRefObjectType
    rNode1: NodeRefObjectType
    lNode2: NodeRefObjectType
    rNode2: NodeRefObjectType
}

type SectionPropsType = {
    name: string,
    notch?: string
    leftColumn: string[],
    rightColumn: string[],
    refs: SectionRefsType
}

function getColumnRefs({ lNode1, rNode1, lNode2, rNode2 }: SectionRefsType) {
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

const Section = forwardRef<SectionRefsType, SectionPropsType>(
    ({ name, notch, leftColumn, rightColumn, refs }, ref) => {

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
                    <CharacterColumn name={ name } characters={ leftColumn } refs={ leftColumnRefs } notch={ notch } />
                    <CharacterColumn name={ name } characters={ rightColumn } refs={ rightColumnRefs } />
                    <div id={ `${name}-forward-line` } className="forward-line" ref={ lineRef1 }></div>
                    <div id={ `${name}-backward-line` } className="backward-line" ref={ lineRef2 }></div>
                </div>
            </div>
        );
    }
);
Section.displayName = 'Section';

export default Section;
