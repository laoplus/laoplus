import { BootstrapIcon } from "~/ui/BootstrapIcon";
import { ConfigModal } from "ui/components/ConfigModal";
import { AutorunStatus } from "./components/AutorunStatus";
import { FarmingStats } from "./components/FarmingStats";
import { ToggleAutorun } from "./components/ToggleAutorun";
const IconWrapper: React.VFC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <div className="absolute bottom-0 left-0 flex gap-1">{children}</div>
    );
};

const App: React.VFC = () => {
    return (
        <>
            <BootstrapIcon />
            <IconWrapper>
                <ConfigModal />
                <ToggleAutorun />
                <FarmingStats />
            </IconWrapper>
            <AutorunStatus />
        </>
    );
};

export const initUi = () => {
    const root = document.createElement("div");
    root.id = "laoplus-root";
    ReactDOM.render(<App />, root);
    document.body.appendChild(root);
};
