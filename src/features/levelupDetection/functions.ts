import { Webhook } from "discord-webhook-ts";
import { uiColor } from "~/constants";
import { wave_clear } from "~/types/api";
import { log } from "~/utils";
import {
    colorHexToInteger,
    sendToDiscordWebhook,
} from "../discordNotification";

/**
 * @package
 */
export const waveClear = ({
    PCExpAndLevelupList,
    SkillExpAndLevelupList,
}: wave_clear) => {
    const setConfig = unsafeWindow.LAOPLUS.config.set;
    const config = unsafeWindow.LAOPLUS.config.config.features.levelupDetection;
    const webhookInterests =
        unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .interests;

    if (config.watchUnitLevel) {
        const requirement = Number(config.unitLevelRequirement);
        const isDone = PCExpAndLevelupList.every((unit) => {
            if (unit.AfterLevel >= requirement) {
                return true;
            }
        });

        // まだ条件を満たしていない
        if (!isDone) {
            return;
        }

        // 条件を満たしたが、通知をしない設定
        if (!webhookInterests.levelUp) {
            log.log(
                "Levelup Detection",
                "レベルが通知の条件を満たしましたが、設定が無効のためDiscord通知を送信しませんでした"
            );
        }

        // 通知を送信する
        const body: Webhook.input.POST = {
            embeds: [
                {
                    color: colorHexToInteger(uiColor.success.hex()),
                    title: "レベリング完了",
                    description: `全ての戦闘員のレベルが${requirement}を超えました`,
                },
            ],
        };
        sendToDiscordWebhook(body);

        // 通知したらオフにする
        setConfig({
            features: {
                levelupDetection: {
                    watchUnitLevel: false,
                },
            },
        });
    }

    if (config.watchSkillLevel) {
        const requirement = Number(config.skillLevelRequirement);
        const isDone = SkillExpAndLevelupList.every((unit) => {
            return unit.SkillInfo.every((skill) => {
                if (skill.AfterLevel >= requirement) {
                    return true;
                }
            });
        });

        // まだ条件を満たしていない
        if (!isDone) {
            return;
        }

        // 条件を満たしたが、通知をしない設定
        if (!webhookInterests.levelUp) {
            log.log(
                "Levelup Detection",
                "スキルレベルが通知の条件を満たしましたが、設定が無効のためDiscord通知を送信しませんでした"
            );
        }

        // 通知を送信する
        const body: Webhook.input.POST = {
            embeds: [
                {
                    color: colorHexToInteger(uiColor.success.hex()),
                    title: "レベリング完了",
                    description: `全ての戦闘員のスキルレベルが${requirement}を超えました`,
                },
            ],
        };

        sendToDiscordWebhook(body);

        // 通知したらオフにする
        setConfig({
            features: {
                levelupDetection: {
                    watchSkillLevel: false,
                },
            },
        });
    }
};
