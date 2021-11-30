export const sendToDiscordWebhook = (body: unknown) => {
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
