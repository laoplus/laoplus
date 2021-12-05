import { Dayjs } from "dayjs";

/**
 * 与えられた日時までを時間と分のみの相対時間に変換する
 * @returns x時間x分
 * @returns x分
 */
export const dateToRelativeTime = (target: Dayjs) => {
    const now = dayjs();

    const hour = target.diff(now, "hour");
    const minute = target.diff(now.add(hour, "hour"), "minute");
    if (hour === 0) {
        return `${minute}分`;
    }
    return `${hour}時間${minute}分`;
};
