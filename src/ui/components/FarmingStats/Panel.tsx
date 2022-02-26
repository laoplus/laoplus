import { disassemblingTable } from "~/constants";
import { FarmingStats as TFarmingStats } from "~/types/Status";
import { reset } from "~/features/farmingStats/functions";
import { humanFriendlyStageKey, log } from "~/utils";
import { calcResourcesFromDrops } from "./calc";
import { MemorizedTimeStat } from "./TimeStat";
import { GainedResourceDisplayHeader } from "./GainedResourceDisplayHeader";
import { GainedResourceDisplayTable } from "./GainedResourceDisplayTable";
import { Profit } from "./Profit";
import { Drops } from "./Drops";

function jsonEqual(a: unknown, b: unknown) {
    return JSON.stringify(a) === JSON.stringify(b);
}
/**
 * @package
 */
export type ResourceDisplayType = "perHour" | "sum";
/**
 * @package
 */
export type ShownResourceTypePerDropKinds = "total" | "units" | "equipments";
/**
 * @package
 */
export const FarmingStatsContext = React.createContext<{
    resourceDisplayType: ResourceDisplayType;
    elapsedHours: number;
}>({
    resourceDisplayType: "sum",
    elapsedHours: 0,
});

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

    const [resourceDisplayType, setResourceDisplayType] =
        React.useState<ResourceDisplayType>("sum");

    // TODO: 命名なんとかする
    const [shownResourceTypePerDropKinds, setShownResourceTypePerDropKinds] =
        React.useState<ShownResourceTypePerDropKinds>("total");

    const elapsedHours = (() => {
        if (stats.latestEnterTime !== null && stats.firstEnterTime !== null) {
            return (stats.latestEnterTime - stats.firstEnterTime) / 1000 / 3600;
        }
        return 0;
    })();

    /**
     * 資源換算
     */
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
                    {stats.latestEnterStageKey &&
                        ` (${humanFriendlyStageKey(
                            stats.latestEnterStageKey
                        )})`}
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

                <FarmingStatsContext.Provider
                    value={{ resourceDisplayType, elapsedHours }}
                >
                    <GainedResourceDisplayHeader
                        resourceDisplayType={resourceDisplayType}
                        setResourceDisplayType={setResourceDisplayType}
                        shownResourceTypePerDropKinds={
                            shownResourceTypePerDropKinds
                        }
                        setShownResourceTypePerDropKinds={
                            setShownResourceTypePerDropKinds
                        }
                    />
                    <GainedResourceDisplayTable
                        resources={
                            disassembledResource[shownResourceTypePerDropKinds]
                        }
                    />

                    <Profit
                        currentSquadCosts={stats.currentSquadCosts}
                        resources={
                            disassembledResource[shownResourceTypePerDropKinds]
                        }
                        lapCount={stats.lapCount}
                    />

                    <Drops
                        drops={stats.drops}
                        shownResourceTypePerDropKinds={
                            shownResourceTypePerDropKinds
                        }
                    />
                </FarmingStatsContext.Provider>
            </main>
        </div>
    );
};
