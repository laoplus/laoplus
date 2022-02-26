import type { ResBase, Reward } from "~/types/api/shared";

/**
 * @package
 */
type res = ResBase & {
    RemainSec: number;
    /**
     * requestのFacilityUidと同一
     */
    Facility_uid: number;
    UpdateItemInfo: Reward;
};
export default res;
