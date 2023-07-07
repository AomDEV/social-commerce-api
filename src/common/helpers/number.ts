export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
export const positive = (value: number) => clamp(value, 0, Infinity);
