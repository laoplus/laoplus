import { DeepPartial } from "./types";
import { BattleStats } from "./features/types";
import { log } from "~/utils";

type statusType = {
    autorunDetection: {
        enterTimerId: number | null;
        latestEnterTime: Date | null;
    };
    battleStats: BattleStats;
};

const defaultStatus = {
    autorunDetection: {
        enterTimerId: null,
        latestEnterTime: null,
    },
    battleStats: {
        startTime: undefined,
        waveTime: undefined,
        endTime: undefined,
        totalWaitTime: 0,
        totalRoundTime: 0,
        rounds: 0,
        Metal: 0,
        Nutrient: 0,
        Power: 0,
        Normal_Module: 0,
        Advanced_Module: 0,
        Special_Module: 0,
    },
} as statusType;

export class Status {
    status: statusType;

    constructor() {
        this.status = defaultStatus;
    }

    events = mitt<{ changed: statusType }>();

    set(value: DeepPartial<Status["status"]>) {
        _.merge(this.status, value);
        log.log("Status", "Status Updated", this.status);
        this.events.emit("changed", this.status);
    }
}
