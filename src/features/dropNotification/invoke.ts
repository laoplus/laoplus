import { itemDropNotification, PcDropNotification } from "./functions";
import { InvokeProps } from "~/types";

export const invoke = (props: InvokeProps) => {
    if (props.pathname === "/wave_clear") {
        PcDropNotification(props.res);
        itemDropNotification(props.res);
        return;
    }
};
