import { FarmingStats } from "~/types/Status";
import { ShownResourceTypePerDropKinds } from "./Panel";
import { ResourceCounter } from "./ResourceCounter";
const cn = classNames;

/**
 * @package
 */
export const Drops: React.VFC<{
    drops: FarmingStats["drops"];
    shownResourceTypePerDropKinds: ShownResourceTypePerDropKinds;
}> = ({ drops, shownResourceTypePerDropKinds }) => {
    return (
        <>
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
                    <ResourceCounter type="B" amount={drops.units.B} />
                    <ResourceCounter type="A" amount={drops.units.A} />
                    <ResourceCounter type="S" amount={drops.units.S} />
                    <ResourceCounter type="SS" amount={drops.units.SS} />
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
                    <ResourceCounter type="B" amount={drops.equipments.B} />
                    <ResourceCounter type="A" amount={drops.equipments.A} />
                    <ResourceCounter type="S" amount={drops.equipments.S} />
                    <ResourceCounter type="SS" amount={drops.equipments.SS} />
                </div>
            </div>
        </>
    );
};
