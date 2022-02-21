import type { Resources } from "./calc";
import { ResourceCounter as Counter } from "./ResourceCounter";

/**
 * @package
 */
export const GainedResourceDisplayTable: React.VFC<{
    resources: Resources;
}> = ({ resources: r }) => {
    return (
        <div className="grid grid-cols-3 grid-rows-2 gap-3">
            <Counter type="parts" amount={r.parts} />
            <Counter type="nutrient" amount={r.nutrients} />
            <Counter type="power" amount={r.power} />
            <Counter type="basic_module" amount={r.basic_module} />
            <Counter type="advanced_module" amount={r.advanced_module} />
            <Counter type="special_module" amount={r.special_module} />
        </div>
    );
};
