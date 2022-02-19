import {
    enter,
    leave,
    updateTimeStatus,
    incrementDrops,
    calcSquadCosts,
} from "./functions";
import { InvokeProps } from "~/types";
import { wave_clear } from "~/types/api";
import { battleserver_enter } from "~/types/api";

export const invoke = ({ res, url }: InvokeProps) => {
    switch (url.pathname) {
        case "/battleserver_enter":
            enter();
            calcSquadCosts(res as battleserver_enter["res"]);
            return;
        case "/battleserver_leave":
            leave();
            return;
        case "/wave_clear":
            incrementDrops(res as wave_clear["res"]);
            updateTimeStatus();
            return;
    }
};
