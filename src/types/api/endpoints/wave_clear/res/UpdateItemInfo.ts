/**
 * @package
 */
export type UpdateItemInfo = {
    Info: {
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
    UpdateType: number;
};
