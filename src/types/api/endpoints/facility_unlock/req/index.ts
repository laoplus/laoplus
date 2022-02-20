import type { ReqBase } from "~/types/api/shared";

/**
 * @package
 */
type req = ReqBase & {
    /**
     * アンロックした施設のKey
     */
    FacilityKey: string;
};
export default req;
