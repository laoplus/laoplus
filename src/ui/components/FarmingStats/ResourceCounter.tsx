import { rankColor } from "~/constants";
import { Icon } from "./Icon";
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
    // const resourceDisplayType = React.useContext(ResourceDisplayTypeContext);
    // const namount =
    //     resourceDisplayType.mode === "perHour"
    //         ? resourceDisplayType.elapsedHours === 0
    //             ? 0
    //             : Number((amount / resourceDisplayType.elapsedHours).toFixed(2))
    //         : amount;
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

            <span className={cn(sign && amount < 0 && "text-red-500")}>
                {sign && (amount === 0 ? "±" : amount < 0 ? "-" : "+")}
                {Math.abs(amount).toLocaleString()}
            </span>
        </div>
    );
};
