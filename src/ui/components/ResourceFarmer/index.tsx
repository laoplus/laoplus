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
    const [_stat,update] = React.useState<ResourceFarmRecoder>();
    const stat = _stat ?? {} as ResourceFarmRecoder;
    status.events.on("changed", () => {
        update(status.status.resourceFarmRecoder as ResourceFarmRecoder);
    });
    return (
        <div className="-translate-x-[50%] absolute inset-y-0 left-0 flex items-center text-white opacity-90 pointer-events-none select-none drop-shadow-lg">
            <div className="pl-[50%] absolute inset-0 flex items-center justify-center">
                Rounds:{stat.rounds}, Metal:{stat.Metal / stat.rounds}, Nutrient:{stat.Nutrient / stat.rounds}, Power:{stat.Power / stat.rounds}, Normal_Module:{stat.Normal_Module / stat.rounds}, Advanced_Module:{stat.Advanced_Module / stat.rounds}, Special_Module:{stat.Special_Module / stat.rounds},
            </div>
        </div>
    );
};
