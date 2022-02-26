import type { CurrencyInfo, QuestInfo, ResBase } from "~/types/api/shared";
import type { PC } from "./PC";
import type { Monster } from "./Monster";
import type { FriendPCInfo } from "./FriendPCInfo";

/**
 * @package
 */
type res = ResBase & {
    CurrencyInfo: CurrencyInfo;

    PCList: PC[];
    MonsterList: Monster[];
    FriendPCInfoList: FriendPCInfo[];
    CurrTrainingTicket: number;
    CurrChallengeTicket: number;
    UpdateQuestInfoList: QuestInfo[];
};
export default res;
