export const itemKeyToRank = (itemKey: string) => {
    switch (true) {
        case /_T1$/.test(itemKey):
            return "B";
        case /_T2$/.test(itemKey):
            return "A";
        case /_T3$/.test(itemKey):
            return "S";
        case /_T4$/.test(itemKey):
            return "SS";
        // そもそも消耗品などはT1とかで終わらない
        default:
            return "";
    }
};
