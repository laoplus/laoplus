const TimeStat: React.VFC<{
    lapCount: number;
    totalWaitingTime: number;
    totalRoundTime: number;
}> = ({ lapCount, totalWaitingTime, totalRoundTime }) => {
    const [displayTimeType, setDisplayTimeType] = React.useState<
        "lapTime" | "battleTime"
    >("lapTime");
    const toggleDisplayTimeType = () => {
        setDisplayTimeType((v) => (v === "lapTime" ? "battleTime" : "lapTime"));
    };

    const totalTime = totalRoundTime + totalWaitingTime;
    const lapTimeAverage =
        lapCount === 0 || totalTime === 0
            ? "0.0"
            : (totalTime / lapCount).toFixed(1);
    const battleTimeAverage =
        lapCount === 0 || totalTime === 0
            ? "0.0"
            : (totalRoundTime / lapCount).toFixed(1);

    return (
        <dl className="flex items-center">
            <dt className="mr-auto">
                <button
                    className="flex items-center gap-1"
                    onClick={toggleDisplayTimeType}
                >
                    {displayTimeType === "lapTime"
                        ? "平均周回時間"
                        : "平均戦闘時間"}
                    <i className="bi bi-chevron-down text-xs before:!align-[inherit]"></i>
                </button>
            </dt>
            <dd>
                <p className="font-bold text-gray-900">
                    <span>
                        {displayTimeType === "lapTime"
                            ? lapTimeAverage
                            : battleTimeAverage}
                    </span>
                    <span className="ml-0.5 text-xs font-bold text-gray-500">
                        秒
                    </span>
                </p>
            </dd>
        </dl>
    );
};

// FIXME: 表示する平均値がブレないようにlapCountが変わったときだけ描画したいので
// React.memoのareEqualで判別しているが、本来そういうふうに使ってはいけないらしい。
// が、うまく動くので使ってしまう
//
// > バグを引き起こす可能性があるため、レンダーを「抑止する」ために使用しないでください。
// > https://ja.reactjs.org/docs/react-api.html#reactmemo
export const MemorizedTimeStat = React.memo(
    TimeStat,
    (prevProps, nextProps) => {
        if (prevProps.lapCount !== nextProps.lapCount) return false;
        return true;
    }
);
