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
    unsafeWindow.LAOPLUS.exploration.forEach((ex: ExplorationSquad) => {
        if (ex.timeoutID) {
            clearTimeout(ex.timeoutID);
        }
    });
    unsafeWindow.LAOPLUS.exploration = ExplorationList.map((ex) => {
        const milisecondsToFinish = ex.EndTime * 1000 - Date.now();
        if (milisecondsToFinish > 0) {
            const timeoutID = setTimeout(
                ExplorationDiscordNotification,
                milisecondsToFinish
            );
            return { ...ex, timeoutID };
        } else {
            return ex;
        }
    });
    log("explorationInginfo", unsafeWindow.LAOPLUS.exploration);
};

export const explorationEnter = ({
    EnterInfo,
}: {
    EnterInfo: ExplorationSquad;
}): void => {
    const milisecondsToFinish = EnterInfo.EndTime * 1000 - Date.now();
    const timeoutID = setTimeout(
        ExplorationDiscordNotification,
        milisecondsToFinish
    );
    unsafeWindow.LAOPLUS.exploration.push({ ...EnterInfo, timeoutID });
    log("explorationEnter", unsafeWindow.LAOPLUS.exploration);
};

export const explorationReward = ({
    SquadIndex,
}: {
    SquadIndex: number;
}): void => {
    unsafeWindow.LAOPLUS.exploration = unsafeWindow.LAOPLUS.exploration.filter(
        (ex) => ex.SquadIndex !== SquadIndex
    );
    log("explorationReward", unsafeWindow.LAOPLUS.exploration);
};

export const explorationCancel = ({
    SquadIndex,
}: {
    SquadIndex: number;
}): void => {
    const targetExploration = unsafeWindow.LAOPLUS.exploration.find(
        (ex) => ex.SquadIndex === SquadIndex
    );
    if (targetExploration?.timeoutID) clearTimeout(targetExploration.timeoutID);

    unsafeWindow.LAOPLUS.exploration = unsafeWindow.LAOPLUS.exploration.filter(
        (ex) => ex.SquadIndex !== SquadIndex
    );
    log("explorationCancel", unsafeWindow.LAOPLUS.exploration);
};
