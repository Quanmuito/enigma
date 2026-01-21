import { useEffect, useRef } from 'react';

export default function useLineRedraw(redrawCallback: () => void) {
    const timeoutRef = useRef<number | null>(null);
    const callbackRef = useRef(redrawCallback);

    useEffect(() => {
        callbackRef.current = redrawCallback;
    }, [redrawCallback]);

    useEffect(() => {
        const debouncedRedraw = () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = window.setTimeout(() => {
                callbackRef.current();
            }, 250);
        };

        window.addEventListener('resize', debouncedRedraw);
        window.addEventListener('scroll', debouncedRedraw, { passive: true });

        return () => {
            window.removeEventListener('resize', debouncedRedraw);
            window.removeEventListener('scroll', debouncedRedraw);
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);
}
