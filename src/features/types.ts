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