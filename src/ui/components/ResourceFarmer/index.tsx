interface ResourceFarmRecoder {
    startTime?: number,
    endTime?: number,
    totalWaitTime: number,
    totalRoundTime: number,
    rounds: number,
    Metal: number,
    Nutrient: number,
    Power: number,
    Normal_Module: number,
    Advanced_Module: number,
    Special_Module: number,
}

export const ResourceFarmer: React.VFC = () => {
    const status = unsafeWindow.LAOPLUS.status;
    const [stat,setStat] = React.useState<ResourceFarmRecoder>(status.status.resourceFarmRecoder);
    status.events.on("changed", (e) => {
        setStat(()=>({...e.resourceFarmRecoder}));
    });
    const style={
        textShadow: "black 0.1em 0.1em 0.2em"
    }
    return (
        <div className="absolute top-0 left-0 w-1/2 px-3 ml-[5%]">
            <div className="text-white text-sm whitespace-nowrap" style={style}>
                [{stat.rounds}] {stat.Metal}/{stat.Nutrient}/{stat.Power} - {stat.Normal_Module}/{stat.Advanced_Module}/{stat.Special_Module}
            </div>
        </div>
    );
};
