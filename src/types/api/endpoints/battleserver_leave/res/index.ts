import type { ResBase, PCInfo, QuestInfo } from "~/types/api/shared";
import type { ItemUpdateType } from "./ItemUpdateType";
import type { ItemInfo } from "./ItemInfo";

/**
 * @package
 */
type res = ResBase & {
    ItemUpdateTypeList: ItemUpdateType[];
    ItemInfoList: ItemInfo[];
    PCInfoList: PCInfo[];
    UpdateQuestInfoList: QuestInfo[];
};
export default res;
