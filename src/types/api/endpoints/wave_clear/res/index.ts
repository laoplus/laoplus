import type { ResBase, PCInfo, QuestInfo } from "~/types/api/shared";
import type { ClearRewardInfo } from "./ClearRewardInfo";
import type { PCExpAndLevelup } from "./PCExpAndLevelup";
import type { SkillExpAndLevelup } from "./SkillExpAndLevelup";
import type { UpdateAccountExpUp } from "./UpdateAccountExpUp";
import type { UpdateEternityStageClearInfo } from "./UpdateEternityStageClearInfo";
import type { UpdateItemInfo } from "./UpdateItemInfo";

/**
 * @package
 */
type res = ResBase & {
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
export default res;
