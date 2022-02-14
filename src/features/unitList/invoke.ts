import { collect } from "./functions";
import { InvokeProps } from "../types";
import { Response } from "./type";

export const invoke = ({ url, res }: InvokeProps) => {
    switch (url.pathname) {
        case "/pclist":
            collect(res as Response);
            return;
    }
};
