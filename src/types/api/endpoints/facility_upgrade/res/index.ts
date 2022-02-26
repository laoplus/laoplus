import type { ResBase, UpdateItemInfo } from "~/types/api/shared";

/**
 * @package
 */
type res = ResBase & {
    /**
     * requestのFacilityUidと同一
     */
    Facility_uid: number;
    RemainSec: number;
    /**
     * アップグレードにあたり増減されたアイテムの一覧
     */
    UpdateItemInfos: UpdateItemInfo[];
};
export default res;
