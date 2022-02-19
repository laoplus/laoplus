import type { ReqBase } from "~/types/api/shared";

/**
 * @package
 */
type req = ReqBase & {
    StageKeyString: string;
};
export default req;
