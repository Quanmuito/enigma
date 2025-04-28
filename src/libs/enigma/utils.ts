export function isLastItem(index: number, array: string[]): boolean {
    return index + 1 === array.length;
}

export function isString(value: string | number): value is string {
    return typeof value === 'string';
}
