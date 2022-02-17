import { waveClear } from "./functions";
import { InvokeProps } from "../types";
import { wave_clear } from "~/types/api";

export const invoke = ({ res, url }: InvokeProps) => {
    if (!unsafeWindow.LAOPLUS.config.config.features.levelupDetection.enabled) {
        return;
    }

    switch (url.pathname) {
        case "/wave_clear":
            waveClear(res as wave_clear);
            return;
    }
};
