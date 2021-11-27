// ==UserScript==
// @namespace   net.mizle
// @name        LAOPLUS
// @version     0.0.1
// @match       https://pc-play.games.dmm.co.jp/play/lastorigin_r/*
// @match       https://pc-play.games.dmm.com/play/lastorigin/*
// @match       https://osapi.dmm.com/gadgets/ifr?synd=dmm&container=dmm&owner=*&viewer=*&aid=616121&*
// @match       https://osapi.dmm.com/gadgets/ifr?synd=dmm&container=dmm&owner=*&viewer=*&aid=699297&*
// @match       https://adult-client.last-origin.com/
// @match       https://normal-client.last-origin.com/
// @grant       GM_info
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @author      Eai
// @run-at      document-idle
// @require     https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require     https://unpkg.com/micromodal/dist/micromodal.min.js
// @require     https://cdn-tailwindcss.vercel.app
// @homepageURL https://github.com/eai04191/laoplus
// @supportURL  https://github.com/eai04191/laoplus/issues
// ==/UserScript==

const log = (name, ...args) => {
    // eslint-disable-next-line no-console
    console.log(
        `%cLAOPLUS :: ${name}`,
        "padding-right:.6rem;padding-left:.6rem;background:gray;color:white;border-radius:.25rem",
        ...args
    );
};

const url = new URL(document.URL);
if (['pc-play.games.dmm.com', 'pc-play.games.dmm.co.jp'].includes(url.host)) {
    document
        .querySelector(`link[rel="icon"]`)
        .setAttribute(
            "href",
            "https://www.last-origin.com/img/apple-touch-icon.png"
        );
    // 適当
    GM_addStyle(`
        body,
        #main-ntg {
            margin: 0;
            padding: 0;
            line-height: 0;
            overflow: hidden;
        }
        .dmm-ntgnavi,
        .area-naviapp,
        #foot {
            display: none;
        }
        #area-game {
            float:left !important;
        }
        #game_frame {
            height: 100vh !important;
            width: 100vw !important;
    }`);
    log("DMM Page", "Style injected.");

    return;
}

if (url.host === "osapi.dmm.com") {
    document.querySelector("#my_frame").removeAttribute("height");
    document.querySelector("#my_frame").style.height = "100vh";
    log("DMM Inner Page", "iframe Style injected.");
    return;
}

GM_addStyle(`
    html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        line-height: 0;
    }
    .webgl-content {
        position: unset;
        -webkit-transform: unset;
        transform: unset;
    }`);

GM_addStyle(`
    .laoplus-modal {
        display:none;
    }
    .laoplus-modal.is-open {
        display: block;
    }
    button[data-micromodal-close]:before {
        content: "\\2715";
    }`);

