import { humanFriendlyStageKey } from "~/utils/humanFriendlyStageKey";

const cn = classNames;

export const ExplorationList: React.VFC = () => {
    const exploration = unsafeWindow.LAOPLUS.exploration.sort(
        (a, b) => a.EndTime - b.EndTime
    );

    const list = exploration.map((exp) => {
        const endDate = dayjs(exp.EndTime * 1000);
        const duration = dayjs.duration(endDate.diff(dayjs()));
        const isFinished = endDate.isSameOrBefore(dayjs());

        return (
            <div
                key={exp.StageKeyString}
                className={cn(
                    "flex items-center gap-3 rounded-md bg-white px-2 py-4 text-gray-800 shadow-md transition-spacing md:px-6",
                    { "animate-bounce": isFinished }
                )}
            >
                <span className="text-3xl font-bold">{exp.SquadIndex}</span>
                <div className="flex flex-col">
                    <span className="text-sm">
                        {humanFriendlyStageKey(exp.StageKeyString)}
                    </span>
                    <span className="font-mono">
                        {isFinished ? "00:00:00" : duration.format("HH:mm:ss")}
                    </span>
                </div>
            </div>
        );
    });

    // コンポーネントを毎秒更新する
    const [, setSeconds] = React.useState(0);
    React.useEffect(() => {
        const interval = window.setInterval(() => {
            setSeconds((seconds) => seconds + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return <>{list}</>;
};
