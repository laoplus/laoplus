import { ResourceFarmRecoder } from "~/features/types";
import { Icon } from "./Icon";
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
        },
    });
}

export const ResourceFarmer: React.VFC = () => {
    const status = unsafeWindow.LAOPLUS.status;
    const [recorder, setRecorder] = React.useState<ResourceFarmRecoder>({
        ...status.status.resourceFarmRecoder,
    });
    status.events.on("changed", (e) => {
        setRecorder((old) => {
            if (!jsonEqual(old, e.resourceFarmRecoder))
                return { ...e.resourceFarmRecoder };
            return old;
        });
    });
    const style = {
        textShadow: "black 0.1em 0.1em 0.2em",
    };

    const totalTime = recorder.totalRoundTime + recorder.totalWaitTime;
    const [Research, setResearch] = React.useState<string>("2.5");
    const numResearch = parseFloat(Research);

    return (
        <div
            className="ml-[5%] text-slate-200 absolute left-0 top-0 px-3 w-1/2 whitespace-nowrap text-sm font-semibold"
            style={style}
        >
            <div>
                [Round:
                <div className="text-emerald-300 inline-block">
                    {recorder.rounds}
                </div>
                ]
                <Icon type="metal" />
                {recorder.Metal}
                <Icon type="nutrient" />
                {recorder.Nutrient}
                <Icon type="power" />
                {recorder.Power}
                <Icon type="basic_module" />
                {recorder.Normal_Module}
                <Icon type="advanced_module" />
                {recorder.Advanced_Module}
                <Icon type="special_module" />
                {recorder.Special_Module}
            </div>
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
                                    recorder.totalRoundTime / recorder.rounds
                                ).toFixed(2)}
                            </td>
                            <td>{recorder.totalRoundTime.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th>Wait Time</th>
                            <td>
                                {(
                                    recorder.totalWaitTime / recorder.rounds
                                ).toFixed(2)}
                            </td>
                            <td>{recorder.totalWaitTime.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th>Total Time</th>
                            <td>{(totalTime / recorder.rounds).toFixed(2)}</td>
                            <td>{totalTime.toFixed(2)}</td>
                        </tr>
                    </table>
                </p>
                <p>
                    <Icon type="metal" />
                    per hour:{" "}
                    {(
                        (recorder.Metal * numResearch * 3600) /
                        totalTime
                    ).toFixed(2)}
                </p>
                <p>
                    <Icon type="nutrient" />
                    per hour:{" "}
                    {(
                        (recorder.Nutrient * numResearch * 3600) /
                        totalTime
                    ).toFixed(2)}
                </p>
                <p>
                    <Icon type="power" />
                    per hour:{" "}
                    {(
                        (recorder.Power * numResearch * 3600) /
                        totalTime
                    ).toFixed(2)}
                </p>
                <p>
                    <Icon type="basic_module" />
                    per hour:{" "}
                    {((recorder.Normal_Module * 3600) / totalTime).toFixed(2)}
                </p>
                <p>
                    <Icon type="advanced_module" />
                    per hour:{" "}
                    {((recorder.Advanced_Module * 3600) / totalTime).toFixed(2)}
                </p>
                <p>
                    <Icon type="special_module" />
                    per hour:{" "}
                    {((recorder.Special_Module * 3600) / totalTime).toFixed(2)}
                </p>
            </div>
        </div>
    );
};
