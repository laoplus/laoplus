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
 * @returns {[boolean, boolean]} [BeforeLevelがrequirement以上, AfterLevelがrequirement以上]
 */
const checkUnitLevel = ({
    list,
    requirement,
}: {
    list: wave_clear["res"]["PCExpAndLevelupList"];
    requirement: number;
}): [boolean, boolean] => {
    const alreadyDone = list.every((unit) => {
        if (unit.BeforeLevel >= requirement) {
            return true;
        }
    });
    const done = list.every((unit) => {
        if (unit.AfterLevel >= requirement) {
            return true;
        }
    });
    log.debug("Levelup Detection", "checkUnitLevel", { alreadyDone, done });
    return [alreadyDone, done];
};

/**
 * 渡されたユニット一覧の全員の全スキルが要求レベルを超えているか返す
 * @returns {[boolean, boolean]} [BeforeLevelがrequirement以上, AfterLevelがrequirement以上]
 */
const checkSkillLevel = ({
    list,
    requirement,
}: {
    list: wave_clear["res"]["SkillExpAndLevelupList"];
    requirement: number;
}): [boolean, boolean] => {
    const alreadyDone = list.every((unit) => {
        return unit.SkillInfo.every((skill) => {
            if (skill.BeforeLevel >= requirement) {
                return true;
            }
        });
    });
    const done = list.every((unit) => {
        return unit.SkillInfo.every((skill) => {
            if (skill.AfterLevel >= requirement) {
                return true;
            }
        });
    });
    log.debug("Levelup Detection", "checkSkillLevel", { alreadyDone, done });
    return [alreadyDone, done];
};

/**
 * @package
 */
export const watchUnitLevel = (res: wave_clear["res"]) => {
    const config = unsafeWindow.LAOPLUS.config.config.features.levelupDetection;
    const webhookInterests =
        unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .interests;
    const requirement = Number(config.unitLevelRequirement);

    const [noLeechers, shouldReportUnitLevel] = checkUnitLevel({
        list: res.PCExpAndLevelupList,
        requirement,
    });
    if (noLeechers) return;

    if (shouldReportUnitLevel) {
        if (!webhookInterests.levelUp) {
            log.log(
                "Levelup Detection",
                "watchUnitLevel",
                "通知条件を満たしましたが、Discord通知設定で無効になっているため通知しません"
            );
        }

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
};

/**
 * @package
 */
export const watchSkillLevel = (res: wave_clear["res"]) => {
    const config = unsafeWindow.LAOPLUS.config.config.features.levelupDetection;
    const webhookInterests =
        unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .interests;
    const requirement = Number(config.skillLevelRequirement);

    const [noLeechers, shouldReportSkillLevel] = checkSkillLevel({
        list: res.SkillExpAndLevelupList,
        requirement,
    });
    if (noLeechers) return;

    if (shouldReportSkillLevel) {
        if (!webhookInterests.levelUp) {
            log.log(
                "Levelup Detection",
                "watchSkillLevel",
                "通知条件を満たしましたが、Discord通知設定で無効になっているため通知しません"
            );
        }

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
