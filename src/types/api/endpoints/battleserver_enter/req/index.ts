import type { ReqBase } from "~/types/api/shared";

/**
 * @package
 */
type req = ReqBase & {
    DataVersion: number;
    Difficulty: number;
    FriendSquadIndex: number;
    FriendWID: number;
    IsAuto: number;
    IsEternityStage: number;
    /**
     * 反復戦闘
     * 1: オン
     * 0: オフ
     */
    IsPatrol: number;
    PacketVersion: number;
    SelectedSquadNo: number;
    SelectedSquadNoList: number[];
    StageKeyString: string;
};
export default req;
