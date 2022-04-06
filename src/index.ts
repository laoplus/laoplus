import { injection } from "injection";
import { Config } from "config";
import { Status } from "./Status";
import { initUi } from "ui/index";
import { initInterceptor } from "features/interceptor";
import { initResizeObserver } from "features/resizeObserver";
import { tailwindConfig, initTailwindCustomStyle } from "./ui/tailwind";
import { initInputObserver } from "./features/inputObserver";
import { initWheelAmplfy } from "./features/wheelAmplify";
import { exploration_enter } from "./types/api";
import { PCInfo } from "~/types/api/shared";
import locale from "./json/JP.json";

type exploration = exploration_enter["res"]["EnterInfo"] & {
    timeoutID: number | null;
};

declare global {
    // 露出させるLAOPLUSオブジェクトのinterface
    interface Window {
        LAOPLUS: {
            config: Config;
            locale: { [key: string]: string };
            exploration: exploration[];
            status: Status;
            units: Map<PCInfo["PCId"], PCInfo>;
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        locale: Object.assign({}, locale),
        exploration: [],
        status: status,
        units: new Map(),
    };

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    tailwind.config = tailwindConfig;
    initTailwindCustomStyle();

    dayjs.extend(dayjs_plugin_relativeTime);
    dayjs.extend(dayjs_plugin_isSameOrBefore);
    dayjs.extend(dayjs_plugin_duration);

    initUi();
    initInterceptor();
    void initResizeObserver();
    initInputObserver();
    initWheelAmplfy();
})();
