import { rankColor } from "~/constants";
import {
    colorHexToInteger,
    sendToDiscordWebhook,
} from "features/discordNotification";
import {
    explorationInginfo,
    explorationEnter,
    explorationReward,
    explorationCancel,
} from "~/features/explorationTimer";
import { gradeToRank } from "utils/gradeToRank";
import { log } from "utils/log";

// TODO: どっかいけ
interface CreatePCInfo {
    PCId: number;
    Index: string;
    Grade: number;
    Level: number;
}

const interceptor = (xhr: XMLHttpRequest): void => {
    if (!xhr.responseURL) return;

    const url = new URL(xhr.responseURL);
    if (url.host !== "gate.last-origin.com") {
        return;
    }

    const responseText = new TextDecoder("utf-8").decode(xhr.response);
    // JSONが不正なことがあるのでtry-catch
    try {
        const res = JSON.parse(responseText);
        log("Interceptor", url.pathname, res);

        // TODO: このような処理をここに書くのではなく、各種機能がここを購読しに来るように分離したい
        if (url.pathname === "/wave_clear") {
            if (
                unsafeWindow.LAOPLUS.config.config.features.discordNotification
                    .enabled
            ) {
                const embeds = res.CreatePCInfos.map((c: CreatePCInfo) => {
                    // ランクB, Aを無視
                    if (c.Grade === 2 || c.Grade === 3) return;

                    const id = c.Index.replace(/^Char_/, "").replace(/_N$/, "");
                    const name =
                        unsafeWindow.LAOPLUS.tacticsManual.locale[`UNIT_${id}`];
                    const rank = gradeToRank(c.Grade);

                    // クラゲ
                    if (id.startsWith("Core")) return;

                    // 強化モジュール
                    if (id.startsWith("Module")) return;

                    return {
                        title: name || id,
                        color:
                            rank !== ""
                                ? colorHexToInteger(rankColor[rank].hex())
                                : undefined,
                        url: `https://lo.swaytwig.com/units/${id}`,
                        thumbnail: {
                            url: `https://lo.swaytwig.com/assets/webp/tbar/TbarIcon_${id}_N.webp`,
                        },
                    };
                }).filter(Boolean);

                if (embeds.length !== 0) {
                    sendToDiscordWebhook({ embeds: embeds });
                }
            }
        } else if (url.pathname === "/exploration_inginfo") {
            explorationInginfo(res);
        } else if (url.pathname === "/exploration_enter") {
            explorationEnter(res);
        } else if (url.pathname === "/exploration_reward") {
            explorationReward(res);
        } else if (url.pathname === "/exploration_cancel") {
            explorationCancel(res);
        }
    } catch (error) {
        log("Interceptor", "Error", error);
    }
};

export const initInterceptor = () => {
    (function (open) {
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener(
                "readystatechange",
                () => {
                    // 完了した通信のみ
                    if (this.readyState === 4) {
                        interceptor(this);
                    }
                },
                false
            );
            // @ts-ignore
            // eslint-disable-next-line prefer-rest-params
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
};
