import { RefObject } from 'react';

const HORIZONTAL_OFFSET = 1;
const VERTICAL_RATIO = 1 / 3;

type EndCoord = {
    x: number;
    y: number;
}

function getEndsCoord(leftChar: HTMLSpanElement, rightChar: HTMLSpanElement): [EndCoord, EndCoord] {
    /** Get position of the left character */
    const leftCharRect = leftChar.getBoundingClientRect();
    const leftEnd: EndCoord = {
        x: leftCharRect.right - HORIZONTAL_OFFSET,
        y: leftCharRect.top + leftCharRect.height * VERTICAL_RATIO,
    };

    /** Get position of the right character */
    const rightCharRect = rightChar.getBoundingClientRect();
    const rightEnd: EndCoord = {
        x: rightCharRect.left - HORIZONTAL_OFFSET,
        y: rightCharRect.top + rightCharRect.height * VERTICAL_RATIO,
    };

    return [leftEnd, rightEnd];
}

/**
 * Calculate attribute of the line
 */
function calculateLineAttribute(leftEnd: EndCoord, rightEnd: EndCoord) {
    const left = leftEnd.x + 'px';
    const top = leftEnd.y + 'px';

    const xDiff = leftEnd.x - rightEnd.x;
    const yDiff = leftEnd.y - rightEnd.y;
    const width = getDistance(xDiff, yDiff) + 'px';
    const angle = getAngle(xDiff, yDiff);

    /**
    * Draw the line
    */
    return function drawLine(line: HTMLDivElement) {
        line.style.width = width;
        line.style.top = top;
        line.style.left = left;
        line.style.transform = `rotate(${-angle}deg)`;
    };
}

function getDistance(x: number, y: number): number {
    return Math.hypot(x, y);
}

function getAngle(x: number, y: number): number {
    return (Math.atan2(x, y) + (Math.PI / 2.0)) * 180 / Math.PI;
}

/**
 * Draw a line between 2 characters
 */
export function connect(
    leftCharRef: RefObject<HTMLSpanElement>,
    rightCharRef: RefObject<HTMLSpanElement>,
    lineRef: RefObject<HTMLDivElement>
) {
    if (leftCharRef.current !== null && rightCharRef.current !== null && lineRef.current !== null) {
        const [leftEnd, rightEnd] = getEndsCoord(leftCharRef.current, rightCharRef.current);
        const drawLine = calculateLineAttribute(leftEnd, rightEnd);
        drawLine(lineRef.current);
    }
}

export function getTodayDate(): number {
    return (new Date()).getDate();
}
