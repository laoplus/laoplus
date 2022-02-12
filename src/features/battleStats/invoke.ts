import { enter, leave, calcResource, incrementDrops } from "./functions";
import { InvokeProps, WaveClearResponse } from "../types";

export const invoke = ({ res, url }: InvokeProps) => {
    switch (url.pathname) {
        case "/battleserver_enter":
            enter();
            return;
        case "/battleserver_leave":
            leave();
            return;
        case "/wave_clear":
            incrementDrops(res as WaveClearResponse);
            calcResource();
            return;
    }
};
