import { log } from "~/utils";

interface ResourceFarmRecoder {
    startTime?: number,
    endTime?: number,
    totalWaitTime?: number,
    totalRoundTime?: number,
    rounds?: number,
    Metal?: number,
    Nutrient?: number,
    Power?: number,
    Normal_Module?: number,
    Advanced_Module?: number,
    Special_Module?: number,
}

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
    }
}


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
    }
}

export const stageStart = () => {
    const status = unsafeWindow.LAOPLUS.status;
    const curtime = new Date().getTime();
    const { startTime, endTime, totalWaitTime, rounds } = status.status.resourceFarmRecoder as ResourceFarmRecoder;

    if (startTime && endTime) {
        const waitTime = curtime - endTime;
        totalWaitTime = (totalWaitTime | 0) + waitTime;
        status.set({
            resourceFarmRecoder: {
                startTime: curtime,
                totalWaitTime: totalWaitTime,
            } as ResourceFarmRecoder
        })
    } else {
        status.set({
            resourceFarmRecoder: {
                startTime: curtime,
            }
        })
    }
};

export const stageStop = () => {
    const status = unsafeWindow.LAOPLUS.status;
    const curtime = new Date().getTime()
    const { startTime, endTime, totalRoundTime, rounds } = status.status.resourceFarmRecoder as ResourceFarmRecoder;

    if (startTime && endTime) {
        const waitTime = curtime - startTime;
        totalRoundTime = (totalRoundTime | 0) + waitTime;
        rounds = (rounds | 0) + 1;
        status.set({
            resourceFarmRecoder: {
                endTime: curtime,
                totalRoundTime: totalRoundTime,
                rounds: rounds,
            } as ResourceFarmRecoder
        })
    } else {
        status.set({
            resourceFarmRecoder: {
                endTime: curtime,
            }
        })
    }
};

type WaveClearResponse = {
    ClearRewardInfo: ClearRewardInfo;
};
type ClearRewardInfo = {
    PCRewardList: RewardPC[];
    ItemRewardList: RewardItem[];
};
type RewardPC = {
    Grade: number;
    Level: number;
    PCKeyString: string;
};
type RewardItem = {
    ItemKeyString: string;
};

