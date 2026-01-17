import React, { useState } from 'react';
import { Machine, buildGenerator } from 'libs/enigma';
import style from './style.module.css';
import { Input } from 'components/Forms/Input';
import { useTranslation } from 'react-i18next';

type EnigmaPropsType = {
    configedMachine: Machine
}

export default function Enigma({ configedMachine }: EnigmaPropsType) {
    const [message, setMessage] = useState<string>('ENIGMA');
    const generator = buildGenerator(configedMachine);
    const [encryptedMessage, machine, nodePositions] = generator(message);
    const { reflector, rotor1, rotor2, rotor3, plugboard } = machine;

    const { t } = useTranslation();

    return (
        <div className={ style.container }>
            <section className={ style.outputContainer }>
                { encryptedMessage }
            </section>

            <section className={ style.inputContainer }>
                <Input
                    name="messageInput"
                    type="text"
                    value={ message }
                    onChange={ (e) => setMessage(e.target.value.toUpperCase()) }
                    aria-label={ t('labelMessageInput') }
                    autoFocus
                    style={ CustomStyle.messageInput }
                />
            </section>
        </div>
    );
}

const CustomStyle: { messageInput: React.CSSProperties } = {
    messageInput: {
        textAlign: 'center',
    },
};
