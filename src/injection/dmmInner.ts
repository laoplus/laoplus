import { log } from "../utils/log";

export const initDMMInnerPage = () => {
    const frame = document.querySelector<HTMLIFrameElement>("#my_frame");
    if (frame === null) return;

    frame.removeAttribute("height");
    frame.style.height = "100vh";

    log.log("Injection", "DMM Inner Page", "iframe Style injected.");
};
