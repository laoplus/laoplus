import { BootstrapIcon } from "~/ui/BootstrapIcon";
import { ConfigModal } from "ui/components/ConfigModal";
import { AutorunStatus } from "./components/AutorunStatus";
import { ResourceFarmer } from "./components/ResourceFarmer";
import { ToggleAutorun } from "./components/ToggleAutorun";
const IconWrapper: React.VFC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <div className="gap-1 absolute bottom-0 left-0 flex">{children}</div>
    );
};

const App: React.VFC = () => {
    return (
        <>
            <BootstrapIcon />
            <IconWrapper>
                <ConfigModal />
                <ToggleAutorun />
            </IconWrapper>
            <AutorunStatus />
            <ResourceFarmer />
        </>
    );
};

export const initUi = () => {
    const root = document.createElement("div");
    root.id = "laoplus-root";
    ReactDOM.render(<App />, root);
    document.body.appendChild(root);
};
