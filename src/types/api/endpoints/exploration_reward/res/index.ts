import type { ResBase, Reward } from "~/types/api/shared";

/**
 * @package
 */
type res = ResBase & {
    StageKeyString: string;
    SquadIndex: number;
    RewardInfo: Reward;
};
export default res;
