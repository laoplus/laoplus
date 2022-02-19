import { battleserver_leave } from "~/types/api";

export type Status = {
    units: battleserver_leave["res"]["PCInfoList"];
};
