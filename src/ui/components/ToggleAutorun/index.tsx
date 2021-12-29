const cn = classNames;

export const ToggleAutorun: React.VFC = () => {
    const config = unsafeWindow.LAOPLUS.config;

    const [enabled, setEnabled] = React.useState(
        config.config.features.autorunDetection.enabled
    );

    config.events.on("changed", (e) => {
        setEnabled(e.features.autorunDetection.enabled);
    });

    const handleClick = () => {
        config.set({ features: { autorunDetection: { enabled: !enabled } } });
    };

    return (
        <button
            onClick={handleClick}
            title={`自動周回停止判定を${enabled ? "オフ" : "オン"}にする`}
            className={cn("text-white drop-shadow", enabled && "animate-spin")}
            style={{
                animationDuration: "2s",
                animationTimingFunction: "ease-in-out",
                filter: "drop-shadow(0 0 0.1em black)",
            }}
        >
            <i className="bi bi-arrow-repeat"></i>
        </button>
    );
};
