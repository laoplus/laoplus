import { disassemblingTable, rankColor } from "~/constants";
import { FarmingStats as TFarmingStats } from "~/features/types";
import { reset } from "~/features/farmingStats/functions";
import { log } from "~/utils";
import { calcResourcesFromDrops } from "./calc";
import { Icon } from "./Icon";
import { MemorizedTimeStat } from "./TimeStat";
const cn = classNames;

function jsonEqual(a: unknown, b: unknown) {
    return JSON.stringify(a) === JSON.stringify(b);
}

const ResourceCounter: React.VFC<{
    type: React.ComponentProps<typeof Icon>["type"] | "B" | "A" | "S" | "SS";
    amount: number;
}> = ({ type, amount }) => {
    return (
        <div className="flex gap-2 items-center">
            {type === "B" || type === "A" || type === "S" || type === "SS" ? (
                <div
                    className={cn(
                        "flex-shrink-0 px-2 rounded-md font-bold ring-1 ring-gray-900/5",
                        `bg-[${rankColor[type].hex()}]`,
                        type === "SS" ? "text-black" : "text-white"
                    )}
                >
                    {type}
                </div>
            ) : (
                <div className="flex-shrink-0 w-6 h-6">
                    <Icon type={type} />
                </div>
            )}

            <hr className="h-[2px] w-full bg-gray-200 border-0 rounded-full" />
            <span className="text-gray-900 font-bold">
                {amount.toLocaleString()}
            </span>
        </div>
    );
};

