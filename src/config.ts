import { DeepPartial } from "./types";
import { log } from "~/utils";

const defaultConfig = {
    features: {
        discordNotification: {
            enabled: false,
            webhookURL: "",
            interests: {
                pcDrop: true,
                pcRank: {
                    B: false,
                    A: false,
                    S: false,
                    SS: true,
                },
                itemDrop: true,
                exploration: true,
                autorunStop: true,
                levelUp: true,
                skillLevelUp: true,
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
        farmingStats: {
            enabled: true,
            unitDisassemblyMultiplier: "0",
            equipmentDisassemblyMultiplier: "0",
        },
        levelupDetection: {
            enabled: false,
            watchSkillLevel: true,
            skillLevelRequirement: "10",
            watchUnitLevel: true,
            unitLevelRequirement: "90",
        },
    },
};
Object.freeze(defaultConfig);

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
