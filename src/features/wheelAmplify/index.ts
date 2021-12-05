import { log } from "~/utils";

const isCanvasElement = (target: EventTarget | null) => {
    if (target === null) return false;
    const t = target as HTMLElement;
    if (t.tagName !== "CANVAS") return false;
    return t as HTMLCanvasElement;
};

export const initWheelAmplfy = () => {
    // TODO: 追加したときのイベントを取っておいていつでも消せるようにする
    // canvasにイベントつけると無限ループするので注意
    unsafeWindow.addEventListener(
        "wheel",
        ({ deltaY, target: eventTraget }) => {
            if (
                !unsafeWindow.LAOPLUS.config.config.features.wheelAmplify
                    .enabled
            ) {
                return;
            }
            log.debug("WheelAmplify", "Swoosh!");
            const target = isCanvasElement(eventTraget);
            if (!target) return;

            const newWheelEvent = new WheelEvent("wheel", {
                deltaY:
                    deltaY *
                    unsafeWindow.LAOPLUS.config.config.features.wheelAmplify
                        .ratio,
            });
            target.dispatchEvent(newWheelEvent);
        }
    );
};
