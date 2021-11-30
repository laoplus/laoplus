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
