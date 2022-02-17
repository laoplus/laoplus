import { log } from "~/utils";
import { invoke as invokeExplorationTimer } from "../explorationTimer/invoke";
import { invoke as invokeDropNotification } from "../dropNotification/invoke";
import { invoke as invokeAutorunDetection } from "../autorunDetection/invoke";
import { invoke as invokeFarmingStats } from "../farmingStats/invoke";

interface ExtendedXHR extends XMLHttpRequest {
    _method: string;
    _requestURL: string | URL;
    _request: Document | XMLHttpRequestBodyInit | null | undefined;
}

const interceptor = (xhr: ExtendedXHR): void => {
    if (!xhr.responseURL) return;

    const url = new URL(xhr.responseURL);
    if (url.host !== "gate.last-origin.com") {
        return;
    }

    const requestText = new TextDecoder("utf-8").decode(
        xhr._request as ArrayBuffer
    );
    const responseText = new TextDecoder("utf-8").decode(xhr.response);

    // JSONが不正なことがあるのでtry-catch
    try {
        const req = JSON.parse(requestText);
        const res = JSON.parse(responseText);
        log.debug("Interceptor", url.pathname, { req, res });

        const invokeProps = { xhr, req, res, url };

        // TODO: このような処理をここに書くのではなく、各種機能がここを購読しに来るように分離したい
        invokeExplorationTimer(invokeProps);
        invokeDropNotification(invokeProps);
        invokeAutorunDetection(invokeProps);
        invokeFarmingStats(invokeProps);
    } catch (error) {
        log.error("Interceptor", "Error", error);
    }
};

export const initInterceptor = () => {
    // オリジナルのメソッド
    const { open, send } = XMLHttpRequest.prototype;

    (XMLHttpRequest.prototype as ExtendedXHR).open = function (method, url) {
        this._method = method;
        this._requestURL = url;

        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        open.apply(this, arguments);
    };

    (XMLHttpRequest.prototype as ExtendedXHR).send = function (body) {
        this._request = body;
        this.addEventListener("load", function () {
            interceptor(this as ExtendedXHR);
        });

        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        send.apply(this, arguments);
    };
};
