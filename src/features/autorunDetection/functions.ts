import { Webhook } from "discord-webhook-ts";
import { log } from "~/utils";
import {
    colorHexToInteger,
    sendToDiscordWebhook,
} from "../discordNotification";

const sendNotification = (type: "enter" | "leave") => {
    const threshold =
        unsafeWindow.LAOPLUS.config.config.features.autorunDetection.threshold;
    const body: Webhook.input.POST = {
        embeds: [
            {
                color: colorHexToInteger(chroma("red").hex()),
                title: "自動周回停止",
                description: `${
                    type === "enter" ? "戦闘開始" : "戦闘終了"
                }のインターバルがしきい値(${threshold}秒)を超えました`,
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
    clearTimers();
};

const getDalayMs = () => {
    const threshold = Number(
        unsafeWindow.LAOPLUS.config.config.features.autorunDetection.threshold
    );
    const thresholdMs = threshold * 1000;
    return thresholdMs;
};

export const clearTimers = () => {
    const status = unsafeWindow.LAOPLUS.status;
    if (status.status.autorunDetection.enterTimerId) {
        window.clearTimeout(status.status.autorunDetection.enterTimerId);
        status.set({ autorunDetection: { enterTimerId: null } });
        log.debug("Autorun Detection", "Reset enterTimer");
    }
    if (status.status.autorunDetection.leaveTimerId) {
        window.clearTimeout(status.status.autorunDetection.leaveTimerId);
        status.set({ autorunDetection: { leaveTimerId: null } });
        log.debug("Autorun Detection", "Reset leaveTimer");
    }
    log.log(
        "Autorun Detection",
        "Reset Timers",
        status.status.autorunDetection
    );
};

/**
 * @package
 */
export const enter = () => {
    const status = unsafeWindow.LAOPLUS.status;

    if (status.status.autorunDetection.enterTimerId !== null) {
        window.clearTimeout(status.status.autorunDetection.enterTimerId);
        log.debug("Autorun Detection", "Remove Current Enter Timer");
    }
    const delay = getDalayMs();
    const timerId = window.setTimeout(sendNotification, delay, "enter");
    status.set({ autorunDetection: { enterTimerId: timerId } });
    log.log("Autorun Detection", "Set Enter Timer", delay);
};

/**
 * @package
 */
export const leave = () => {
    const status = unsafeWindow.LAOPLUS.status;

    if (status.status.autorunDetection.leaveTimerId !== null) {
        window.clearTimeout(status.status.autorunDetection.leaveTimerId);
        log.debug("Autorun Detection", "Remove Current Leave Timer");
    }
    const delay = getDalayMs();
    const timerId = window.setTimeout(sendNotification, delay, "leave");
    status.set({ autorunDetection: { leaveTimerId: timerId } });
    log.log("Autorun Detection", "Set Leave Timer", delay);
};
