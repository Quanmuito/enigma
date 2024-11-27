import { useRef } from 'react';

export default function useLineRef() {
    const lineForward = useRef<HTMLDivElement>(null);
    const lineBackward = useRef<HTMLDivElement>(null);

    return [lineForward, lineBackward];
}
