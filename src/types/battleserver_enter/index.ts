import { ErrorCode, Sequence, CurrencyInfo } from "../";
import { PC } from "./PC";
import { Monster } from "./Monster";
import { FriendPCInfo } from "./FriendPCInfo";
import { UpdateQuestInfo } from "./UpdateQuestInfo";

export type battleserver_enter = {
    ErrorCode: ErrorCode;
    Sequence: Sequence;

    CurrencyInfo: CurrencyInfo;

    PCList: PC[];
    MonsterList: Monster[];
    FriendPCInfoList: FriendPCInfo[];
    CurrTrainingTicket: number;
    CurrChallengeTicket: number;
    UpdateQuestInfoList: UpdateQuestInfo[];
};