const modalHtml = `
    <div id="laoplus-modal" aria-hidden="true" class="laoplus-modal">
        <div tabindex="-1" class="fixed inset-0 backdrop-blur backdrop-saturate-[0.75] flex items-center justify-center">
            <div role="dialog" aria-modal="true" aria-labelledby="laoplus-modal-title" class="bg-gray-50 p-4 rounded shadow max-w-[90%] max-h-[90%] overflow-auto flex flex-col gap-2">
                <header class="flex place-content-between items-center">
                    <div class="flex gap-2 items-end">
                        <h2 id="laoplus-modal-title" class="font-semibold text-xl">LAOPLUS</h2>
                        <span class="text-sm text-gray-500 pb-0.5">${GM_info.script.version}</span>
                    </div>
                    <button aria-label="Close modal" data-micromodal-close></button>
                </header>
                <div class="my-2 border-t"></div>
                <div id="laoplus-modal-content">
                    <div class="flex flex-col ml-6">
                        <label class="flex gap-2 items-center">
                            <input type="checkbox" id="laoplus-discord-notification" class="w-4 h-4 -ml-6">
                            <span>Discord通知</span>
                        </label>
                        <label class="flex gap-2">
                            <span>Discord Webhook URL:</span>
                            <input type="text" id="laoplus-discord-webhook-url" class="w-48 border-gray-500">
                        </label>
                    </div>
                </div>
                <div class="my-2 border-t"></div>
                <footer>
                    <a href="${GM_info.script.homepageURL}" target="_blank" class="text-gray-500 text-sm">GitHub</a>
                </footer>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML("beforeend", modalHtml);
log("Game Page", "Style & Modal injected.");

const game = document.querySelector("canvas");
const body = document.body;

const addLaoplusButton = () => {
    const html = `<button class="laoplus-button absolute bottom-0 left-0 transition" data-micromodal-trigger="laoplus-modal">➕</button>`;
    document.body.insertAdjacentHTML("beforeend", html);
};
addLaoplusButton();

const defaultConfig = {
    features: {
        discordNotification: {
            enabled: false,
            webhookURL: "",
        },
    },
};
const config = GM_getValue("config", defaultConfig);
log("Config", "Config Loaded", config);

MicroModal.init({
    onShow: (modal) => {
        log("Modal", "Opened", modal);
        log("Modal", "Current Config", config);

        modal.querySelector("#laoplus-discord-notification").checked =
            config.features.discordNotification.enabled;
        modal.querySelector("#laoplus-discord-webhook-url").value =
            config.features.discordNotification.webhookURL;

        log("Modal", "Config Set");
    },
    onClose: (modal) => {
        log("Modal", "Closed", modal);
        log("Modal", "Current Config", config);

        _.set(
            config,
            "features.discordNotification.enabled",
            modal.querySelector("#laoplus-discord-notification").checked
        );
        _.set(
            config,
            "features.discordNotification.webhookURL",
            modal.querySelector("#laoplus-discord-webhook-url").value
        );

        GM_setValue("config", config);
        log("Modal", "Config Saved", config);
    },
});

if (!game) {
    log("Game canvas is not found.");
    return;
}
log("Game Page", "Game canvas found.", game);

// 自動リサイズ関連
const bodyResizeObserver = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    game.height = height;
    game.width = width;
    log("ResizeObserver", "Game resized:", `${game.width}x${game.height}`);
});
const canvasAttributeObserver = new MutationObserver(() => {
    bodyResizeObserver.observe(body);
    log("CanvasAttributeObserver", "Game initialized. ResizeObserver Started.");
    canvasAttributeObserver.disconnect();
    log("CanvasAttributeObserver", "CanvasAttributeObserver Stopped.");
});
canvasAttributeObserver.observe(game, { attributes: true });
log("CanvasAttributeObserver", "CanvasAttributeObserver Started.");

const sendToDiscordWebhook = (body) => {
    log("DiscordNotification", "body", body);
    fetch(config.features.discordNotification.webhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
};

const interceptor = (xhr) => {
    if (!xhr.responseURL) return;
    const url = new URL(xhr.responseURL);
    if (url.host !== "gate.last-origin.com") {
        return;
    }
    const responseText = new TextDecoder("utf-8").decode(xhr.response);
    const res = JSON.parse(responseText);
    log("Interceptor", url.pathname, res);

    if (url.pathname === "/wave_clear") {
        if (config.features.discordNotification.enabled) {
            const embeds = res.CreatePCInfos.map((c) => {
                if (c.Grade === 2 || c.Grade === 3) return;
                const id = c.Index.replace(/^Char_/, "").replace(/_N$/, "");
                // クラゲ
                if (id.startsWith("Core")) return;
                return {
                    title: id,
                    url: `https://lo.swaytwig.com/units/${id}`,
                    thumbnail: {
                        url: `https://lo.swaytwig.com/assets/webp/tbar/TbarIcon_${id}_N.webp`,
                    },
                };
            }).filter(Boolean);
            if (embeds.length !== 0) {
                sendToDiscordWebhook({ embeds: embeds });
            }
        }
    }
};

(function (open) {
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener(
            "readystatechange",
            () => {
                // 完了した通信のみ
                if (this.readyState === 4) {
                    interceptor(this);
                }
            },
            false
        );
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);
