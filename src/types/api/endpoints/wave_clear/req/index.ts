import type { ReqBase } from "~/types/api/shared";

/**
 * @package
 */
type req = ReqBase & {
    /**
     * 謎
     */
    BonusExpList: [];
    IsAuto: number;
    Wave: number;
};

export default req;
