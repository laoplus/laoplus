import type { ResBase } from "~/types/api/shared";

/**
 * @package
 */
type res = ResBase & {
    EnterPCs: number[];
    /**
     * requestのFacilityUidと同一
     */
    Facility_uid: number;
    LeavePCs: number[];
};
export default res;
