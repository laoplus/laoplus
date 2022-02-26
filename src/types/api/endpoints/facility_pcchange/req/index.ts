import type { ReqBase } from "~/types/api/shared";

/**
 * @package
 */
type req = ReqBase & {
    EnterPCs: number[];
    FacilityUid: number;
    LeavePCs: number[];
};
export default req;
