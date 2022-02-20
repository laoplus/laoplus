import { waveClear } from "./functions";
import { InvokeProps } from "~/types/api";

export const invoke = (props: InvokeProps) => {
    if (!unsafeWindow.LAOPLUS.config.config.features.levelupDetection.enabled) {
        return;
    }

    if (props.pathname === "/wave_clear") {
        waveClear(props.res);
        return;
    }
};
