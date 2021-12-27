import { Embed } from "discord-webhook-ts";
import { rankColor } from "~/constants";
import { gradeToRank } from "~/utils/gradeToRank";
import { log } from "~/utils/log";
import {
    colorHexToInteger,
    sendToDiscordWebhook,
} from "../discordNotification";

type WaveClearResponse = {
    ClearRewardInfo: ClearRewardInfo;
};

type ClearRewardInfo = {
    PCRewardList: RewardPC[];
    ItemRewardList: RewardItem[];
};
type RewardPC = {
    Grade: number;
    Level: number;
    PCKeyString: string;
};
type RewardItem = {
    ItemKeyString: string;
};

/**
 * @package
 */
export const PcDropNotification = (res: WaveClearResponse) => {
    const embeds = res.ClearRewardInfo.PCRewardList.reduce(
        (embeds: Embed[], pc) => {
            const {
                B: notifyRankB,
                A: notifyRankA,
                S: notifyRankS,
                SS: notifyRankSS,
            } = unsafeWindow.LAOPLUS.config.config.features.discordNotification
                .interests.pcRank;

            if (pc.Grade === 2 && notifyRankB === false) return embeds;
            if (pc.Grade === 3 && notifyRankA === false) return embeds;
            if (pc.Grade === 4 && notifyRankS === false) return embeds;
            if (pc.Grade === 5 && notifyRankSS === false) return embeds;

            const id = pc.PCKeyString.replace(/^Char_/, "").replace(/_N$/, "");
            const name =
                unsafeWindow.LAOPLUS.tacticsManual.locale[`UNIT_${id}`];
            const rank = gradeToRank(pc.Grade);

            // クラゲ
            if (id.startsWith("Core")) return embeds;

            // 強化モジュール
            if (id.startsWith("Module")) return embeds;

            embeds.push({
                title: name || id,
                color:
                    rank !== ""
                        ? colorHexToInteger(rankColor[rank].hex())
                        : undefined,
                url: `https://lo.swaytwig.com/units/${id}`,
                thumbnail: {
                    url: `https://lo.swaytwig.com/assets/webp/tbar/TbarIcon_${id}_N.webp`,
                },
            });

            return embeds;
        },
        []
    );

    const body = { embeds };

    if (
        embeds.length !== 0 &&
        unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .interests.pcDrop
    ) {
        sendToDiscordWebhook(body);
    } else {
        log.debug(
            "Drop Notification",
            "送信する項目がないか、設定が無効のため、Discord通知を送信しませんでした",
            body
        );
    }
};

/**
 * @package
 */
export const itemDropNotification = (res: WaveClearResponse) => {
    const embeds = res.ClearRewardInfo.ItemRewardList.reduce(
        (embeds: Embed[], item) => {
            // SSのみ
            if (!item.ItemKeyString.includes("T4")) return embeds;

            const localeKey = item.ItemKeyString.replace(/^Equip_/, "EQUIP_");
            const id = item.ItemKeyString.replace(/^Equip_/, "");
            const name = unsafeWindow.LAOPLUS.tacticsManual.locale[localeKey];

            embeds.push({
                title: name || localeKey,
                color: colorHexToInteger(rankColor["SS"].hex()),
                url: `https://lo.swaytwig.com/equips/${id}`,
                thumbnail: {
                    url: `https://lo.swaytwig.com/assets/webp/item/UI_Icon_${item.ItemKeyString}.webp`,
                },
            });

            return embeds;
        },
        []
    );

    const body = { embeds };

    if (
        embeds.length !== 0 &&
        unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .interests.itemDrop
    ) {
        sendToDiscordWebhook(body);
    } else {
        log.debug(
            "Drop Notification",
            "送信する項目がないか、設定が無効のため、Discord通知を送信しませんでした",
            body
        );
    }
};
