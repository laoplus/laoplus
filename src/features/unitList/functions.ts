import { pclist } from "~/types/api";

/**
 * @package
 */
export const collect = (res: pclist["res"]) => {
    const set = _.clone(unsafeWindow.LAOPLUS.status.status.units);
    res.Result.forEach((unit) => {
        set.add(unit);
    });
    unsafeWindow.LAOPLUS.status.set({
        units: set,
    });
    return;
};
