import type { ResBase } from "~/types/api/shared";

/**
 * @package
 */
type res = ResBase & {
    SquadIndex: number;
    StageKeyString: string;
};
export default res;
