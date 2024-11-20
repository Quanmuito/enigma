import { RefObject } from 'react';

type EndCord = {
    x: number, // cordinate on X-axis
    y: number, // cordinate on Y-axis
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
        const [leftEnd, rightEnd] = getEndCord(leftCharRef.current, rightCharRef.current);
        const drawLine = calculateLineAttribute(leftEnd, rightEnd);
        drawLine(lineRef.current);
    }
}

function getEndCord(leftChar: HTMLSpanElement, rightChar: HTMLSpanElement): [EndCord, EndCord] {
    /** Get position of the left character */
    const leftCharRect = leftChar.getBoundingClientRect();
    const leftEnd: EndCord = {
        x: leftCharRect.right - 1, // Move 1px away from the character horizontally
        y: leftCharRect.top + leftCharRect.height / 3, // Make the line in the middle of the character vertically
    };

    /** Get position of the right character */
    const rightCharRect = rightChar.getBoundingClientRect();
    const rightEnd: EndCord = {
        x: rightCharRect.left - 1, // Move 1px away from the character horizontally
        y: rightCharRect.top + rightCharRect.height / 3, // Make the line in the middle of the character vertically
    };

    return [leftEnd, rightEnd];
}

/**
 * Calculate attribute of the line
*/
function calculateLineAttribute(leftEnd: EndCord, rightEnd: EndCord) {
    const xDiff = leftEnd.x - rightEnd.x;
    const yDiff = leftEnd.y - rightEnd.y;
    const width = getDistance(xDiff, yDiff) + 'px';
    const left = leftEnd.x + 'px';
    const top = leftEnd.y + 'px';
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
