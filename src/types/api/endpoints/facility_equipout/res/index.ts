import type { ResBase } from "~/types/api/shared";

/**
 * @package
 */
type res = ResBase & {
    /**
     * requestのFacilityUidと同一
     */
    Facility_uid: number;
};
export default res;
