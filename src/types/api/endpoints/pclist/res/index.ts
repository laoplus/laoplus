import type { PCInfo, ResBase } from "~/types/api/shared";

/**
 * @package
 */
type res = ResBase & {
    /**
     * Resultで受け取るPCのIDのリスト
     * /
    FavorPCList:number[];
    /**
     * アカウントの戦闘員枠の最大数
     */
    MaxHavePCSlot: number;
    Result: PCInfo[];
};
export default res;
