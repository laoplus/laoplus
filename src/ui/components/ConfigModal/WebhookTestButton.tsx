import { sendToDiscordWebhook } from "~/features/discordNotification";

export const WebhookTestButton: React.VFC<{ webhookURL: string }> = ({
    webhookURL,
}) => {
    return (
        <button
            className="bg-amber-300 rounded border px-2 py-1"
            onClick={async (e) => {
                e.preventDefault();

                const response = await sendToDiscordWebhook(
                    {
                        content:
                            ":ok: このメッセージを確認できているので、Discord通知は正しく設定されています！",
                    },
                    {
                        forceSend: true,
                        webhookURL: webhookURL,
                    }
                )?.catch(() => {
                    alert("テストメッセージの送信中にエラーが発生しました。");
                    return { ok: false };
                });

                // forceSendがtrueなのに何も帰ってこないことはないはず
                if (!response) {
                    alert(
                        "テストメッセージが送信されませんでした。\n（おそらくバグです）"
                    );
                    return;
                }

                if (response.ok) {
                    alert(
                        "テストメッセージが送信されました。\nメッセージが届かない場合はWebhook URLを確認・再設定してください。"
                    );
                } else {
                    alert(
                        "テストメッセージの送信に失敗しました。\nWebhook URLを確認・再設定してください。"
                    );
                }
            }}
        >
            通知テスト
        </button>
    );
};
