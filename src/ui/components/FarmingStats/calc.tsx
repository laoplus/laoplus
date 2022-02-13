import { log } from "~/utils";
import { disassemblingTable } from "~/constants";
import { FarmingStats } from "~/features/types";

// 分解についてのメモ
// 分解獲得資源上昇（研究「精密分解施設」, 基地「装備分解室」）で増えるのは部品・栄養・電力のみ
// 計算式: 少数切り捨て(1体から得られる量 * 数 * 倍率)

/**
 * 素の分解獲得資源値に自分の分解獲得資源上昇値をかけた値を得る
 */
const calcMultipliedValue = (amount: number, type: "units" | "equipments") => {
    const config = unsafeWindow.LAOPLUS.config.config.features.farmingStats;

    /**
     * ユーザーが実際にゲームで見る数値
     *
     * **追加で** xxx%得られるという意味なので、使うときは100%分足す
     * @example 150
     */
    const rawMultiplier =
        type === "units"
            ? config.unitDisassemblyMultiplier
            : config.equipmentDisassemblyMultiplier;

    /**
     * 計算に使う数値
     * @example 2.5
     */
    const multiplier = (Number(rawMultiplier) + 100) * 0.01;

    return Math.trunc(amount * multiplier);
};

// TODO: テストを書く
/**
 * @package
 */
export const calcResourcesFromDrops = ({
    drops,
    table,
    type,
}: {
    drops: FarmingStats["drops"]["units"] | FarmingStats["drops"]["equipments"];
    table:
        | typeof disassemblingTable.units
        | typeof disassemblingTable.equipments;
    type: "units" | "equipments";
}) => {
    const sumInitialValue = {
        parts: 0,
        nutrients: 0,
        power: 0,
        basic_module: 0,
        advanced_module: 0,
        special_module: 0,
    };
    Object.freeze(sumInitialValue);

    const ranks = Object.keys(drops) as (keyof typeof drops)[];

    // ランクごとに集計・加算して返す
    const total = ranks.reduce(
        (sum, rank) => {
            const resourceKeys = Object.keys(
                sumInitialValue
            ) as (keyof typeof sumInitialValue)[];

            // このランクを分解して得られる資源量を保存するオブジェクト
            const income = { ...sumInitialValue };

            resourceKeys.forEach((key) => {
                income[key] = table[rank][key] * drops[rank];
            });
            log.debug("FarmingStats", type, rank, "倍率かける前", income);

            // 部品・栄養・電力のみ 上昇倍率をかける
            income.parts = calcMultipliedValue(income.parts, type);
            income.nutrients = calcMultipliedValue(income.nutrients, type);
            income.power = calcMultipliedValue(income.power, type);
            log.debug("FarmingStats", type, rank, "倍率かけた後", income);

            // sumとincomeを加算する
            resourceKeys.forEach((key) => {
                sum[key] += income[key];
            });

            return sum;
        },
        { ...sumInitialValue }
    );

    log.debug("FarmingStats", type, "total", total);
    return total;
};