export const Panel: React.VFC = () => {
    const status = unsafeWindow.LAOPLUS.status;
    const [stats, setStats] = React.useState<TFarmingStats>({
        ...status.status.farmingStats,
    });
    status.events.on("changed", (e) => {
        setStats((old) => {
            if (!jsonEqual(old, e.farmingStats)) return { ...e.farmingStats };
            return old;
        });
    });

    const [resourceDisplayType, setResourceDisplayType] = React.useState<
        "perHour" | "sum"
    >("sum");
    const toggleResourceDisplayType = () => {
        setResourceDisplayType((v) => (v === "sum" ? "perHour" : "sum"));
    };

    // TODO: 命名なんとかする
    const [shownResourceTypePerDropKinds, setShownResourceTypePerDropKinds] =
        React.useState<"total" | "units" | "equipments">("total");
    const cycleShownResourceTypePerDropKinds = () => {
        setShownResourceTypePerDropKinds((v) =>
            v === "total" ? "units" : v === "units" ? "equipments" : "total"
        );
    };

    const disassembledResource = (() => {
        const units = calcResourcesFromDrops({
            drops: stats.drops.units,
            table: disassemblingTable.units,
            type: "units",
        });
        log.log("FarmingStats", "disassembledResource", "units", units);

        const equipments = calcResourcesFromDrops({
            drops: stats.drops.equipments,
            table: disassemblingTable.equipments,
            type: "equipments",
        });
        log.log(
            "FarmingStats",
            "disassembledResource",
            "equipments",
            equipments
        );

        const total = [units, equipments].reduce(
            (sum, resources) => {
                (Object.keys(resources) as (keyof typeof resources)[]).forEach(
                    (key) => {
                        sum[key] = sum[key] + resources[key];
                    }
                );
                return sum;
            },
            {
                parts: 0,
                nutrients: 0,
                power: 0,
                basic_module: 0,
                advanced_module: 0,
                special_module: 0,
            }
        );
        log.log("FarmingStats", "disassembledResource", "total", total);

        return {
            total,
            units,
            equipments,
        };
    })();

    return (
        <div className="w-[420px] ring-gray-900/5 absolute bottom-6 left-0 mb-1 rounded-lg shadow-xl overflow-hidden ring-1">
            <header className="from-slate-800 to-slate-700 flex items-center p-2 pl-3 text-white font-bold bg-gradient-to-r">
                <h1 className="flex gap-2 items-center mr-auto">
                    <i className="bi bi-info-circle text-lg"></i>
                    周回統計
                </h1>
                <div className="flex gap-2 items-center">
                    <button
                        className="bg-amber-300 ring-amber-900/5 flex gap-1 items-center px-2 py-1 text-gray-900 font-bold rounded shadow ring-1 ring-inset"
                        onClick={reset}
                    >
                        <i className="bi bi-stopwatch-fill inline w-4"></i>
                        リセット
                    </button>
                </div>
            </header>

            <main className="flex flex-col gap-4 px-4 py-5 bg-white">
                <div className="grid gap-4 grid-cols-2 items-center">
                    <MemorizedTimeStat {...stats} />
                    <dl className="flex">
                        <dt className="mr-auto">完了した周回数</dt>
                        <dd>
                            <p className="text-gray-900 font-bold">
                                {stats.lapCount.toLocaleString()}
                                <span className="ml-0.5 text-gray-500 text-xs font-bold">
                                    回
                                </span>
                            </p>
                        </dd>
                    </dl>
                </div>

                <hr />

                <div className="flex gap-3">
                    <h2>
                        <button
                            className="flex gap-1 items-center font-bold"
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
                            <i className="bi bi-chevron-down before:!align-[inherit] text-xs"></i>
                        </button>
                    </h2>
                    <div className="hidden">
                        <div className="flex gap-1 items-center ml-auto cursor-pointer select-none">
                            <span
                                onClick={() => {
                                    setResourceDisplayType("perHour");
                                }}
                            >
                                時給
                            </span>
                            <div
                                className="flex items-center px-1 w-10 h-5 bg-gray-300 rounded-full"
                                onClick={toggleResourceDisplayType}
                            >
                                <div
                                    className={cn(
                                        "w-4 h-4 bg-white rounded-full shadow-md transform transition-transform",
                                        resourceDisplayType === "sum" &&
                                            "translate-x-4"
                                    )}
                                ></div>
                            </div>
                            <span
                                onClick={() => {
                                    setResourceDisplayType("sum");
                                }}
                            >
                                合計
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 grid-cols-3">
                    <ResourceCounter
                        type="parts"
                        amount={
                            disassembledResource[shownResourceTypePerDropKinds]
                                .parts
                        }
                    />
                    <ResourceCounter
                        type="nutrient"
                        amount={
                            disassembledResource[shownResourceTypePerDropKinds]
                                .nutrients
                        }
                    />
                    <ResourceCounter
                        type="power"
                        amount={
                            disassembledResource[shownResourceTypePerDropKinds]
                                .power
                        }
                    />
                </div>
                <div className="grid gap-3 grid-cols-3">
                    <ResourceCounter
                        type="basic_module"
                        amount={
                            disassembledResource[shownResourceTypePerDropKinds]
                                .basic_module
                        }
                    />
                    <ResourceCounter
                        type="advanced_module"
                        amount={
                            disassembledResource[shownResourceTypePerDropKinds]
                                .advanced_module
                        }
                    />
                    <ResourceCounter
                        type="special_module"
                        amount={
                            disassembledResource[shownResourceTypePerDropKinds]
                                .special_module
                        }
                    />
                </div>

                <div className="flex gap-3">
                    <h2 className="font-bold">ドロップ詳細</h2>
                </div>

                <div className="flex gap-2">
                    <i className="bi bi-person-fill text-xl" title="戦闘員"></i>
                    <div
                        className={cn(
                            "grid gap-3 grid-cols-4 flex-1 transition-opacity",
                            shownResourceTypePerDropKinds === "equipments" &&
                                "opacity-50"
                        )}
                    >
                        <ResourceCounter
                            type="B"
                            amount={stats.drops.units.B}
                        />
                        <ResourceCounter
                            type="A"
                            amount={stats.drops.units.A}
                        />
                        <ResourceCounter
                            type="S"
                            amount={stats.drops.units.S}
                        />
                        <ResourceCounter
                            type="SS"
                            amount={stats.drops.units.SS}
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <i className="bi bi-cpu text-xl" title="装備"></i>
                    <div
                        className={cn(
                            "grid gap-3 grid-cols-4 flex-1 transition-opacity",
                            shownResourceTypePerDropKinds === "units" &&
                                "opacity-50"
                        )}
                    >
                        <ResourceCounter
                            type="B"
                            amount={stats.drops.equipments.B}
                        />
                        <ResourceCounter
                            type="A"
                            amount={stats.drops.equipments.A}
                        />
                        <ResourceCounter
                            type="S"
                            amount={stats.drops.equipments.S}
                        />
                        <ResourceCounter
                            type="SS"
                            amount={stats.drops.equipments.SS}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};
