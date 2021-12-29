import { injection } from "injection";
import { Config } from "config";
import { Status } from "./Status";
import { initUi } from "ui/index";
import { initInterceptor } from "features/interceptor";
import { initResizeObserver } from "features/resizeObserver";
import { initTacticsManual } from "tacticsManual";
import { TacticsManualUnit, ExplorationSquad } from "./types";
import { tailwindConfig, initTailwindCustomStyle } from "./ui/tailwind";
import { initInputObserver } from "./features/inputObserver";
import { initWheelAmplfy } from "./features/wheelAmplify";
import { log } from "./utils";

declare global {
    // 露出させるLAOPLUSオブジェクトのinterface
    interface Window {
        LAOPLUS: {
            config: Config;
            tacticsManual: {
                locale: { [key: string]: string };
                unit: TacticsManualUnit[];
            };
            exploration: ExplorationSquad[];
            status: Status;
        };
    }
}

// 'return' outside of functionでビルドがコケるのを防ぐ即時実行関数
(function () {
    const isGameWindow = injection();
    if (!isGameWindow) return;

    const config = new Config();
    const status = new Status();

    // LAOPLUSオブジェクトを露出させる
    unsafeWindow.LAOPLUS = {
        config: config,
        tacticsManual: {
            locale: {},
            unit: [],
        },
        exploration: [],
        status: status,
    };

    // @ts-ignore
    tailwind.config = tailwindConfig;
    initTailwindCustomStyle();

    dayjs.extend(dayjs_plugin_relativeTime);
    dayjs.extend(dayjs_plugin_isSameOrBefore);
    dayjs.extend(dayjs_plugin_duration);

    initUi();
    initInterceptor();
    initResizeObserver();
    initInputObserver();
    initWheelAmplfy();
    initTacticsManual();

    unsafeWindow.LAOPLUS.config.events.on("*", (type, e) => {
        log.debug("index", "config fired", type, e);
    });

    unsafeWindow.LAOPLUS.status.events.on("*", (type, e) => {
        log.debug("index", "status fired", type, e);
    });
})();
