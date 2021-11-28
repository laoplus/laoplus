import { ConfigModal } from "ui/components/Modal";

const App: React.VFC = () => {
    return (
        <>
            <ConfigModal />
        </>
    );
};

export const initUi = () => {
    const root = document.createElement("div");
    ReactDOM.render(<App />, root);
    document.body.appendChild(root);
};
