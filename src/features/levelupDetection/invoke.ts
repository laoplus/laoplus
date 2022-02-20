import { watchSkillLevel, watchUnitLevel } from "./functions";
import { InvokeProps } from "~/types/api";

export const invoke = (props: InvokeProps) => {
    const config = unsafeWindow.LAOPLUS.config.config.features.levelupDetection;
    if (!config.enabled) {
        return;
    }

    if (props.pathname === "/wave_clear") {
        if (config.watchUnitLevel) {
            watchUnitLevel(props.res);
        }
        if (config.watchSkillLevel) {
            watchSkillLevel(props.res);
        }
        return;
    }
};
