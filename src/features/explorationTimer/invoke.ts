import {
    cancel,
    enter,
    loginto,
    reward,
} from ".";
import { InvokeProps } from "../types";

// TODO: 型を用意してanyをキャストする
export const invoke = ({ res, url }: InvokeProps) => {
    switch (url.pathname) {
        case "/exploration_inginfo":
            loginto(res as any);
            return;
        case "/exploration_enter":
            enter(res as any);
            return;
        case "/exploration_reward":
            reward(res as any);
            return;
        case "/exploration_cancel":
            cancel(res as any);
            return;
    }
};
