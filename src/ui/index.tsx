import { BootstrapIcon } from "~/ui/BootstrapIcon";
import { ConfigModal } from "ui/components/ConfigModal";
import { AutorunStatus } from "./components/AutorunStatus";

const App: React.VFC = () => {
    return (
        <>
            <BootstrapIcon />
            <ConfigModal />
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
