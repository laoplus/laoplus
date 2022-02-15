import { ErrorCode, Sequence } from "../";
import { ItemUpdateType } from "./ItemUpdateType";
import { ItemInfo } from "./ItemInfo";
import { PCInfo } from "./PCInfo";
import { UpdateQuestInfo } from "./UpdateQuestInfo";

export type battleserver_leave = {
    ErrorCode: ErrorCode;
    Sequence: Sequence;

    ItemUpdateTypeList: ItemUpdateType[];
    ItemInfoList: ItemInfo[];
    PCInfoList: PCInfo[];
    UpdateQuestInfoList: UpdateQuestInfo[];
};
