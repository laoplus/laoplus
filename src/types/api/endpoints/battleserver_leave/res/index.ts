import type {
    ErrorCode,
    Sequence,
    PCInfo,
    QuestInfo,
} from "~/types/api/shared";
import type { ItemUpdateType } from "./ItemUpdateType";
import type { ItemInfo } from "./ItemInfo";

/**
 * @package
 */
type res = {
    ErrorCode: ErrorCode;
    Sequence: Sequence;

    ItemUpdateTypeList: ItemUpdateType[];
    ItemInfoList: ItemInfo[];
    PCInfoList: PCInfo[];
    UpdateQuestInfoList: QuestInfo[];
};
export default res;
