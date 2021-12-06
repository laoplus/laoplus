import { Webhook } from "discord-webhook-ts";
import { log } from "~/utils";
import {
    colorHexToInteger,
    sendToDiscordWebhook,
} from "../discordNotification";

const sendNotification = () => {
    const threshold =
        unsafeWindow.LAOPLUS.config.config.features.autorunDetection.threshold;
    const body: Webhook.input.POST = {
        embeds: [
            {
                color: colorHexToInteger(chroma("red").hex()),
                title: "自動周回停止",
                description: `戦闘開始、または終了のインターバルがしきい値(${threshold}秒)を超えました`,
            },
        ],
    };

    if (
        unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .interests.autorunStop
    ) {
        sendToDiscordWebhook(body);
    } else {
        log.debug(
            "Autorun Detection",
            "設定が無効のため、Discord通知を送信しませんでした",
            body
        );
    }

    unsafeWindow.LAOPLUS.config.set({
        features: { autorunDetection: { enabled: false } },
    });
    log.debug("Autorun Detection", "Autorun Detection Disabled");
};

const getDalayMs = () => {
    const threshold = Number(
        unsafeWindow.LAOPLUS.config.config.features.autorunDetection.threshold
    );
    const thresholdMs = threshold * 1000;
    return thresholdMs;
};

export const clear = () => {
    const status = unsafeWindow.LAOPLUS.status.autorunDetection;
    status.battleEnterTimerId = null;
    status.battleLeaveTimerId = null;
    log.log("Autorun Detection", "Reset Timers", status);
};

/**
 * @package
 */
export const enter = () => {
    const status = unsafeWindow.LAOPLUS.status.autorunDetection;

    if (status.battleEnterTimerId !== null) {
        window.clearTimeout(status.battleEnterTimerId);
        log.debug("Autorun Detection", "Remove Current Enter Timer");
    }
    const time = getDalayMs();
    status.battleEnterTimerId = window.setTimeout(sendNotification, time);
    log.log("Autorun Detection", "Set Enter Timer", time);
};

/**
 * @package
 */
export const leave = () => {
    const status = unsafeWindow.LAOPLUS.status.autorunDetection;

    if (status.battleLeaveTimerId !== null) {
        window.clearTimeout(status.battleLeaveTimerId);
        log.debug("Autorun Detection", "Remove Current Leave Timer");
    }
    const time = getDalayMs();
    status.battleLeaveTimerId = window.setTimeout(sendNotification, time);
    log.log("Autorun Detection", "Set Leave Timer", time);
};
