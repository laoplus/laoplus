import { initDMMInnerPage } from "init/dmmInner";
import { initDMMGamePage } from "init/dmmGame";
import { initGamePage } from "init/game";
import { initUi } from "ui/index";
import { Config } from "config";

declare global {
    // 露出させるLAOPLUSオブジェクトのinterface
    interface Window {
        LAOPLUS: {
            config: Config;
        };
    }
}

// 'return' outside of functionでビルドがコケるのを防ぐ即時実行関数
(function () {
    const url = new URL(document.URL);

    if (
        ["pc-play.games.dmm.com", "pc-play.games.dmm.co.jp"].includes(url.host)
    ) {
        initDMMGamePage();
        return;
    }

    if (url.host === "osapi.dmm.com") {
        initDMMInnerPage();
        return;
    }

    initGamePage();

    const game = document.querySelector("canvas");
    const body = document.body;
    const config = new Config();

    // LAOPLUSオブジェクトを露出させる
    unsafeWindow.LAOPLUS = {
        config: config,
    };

    initUi();
})();
