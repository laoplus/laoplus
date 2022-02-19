import type { ReqBase } from "~/types/api/shared";

/**
 * @package
 */
type req = ReqBase & {
    SquadIndex: number;
    StageKeyString: string;
};
export default req;
