import type { RefObject } from 'react';
import type { Config } from 'libs/enigma';

export type AppState = {
    config: Config,
    showMachine: boolean;
};

export type NodeRefObjectType = {
    id: number,
    ref: RefObject<HTMLSpanElement>,
};
