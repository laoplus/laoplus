import { defaultStatus } from "~/Status";
import { battleserver_enter } from "~/types/battleserver_enter";
import { log, gradeToRank, itemKeyToRank } from "~/utils";
import { WaveClearResponse } from "../types";

export const reset = () => {
    unsafeWindow.LAOPLUS.status.set({
        farmingStats: { ...defaultStatus.farmingStats },
    });
};

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
export const calcSquadCosts = (res: battleserver_enter) => {
    const status = unsafeWindow.LAOPLUS.status;
    const latestResources = status.status.farmingStats.latestResources;

    const currentResources = {
        parts: res.CurrencyInfo.Metal + res.CurrencyInfo.FreeMetal,
        nutrients: res.CurrencyInfo.Nutrient + res.CurrencyInfo.FreeNutrient,
        power: res.CurrencyInfo.Power + res.CurrencyInfo.FreePower,
    };

    const currentSquadCosts = (() => {
        if (latestResources === null) {
            return null;
        }
        const current = {
            parts: latestResources.parts - currentResources.parts,
            nutrients: latestResources.nutrients - currentResources.nutrients,
            power: latestResources.power - currentResources.power,
        };

        // どれか一つでもマイナスになってたらなにかが変わったのでresetしてnullを返す
        if (Object.values(current).some((n) => n < 0)) {
            log.warn(
                "farmingStats",
                "calcSquadCosts",
                "currentSquadCostsがマイナスになっていたためresetします",
                current
            );
            reset();
            return null;
        }
        return current;
    })();

    status.set({
        farmingStats: {
            latestResources: {
                parts: currentResources.parts,
                nutrients: currentResources.nutrients,
                power: currentResources.power,
            },
            currentSquadCosts,
        },
    });
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
export const updateTimeStatus = () => {
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
