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
    showSign?: boolean;
}> = ({ type, amount, showSign = false }) => {
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

    const nf = new Intl.NumberFormat(undefined, {
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/46712
        signDisplay: showSign ? "exceptZero" : "auto",
    });
    const parts = nf.formatToParts(displayAmount);
    const sign = parts.find((p) => p.type.includes("Sign"))?.value || "";
    const isNegative = parts.some((p) => p.type === "minusSign");
    const integer =
        parts
            .filter(
                (v) =>
                    v.type !== "decimal" &&
                    v.type !== "fraction" &&
                    !v.type.includes("Sign")
            )
            .map((v) => v.value)
            .join("") || "0";
    const decimal = parts.find((p) => p.type === "decimal")?.value || ".";
    const fraction = parts.find((p) => p.type === "fraction")?.value;

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

            <span className={cn(isNegative && "text-red-500")}>
                {sign}
                {integer}
                {fraction && (
                    <span
                        className={cn(
                            "ml-0.5 text-xs text-gray-500",
                            isNegative && "!text-red-500"
                        )}
                    >
                        {decimal}
                        {fraction}
                    </span>
                )}
            </span>
        </div>
    );
};
