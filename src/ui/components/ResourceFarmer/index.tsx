import { Spinner } from "./Spinner";
import { Timer } from "./Timer";

interface ResourceFarmRecoder {
    startTime?: number,
    endTime?: number,
    totalWaitTime?: number,
    totalRoundTime?: number,
    rounds?: number,
    Metal?: number,
    Nutrient?: number,
    Power?: number,
    Normal_Module?: number,
    Advanced_Module?: number,
    Special_Module?: number,
}

export const ResourceFarmer: React.VFC = () => {
    const status = unsafeWindow.LAOPLUS.status;

    const {rounds, Metal, Nutrient, Power, Normal_Module, Advanced_Module, Special_Module } = status.status.resourceFarmRecoder as ResourceFarmRecoder;


    return (
        <div className="-translate-x-[50%] absolute inset-y-0 left-0 flex items-center text-white opacity-90 pointer-events-none select-none drop-shadow-lg">
            <div className="pl-[50%] absolute inset-0 flex items-center justify-center">
                Rounds:{rounds},Metal:{Metal / rounds}, Nutrient:{Nutrient / rounds}, Power:{Power / rounds}, Normal_Module:{Normal_Module / rounds}, Advanced_Module:{Advanced_Module / rounds}, Special_Module:{Special_Module / rounds},
            </div>
        </div>
    );
};
