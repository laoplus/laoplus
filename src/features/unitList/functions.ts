import { pclist } from "~/types/api";

/**
 * @package
 */
export const collect = (res: pclist["res"]) => {
    res.Result.forEach((unit) => {
        unsafeWindow.LAOPLUS.units.set(unit.PCId, unit);
    });

    return;
};
