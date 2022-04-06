import { collect } from "./functions";
import { InvokeProps } from "~/types/api";

export const invoke = (props: InvokeProps) => {
    if (props.pathname === "/pclist") {
        collect(props.res);
        return;
    }
};
