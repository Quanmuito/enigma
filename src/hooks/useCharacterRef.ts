import { useRef } from 'react';

export default function useCharacterRef(nodePositions: number[], [p1, p2, p3, p4]: number[]) {
    const lNode1 = useRef<HTMLSpanElement>(null);
    const rNode1 = useRef<HTMLSpanElement>(null);
    const lNode2 = useRef<HTMLSpanElement>(null);
    const rNode2 = useRef<HTMLSpanElement>(null);

    return {
        lNode1: { id: nodePositions[p1], ref: lNode1 },
        rNode1: { id: nodePositions[p2], ref: rNode1 },
        lNode2: { id: nodePositions[p3], ref: p1 === p3 ? lNode1 : lNode2 },
        rNode2: { id: nodePositions[p4], ref: rNode2 },
    };
}
