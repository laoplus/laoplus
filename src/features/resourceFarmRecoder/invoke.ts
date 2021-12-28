import { stageStart, stageStop, calcResource } from "./functions";
import { InvokeProps } from "../types";

export const invoke = ({ res, url }: InvokeProps) => {

    if (unsafeWindow.LAOPLUS.config.config.features.autorunDetection.enabled) {
        switch (url.pathname) {
            case "/battleserver_enter":
                stageStart();
                return;
            case "/battleserver_leave":
                stageStop();
                return;
            case "/wave_clear":
                calcResource(res);
                return;
        }
    }
};
