/**
 * 1桁の数字を囲み絵文字に変換する
 * @param SquadIndex 1 | 2| 3 | 4
 * @returns 1️⃣ | 2️⃣ | 3️⃣ | 4️⃣
 */
export const numberToEmoji = (number: number) => {
    if (String(number).length !== 1) {
        throw new Error("1桁以外の数字を処理することはできません");
    }
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return number + "\uFE0F\u20E3";
};
