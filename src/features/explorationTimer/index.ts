import { Dayjs } from "dayjs";
import { ExplorationSquad } from "types";
import { sendToDiscordWebhook } from "features/discordNotification";
import { log } from "utils/log";
import { humanFriendlyStageKey } from "~/utils/humanFriendlyStageKey";

/**
 * 与えられた日時までの時間と分のみの相対時間に変換する
 * @returns x時間x分
 */
const toRelativeTime = (target: Dayjs) => {
    const now = dayjs();

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
const squadIndexToEmoji = (SquadIndex: number) => {
    return SquadIndex + "\uFE0F\u20E3";
};

const sendNotification = (): void => {
    const embedFields: {
        name: string;
        value: string;
        inline: boolean;
    }[] = unsafeWindow.LAOPLUS.exploration
        .sort((a, b) => a.EndTime - b.EndTime)
        .map((ex) => {
            const endDate = dayjs(ex.EndTime * 1000);
            // たま～に早く実行されてisFinishedがfalseになってしまうので1秒猶予をもたせる
            const isFinished = endDate.isSameOrBefore(dayjs().add(1, "second"));
            const value = isFinished
                ? ":white_check_mark: **完了**"
                : `<t:${ex.EndTime}:t> ${toRelativeTime(endDate)}後`;
            // <t:TIMESTAMP> Discord Timestamp Format
            // https://discord.com/developers/docs/reference#message-formatting
            return {
                name: [
                    squadIndexToEmoji(ex.SquadIndex),
                    humanFriendlyStageKey(ex.StageKeyString),
                ].join(" "),
                value: value,
                inline: !isFinished,
            };
        });
    const body = {
        embeds: [
            {
                title: "探索完了",
                fields: embedFields,
            },
        ],
    };

    if (
        unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .interests.exploration
    ) {
        sendToDiscordWebhook(body);
    } else {
        log.debug(
            "Exploration Timer",
            "設定が無効のため、Discord通知を送信しませんでした",
            body
        );
    }
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

    log.log(
        "Exploration Timer",
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

    log.log(
        "Exploration Timer",
        "Add Exploration Timer",
        unsafeWindow.LAOPLUS.exploration
    );
};

export const explorationReward = ({
    SquadIndex,
}: {
    SquadIndex: number;
}): void => {
    unsafeWindow.LAOPLUS.exploration = unsafeWindow.LAOPLUS.exploration.filter(
        (ex) => ex.SquadIndex !== SquadIndex
    );

    log.log(
        "Exploration Timer",
        "Remove Exploration Timer",
        unsafeWindow.LAOPLUS.exploration
    );
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

    log.log(
        "Exploration Timer",
        "Remove Exploration",
        unsafeWindow.LAOPLUS.exploration
    );
};
