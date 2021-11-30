import { Icon } from "ui/Icon";
import { ConfigModal } from "ui/components/ConfigModal";

const App: React.VFC = () => {
    return (
        <>
            <Icon />
            <ConfigModal />
        </>
    );
};

export const initUi = () => {
    const root = document.createElement("div");
    root.id = "laoplus-root";
    ReactDOM.render(<App />, root);
    document.body.appendChild(root);
};
