import {
    enter,
    leave,
    updateTimeStatus,
    incrementDrops,
    calcSquadCosts,
} from "./functions";
import { InvokeProps, WaveClearResponse } from "../types";
import { battleserver_enter } from "~/types/api";

export const invoke = ({ res, url }: InvokeProps) => {
    switch (url.pathname) {
        case "/battleserver_enter":
            enter();
            calcSquadCosts(res as battleserver_enter);
            return;
        case "/battleserver_leave":
            leave();
            return;
        case "/wave_clear":
            incrementDrops(res as WaveClearResponse);
            updateTimeStatus();
            return;
    }
};
