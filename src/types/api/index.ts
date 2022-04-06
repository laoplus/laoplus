import {
    battleserver_enter,
    battleserver_leave,
    exploration_cancel,
    exploration_enter,
    exploration_inginfo,
    exploration_reward,
    facility_equipin,
    facility_equipout,
    facility_list,
    facility_pcchange,
    facility_reward,
    facility_slot_list,
    facility_unlock,
    facility_upgrade,
    facility_upgrade_confirm,
    facility_work,
    pclist,
    wave_clear,
} from "./endpoints";

export type {
    battleserver_enter,
    battleserver_leave,
    exploration_cancel,
    exploration_enter,
    exploration_inginfo,
    exploration_reward,
    facility_equipin,
    facility_equipout,
    facility_list,
    facility_pcchange,
    facility_reward,
    facility_slot_list,
    facility_unlock,
    facility_upgrade,
    facility_upgrade_confirm,
    facility_work,
    pclist,
    wave_clear,
} from "./endpoints";

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
          pathname: "/facility_slot_list";
          req: facility_slot_list["req"];
          res: facility_slot_list["res"];
      })
    | (InvokePropsBase & {
          pathname: "/facility_equipin";
          req: facility_equipin["req"];
          res: facility_equipin["res"];
      })
    | (InvokePropsBase & {
          pathname: "/facility_equipout";
          req: facility_equipout["req"];
          res: facility_equipout["res"];
      })
    | (InvokePropsBase & {
          pathname: "/facility_list";
          req: facility_list["req"];
          res: facility_list["res"];
      })
    | (InvokePropsBase & {
          pathname: "/facility_pcchange";
          req: facility_pcchange["req"];
          res: facility_pcchange["res"];
      })
    | (InvokePropsBase & {
          pathname: "/facility_reward";
          req: facility_reward["req"];
          res: facility_reward["res"];
      })
    | (InvokePropsBase & {
          pathname: "/facility_unlock";
          req: facility_unlock["req"];
          res: facility_unlock["res"];
      })
    | (InvokePropsBase & {
          pathname: "/facility_upgrade";
          req: facility_upgrade["req"];
          res: facility_upgrade["res"];
      })
    | (InvokePropsBase & {
          pathname: "/facility_upgrade_confirm";
          req: facility_upgrade_confirm["req"];
          res: facility_upgrade_confirm["res"];
      })
    | (InvokePropsBase & {
          pathname: "/facility_work";
          req: facility_work["req"];
          res: facility_work["res"];
      })
    | (InvokePropsBase & {
          pathname: "/pclist";
          req: pclist["req"];
          res: pclist["res"];
      })
    | (InvokePropsBase & {
          pathname: "/wave_clear";
          req: wave_clear["req"];
          res: wave_clear["res"];
      });
