import { log } from "~/utils";

export const initResizeObserver = () => {
    const game = document.querySelector("canvas");
    if (!game) {
        log.error("ResizeObserver", "Game Canvas Not Found");
        return;
    }
    const body = document.body;

    const bodyResizeObserver = new ResizeObserver((entries) => {
        if (!entries[0]) return;
        const { width, height } = entries[0].contentRect;
        game.height = height;
        game.width = width;
        log.log(
            "ResizeObserver",
            "Game resized:",
            `${game.width}x${game.height}`
        );
    });

    const canvasAttributeObserver = new MutationObserver(() => {
        bodyResizeObserver.observe(body);
        log.log(
            "CanvasAttributeObserver",
            "Game initialized. ResizeObserver Started."
        );
        canvasAttributeObserver.disconnect();
        log.log("CanvasAttributeObserver", "CanvasAttributeObserver Stopped.");
    });

    canvasAttributeObserver.observe(game, { attributes: true });
    log.log("CanvasAttributeObserver", "CanvasAttributeObserver Started.");
};
