import { stageStart, stageStop, calcResource } from "./functions";
import { InvokeProps, WaveClearResponse } from "../types";

export const invoke = ({ res, url }: InvokeProps) => {
    switch (url.pathname) {
        case "/battleserver_enter":
            stageStart();
            return;
        case "/battleserver_leave":
            stageStop();
            return;
        case "/wave_clear":
            calcResource(res as WaveClearResponse);
            return;
    }
};
