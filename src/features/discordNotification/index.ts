import { log } from "~/utils/log";

export const sendToDiscordWebhook = (body: unknown) => {
    if (
        !unsafeWindow.LAOPLUS.config.config.features.discordNotification.enabled
    ) {
        log.log("Discord Notification", "設定が無効のため送信しませんでした", body);
        return;
    }

    fetch(
        unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .webhookURL,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );
};

/**
 * 16進数のカラーコードを受け取って10進数のカラーコードを返す
 */
export const colorHexToInteger = (hex: string) => {
    return parseInt(hex.replace("#", ""), 16);
};
