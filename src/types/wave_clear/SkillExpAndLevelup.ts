/**
 * @package
 */
export type SkillExpAndLevelup = {
    PCID: number;
    SkillInfo: SkillInfo[];
};

type SkillInfo = {
    AfterExp: number;
    AfterLevel: number;
    BeforeExp: number;
    BeforeLevel: number;
    IsLevelUp: number;
    OffsetExp: number;
    SkillKeyString: string;
};
