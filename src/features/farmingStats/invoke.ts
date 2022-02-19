import {
    enter,
    leave,
    updateTimeStatus,
    incrementDrops,
    calcSquadCosts,
} from "./functions";
import { InvokeProps } from "~/types";

export const invoke = (props: InvokeProps) => {
    if (props.pathname === "/battleserver_enter") {
        enter();
        calcSquadCosts(props.res);
        return;
    }
    if (props.pathname === "/battleserver_leave") {
        leave();
        return;
    }
    if (props.pathname === "/wave_clear") {
        incrementDrops(props.res);
        updateTimeStatus();
        return;
    }
};
