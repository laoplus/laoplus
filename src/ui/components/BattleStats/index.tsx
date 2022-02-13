import { Panel } from "./Panel";

export const BattleStats: React.VFC = () => {
    const [showPanel, setShowPanel] = React.useState(false);
    const handleButtonClick = () => {
        setShowPanel((v) => !v);
    };

    return (
        <div className="relative">
            <button
                onClick={handleButtonClick}
                title="周回情報パネルを表示する"
                className="h-6 text-white drop-shadow-featureIcon"
            >
                <i className="bi bi-recycle"></i>
            </button>
            {showPanel && <Panel />}
        </div>
    );
};
