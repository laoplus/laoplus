import { initDMMGamePage } from "injection/dmmGame";
import { initDMMInnerPage } from "injection/dmmInner";
import { initGamePage } from "injection/game";

export const injection = () => {
    const url = new URL(document.URL);

    if (
        ["pc-play.games.dmm.com", "pc-play.games.dmm.co.jp"].includes(url.host)
    ) {
        initDMMGamePage();
        return false;
    }

    if (url.host === "osapi.dmm.com") {
        initDMMInnerPage();
        return false;
    }

    initGamePage();
    return true;
};
