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
export interface BattleStats {
    startTime?: number;
    waveTime?: number;
    endTime?: number;
    totalWaitTime: number;
    totalRoundTime: number;
    lapCount: number;
    Metal: number;
    Nutrient: number;
    Power: number;
    Normal_Module: number;
    Advanced_Module: number;
    Special_Module: number;
}
