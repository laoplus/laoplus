import { BootstrapIcon } from "~/ui/BootstrapIcon";
import { ConfigModal } from "ui/components/ConfigModal";
import { AutorunStatus } from "./components/AutorunStatus";
import { FarmingStats } from "./components/FarmingStats";
import { ToggleAutorun } from "./components/ToggleAutorun";
import { log } from "~/utils";

const IconWrapper: React.VFC<{
    children: React.ReactNode;
    style: React.HTMLAttributes<HTMLDivElement>["style"];
}> = ({ children, ...props }) => {
    return (
        <div
            className="absolute bottom-0 left-0 flex gap-1 transition-opacity hover:!opacity-100"
            {...props}
        >
            {children}
        </div>
    );
};

const App: React.VFC = () => {
    const config = unsafeWindow.LAOPLUS.config;

    const [menuOpacity, setMenuOpacity] = React.useState(
        config.config.features.ui.menuInactivityOpaicty
    );

    const [showFarmStats, setShowFarmStats] = React.useState(
        config.config.features.farmingStats.enabled
    );

    config.events.on("changed", (e) => {
        setMenuOpacity(e.features.ui.menuInactivityOpaicty);
        setShowFarmStats(e.features.farmingStats.enabled);
    });

    return (
        <>
            <BootstrapIcon />
            <AutorunStatus />
            <IconWrapper style={{ opacity: menuOpacity }}>
                <ConfigModal />
                <ToggleAutorun />
                {showFarmStats && <FarmingStats />}
            </IconWrapper>
        </>
    );
};

export const initUi = () => {
    const root = document.createElement("div");
    root.id = "laoplus-root";
    ReactDOM.render(<App />, root);
    document.body.appendChild(root);
};
