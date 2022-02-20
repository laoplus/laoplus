import type { ResBase, UpdateItemInfo } from "~/types/api/shared";
import type { NewFacility } from "./NewFacility";

/**
 * @package
 */
type res = ResBase & {
    NewFacility: NewFacility;
    /**
     * 設置した結果、増減があったアイテムの一覧
     */
    UpdateItemInfos: UpdateItemInfo[];
};
export default res;
