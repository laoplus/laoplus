// TODO: テストを書く
/**
 * StageKeyをプレイヤーが慣れてる表記に変換する
 * @param StageKey Ch01Ev9Stage01Ex
 * @returns Ev1-1Ex
 */
export const humanFriendlyStageKey = (StageKey: string) => {
    const regex =
        /(Ch(?<chapter>\d{2}))(Ev(?<event>\d+))?(Stage(?<stage>\d+))((?<Ex>Ex)|(?<side>.))?/;
    const exec = regex.exec(StageKey);
    if (exec && exec.groups) {
        const {
            chapter: c,
            event = "",
            stage: s,
            side = "",
            Ex = "",
        } = exec.groups;
        const isEvent = event !== "";
        const chapter = Number(c);
        const stage = Number(s);
        return `${isEvent ? "Ev" : ""}${chapter}-${stage}${side}${Ex}`;
    }
    // うまくパースできなかったらそのまま返す
    return StageKey;
};
