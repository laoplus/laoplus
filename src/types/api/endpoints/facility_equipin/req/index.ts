import type { ReqBase } from "~/types/api/shared";

/**
 * @package
 */
type req = ReqBase & {
    EquipSlotIndex: number;
    FacilityUid: number;
};
export default req;
