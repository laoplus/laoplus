import { DeepPartial } from "./types";
import { log } from "~/utils";

const defaultStatus = {
    autorunDetection: {
        enterTimerId: null,
        latestEnterTime: null,
    },
};

type statusType = {
    autorunDetection: {
        enterTimerId: number | null;
        latestEnterTime: Date | null;
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
