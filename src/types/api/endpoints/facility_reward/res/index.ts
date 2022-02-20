import type { ResBase, Reward } from "~/types/api/shared";

/**
 * @package
 */
type res = ResBase & {
    RewardInfo: Reward;
    /**
     * requestのFacilityUidと同一
     */
    Facility_uid: number;
};
export default res;
