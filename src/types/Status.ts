// https://stackoverflow.com/questions/61132262/typescript-deep-partial
export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export type FarmingStats = {
    firstEnterTime: number | null;
    latestEnterTime: number | null;
    waveTime: number | null;
    latestLeaveTime: number | null;
    totalWaitingTime: number;
    totalRoundTime: number;
    lapCount: number;
    latestEnterStageKey: string | null;
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
    latestResources: {
        parts: number;
        nutrients: number;
        power: number;
    } | null;
    currentSquadCosts: {
        parts: number;
        nutrients: number;
        power: number;
    } | null;
};
