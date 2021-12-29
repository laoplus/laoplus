interface ResourceFarmRecoder {
    startTime?: number;
    endTime?: number;
    totalWaitTime: number;
    totalRoundTime: number;
    rounds: number;
    Metal: number;
    Nutrient: number;
    Power: number;
    Normal_Module: number;
    Advanced_Module: number;
    Special_Module: number;
}
import "./Style.ts";
function jsonEqual(a: any, b: any) {
    return JSON.stringify(a) === JSON.stringify(b);
}
export const ResourceFarmer: React.VFC = () => {
    const status = unsafeWindow.LAOPLUS.status;
    const [stat, setStat] = React.useState<ResourceFarmRecoder>(
        {...status.status.resourceFarmRecoder}
    );
    status.events.on("changed", (e) => {
        setStat((old) => {
            if (!jsonEqual(old, e.resourceFarmRecoder))
                return { ...e.resourceFarmRecoder };
            return old;
        });
    });
    const style = {
        textShadow: "black 0.1em 0.1em 0.2em",
    };
    return (
        <div className="ml-[5%] absolute left-0 top-0 px-3 w-1/2">
            <div
                className="text-slate-200 whitespace-nowrap text-sm font-semibold"
                style={style}
            >
                [Round:
                <div className="text-emerald-300 inline-block">
                    {stat.rounds}
                </div>
                ]
                <img
                    className="icon"
                    src="https://static.wikia.nocookie.net/lastorigin/images/a/ab/Part_Icon.png"
                ></img>
                {stat.Metal}
                <img
                    className="icon"
                    src="https://static.wikia.nocookie.net/lastorigin/images/f/f4/Nutrient_Icon.png"
                ></img>
                {stat.Nutrient}
                <img
                    className="icon"
                    src="https://static.wikia.nocookie.net/lastorigin/images/d/d0/Power_Icon.png"
                ></img>
                {stat.Power}
                <img
                    className="icon"
                    src="https://static.wikia.nocookie.net/lastorigin/images/2/2e/Basic_Module_Icon.png"
                ></img>
                {stat.Normal_Module}
                <img
                    className="icon"
                    src="https://static.wikia.nocookie.net/lastorigin/images/d/d3/Advanced_Module_Icon.png"
                ></img>
                {stat.Advanced_Module}
                <img
                    className="icon"
                    src="https://static.wikia.nocookie.net/lastorigin/images/9/9c/Special_Module_Icon.png"
                ></img>
                {stat.Special_Module}
            </div>
        </div>
    );
};
