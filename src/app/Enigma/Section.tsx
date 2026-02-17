import React, { forwardRef, useImperativeHandle, useRef, useEffect, useCallback, useMemo } from 'react';
import useLineRedraw from 'hooks/useLineRedraw';
import { connect } from 'libs/utils';
import type { NodeRefObjectType } from 'types';
import CharacterColumn from './CharacterColumn';
import style from './style.module.css';

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

const Section = React.memo(
    forwardRef<SectionRefsType, SectionPropsType>(
        ({ name, notch, leftColumn, rightColumn, refs }, ref) => {

            useImperativeHandle(ref, () => refs);

            const [leftColumnRefs, rightColumnRefs] = useMemo(
                () => getColumnRefs(refs),
                [refs]
            );

            const lineRef1 = useRef<HTMLDivElement>(null);
            const lineRef2 = useRef<HTMLDivElement>(null);

            const redrawLines = useCallback(() => {
                connect(leftColumnRefs.node1.ref, rightColumnRefs.node1.ref, lineRef1);
                connect(leftColumnRefs.node2.ref, rightColumnRefs.node2.ref, lineRef2);
            }, [leftColumnRefs.node1.ref, leftColumnRefs.node2.ref, rightColumnRefs.node1.ref, rightColumnRefs.node2.ref]);

            useLineRedraw(redrawLines);

            useEffect(() => {
                redrawLines();
            }, [redrawLines, leftColumnRefs.node1.id, leftColumnRefs.node2.id, rightColumnRefs.node1.id, rightColumnRefs.node2.id]);

            return (
                <div className={ style.section }>
                    <div className={ style.nameContainer }>
                        <h5>{ name.toUpperCase() }</h5>
                    </div>
                    <div className={ style.characterContainer }>
                        <CharacterColumn name={ name } characters={ leftColumn } refs={ leftColumnRefs } notch={ notch } />
                        <CharacterColumn name={ name } characters={ rightColumn } refs={ rightColumnRefs } />
                        <div id={ `${name}-forward-line` } className={ style.forwardLine } ref={ lineRef1 }></div>
                        <div id={ `${name}-backward-line` } className={ style.backwardLine } ref={ lineRef2 }></div>
                    </div>
                </div>
            );
        }
    ),
    (prevProps, nextProps) => {
        return (
            prevProps.name === nextProps.name &&
            prevProps.notch === nextProps.notch &&
            prevProps.leftColumn === nextProps.leftColumn &&
            prevProps.rightColumn === nextProps.rightColumn &&
            prevProps.refs === nextProps.refs
        );
    }
);
Section.displayName = 'Section';

export default Section;
