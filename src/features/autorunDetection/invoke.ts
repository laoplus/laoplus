import { enter, leave } from "./functions";
import { InvokeProps } from "../types";

export const invoke = ({ url }: InvokeProps) => {
    switch (url.pathname) {
        case "/battleserver_enter":
            if (
                unsafeWindow.LAOPLUS.config.config.features.autorunDetection
                    .enabled
            ) {
                enter();
            }
            return;
        case "/battleserver_leave":
            if (
                unsafeWindow.LAOPLUS.config.config.features.autorunDetection
                    .enabled
            ) {
                leave();
            }
            return;
    }
};
