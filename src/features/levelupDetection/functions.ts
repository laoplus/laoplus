import { Webhook } from "discord-webhook-ts";
import { uiColor } from "~/constants";
import { wave_clear } from "~/types/api";
import { log } from "~/utils";
import {
    colorHexToInteger,
    sendToDiscordWebhook,
} from "../discordNotification";

/**
 * 渡されたユニット一覧の全員が要求レベルを超えているか返す
 */
const checkUnitLevel = ({
    list,
    requirement,
}: {
    list: wave_clear["PCExpAndLevelupList"];
    requirement: number;
}) => {
    const isDone = list.every((unit) => {
        if (unit.AfterLevel >= requirement) {
            return true;
        }
    });
    log.debug("Levelup Detection", "checkUnitLevel", "isDone", isDone);
    return isDone;
};

/**
 * 渡されたユニット一覧の全員の全スキルが要求レベルを超えているか返す
 */
const checkSkillLevel = ({
    list,
    requirement,
}: {
    list: wave_clear["SkillExpAndLevelupList"];
    requirement: number;
}) => {
    const isDone = list.every((unit) => {
        return unit.SkillInfo.every((skill) => {
            if (skill.AfterLevel >= requirement) {
                return true;
            }
        });
    });
    log.debug("Levelup Detection", "checkSkillLevel", "isDone", isDone);
    return isDone;
};

/**
 * @package
 */
export const waveClear = ({
    PCExpAndLevelupList,
    SkillExpAndLevelupList,
}: wave_clear) => {
    const config = unsafeWindow.LAOPLUS.config.config.features.levelupDetection;
    const webhookInterests =
        unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .interests;

    const shouldReportUnitLevel = checkUnitLevel({
        list: PCExpAndLevelupList,
        requirement: Number(config.unitLevelRequirement),
    });
    if (shouldReportUnitLevel && webhookInterests.levelUp) {
        const body: Webhook.input.POST = {
            embeds: [
                {
                    color: colorHexToInteger(uiColor.success.hex()),
                    title: "レベリング完了",
                    description: `全ての戦闘員のレベルが${config.unitLevelRequirement}を超えました`,
                },
            ],
        };
        sendToDiscordWebhook(body);

        // 通知したらオフにする
        unsafeWindow.LAOPLUS.config.set({
            features: {
                levelupDetection: {
                    watchUnitLevel: false,
                },
            },
        });
    }

    const shouldReportSkillLevel = checkSkillLevel({
        list: SkillExpAndLevelupList,
        requirement: Number(config.skillLevelRequirement),
    });

    if (shouldReportSkillLevel && webhookInterests.skillLevelUp) {
        const body: Webhook.input.POST = {
            embeds: [
                {
                    color: colorHexToInteger(uiColor.success.hex()),
                    title: "レベリング完了",
                    description: `全ての戦闘員のスキルレベルが${config.skillLevelRequirement}を超えました`,
                },
            ],
        };
        sendToDiscordWebhook(body);

        // 通知したらオフにする
        unsafeWindow.LAOPLUS.config.set({
            features: {
                levelupDetection: {
                    watchSkillLevel: false,
                },
            },
        });
    }
};
