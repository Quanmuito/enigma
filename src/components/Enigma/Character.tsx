import React, { forwardRef } from 'react';

type CharacterPropsType = {
    char: string
}
const Character = forwardRef<HTMLSpanElement, CharacterPropsType>(
    ({ char }, ref) => {
        return <span ref={ ref }>{ char }</span>;
    }
);
Character.displayName = 'Character';

export default Character;
