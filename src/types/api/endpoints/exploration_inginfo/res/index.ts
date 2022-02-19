import type { ResBase } from "~/types/api/shared";
import type { Exploration } from "./Exploration";

/**
 * @package
 */
type res = ResBase & {
    ExplorationList: Exploration[];
};
export default res;
