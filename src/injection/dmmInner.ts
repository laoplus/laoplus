import { log } from "../utils/log";

export const initDMMInnerPage = () => {
    // UA偽装
    if (!navigator.userAgent.includes("Chrome")) {
        const originalUA = navigator.userAgent;
        Object.defineProperty(navigator, "userAgent", {
            value: `Chrome/99.99.99.99 (Spoofed by LAOPLUS) (${originalUA})`,
            configurable: false,
        });
        log.log(
            "Injection",
            "DMM Inner Page",
            "UA spoofed",
            navigator.userAgent
        );
    }

    const frame = document.querySelector<HTMLIFrameElement>("#my_frame");
    if (frame === null) return;

    frame.removeAttribute("height");
    frame.style.height = "100vh";

    log.log("Injection", "DMM Inner Page", "iframe Style injected.");
};
