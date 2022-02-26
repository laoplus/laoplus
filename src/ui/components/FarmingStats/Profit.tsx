import type { FarmingStats } from "~/types/Status";
import type { Resources } from "./calc";
import { ResourceCounter } from "./ResourceCounter";

const NoData: React.VFC = () => {
    return (
        <p className="text-sm text-gray-600">
            <i className="bi bi-info-circle mr-1"></i>
            同じ部隊で2周以上出撃すると、ここに収支が表示されます
        </p>
    );
};

/**
 * @package
 */
export const Profit: React.VFC<{
    currentSquadCosts: FarmingStats["currentSquadCosts"];
    lapCount: FarmingStats["lapCount"];
    resources: Resources;
}> = ({ currentSquadCosts, resources, lapCount }) => {
    return (
        <>
            <div className="flex gap-3">
                <h2 className="font-bold">収支</h2>
            </div>
            {currentSquadCosts === null ? (
                <NoData />
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    <ResourceCounter
                        type="parts"
                        showSign
                        amount={
                            resources.parts - currentSquadCosts.parts * lapCount
                        }
                    />
                    <ResourceCounter
                        type="nutrient"
                        showSign
                        amount={
                            resources.nutrients -
                            currentSquadCosts.nutrients * lapCount
                        }
                    />
                    <ResourceCounter
                        type="power"
                        showSign
                        amount={
                            resources.power - currentSquadCosts.power * lapCount
                        }
                    />
                </div>
            )}
        </>
    );
};
