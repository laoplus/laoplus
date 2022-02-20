import type { ReqBase } from "~/types/api/shared";

/**
 * @package
 */
type req = ReqBase & {
    FacilityUid: number;
};
export default req;
