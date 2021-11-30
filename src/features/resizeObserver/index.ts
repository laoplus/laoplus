import { log } from "utils/log";

export const initResizeObserver = () => {
    const game = document.querySelector("canvas");
    if (!game) return;
    const body = document.body;

    const bodyResizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        game.height = height;
        game.width = width;
        log("ResizeObserver", "Game resized:", `${game.width}x${game.height}`);
    });

    const canvasAttributeObserver = new MutationObserver(() => {
        bodyResizeObserver.observe(body);
        log(
            "CanvasAttributeObserver",
            "Game initialized. ResizeObserver Started."
        );
        canvasAttributeObserver.disconnect();
        log("CanvasAttributeObserver", "CanvasAttributeObserver Stopped.");
    });

    canvasAttributeObserver.observe(game, { attributes: true });
    log("CanvasAttributeObserver", "CanvasAttributeObserver Started.");
};
