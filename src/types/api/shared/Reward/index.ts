import { CurrencyInfo } from "~/types/api/shared";
import { ItemReward } from "./ItemReward";

/**
 * @package
 */
export type Reward = {
    IsSendToMail: number;
    BeforAccountLevel: number;
    CurrentAccountLevel: number;
    AddAccountExp: number;
    CurrAccountExp: number;
    /**
     * 報酬として獲得した資源
     */
    GiveCurrencyInfo: CurrencyInfo;
    AddTraningTicket: number;
    AddChallengeTicket: number;
    AddPresetSlotCount: number;
    /**
     * 現在の資源
     */
    CurrencyInfo: CurrencyInfo;
    CurrTriningTicket: number;
    CurrChallengeTicket: number;
    /**
     * PCRewardMiniかPCRewardだと思うが未確認
     */
    PCRewardList: null;
    ItemRewardList: ItemReward[];
    PCSkinKeyList: null;
    FavorRewardList: null;
    InvenExtendList: null;
    PCUpdateList: null;
    UpdateSkillUpList: null;
    BGKeyString: "";
    AddBoostInfos: null;
};
