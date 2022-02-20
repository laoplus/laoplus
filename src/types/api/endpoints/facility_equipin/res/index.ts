import type { ResBase } from "~/types/api/shared";

/**
 * @package
 */
type res = ResBase & {
    EquipSlotIndex: number;
    /**
     * requestのFacilityUidと同一
     */
    Facility_uid: number;
};
export default res;
