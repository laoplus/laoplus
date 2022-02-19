import { cancel, enter, loginto, reward } from "./functions";
import { InvokeProps } from "~/types";

export const invoke = (props: InvokeProps) => {
    if (
        !unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .interests.exploration
    ) {
        return;
    }

    if (props.pathname === "/exploration_inginfo") {
        loginto(props.res);
        return;
    }

    if (props.pathname === "/exploration_enter") {
        enter(props.res);
        return;
    }

    if (props.pathname === "/exploration_reward") {
        reward(props.res);
        return;
    }

    if (props.pathname === "/exploration_cancel") {
        cancel(props.res);
        return;
    }
};
