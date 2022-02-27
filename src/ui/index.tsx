import { BootstrapIcon } from "~/ui/BootstrapIcon";
import { ConfigModal } from "ui/components/ConfigModal";
import { AutorunStatus } from "./components/AutorunStatus";
import { FarmingStats } from "./components/FarmingStats";
import { ToggleAutorun } from "./components/ToggleAutorun";

const element = document.createElement("style");
element.setAttribute("type", "text/tailwindcss");
element.innerText = `
.icon-wrapper > div > button {
    @apply transition-opacity duration-150;
    opacity: var(--menu-button-opacity);
}
.icon-wrapper.hovered > div > button {
    @apply opacity-100;
}
`;
document.head.appendChild(element);

const IconWrapper: React.VFC<{
    children: React.ReactNode;
    style: React.HTMLAttributes<HTMLDivElement>["style"];
}> = ({ children, ...props }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    return (
        <div
            className={classNames(
                "absolute bottom-0 left-0 flex transition-opacity",
                "icon-wrapper",
                isHovered && "hovered"
            )}
            onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains("js-feature-button")) {
                    setIsHovered(true);
                }
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
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
            <IconWrapper
                style={
                    {
                        "--menu-button-opacity": menuOpacity,
                    } as React.CSSProperties
                }
            >
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
