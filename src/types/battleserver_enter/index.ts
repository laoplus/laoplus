import { ErrorCode, Sequence, CurrencyInfo } from "../api";
import { PC } from "./PC";
import { Monster } from "./Monster";
import { FriendPCInfo } from "./FriendPCInfo";
import { QuestInfo } from "../QuestInfo";

export type battleserver_enter = {
    ErrorCode: ErrorCode;
    Sequence: Sequence;

    CurrencyInfo: CurrencyInfo;

    PCList: PC[];
    MonsterList: Monster[];
    FriendPCInfoList: FriendPCInfo[];
    CurrTrainingTicket: number;
    CurrChallengeTicket: number;
    UpdateQuestInfoList: QuestInfo[];
};
