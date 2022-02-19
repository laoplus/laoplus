import {
    battleserver_enter,
    battleserver_leave,
    exploration_cancel,
    exploration_enter,
    exploration_inginfo,
    exploration_reward,
    wave_clear,
} from "./api";

type InvokePropsBase = {
    xhr: XMLHttpRequest;
    url: URL;
};

export type InvokeProps =
    | (InvokePropsBase & {
          pathname: "/battleserver_enter";
          req: battleserver_enter["req"];
          res: battleserver_enter["res"];
      })
    | (InvokePropsBase & {
          pathname: "/battleserver_leave";
          req: battleserver_leave["req"];
          res: battleserver_leave["res"];
      })
    | (InvokePropsBase & {
          pathname: "/exploration_cancel";
          req: exploration_cancel["req"];
          res: exploration_cancel["res"];
      })
    | (InvokePropsBase & {
          pathname: "/exploration_enter";
          req: exploration_enter["req"];
          res: exploration_enter["res"];
      })
    | (InvokePropsBase & {
          pathname: "/exploration_inginfo";
          req: exploration_inginfo["req"];
          res: exploration_inginfo["res"];
      })
    | (InvokePropsBase & {
          pathname: "/exploration_reward";
          req: exploration_reward["req"];
          res: exploration_reward["res"];
      })
    | (InvokePropsBase & {
          pathname: "/wave_clear";
          req: wave_clear["req"];
          res: wave_clear["res"];
      });

export interface TacticsManualUnit {
    uid: string;
    id: number;
    rarity: number;
    group: string;
    type: number;
    role: number;
    body: number;
    craft: number | false;
    // buffs: any[][];
    // skills: Skills;
    promo: number[];
}
