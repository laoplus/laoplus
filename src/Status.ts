import { DeepPartial } from "./types";
import { log } from "~/utils";

const defaultStatus = {
    autorunDetection: {
        enterTimerId: null,
        latestEnterTime: null,
    },
    resourceFarmRecoder: {
        startTime: undefined,
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
};

type statusType = {
    autorunDetection: {
        enterTimerId: number | null;
        latestEnterTime: Date | null;
    };
    resourceFarmRecoder: {
        startTime?: number,
        endTime?: number,
        totalWaitTime: number,
        totalRoundTime: number,
        rounds: number,
        Metal: number,
        Nutrient: number,
        Power: number,
        Normal_Module: number,
        Advanced_Module: number,
        Special_Module: number,
    };
};

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
