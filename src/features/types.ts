export type InvokeProps = {
    xhr: XMLHttpRequest;
    res: unknown;
    url: URL;
};

export type WaveClearResponse = {
    ClearRewardInfo: ClearRewardInfo;
};

export type ClearRewardInfo = {
    PCRewardList: RewardPC[];
    ItemRewardList: RewardItem[];
};
export type RewardPC = {
    Grade: number;
    Level: number;
    PCKeyString: string;
};
export type RewardItem = {
    ItemKeyString: string;
};
export interface FarmingStats {
    latestEnterTime: number | null;
    waveTime: number | null;
    latestLeaveTime: number | null;
    totalWaitingTime: number;
    totalRoundTime: number;
    lapCount: number;
    drops: {
        units: {
            SS: number;
            S: number;
            A: number;
            B: number;
        };
        equipments: {
            SS: number;
            S: number;
            A: number;
            B: number;
        };
    };
}
