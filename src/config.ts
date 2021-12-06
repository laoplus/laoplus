import { log } from "~/utils";

// https://stackoverflow.com/questions/61132262/typescript-deep-partial
type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

const defaultConfig = {
    features: {
        discordNotification: {
            enabled: false,
            webhookURL: "",
            interests: {
                pcDrop: true,
                itemDrop: true,
                exploration: true,
            },
        },
        wheelAmplify: {
            enabled: true,
            ratio: "10",
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

    set(value: DeepPartial<Config["config"]>) {
        _.merge(this.config, value);
        GM_setValue("config", this.config);
        log.log("Config", "Config Updated", this.config);
    }
}
