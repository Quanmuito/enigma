import React, { useEffect, useRef } from 'react';

export default function App() {
    const dotAStyle = {
        top: '50px',
        left: '10px',
    };

    const dotBStyle = {
        top: '100px',
        left: '100px',
    };

    const dotARef = useRef<HTMLDivElement>(null);
    const dotBRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dotARef.current && dotBRef.current && lineRef.current) {
            const dotARect = dotARef.current.getBoundingClientRect();
            const dotAPos = {
                x: dotARect.left + 5,
                y: dotARect.top + 5,
            };
            const dotBRect = dotBRef.current.getBoundingClientRect();
            const dotBPos = {
                x: dotBRect.left + 5,
                y: dotBRect.top + 5,
            };
            const lineStyle = lineRef.current.style;

            const width = Math.hypot(dotAPos.x - dotBPos.x, dotAPos.y - dotBPos.y);
            const angle = ((Math.atan2(dotAPos.x - dotBPos.x, dotAPos.y - dotBPos.y) + (Math.PI / 2.0)) * 180 / Math.PI);
            lineStyle.width = width + 'px';
            lineStyle.left = dotAPos.x + 'px';
            lineStyle.top = dotAPos.y + 'px';
            lineStyle.transform = `rotate(${-angle}deg)`;
            lineStyle.display = 'block';
        }
    }, []);

    return (
        <div className="App">
            <div className="container">
                <div ref={ dotARef } id="dotA" className="dot" style={ dotAStyle }></div>
                <div ref={ dotBRef } id="dotB" className="dot" style={ dotBStyle }></div>
                <div ref={ lineRef } id="line"></div>
            </div>
        </div>
    );
}
