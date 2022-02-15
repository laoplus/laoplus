type PCMaxEnchantAttrInfo = {
    MaxAtkValue: number;
    MaxAtkExp: number;
    MaxDefValue: number;
    MaxDefExp: number;
    MaxHPValue: number;
    MaxHPExp: number;
    MaxAccValue: number;
    MaxAccExp: number;
    MaxEvadeValue: number;
    MaxEvadeExp: number;
    MaxCriValue: number;
    MaxCriExp: number;
};

/**
 * 謎
 */
type PCEnchantAttrInfoList = {
    EnchantAfterCount: number;
    EnchantExp: number;
    AttrType: number;
    AttrValue: number;
};

type HaveSkillList = {
    SkillKeyString: string;
    SkillLevel: number;
    SkillExp: number;
};

type HaveSkinList = {
    // need to be updated
};

type EquippedItemInfo = {
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

/**
 * コアリンクしているユニットと装備品共通の型
 * SlotNoが偶数のときはコアリンク
 * SlotNoが奇数 | 0のときは装備品
 */
type PCEquipSlotList = {
    SlotNo: number;
    EquippedItemInfo: EquippedItemInfo;
    IsPermanentCoreSlot: number;
    PermanentCore_PCKeyString: string;
    PCGrade: number;
    IsSetSkin: number;
    SkinKeyString: string;
};

/**
 * @package
 */
export type PCInfo = {
    PCId: number;
    Index: string;
    Grade: number;
    Level: number;
    CurrentExp: number;
    HP: number;
    MaxHP: number;
    ATK: number;
    DEF: number;
    EVADE: number;
    TURNSPEED: number;
    RESFIRE: number;
    RESICE: number;
    RESLIGHTNING: number;
    CreateTime: number;
    HaveSkillList: HaveSkillList[];
    PCEquipSlotList: PCEquipSlotList[];
    MaxEnchantCount: number;
    PCEnchantAttrInfoList: PCEnchantAttrInfoList[];
    PCMaxEnchantAttrInfo: PCMaxEnchantAttrInfo;
    IsFirstGainPC: number;
    IsUseCoreSlotRef: number;
    IsLock: number;
    FavorPoint: number;
    MaxFavorPoint: number;
    LastGiveFavorPointTime: number;
    SetSkinKeyString: string;
    HaveSkinList: HaveSkinList[];
    Destroyed: number;
    CoreLinkBonus_KeyString: string;
};
