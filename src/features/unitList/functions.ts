import { pclist } from "~/types/api";

/**
 * @package
 */
export const collect = (res: pclist["res"]) => {
    const unitsMap = _.clone(unsafeWindow.LAOPLUS.status.status.units);
    res.Result.forEach((unit) => {
        unitsMap.set(unit.PCId, unit);
    });
    unsafeWindow.LAOPLUS.status.set({
        units: unitsMap,
    });
    return;
};
