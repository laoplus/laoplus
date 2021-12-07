import { Spinner } from "./Spinner";
import { Timer } from "./Timer";

export const AutorunStatus: React.VFC = () => {
    const config = unsafeWindow.LAOPLUS.config;
    const status = unsafeWindow.LAOPLUS.status;

    const [shown, setShown] = React.useState(
        config.config.features.autorunDetection.enabled
    );
    const [enterDate, setEnterDate] = React.useState<Date | null>(null);

    config.events.on("changed", (e) => {
        setShown(e.features.autorunDetection.enabled);
    });

    status.events.on("changed", (e) => {
        setEnterDate(e.autorunDetection.latestEnterTime);
    });

    if (!shown) {
        return <></>;
    }

    return (
        <div className="-translate-x-[50%] absolute inset-y-0 left-0 flex items-center text-white opacity-90 pointer-events-none select-none drop-shadow-lg">
            <Spinner
                className="leading-zero text-[70vh] animate-spin"
                style={{ animationDuration: "12s" }}
            />
            <div className="pl-[50%] absolute inset-0 flex items-center justify-center">
                <Timer targetDate={enterDate} className="pt-[50%] rotate-90" />
            </div>
        </div>
    );
};