import { gradeToRank, itemKeyToRank } from "~/utils";
import { WaveClearResponse } from "../types";

/**
 * @package
 */
export const enter = () => {
    const status = unsafeWindow.LAOPLUS.status;
    const curtime = new Date().getTime();
    const { latestLeaveTime, totalWaitingTime } = status.status.farmingStats;

    if (latestLeaveTime) {
        const waitTime = (curtime - latestLeaveTime) / 1000;
        status.set({
            farmingStats: {
                latestEnterTime: curtime,
                totalWaitingTime: totalWaitingTime + waitTime,
            },
        });
    } else {
        status.set({
            farmingStats: {
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
    const { waveTime, totalRoundTime, lapCount } = status.status.farmingStats;

    if (waveTime) {
        const waitTime = (curtime - waveTime) / 1000;
        status.set({
            farmingStats: {
                latestLeaveTime: curtime,
                totalRoundTime: totalRoundTime + waitTime,
                lapCount: lapCount + 1,
            },
        });
    } else {
        status.set({
            farmingStats: {
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
    }, status.status.farmingStats.drops.units);

    const equipments = res.ClearRewardInfo.ItemRewardList.reduce(
        (equipmentDrops, item) => {
            const rank = itemKeyToRank(item.ItemKeyString);
            if (rank === "") return equipmentDrops;

            return {
                ...equipmentDrops,
                [rank]: equipmentDrops[rank] + 1,
            };
        },
        status.status.farmingStats.drops.equipments
    );

    status.set({
        farmingStats: { drops: { units, equipments } },
    });
};

/**
 * @package
 */
export const calcResource = () => {
    const status = unsafeWindow.LAOPLUS.status;

    const curtime = new Date().getTime();
    const { latestEnterTime, waveTime, totalRoundTime } =
        status.status.farmingStats;

    const newRoundTime = waveTime ?? latestEnterTime ?? undefined;
    if (newRoundTime) {
        const waitTime = (curtime - newRoundTime) / 1000;
        status.set({
            farmingStats: {
                waveTime: curtime,
                totalRoundTime: totalRoundTime + waitTime,
            },
        });
    } else {
        status.set({
            farmingStats: {
                waveTime: curtime,
            },
        });
    }
};
