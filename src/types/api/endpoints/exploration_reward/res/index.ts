import type { ResBase } from "~/types/api/shared";
import { Reward } from "./Reward";

/**
 * @package
 */
type res = ResBase & {
    StageKeyString: string;
    SquadIndex: number;
    RewardInfo: Reward;
};
export default res;
