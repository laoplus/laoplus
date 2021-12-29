import { ResourceFarmRecoder } from "~/features/types";
import "./Style.ts";
function jsonEqual(a: any, b: any) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function resetRecoder() {
    const status = unsafeWindow.LAOPLUS.status;
    status.set({
        resourceFarmRecoder: {
            startTime: undefined,
            waveTime: undefined,
            endTime: undefined,
            totalWaitTime: 0,
            totalRoundTime: 0,
            rounds: 0,
            Metal: 0,
            Nutrient: 0,
            Power: 0,
            Normal_Module: 0,
            Advanced_Module: 0,
            Special_Module: 0,
        } as ResourceFarmRecoder,
    });
}

function AdvanceWindow(props: any) {
    const isShow = props.isShow;
    const recoder = props.recoder as ResourceFarmRecoder;
    const totalTime = recoder.totalRoundTime + recoder.totalWaitTime;
    const [Research, setResearch] = React.useState<string>("2.5");
    const numResearch = parseFloat(Research);
    if (isShow) {
        return (
            <div>
                Research:{" "}
                <select
                    className="text-black"
                    value={Research}
                    onChange={(e) => setResearch((old) => e.target.value)}
                >
                    <option value="1">0%</option>
                    <option value="1.3">30%</option>
                    <option value="1.6">60%</option>
                    <option value="1.9">90%</option>
                    <option value="2.2">120%</option>
                    <option value="2.5">150%</option>
                </select>
                <button
                    className="bg-amber-300 ml-1 p-1 text-black font-bold"
                    onClick={resetRecoder}
                >
                    Reset
                </button>
                <p>
                    <table>
                        <tr>
                            <th></th>
                            <th>Average</th>
                            <th>Total</th>
                        </tr>
                        <tr>
                            <th>Round Time</th>
                            <td>
                                {(
                                    recoder.totalRoundTime / recoder.rounds
                                ).toFixed(2)}
                            </td>
                            <td>{recoder.totalRoundTime.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th>Wait Time</th>
                            <td>
                                {(
                                    recoder.totalWaitTime / recoder.rounds
                                ).toFixed(2)}
                            </td>
                            <td>{recoder.totalWaitTime.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th>Total Time</th>
                            <td>{(totalTime / recoder.rounds).toFixed(2)}</td>
                            <td>{totalTime.toFixed(2)}</td>
                        </tr>
                    </table>
                </p>
                <p>
                    <img
                        className="icon"
                        src="https://static.wikia.nocookie.net/lastorigin/images/a/ab/Part_Icon.png"
                    ></img>
                    per hour:{" "}
                    {((recoder.Metal * numResearch * 3600) / totalTime).toFixed(
                        2
                    )}
                </p>
                <p>
                    <img
                        className="icon"
                        src="https://static.wikia.nocookie.net/lastorigin/images/f/f4/Nutrient_Icon.png"
                    ></img>
                    per hour:{" "}
                    {(
                        (recoder.Nutrient * numResearch * 3600) /
                        totalTime
                    ).toFixed(2)}
                </p>
                <p>
                    <img
                        className="icon"
                        src="https://static.wikia.nocookie.net/lastorigin/images/d/d0/Power_Icon.png"
                    ></img>
                    per hour:{" "}
                    {((recoder.Power * numResearch * 3600) / totalTime).toFixed(
                        2
                    )}
                </p>
                <p>
                    <img
                        className="icon"
                        src="https://static.wikia.nocookie.net/lastorigin/images/2/2e/Basic_Module_Icon.png"
                    ></img>
                    per hour:{" "}
                    {((recoder.Normal_Module * 3600) / totalTime).toFixed(2)}
                </p>
                <p>
                    <img
                        className="icon"
                        src="https://static.wikia.nocookie.net/lastorigin/images/d/d3/Advanced_Module_Icon.png"
                    ></img>
                    per hour:{" "}
                    {((recoder.Advanced_Module * 3600) / totalTime).toFixed(2)}
                </p>
                <p>
                    <img
                        className="icon"
                        src="https://static.wikia.nocookie.net/lastorigin/images/9/9c/Special_Module_Icon.png"
                    ></img>
                    per hour:{" "}
                    {((recoder.Special_Module * 3600) / totalTime).toFixed(2)}
                </p>
            </div>
        );
    }
    return <></>;
}

export const ResourceFarmer: React.VFC = () => {
    const status = unsafeWindow.LAOPLUS.status;
    const [stat, setStat] = React.useState<ResourceFarmRecoder>({
        ...status.status.resourceFarmRecoder,
    });
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
    const [adv_show, setAdvShow] = React.useState<boolean>(false);

    return (
        <div
            className="ml-[5%] text-slate-200 px-3 w-1/2 font-semibold absolute left-0 top-0 whitespace-nowrap text-sm"
            style={style}
        >
            <div>
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
                <button onClick={() => setAdvShow((e) => !e)}>
                    <img
                        className="icon"
                        src="https://static.wikia.nocookie.net/lastorigin/images/d/de/Menu_Workshop.png"
                    ></img>
                </button>
            </div>
            <AdvanceWindow isShow={adv_show} recoder={stat}></AdvanceWindow>
        </div>
    );
};
