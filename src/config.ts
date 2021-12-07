import { DeepPartial } from "./types";
import { log } from "~/utils";

const defaultConfig = {
    features: {
        discordNotification: {
            enabled: false,
            webhookURL: "",
            interests: {
                pcDrop: true,
                itemDrop: true,
                exploration: true,
                autorunStop: true,
            },
        },
        wheelAmplify: {
            enabled: true,
            ratio: "10",
        },
        autorunDetection: {
            enabled: false,
            hideTimer: false,
            threshold: "5",
        },
    },
};

export class Config {
    config: typeof defaultConfig;

    constructor() {
        this.config = _.merge(
            defaultConfig,
            GM_getValue("config", defaultConfig)
        );
    }

    events = mitt<{ changed: typeof defaultConfig }>();

    set(value: DeepPartial<Config["config"]>) {
        _.merge(this.config, value);
        GM_setValue("config", this.config);
        log.log("Config", "Config Updated", this.config);
        this.events.emit("changed", this.config);
    }
}
