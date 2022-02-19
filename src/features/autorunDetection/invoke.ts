import { enter } from "./functions";
import { InvokeProps } from "~/types";

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
    }
};
