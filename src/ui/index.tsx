import { Icon } from "ui/Icon";
import { ConfigModal } from "ui/components/ConfigModal";
import { AutorunStatus } from "./components/AutorunStatus";
import { ResourceFarmer } from "./components/ResourceFarmer";

const App: React.VFC = () => {
    return (
        <>
            <Icon />
            <ConfigModal />
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
