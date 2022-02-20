import type { ReqBase } from "~/types/api/shared";

/**
 * @package
 */
type req = ReqBase & {
    IsFirst: 0 | 1;
    LastRecvPCID: number;
    Offset: number;
};
export default req;
