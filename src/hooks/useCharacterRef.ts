import { createRef, RefObject, useMemo } from 'react';

type CharacterRef = {
    [index: string]: RefObject<HTMLSpanElement>;
};

function getRefForCharList(charList: string[]) {
    const refs: CharacterRef = {};

    function getRefForChar(char: string) {
        refs[char] = createRef<HTMLSpanElement>();
    }

    charList.forEach(getRefForChar);
    return refs;
}

export default function useCharacterRef(ingang: string[], engang: string[]): [CharacterRef, CharacterRef] {
    return useMemo(() => [getRefForCharList(ingang), getRefForCharList(engang)], [ingang, engang]);
}
