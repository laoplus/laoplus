import { itemDropNotification, PcDropNotification } from "./functions";
import { InvokeProps } from "~/types";

// TODO: 渡す前にキャストする
export const invoke = ({ res, url }: InvokeProps) => {
    switch (url.pathname) {
        case "/wave_clear":
            PcDropNotification(res as any);
            itemDropNotification(res as any);
            return;
    }
};
