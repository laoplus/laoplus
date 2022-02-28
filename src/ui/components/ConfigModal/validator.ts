/**
 * 与えられた文字列をNumberでパースした際、整数として正しいか
 */
export const isInteger = (value: string): boolean => {
    return Number.isSafeInteger(Number(value));
};

/**
 * 与えられた文字列をNumberでパースした際、0を含む正の整数として正しいか
 */
export const isPositiveInteger = (value: string): boolean => {
    const num = Number(value);
    return Number.isSafeInteger(num) && num >= 0;
};

/**
 * 与えられた文字列をNumberでパースした際、小数として正しいか
 */
export const isFloat = (value: string): boolean => {
    return Number.isFinite(Number(value));
};

/**
 * 与えられた文字列をNumberでパースした際、0を含む正の小数として正しいか
 */
export const isPositiveFloat = (value: string): boolean => {
    const num = Number(value);
    return Number.isFinite(num) && num >= 0;
};
