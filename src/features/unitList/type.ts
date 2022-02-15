type Skill = {
    SkillKeyString: string;
    SkillLevel: number;
    SkillExp: number;
};

type EquippedSlot = {
    // EquippedItemInfo:
    IsPermanentCoreSlot: number;
    IsSetSkin: number;
    PCGrade: number;
    PermanentCore_PCKeyString: string;
    SkinKeyString: string;
    SlotNo: number;
};

export type Unit = {
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
    HaveSkillList: Skill[];
    PCEquipSlotList: EquippedSlot[] | false;
    MaxEnchantCount: number;
    // PCEnchantAttrInfoList:
    // PCMaxEnchantAttrInfo:
    IsFirstGainPC: number;
    IsUseCoreSlotRef: number;
    IsLock: number;
    FavorPoint: number;
    MaxFavorPoint: number;
    LastGiveFavorPointTime: number;
    SetSkinKeyString: string;
    // HaveSkinList:
    Destroyed: number;
    CoreLinkBonus_KeyString: string;
};

export type Response = {
    Result: Unit[];
};
