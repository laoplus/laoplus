import { log } from "~/utils";
import { invoke as invokeExplorationTimer } from "../explorationTimer/invoke";
import { invoke as invokeDropNotification } from "../dropNotification/invoke";
import { invoke as invokeAutorunDetection } from "../autorunDetection/invoke";
import { invoke as invokeFarmingStats } from "../farmingStats/invoke";
import { invoke as invokeLevelupDetection } from "../levelupDetection/invoke";

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
        log.debug("Interceptor", url.pathname, res);

        const invokeProps = { xhr, res, url };

        // TODO: このような処理をここに書くのではなく、各種機能がここを購読しに来るように分離したい
        invokeExplorationTimer(invokeProps);
        invokeDropNotification(invokeProps);
        invokeAutorunDetection(invokeProps);
        invokeFarmingStats(invokeProps);
        invokeLevelupDetection(invokeProps);
    } catch (error) {
        log.error("Interceptor", "Error", error);
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
