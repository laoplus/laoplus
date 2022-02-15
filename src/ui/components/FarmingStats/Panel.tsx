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
        <div className="flex items-center gap-2">
            {type === "B" || type === "A" || type === "S" || type === "SS" ? (
                <div
                    className={cn(
                        "flex-shrink-0 rounded-md px-2 font-bold ring-1 ring-gray-900/5",
                        `bg-[${rankColor[type].hex()}]`,
                        type === "SS" ? "text-black" : "text-white"
                    )}
                >
                    {type}
                </div>
            ) : (
                <div className="h-6 w-6 flex-shrink-0">
                    <Icon type={type} />
                </div>
            )}

            <hr className="h-[2px] w-full rounded-full border-0 bg-gray-200" />
            <span className="font-bold text-gray-900">
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
        <div className="absolute bottom-6 left-0 mb-1 w-[420px] overflow-hidden rounded-lg shadow-xl ring-1 ring-gray-900/5">
            <header className="flex items-center bg-gradient-to-r from-slate-800 to-slate-700 p-2 pl-3 font-bold text-white">
                <h1 className="mr-auto flex items-center gap-2">
                    <i className="bi bi-info-circle text-lg"></i>
                    周回統計
                </h1>
                <div className="flex items-center gap-2">
                    <button
                        className="flex items-center gap-1 rounded bg-amber-300 px-2 py-1 font-bold text-gray-900 shadow ring-1 ring-inset ring-amber-900/5"
                        onClick={reset}
                    >
                        <i className="bi bi-stopwatch-fill inline w-4"></i>
                        リセット
                    </button>
                </div>
            </header>

            <main className="flex flex-col gap-4 bg-white px-4 py-5">
                <div className="grid grid-cols-2 items-center gap-4">
                    <MemorizedTimeStat {...stats} />
                    <dl className="flex">
                        <dt className="mr-auto">完了した周回数</dt>
                        <dd>
                            <p className="font-bold text-gray-900">
                                {stats.lapCount.toLocaleString()}
                                <span className="ml-0.5 text-xs font-bold text-gray-500">
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
                    <div className="hidden">
                        <div className="ml-auto flex cursor-pointer select-none items-center gap-1">
                            <span
                                onClick={() => {
                                    setResourceDisplayType("perHour");
                                }}
                            >
                                時給
                            </span>
                            <div
                                className="flex h-5 w-10 items-center rounded-full bg-gray-300 px-1"
                                onClick={toggleResourceDisplayType}
                            >
                                <div
                                    className={cn(
                                        "h-4 w-4 transform rounded-full bg-white shadow-md transition-transform",
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

                <div className="grid grid-cols-3 gap-3">
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
                <div className="grid grid-cols-3 gap-3">
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
                            "grid flex-1 grid-cols-4 gap-3 transition-opacity",
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
                            "grid flex-1 grid-cols-4 gap-3 transition-opacity",
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
