import React, { forwardRef, useImperativeHandle } from 'react';
import Character from 'components/Enigma/Character';
import { NodeRefObjectType } from 'types';

export type CharacterColumnRefObjectType = {
    node1: NodeRefObjectType
    node2: NodeRefObjectType
}
type CharacterColumnPropsType = {
    name: string,
    characters: string[],
    refs: CharacterColumnRefObjectType,
}
const CharacterColumn = forwardRef<CharacterColumnRefObjectType, CharacterColumnPropsType>(
    ({ name, characters, refs }, ref) => {
        useImperativeHandle(ref, () => refs);
        const { node1, node2 } = refs;

        function renderCharacter(char: string, index: number) {
            const key: string = `${name}-${char}`;

            if (index !== node1.id && index !== node2.id) {
                return <Character key={ key } char={ char } />;
            }

            if (index === node1.id) {
                return <Character key={ key } char={ char } ref={ node1.ref } />;
            }

            if (index === node2.id) {
                return <Character key={ key } char={ char } ref={ node2.ref } />;
            }
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