export const calcResource = (res: WaveClearResponse) => {
    const status = unsafeWindow.LAOPLUS.status;
    const { Metal, Nutrient, Power, Normal_Module, Advanced_Module, Special_Module } = status.status.resourceFarmRecoder as ResourceFarmRecoder;
    res.ClearRewardInfo.PCRewardList.forEach(pc => {
        switch (pc.Grade) {
            case 2:
                Metal = (Metal | 0) + PCDisassemblingTable["B"]["Metal"];
                Nutrient = (Nutrient | 0) + PCDisassemblingTable["B"]["Nutrient"];
                Power = (Power | 0) + PCDisassemblingTable["B"]["Power"];
                Normal_Module = (Normal_Module | 0) + PCDisassemblingTable["B"]["Normal_Module"];
                Advanced_Module = (Advanced_Module | 0) + PCDisassemblingTable["B"]["Advanced_Module"];
                Special_Module = (Special_Module | 0) + PCDisassemblingTable["B"]["Special_Module"];
                break;
            case 3:
                Metal = (Metal | 0) + PCDisassemblingTable["A"]["Metal"];
                Nutrient = (Nutrient | 0) + PCDisassemblingTable["A"]["Nutrient"];
                Power = (Power | 0) + PCDisassemblingTable["A"]["Power"];
                Normal_Module = (Normal_Module | 0) + PCDisassemblingTable["A"]["Normal_Module"];
                Advanced_Module = (Advanced_Module | 0) + PCDisassemblingTable["A"]["Advanced_Module"];
                Special_Module = (Special_Module | 0) + PCDisassemblingTable["A"]["Special_Module"];
                break;
            case 4:
                Metal = (Metal | 0) + PCDisassemblingTable["S"]["Metal"];
                Nutrient = (Nutrient | 0) + PCDisassemblingTable["S"]["Nutrient"];
                Power = (Power | 0) + PCDisassemblingTable["S"]["Power"];
                Normal_Module = (Normal_Module | 0) + PCDisassemblingTable["S"]["Normal_Module"];
                Advanced_Module = (Advanced_Module | 0) + PCDisassemblingTable["S"]["Advanced_Module"];
                Special_Module = (Special_Module | 0) + PCDisassemblingTable["S"]["Special_Module"];
                break;
            case 5:
                Metal = (Metal | 0) + PCDisassemblingTable["SS"]["Metal"];
                Nutrient = (Nutrient | 0) + PCDisassemblingTable["SS"]["Nutrient"];
                Power = (Power | 0) + PCDisassemblingTable["SS"]["Power"];
                Normal_Module = (Normal_Module | 0) + PCDisassemblingTable["SS"]["Normal_Module"];
                Advanced_Module = (Advanced_Module | 0) + PCDisassemblingTable["SS"]["Advanced_Module"];
                Special_Module = (Special_Module | 0) + PCDisassemblingTable["SS"]["Special_Module"];
                break;
        }
    })

    res.ClearRewardInfo.ItemRewardList.forEach(pc => {
        switch (pc.Grade) {
            case 2:
                Metal = (Metal | 0) + ItemDisassemblingTable["B"]["Metal"];
                Nutrient = (Nutrient | 0) + ItemDisassemblingTable["B"]["Nutrient"];
                Power = (Power | 0) + ItemDisassemblingTable["B"]["Power"];
                Normal_Module = (Normal_Module | 0) + ItemDisassemblingTable["B"]["Normal_Module"];
                Advanced_Module = (Advanced_Module | 0) + ItemDisassemblingTable["B"]["Advanced_Module"];
                Special_Module = (Special_Module | 0) + ItemDisassemblingTable["B"]["Special_Module"];
                break;
            case 3:
                Metal = (Metal | 0) + ItemDisassemblingTable["A"]["Metal"];
                Nutrient = (Nutrient | 0) + ItemDisassemblingTable["A"]["Nutrient"];
                Power = (Power | 0) + ItemDisassemblingTable["A"]["Power"];
                Normal_Module = (Normal_Module | 0) + ItemDisassemblingTable["A"]["Normal_Module"];
                Advanced_Module = (Advanced_Module | 0) + ItemDisassemblingTable["A"]["Advanced_Module"];
                Special_Module = (Special_Module | 0) + ItemDisassemblingTable["A"]["Special_Module"];
                break;
            case 4:
                Metal = (Metal | 0) + ItemDisassemblingTable["S"]["Metal"];
                Nutrient = (Nutrient | 0) + ItemDisassemblingTable["S"]["Nutrient"];
                Power = (Power | 0) + ItemDisassemblingTable["S"]["Power"];
                Normal_Module = (Normal_Module | 0) + ItemDisassemblingTable["S"]["Normal_Module"];
                Advanced_Module = (Advanced_Module | 0) + ItemDisassemblingTable["S"]["Advanced_Module"];
                Special_Module = (Special_Module | 0) + ItemDisassemblingTable["S"]["Special_Module"];
                break;
            case 5:
                Metal = (Metal | 0) + ItemDisassemblingTable["SS"]["Metal"];
                Nutrient = (Nutrient | 0) + ItemDisassemblingTable["SS"]["Nutrient"];
                Power = (Power | 0) + ItemDisassemblingTable["SS"]["Power"];
                Normal_Module = (Normal_Module | 0) + ItemDisassemblingTable["SS"]["Normal_Module"];
                Advanced_Module = (Advanced_Module | 0) + ItemDisassemblingTable["SS"]["Advanced_Module"];
                Special_Module = (Special_Module | 0) + ItemDisassemblingTable["SS"]["Special_Module"];
                break;
        }
    })    
    status.set({
        resourceFarmRecoder: {
            Metal: Metal,
            Nutrient: Nutrient,
            Power: Power,
            Normal_Module: Normal_Module,
            Advanced_Module: Advanced_Module,
            Special_Module: Special_Module,
        }
    })
};
