import { log } from "~/utils";

const PCDisassemblingTable = {
    B: {
        Metal: 5,
        Nutrient: 5,
        Power: 5,
        Normal_Module: 5,
        Advanced_Module: 0,
        Special_Module: 0,
    },
    A: {
        Metal: 25,
        Nutrient: 25,
        Power: 25,
        Normal_Module: 25,
        Advanced_Module: 3,
        Special_Module: 0,
    },
    S: {
        Metal: 50,
        Nutrient: 50,
        Power: 50,
        Normal_Module: 50,
        Advanced_Module: 10,
        Special_Module: 1,
    },
    SS: {
        Metal: 100,
        Nutrient: 100,
        Power: 100,
        Normal_Module: 100,
        Advanced_Module: 20,
        Special_Module: 5,
    },
};

const ItemDisassemblingTable = {
    B: {
        Metal: 3,
        Nutrient: 0,
        Power: 3,
        Normal_Module: 1,
        Advanced_Module: 0,
        Special_Module: 0,
    },
    A: {
        Metal: 5,
        Nutrient: 0,
        Power: 5,
        Normal_Module: 3,
        Advanced_Module: 1,
        Special_Module: 0,
    },
    S: {
        Metal: 10,
        Nutrient: 0,
        Power: 10,
        Normal_Module: 5,
        Advanced_Module: 2,
        Special_Module: 0,
    },
    SS: {
        Metal: 20,
        Nutrient: 0,
        Power: 20,
        Normal_Module: 10,
        Advanced_Module: 3,
        Special_Module: 1,
    },
};

export const stageStart = () => {
    const status = unsafeWindow.LAOPLUS.status;
    const curtime = new Date().getTime();
    const { endTime, totalWaitTime } = status.status.battleStats;

    if (endTime) {
        const waitTime = (curtime - endTime) / 1000;
        status.set({
            battleStats: {
                startTime: curtime,
                totalWaitTime: totalWaitTime + waitTime,
            },
        });
    } else {
        status.set({
            battleStats: {
                startTime: curtime,
            },
        });
    }
};

export const stageStop = () => {
    const status = unsafeWindow.LAOPLUS.status;
    const curtime = new Date().getTime();
    const { waveTime, totalRoundTime, rounds } = status.status.battleStats;

    if (waveTime) {
        const waitTime = (curtime - waveTime) / 1000;
        status.set({
            battleStats: {
                endTime: curtime,
                totalRoundTime: totalRoundTime + waitTime,
                rounds: rounds + 1,
            },
        });
    } else {
        status.set({
            battleStats: {
                endTime: curtime,
                rounds: rounds + 1,
            },
        });
    }
};

import { WaveClearResponse } from "../types";

