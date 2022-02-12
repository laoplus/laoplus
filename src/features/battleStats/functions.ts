import { gradeToRank, itemKeyToRank } from "~/utils";
import { WaveClearResponse } from "../types";

/**
 * @package
 */
export const enter = () => {
    const status = unsafeWindow.LAOPLUS.status;
    const curtime = new Date().getTime();
    const { latestLeaveTime, totalWaitingTime } = status.status.battleStats;

    if (latestLeaveTime) {
        const waitTime = (curtime - latestLeaveTime) / 1000;
        status.set({
            battleStats: {
                latestEnterTime: curtime,
                totalWaitingTime: totalWaitingTime + waitTime,
            },
        });
    } else {
        status.set({
            battleStats: {
                latestEnterTime: curtime,
            },
        });
    }
};

/**
 * @package
 */
export const leave = () => {
    const status = unsafeWindow.LAOPLUS.status;
    const curtime = new Date().getTime();
    const { waveTime, totalRoundTime, lapCount } = status.status.battleStats;

    if (waveTime) {
        const waitTime = (curtime - waveTime) / 1000;
        status.set({
            battleStats: {
                latestLeaveTime: curtime,
                totalRoundTime: totalRoundTime + waitTime,
                lapCount: lapCount + 1,
            },
        });
    } else {
        status.set({
            battleStats: {
                latestLeaveTime: curtime,
                lapCount: lapCount + 1,
            },
        });
    }
};

/**
 * @package
 */
export const incrementDrops = (res: WaveClearResponse) => {
    const status = unsafeWindow.LAOPLUS.status;

    const units = res.ClearRewardInfo.PCRewardList.reduce((unitDrops, unit) => {
        const rank = gradeToRank(unit.Grade);
        if (rank === "") return unitDrops;

        return {
            ...unitDrops,
            [rank]: unitDrops[rank] + 1,
        };
    }, status.status.battleStats.drops.units);

    const equipments = res.ClearRewardInfo.ItemRewardList.reduce(
        (equipmentDrops, item) => {
            const rank = itemKeyToRank(item.ItemKeyString);
            if (rank === "") return equipmentDrops;

            return {
                ...equipmentDrops,
                [rank]: equipmentDrops[rank] + 1,
            };
        },
        status.status.battleStats.drops.equipments
    );

    status.set({
        battleStats: { drops: { units, equipments } },
    });
};

/**
 * @package
 */
export const calcResource = () => {
    const status = unsafeWindow.LAOPLUS.status;

    const curtime = new Date().getTime();
    const { latestEnterTime, waveTime, totalRoundTime } =
        status.status.battleStats;

    const newRoundTime = waveTime ?? latestEnterTime ?? undefined;
    if (newRoundTime) {
        const waitTime = (curtime - newRoundTime) / 1000;
        status.set({
            battleStats: {
                waveTime: curtime,
                totalRoundTime: totalRoundTime + waitTime,
            },
        });
    } else {
        status.set({
            battleStats: {
                waveTime: curtime,
            },
        });
    }
};
