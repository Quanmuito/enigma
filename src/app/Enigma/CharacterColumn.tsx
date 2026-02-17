import React, { forwardRef, useImperativeHandle } from 'react';
import type { RefObject } from 'react';
import type { NodeRefObjectType } from 'types';
import style from './style.module.css';

export type CharacterColumnRefObjectType = {
    node1: NodeRefObjectType
    node2: NodeRefObjectType
}
type CharacterColumnPropsType = {
    name: string,
    characters: string[],
    notch?: string
    refs: CharacterColumnRefObjectType,
}
const CharacterColumn = React.memo(
    forwardRef<CharacterColumnRefObjectType, CharacterColumnPropsType>(
        ({ name, characters, notch, refs }, ref) => {
            useImperativeHandle(ref, () => refs);
            const { node1, node2 } = refs;

            function getRef(index: number): RefObject<HTMLSpanElement>|null {
                if (index === node1.id) return node1.ref;
                if (index === node2.id) return node2.ref;
                return null;
            }

            function renderCharacter(char: string, index: number) {
                const key: string = `${name}-${char}`;
                return (
                    <span
                        key={ key }
                        ref={ getRef(index) }
                        className={ [
                            char === notch && style.notch,
                            !!notch && index === 0 && style.top,
                        ].filter(Boolean).join(' ') }
                    >
                        { char }
                    </span>
                );
            }

            return (
                <div className={ style.characterColumn }>
                    { characters.map(renderCharacter) }
                </div>
            );
        }
    ),
    (prevProps, nextProps) => {
        return (
            prevProps.name === nextProps.name &&
            prevProps.characters === nextProps.characters &&
            prevProps.notch === nextProps.notch &&
            prevProps.refs.node1.id === nextProps.refs.node1.id &&
            prevProps.refs.node2.id === nextProps.refs.node2.id
        );
    }
);
CharacterColumn.displayName = 'CharacterColumn';

export default CharacterColumn;
