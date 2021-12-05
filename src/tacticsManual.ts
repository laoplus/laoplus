import { log } from "~/utils";
import { TacticsManualUnit } from "./types";

export const initTacticsManual = () => {
    GM_xmlhttpRequest({
        url: "https://lo.swaytwig.com/json/locale/JP.json",
        onload: ({ responseText }) => {
            try {
                const parsedJson: {
                    [key: string]: string;
                } = JSON.parse(responseText);
                log.log("TacticsManual", "Locale", "Loaded");

                unsafeWindow.LAOPLUS.tacticsManual.locale = parsedJson;
            } catch (error) {
                log.error("Tactics Manual", "Locale", "Error", error);
            }
        },
    });

    GM_xmlhttpRequest({
        url: "https://lo.swaytwig.com/json/korea/filterable.unit.json",
        onload: ({ responseText }) => {
            try {
                const parsedJson: TacticsManualUnit[] =
                    JSON.parse(responseText);
                log.log("TacticsManual", "Unit", "Loaded");

                unsafeWindow.LAOPLUS.tacticsManual.unit = parsedJson;
            } catch (error) {
                log.error("Tactics Manual", "Unit", "Error", error);
            }
        },
    });
};