export const calcResource = (res: WaveClearResponse) => {
    const status = unsafeWindow.LAOPLUS.status;
    // Get timer
    const curtime = new Date().getTime();
    const { startTime, waveTime, totalRoundTime } = status.status.battleStats;

    const newRoundTime = waveTime ?? startTime ?? undefined;
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

    // Get reward
    const { rounds } = status.status.battleStats;
    let {
        Metal,
        Nutrient,
        Power,
        Normal_Module,
        Advanced_Module,
        Special_Module,
    } = status.status.battleStats;
    res.ClearRewardInfo.PCRewardList.forEach((pc) => {
        switch (pc.Grade) {
            case 2:
                Metal = Metal + PCDisassemblingTable["B"]["Metal"];
                Nutrient = Nutrient + PCDisassemblingTable["B"]["Nutrient"];
                Power = Power + PCDisassemblingTable["B"]["Power"];
                Normal_Module =
                    Normal_Module + PCDisassemblingTable["B"]["Normal_Module"];
                Advanced_Module =
                    Advanced_Module +
                    PCDisassemblingTable["B"]["Advanced_Module"];
                Special_Module =
                    Special_Module +
                    PCDisassemblingTable["B"]["Special_Module"];
                break;
            case 3:
                Metal = Metal + PCDisassemblingTable["A"]["Metal"];
                Nutrient = Nutrient + PCDisassemblingTable["A"]["Nutrient"];
                Power = Power + PCDisassemblingTable["A"]["Power"];
                Normal_Module =
                    Normal_Module + PCDisassemblingTable["A"]["Normal_Module"];
                Advanced_Module =
                    Advanced_Module +
                    PCDisassemblingTable["A"]["Advanced_Module"];
                Special_Module =
                    Special_Module +
                    PCDisassemblingTable["A"]["Special_Module"];
                break;
            case 4:
                Metal = Metal + PCDisassemblingTable["S"]["Metal"];
                Nutrient = Nutrient + PCDisassemblingTable["S"]["Nutrient"];
                Power = Power + PCDisassemblingTable["S"]["Power"];
                Normal_Module =
                    Normal_Module + PCDisassemblingTable["S"]["Normal_Module"];
                Advanced_Module =
                    Advanced_Module +
                    PCDisassemblingTable["S"]["Advanced_Module"];
                Special_Module =
                    Special_Module +
                    PCDisassemblingTable["S"]["Special_Module"];
                break;
            case 5:
                Metal = Metal + PCDisassemblingTable["SS"]["Metal"];
                Nutrient = Nutrient + PCDisassemblingTable["SS"]["Nutrient"];
                Power = Power + PCDisassemblingTable["SS"]["Power"];
                Normal_Module =
                    Normal_Module + PCDisassemblingTable["SS"]["Normal_Module"];
                Advanced_Module =
                    Advanced_Module +
                    PCDisassemblingTable["SS"]["Advanced_Module"];
                Special_Module =
                    Special_Module +
                    PCDisassemblingTable["SS"]["Special_Module"];
                break;
        }
    });

    res.ClearRewardInfo.ItemRewardList.forEach((item) => {
        if (item.ItemKeyString.includes("T1")) {
            Metal = Metal + ItemDisassemblingTable["B"]["Metal"];
            Nutrient = Nutrient + ItemDisassemblingTable["B"]["Nutrient"];
            Power = Power + ItemDisassemblingTable["B"]["Power"];
            Normal_Module =
                Normal_Module + ItemDisassemblingTable["B"]["Normal_Module"];
            Advanced_Module =
                Advanced_Module +
                ItemDisassemblingTable["B"]["Advanced_Module"];
            Special_Module =
                Special_Module + ItemDisassemblingTable["B"]["Special_Module"];
        } else if (item.ItemKeyString.includes("T2")) {
            Metal = Metal + ItemDisassemblingTable["A"]["Metal"];
            Nutrient = Nutrient + ItemDisassemblingTable["A"]["Nutrient"];
            Power = Power + ItemDisassemblingTable["A"]["Power"];
            Normal_Module =
                Normal_Module + ItemDisassemblingTable["A"]["Normal_Module"];
            Advanced_Module =
                Advanced_Module +
                ItemDisassemblingTable["A"]["Advanced_Module"];
            Special_Module =
                Special_Module + ItemDisassemblingTable["A"]["Special_Module"];
        } else if (item.ItemKeyString.includes("T3")) {
            Metal = Metal + ItemDisassemblingTable["S"]["Metal"];
            Nutrient = Nutrient + ItemDisassemblingTable["S"]["Nutrient"];
            Power = Power + ItemDisassemblingTable["S"]["Power"];
            Normal_Module =
                Normal_Module + ItemDisassemblingTable["S"]["Normal_Module"];
            Advanced_Module =
                Advanced_Module +
                ItemDisassemblingTable["S"]["Advanced_Module"];
            Special_Module =
                Special_Module + ItemDisassemblingTable["S"]["Special_Module"];
        } else if (item.ItemKeyString.includes("T4")) {
            Metal = Metal + ItemDisassemblingTable["SS"]["Metal"];
            Nutrient = Nutrient + ItemDisassemblingTable["SS"]["Nutrient"];
            Power = Power + ItemDisassemblingTable["SS"]["Power"];
            Normal_Module =
                Normal_Module + ItemDisassemblingTable["SS"]["Normal_Module"];
            Advanced_Module =
                Advanced_Module +
                ItemDisassemblingTable["SS"]["Advanced_Module"];
            Special_Module =
                Special_Module + ItemDisassemblingTable["SS"]["Special_Module"];
        }
    });
    log.debug(
        `[${rounds}] ${Metal}/${Nutrient}/${Power} - ${Normal_Module}/${Advanced_Module}/${Special_Module}`
    );
    status.set({
        battleStats: {
            Metal: Metal,
            Nutrient: Nutrient,
            Power: Power,
            Normal_Module: Normal_Module,
            Advanced_Module: Advanced_Module,
            Special_Module: Special_Module,
        },
    });
};
