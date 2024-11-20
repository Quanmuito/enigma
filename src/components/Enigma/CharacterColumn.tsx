import React, { RefObject, forwardRef, useImperativeHandle } from 'react';
import { NodeRefObjectType } from 'types';

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
const CharacterColumn = forwardRef<CharacterColumnRefObjectType, CharacterColumnPropsType>(
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
                    className={ (char === notch ? 'notch' : '') + ((!!notch && index === 0) ? ' top' : '') }
                >
                    { char }
                </span>
            );
        }

        return (
            <div className="character-column">
                { characters.map(renderCharacter) }
            </div>
        );
    }
);
CharacterColumn.displayName = 'CharacterColumn';

export default CharacterColumn;
