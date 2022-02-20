import type { ResBase } from "~/types/api/shared";
import { Facility } from "./Facility";

/**
 * @package
 */
type res = ResBase & {
    FacilityList: Facility[];
};
export default res;
