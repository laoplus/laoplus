import { rankColor } from "~/constants";
import { Icon } from "./Icon";
import { FarmingStatsContext } from "./Panel";
const cn = classNames;

type Rarity = "B" | "A" | "S" | "SS";

/**
 * 戦闘員・装備をのレアリティを示す文字のアイコン
 */
const ResourceCounterIcon: React.VFC<{ type: Rarity }> = ({ type }) => {
    return (
        <div
            className={cn(
                "flex-shrink-0 rounded-md px-2 font-bold ring-1 ring-gray-900/5",
                `bg-[${rankColor[type].hex()}]`,
                type === "SS" ? "text-black" : "text-white"
            )}
        >
            {type}
        </div>
    );
};

/**
 * アイコンと数字を表示するコンポーネント
 * @package
 */
export const ResourceCounter: React.VFC<{
    type: React.ComponentProps<typeof Icon>["type"] | Rarity;
    amount: number;
    sign?: boolean;
}> = ({ type, amount, sign = false }) => {
    const context = React.useContext(FarmingStatsContext);
    const displayAmount = (() => {
        if (context.resourceDisplayType === "sum") {
            return amount;
        }
        if (context.resourceDisplayType === "perHour") {
            if (context.elapsedHours === 0) return 0;
            const v = amount / context.elapsedHours;
            return Number(v.toFixed(1));
        }
        return amount;
    })();

    // displayAmountの小数部分
    const dec = String(displayAmount).split(".")[1];

    return (
        <div className="flex items-center gap-2 font-bold text-gray-900">
            {type === "B" || type === "A" || type === "S" || type === "SS" ? (
                <ResourceCounterIcon type={type} />
            ) : (
                <div className="h-6 w-6 flex-shrink-0">
                    <Icon type={type} />
                </div>
            )}

            <hr className="h-[2px] w-full rounded-full border-0 bg-gray-200" />

            <span className={cn(sign && displayAmount < 0 && "text-red-500")}>
                {sign &&
                    (displayAmount === 0 ? "±" : displayAmount < 0 ? "-" : "+")}
                {Math.abs(Math.trunc(displayAmount)).toLocaleString()}
                {dec && (
                    // 日本や欧米以外では小数点が"."ではない可能性があるが
                    // Number.prototype.toLocaleString()した結果のロケール定義を取得する方法がわからないため.に固定している
                    <span className="ml-0.5 text-xs text-gray-500">.{dec}</span>
                )}
            </span>
        </div>
    );
};
