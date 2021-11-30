import { log } from "../utils/log";

export const initGamePage = () => {
    GM_addStyle(`
    html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        line-height: 0;
    }
    .webgl-content {
        position: unset;
        -webkit-transform: unset;
        transform: unset;
    }`);

    log("Game Page", "Style injected.");
};
