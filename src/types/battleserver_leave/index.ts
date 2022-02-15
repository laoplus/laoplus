import { ErrorCode, Sequence } from "../api";
import { ItemUpdateType } from "./ItemUpdateType";
import { ItemInfo } from "./ItemInfo";
import { PCInfo } from "../PCInfo";
import { QuestInfo } from "../QuestInfo";

export type battleserver_leave = {
    ErrorCode: ErrorCode;
    Sequence: Sequence;

    ItemUpdateTypeList: ItemUpdateType[];
    ItemInfoList: ItemInfo[];
    PCInfoList: PCInfo[];
    UpdateQuestInfoList: QuestInfo[];
};
