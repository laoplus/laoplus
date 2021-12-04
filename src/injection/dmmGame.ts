import { log } from "../utils/log";

export const initDMMGamePage = () => {
    // favicon書き換え
    document
        ?.querySelector(`link[rel="icon"]`)
        ?.setAttribute(
            "href",
            "https://www.last-origin.com/img/apple-touch-icon.png"
        );

    // 適当
    GM_addStyle(`
        body,
        #main-ntg {
            margin: 0;
            padding: 0;
            line-height: 0;
            overflow: hidden;
        }
        .dmm-ntgnavi,
        .area-naviapp,
        #foot {
            display: none;
        }
        #area-game {
            float:left !important;
        }
        #game_frame {
            height: 100vh !important;
            width: 100vw !important;
    }`);

    log.log("DMM Page", "Style injected.");
};
