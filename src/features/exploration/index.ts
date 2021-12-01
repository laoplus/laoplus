import { Dayjs } from "dayjs";
import { ExplorationSquad } from "types";
import { sendToDiscordWebhook } from "features/discordNotification";
import { log } from "utils/log";

/**
 * 与えられた日時までの時間と分のみの相対時間に変換する
 * @returns x時間x分
 */
const toRelativeTime = (target: Dayjs) => {
    const now = dayjs();
    dayjs.extend(dayjs_plugin_relativeTime);

    const hour = target.diff(now, "hour");
    const minute = target.diff(now.add(hour, "hour"), "minute");
    if (hour === 0) {
        return `${minute}分`;
    }
    return `${hour}時間${minute}分`;
};

/**
 * 1桁の数字を囲み絵文字に変換する
 * @param SquadIndex 1 | 2| 3 | 4
 * @returns 1️⃣ | 2️⃣ | 3️⃣ | 4️⃣
 */
const SquadIndexToEmoji = (SquadIndex: number) => {
    return SquadIndex + "\uFE0F\u20E3";
};

// TODO: テストを書く
/**
 * StageKeyをプレイヤーが慣れてる表記に変換する
 * @param StageKey Ch01Ev9Stage01Ex
 * @returns Ev1-1Ex
 */
const HumanFriendlyStageKey = (StageKey: string) => {
    const regex =
        /(Ch(?<chapter>\d{2}))(Ev(?<event>\d+))?(Stage(?<stage>\d+))((?<Ex>Ex)|(?<side>.))?/;
    const exec = regex.exec(StageKey);
    if (exec && exec.groups) {
        const { chapter: c, event = "", stage: s, side = "" } = exec.groups;
        const isEvent = !!event;
        const chapter = Number(c);
        const stage = Number(s);
        return `${isEvent && "Ev"}${chapter}-${stage}${side}`;
    }
    // うまくパースできなかったらそのまま返す
    return StageKey;
};

const sendNotification = (): void => {
    const fields: {
        name: string;
        value: string;
        inline: boolean;
    }[] = unsafeWindow.LAOPLUS.exploration
        .sort((a, b) => a.EndTime - b.EndTime)
        .map((ex) => {
            const endDate = dayjs(ex.EndTime * 1000);
            const isFinished = endDate.isBefore(dayjs());
            const value = isFinished
                ? ":white_check_mark: **完了**"
                // <t:TIMESTAMP> Discord Timestamp Format
                // https://discord.com/developers/docs/reference#message-formatting
                : `<t:${ex.EndTime}:t> ${toRelativeTime(endDate)}後`;
            return {
                name: [
                    SquadIndexToEmoji(ex.SquadIndex),
                    HumanFriendlyStageKey(ex.StageKeyString),
                ].join(" "),
                value: value,
                inline: !isFinished,
            };
        });
    sendToDiscordWebhook({
        title: "探索完了",
        embeds: [
            {
                fields: fields,
            },
        ],
    });
};

export const explorationInginfo = ({
    ExplorationList,
}: {
    ExplorationList: ExplorationSquad[];
}): void => {
    // 既存のタイマーをすべて破棄する
    unsafeWindow.LAOPLUS.exploration.forEach((ex) => {
        if (ex.timeoutID) {
            window.clearTimeout(ex.timeoutID);
        }
    });

    unsafeWindow.LAOPLUS.exploration = ExplorationList.map((ex) => {
        const msToFinish = ex.EndTime * 1000 - Date.now();
        if (msToFinish > 0) {
            const timeoutID = window.setTimeout(sendNotification, msToFinish);
            return { ...ex, timeoutID };
        } else {
            return ex;
        }
    });
    log(
        "Exploration",
        "Restore Exploration Timers",
        unsafeWindow.LAOPLUS.exploration
    );
};

export const explorationEnter = ({
    EnterInfo,
}: {
    EnterInfo: ExplorationSquad;
}): void => {
    const msToFinish = EnterInfo.EndTime * 1000 - Date.now();
    const timeoutID = window.setTimeout(sendNotification, msToFinish);
    unsafeWindow.LAOPLUS.exploration.push({ ...EnterInfo, timeoutID });
    log("Exploration", "Add Exploration", unsafeWindow.LAOPLUS.exploration);
};

export const explorationReward = ({
    SquadIndex,
}: {
    SquadIndex: number;
}): void => {
    unsafeWindow.LAOPLUS.exploration = unsafeWindow.LAOPLUS.exploration.filter(
        (ex) => ex.SquadIndex !== SquadIndex
    );
    log("Exploration", "Remove Exploration", unsafeWindow.LAOPLUS.exploration);
};

export const explorationCancel = ({
    SquadIndex,
}: {
    SquadIndex: number;
}): void => {
    const targetExploration = unsafeWindow.LAOPLUS.exploration.find(
        (ex) => ex.SquadIndex === SquadIndex
    );
    if (targetExploration?.timeoutID) {
        window.clearTimeout(targetExploration.timeoutID);
    }

    unsafeWindow.LAOPLUS.exploration = unsafeWindow.LAOPLUS.exploration.filter(
        (ex) => ex.SquadIndex !== SquadIndex
    );
    log(
        "explorationCancel",
        "Remove Exploration",
        unsafeWindow.LAOPLUS.exploration
    );
};
