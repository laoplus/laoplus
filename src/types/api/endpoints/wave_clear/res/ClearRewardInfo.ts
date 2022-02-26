import type { CurrencyInfo } from "~/types/api/shared";

/**
 * @package
 */
export type ClearRewardInfo = {
    AccountExp: number;
    Exp: number;
    GiveCurrencyInfo: CurrencyInfo;
    ItemRewardList: ItemReward[];
    MailReward: MailReward;
    PCRewardList: PCRewardMini[];
};

type ItemReward = {
    EnchantLevel: number;
    EnchantPoint: number;
    EquipSlot: number;
    EquippedPCID: number;
    InvenCategory: number;
    InvenPos: number;
    IsLock: number;
    ItemKeyString: string;
    ItemSN: number;
    ItemType: number;
    ItemUID: number;
    StackCount: number;
};

type MailReward = {
    ItemRewardList: ItemReward[];
    /**
     * PCRewardMiniかPCRewardだと思うがわからない
     */
    PCRewardList: [];
};

type PCRewardMini = {
    Grade: number;
    Level: number;
    /**
     * @example "Char_BR_WarWolf_N"
     */
    PCKeyString: string;
};
