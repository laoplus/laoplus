import { Embed } from "discord-webhook-ts";
import { rankColor } from "~/constants";
import { gradeToRank } from "~/utils/gradeToRank";
import { log } from "~/utils/log";
import {
    colorHexToInteger,
    sendToDiscordWebhook,
} from "../discordNotification";

type CreatePCInfo = {
    PCId: number;
    Index: string;
    Grade: number;
    Level: number;
};

export const PcDropNotification = (res: { CreatePCInfos: CreatePCInfo[] }) => {
    const embeds = res.CreatePCInfos.reduce((embeds: Embed[], pc) => {
        // ランクB, Aを無視
        if (pc.Grade === 2 || pc.Grade === 3) return embeds;

        const id = pc.Index.replace(/^Char_/, "").replace(/_N$/, "");
        const name = unsafeWindow.LAOPLUS.tacticsManual.locale[`UNIT_${id}`];
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
    }, []);

    const body = { embeds };

    if (
        embeds.length !== 0 &&
        unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .interests.pcdrop
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
