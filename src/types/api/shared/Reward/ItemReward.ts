/**
 * @package
 */
export type ItemReward = {
    UpdateType: number;
    Info: {
        ItemUID: number;
        ItemSN: number;
        ItemType: number;
        ItemKeyString: string;
        StackCount: number;
        InvenCategory: number;
        InvenPos: number;
        EnchantLevel: number;
        IsLock: number;
        EnchantPoint: number;
        EquippedPCID: number;
        EquipSlot: number;
    };
};
