import type { ResBase } from "~/types/api/shared";
import type { EnterInfo } from "./EnterInfo";

/**
 * @package
 */
type res = ResBase & {
    EnterInfo: EnterInfo;
};
export default res;
