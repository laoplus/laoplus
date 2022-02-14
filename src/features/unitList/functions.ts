import { Response } from "./type";

/**
 * @package
 */
export const collect = (res: Response) => {
    const set = _.clone(unsafeWindow.LAOPLUS.status.status.units);
    res.Result.forEach((unit) => {
        set.add(unit);
    });
    unsafeWindow.LAOPLUS.status.set({
        units: set,
    });
    return;
};
