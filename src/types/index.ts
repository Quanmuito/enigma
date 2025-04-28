import { RefObject } from 'react';
import { Config } from 'libs/enigma';

export type AppState = {
    config: Config,
    showMachine: boolean;
};

export type NodeRefObjectType = {
    id: number,
    ref: RefObject<HTMLSpanElement>,
};
