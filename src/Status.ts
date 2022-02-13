import { DeepPartial } from "./types";
import { FarmingStats } from "./features/types";
import { log } from "~/utils";

type statusType = {
    autorunDetection: {
        enterTimerId: number | null;
        latestEnterTime: Date | null;
    };
    farmingStats: FarmingStats;
};

export const defaultStatus = {
    autorunDetection: {
        enterTimerId: null,
        latestEnterTime: null,
    },
    farmingStats: {
        latestEnterTime: null,
        waveTime: null,
        latestLeaveTime: null,
        totalWaitingTime: 0,
        totalRoundTime: 0,
        lapCount: 0,
        drops: {
            units: {
                SS: 0,
                S: 0,
                A: 0,
                B: 0,
            },
            equipments: {
                SS: 0,
                S: 0,
                A: 0,
                B: 0,
            },
        },
    },
} as statusType;
Object.freeze(defaultStatus);

export class Status {
    status: statusType;

    constructor() {
        this.status = _.cloneDeep(defaultStatus);
    }

    events = mitt<{ changed: statusType }>();

    set(value: DeepPartial<Status["status"]>) {
        _.merge(this.status, value);
        log.log("Status", "Status Updated", this.status);
        this.events.emit("changed", this.status);
    }
}
