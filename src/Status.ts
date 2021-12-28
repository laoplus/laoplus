import { DeepPartial } from "./types";
import { log } from "~/utils";

const defaultStatus = {
    autorunDetection: {
        enterTimerId: null,
        latestEnterTime: null,
    },
    resourceFarmRecoder: {
        startTime: null,
        endTime: null,
        endTime: null,
        totalWaitTime: null,
        totalRoundTime: null,
        rounds: null,
        Metal: null,
        Nutrient: null,
        Power: null,
        Normal_Module: null,
        Advanced_Module: null,
        Special_Module: null,
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
        endTime?: number,
        totalWaitTime?: number,
        totalRoundTime?: number,
        rounds?: number,
        Metal?: number,
        Nutrient?: number,
        Power?: number,
        Normal_Module?: number,
        Advanced_Module?: number,
        Special_Module?: number,
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
