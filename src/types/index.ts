export type InvokeProps = {
    xhr: XMLHttpRequest;
    res: unknown;
    url: URL;
};

export interface TacticsManualUnit {
    uid: string;
    id: number;
    rarity: number;
    group: string;
    type: number;
    role: number;
    body: number;
    craft: number | false;
    // buffs: any[][];
    // skills: Skills;
    promo: number[];
}

export interface ExplorationSquad {
    EndTime: number;
    // EnterTime: number;
    SquadIndex: number;
    StageKeyString: string;
    // Status: number;
    timeoutID: number | undefined;
}
