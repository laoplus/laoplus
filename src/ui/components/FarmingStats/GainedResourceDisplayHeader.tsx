import {
    FarmingStatsContext,
    ResourceDisplayType,
    ShownResourceTypePerDropKinds,
} from "./Panel";
const cn = classNames;

/**
 * @package
 */
export const GainedResourceDisplayHeader: React.VFC<{
    resourceDisplayType: ResourceDisplayType;
    setResourceDisplayType: React.Dispatch<
        React.SetStateAction<ResourceDisplayType>
    >;

    shownResourceTypePerDropKinds: ShownResourceTypePerDropKinds;
    setShownResourceTypePerDropKinds: React.Dispatch<
        React.SetStateAction<ShownResourceTypePerDropKinds>
    >;
}> = ({
    resourceDisplayType,
    setResourceDisplayType,
    shownResourceTypePerDropKinds,
    setShownResourceTypePerDropKinds,
}) => {
    const toggleResourceDisplayType = () => {
        setResourceDisplayType((v) => (v === "sum" ? "perHour" : "sum"));
    };

    const cycleShownResourceTypePerDropKinds = () => {
        setShownResourceTypePerDropKinds((v) =>
            v === "total" ? "units" : v === "units" ? "equipments" : "total"
        );
    };

    const context = React.useContext(FarmingStatsContext);

    return (
        <div className="flex gap-3">
            <h2>
                <button
                    className="flex items-center gap-1 font-bold"
                    onClick={cycleShownResourceTypePerDropKinds}
                >
                    取得資源
                    {(() => {
                        switch (shownResourceTypePerDropKinds) {
                            case "units":
                                return "（戦闘員）";
                            case "equipments":
                                return "（装備）";
                            default:
                                return "";
                        }
                    })()}
                    <i className="bi bi-chevron-down text-xs before:!align-[inherit]"></i>
                </button>
            </h2>

            <div className="ml-auto flex cursor-pointer select-none items-center gap-1">
                <span
                    onClick={() => {
                        setResourceDisplayType("perHour");
                    }}
                >
                    時給{context.elapsedHours < 1 && "（予測）"}
                </span>
                <div
                    className="flex h-5 w-10 items-center rounded-full bg-gray-300 px-1"
                    onClick={toggleResourceDisplayType}
                >
                    <div
                        className={cn(
                            "h-4 w-4 transform rounded-full bg-white shadow-md transition-transform",
                            resourceDisplayType === "sum" && "translate-x-4"
                        )}
                    ></div>
                </div>
                <span
                    onClick={() => {
                        setResourceDisplayType("sum");
                    }}
                >
                    累計
                </span>
            </div>
        </div>
    );
};
