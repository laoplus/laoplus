import { ExplorationSquad } from "types";
import { sendToDiscordWebhook } from "features/discordNotification";
import { log } from "utils/log";

const ExplorationDiscordNotification = (): void => {
    const fields: {
        name: string;
        value: string;
        inline: boolean;
    }[] = unsafeWindow.LAOPLUS.exploration
        .sort((a, b) => a.EndTime - b.EndTime)
        .map((ex) => {
            const endDateTime = new Date(ex.EndTime * 1000);
            const dateTimeValue =
                ex.EndTime * 1000 < Date.now()
                    ? "**" + endDateTime.toLocaleTimeString() + "**"
                    : endDateTime.toLocaleTimeString();
            return {
                name: ex.StageKeyString,
                value: dateTimeValue,
                inline: true,
            };
        });
    sendToDiscordWebhook({
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
