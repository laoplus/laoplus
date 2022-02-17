import { ErrorCode, Sequence } from "../api";
import { ClearRewardInfo } from "./ClearRewardInfo";
import { PCInfo } from "../PCInfo";
import { PCExpAndLevelup } from "./PCExpAndLevelup";
import { SkillExpAndLevelup } from "./SkillExpAndLevelup";
import { UpdateAccountExpUp } from "./UpdateAccountExpUp";
import { UpdateEternityStageClearInfo } from "./UpdateEternityStageClearInfo";
import { UpdateItemInfo } from "./UpdateItemInfo";
import { QuestInfo } from "../QuestInfo";

export type wave_clear = {
    ErrorCode: ErrorCode;
    Sequence: Sequence;

    ClearRewardInfo: ClearRewardInfo;
    CreatePCInfos: PCInfo[];
    PCExpAndLevelupList: PCExpAndLevelup[];
    SkillExpAndLevelupList: SkillExpAndLevelup[];
    UpdateAccountExpUp: UpdateAccountExpUp;
    UpdateEternityStageClearInfo: UpdateEternityStageClearInfo;
    UpdateItemInfos: UpdateItemInfo[];
    UpdatePCInfos: PCInfo[];
    UpdateQuestInfoList: QuestInfo[];
    WaveClearRank: number;
};
