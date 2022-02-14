import { DeepPartial, FarmingStats } from "./types/Status";
import { log } from "~/utils";
import { Unit } from "./features/unitList/type";

type statusType = {
    autorunDetection: {
        enterTimerId: number | null;
        latestEnterTime: Date | null;
    };
    farmingStats: FarmingStats;
    units: Set<Unit>;
};

export const defaultStatus = {
    autorunDetection: {
        enterTimerId: null,
        latestEnterTime: null,
    },
    farmingStats: {
        firstEnterTime: null,
        latestEnterTime: null,
        waveTime: null,
        latestLeaveTime: null,
        totalWaitingTime: 0,
        totalRoundTime: 0,
        lapCount: 0,
        latestEnterStageKey: null,
        latestEnterSquad: null,
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
        latestResources: null,
        currentSquadCosts: null,
    },
    units: new Set(),
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
