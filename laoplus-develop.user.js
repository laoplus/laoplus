
// ==UserScript==
// @name        LAOPLUS
// @namespace   net.mizle
// @version     0.0.1
// @author      Eai <eai@mizle.net>
// @description ブラウザ版ラストオリジンのプレイを支援する Userscript
// @homepageURL https://github.com/eai04191/laoplus
// @supportURL  https://github.com/eai04191/laoplus/issues
// @run-at      document-idle
// @match       https://pc-play.games.dmm.co.jp/play/lastorigin_r/*
// @match       https://pc-play.games.dmm.com/play/lastorigin/*
// @match       https://osapi.dmm.com/gadgets/ifr?synd=dmm&container=dmm&owner=*&viewer=*&aid=616121&*
// @match       https://osapi.dmm.com/gadgets/ifr?synd=dmm&container=dmm&owner=*&viewer=*&aid=699297&*
// @match       https://adult-client.last-origin.com/
// @match       https://normal-client.last-origin.com/
// @require     https://cdn-tailwindcss.vercel.app
// @require     https://unpkg.com/lodash@4.17.21/lodash.js
// @require     https://unpkg.com/classnames@2.3.1/index.js
// @require     https://unpkg.com/react@17.0.2/umd/react.production.min.js
// @require     https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js
// @require     https://unpkg.com/react-modal@3.14.4/dist/react-modal.js
// @require     https://unpkg.com/@headlessui/react@1.4.2/dist/headlessui.umd.development.js
// @require     https://unpkg.com/react-hook-form@7.20.4/dist/index.umd.js
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_info
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    const log = (name, ...args) => {
        // eslint-disable-next-line no-console
        console.log(`%cLAOPLUS :: ${name}`, "padding-right:.6rem;padding-left:.6rem;background:gray;color:white;border-radius:.25rem", ...args);
    };

    const initDMMGamePage = () => {
        // favicon書き換え
        document
            ?.querySelector(`link[rel="icon"]`)
            ?.setAttribute("href", "https://www.last-origin.com/img/apple-touch-icon.png");
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
    };

    const initDMMInnerPage = () => {
        const frame = document.querySelector("#my_frame");
        if (frame === null)
            return;
        frame.removeAttribute("height");
        frame.style.height = "100vh";
        log("DMM Inner Page", "iframe Style injected.");
    };

    const initGamePage = () => {
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
        log("Game Page", "Style injected.");
    };

    const injection = () => {
        const url = new URL(document.URL);
        if (["pc-play.games.dmm.com", "pc-play.games.dmm.co.jp"].includes(url.host)) {
            initDMMGamePage();
            return false;
        }
        if (url.host === "osapi.dmm.com") {
            initDMMInnerPage();
            return false;
        }
        initGamePage();
        return true;
    };

    const defaultConfig = {
        features: {
            discordNotification: {
                enabled: false,
                webhookURL: "",
            },
        },
    };
    class Config {
        config;
        constructor() {
            this.config = GM_getValue("config", defaultConfig);
        }
        set(value) {
            _.merge(this.config, value);
            GM_setValue("config", this.config);
            log("Config", "Config Updated", this.config);
        }
    }

    const Icon = () => {
        return (React.createElement("link", { rel: "stylesheet", href: "https://unpkg.com/bootstrap-icons@1.7.1/font/bootstrap-icons.css" }));
    };

    const cn$2 = classNames;
    const ErrorMessage = ({ children, className }) => {
        return (React.createElement("span", { className: cn$2("text-red-600 text-xs", className) }, children));
    };

    const HelpIcon = ({ href }) => {
        return (React.createElement("span", null,
            React.createElement("a", { href: href, target: "_blank", rel: "noreferrer", title: "\u30D8\u30EB\u30D7" },
                React.createElement("i", { className: "bi bi-question-circle" }))));
    };

    const cn$1 = classNames;
    /**
     * ラスオリのボタンっぽいボタン
     * variantのプレビュー: https://user-images.githubusercontent.com/3516343/143912908-65956c55-b60d-4028-82d2-143b08414384.png
     */
    const SubmitButton = ({ children, variant = 1, className }) => {
        const clipStyle = (() => {
            switch (variant) {
                default:
                case 1:
                    return {
                        "--corner-size": "14px",
                        clipPath: `polygon(
                            calc(100% - var(--corner-size)) 0%,
                            100% var(--corner-size),
                            100% 100%,
                            var(--corner-size) 100%,
                            0% calc(100% - var(--corner-size)),
                            0 0
                        )`,
                    };
                case 2:
                    return {
                        "--gap-length": "8px",
                        "--outer": "calc(100% - calc(var(--gap-length) * 3))",
                        "--inner": "calc(100% - calc(var(--gap-length) * 2))",
                        "--inner2": "calc(100% - var(--gap-length))",
                        clipPath: `polygon(
                        0 0,
                        100% 0,

                        100% var(--outer),
                        var(--outer) 100%,

                        var(--inner) 100%,
                        100% var(--inner),

                        100% var(--inner2),
                        var(--inner2) 100%,

                        100% 100%,
                        0 100%
                    )`,
                    };
            }
        })();
        return (React.createElement("div", { className: "drop-shadow" },
            React.createElement("button", { type: "submit", className: cn$1("bg-amber-300 min-w-[6rem] p-3 font-bold leading-none", { rounded: variant === 1 }, className), style: clipStyle }, children)));
    };

    const cn = classNames;
    ReactModal.defaultStyles = {};
    const element = document.createElement("style");
    element.setAttribute("type", "text/tailwindcss");
    element.innerText = `
#laoplus-modal button {
    @apply hover:brightness-105;
}
.ReactModal__Overlay {
    @apply opacity-0 transition-opacity duration-150;
}
.ReactModal__Overlay--after-open {
    @apply opacity-100;
}
.ReactModal__Overlay--before-close {
    @apply opacity-0;
}
`;
    document.head.appendChild(element);
    const ConfigModal = () => {
        const [isOpen, setIsOpen] = React.useState(false);
        const { register, handleSubmit, watch, formState: { errors }, } = ReactHookForm.useForm({
            defaultValues: unsafeWindow.LAOPLUS.config.config,
        });
        const onSubmit = (config) => {
            log("Config Modal", "Config submitted", config);
            unsafeWindow.LAOPLUS.config.set(config);
            setIsOpen(false);
        };
        if (!_.isEmpty(errors)) {
            log("Config Modal", "Error!", errors);
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("button", { onClick: () => {
                    setIsOpen(true);
                }, className: "absolute bottom-0 left-0" }, "\u2795"),
            React.createElement(ReactModal, { appElement: 
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                document.querySelector("#laoplus-root"), shouldCloseOnOverlayClick: false, 
                // .ReactModal__Overlayに指定してるduration
                closeTimeoutMS: 150, isOpen: isOpen, overlayClassName: "fixed inset-0 backdrop-blur backdrop-saturate-[0.75] flex items-center justify-center", className: "min-w-[50%] max-w-[90%] max-h-[90%] p-4 bg-gray-50 rounded shadow overflow-auto", id: "laoplus-modal" },
                React.createElement("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-2" },
                    React.createElement("header", { className: "flex items-center place-content-between" },
                        React.createElement("div", { className: "flex gap-2 items-end" },
                            React.createElement("h2", { className: "text-xl font-semibold" }, GM_info.script.name),
                            React.createElement("span", { className: "pb-0.5 text-gray-500 text-sm" }, GM_info.script.version))),
                    React.createElement("div", { className: "my-2 border-t" }),
                    React.createElement("main", { className: "flex flex-col gap-1 ml-6" },
                        React.createElement("div", { className: "flex flex-col gap-1" },
                            React.createElement("label", { className: "flex gap-2 items-center" },
                                React.createElement("input", { type: "checkbox", id: "laoplus-discord-notification", className: "-ml-6 w-4 h-4", ...register("features.discordNotification.enabled") }),
                                React.createElement("span", null, "Discord\u901A\u77E5"),
                                React.createElement(HelpIcon, { href: "https://github.com/eai04191/laoplus/wiki/features-discordNotification" }))),
                        React.createElement("div", { className: cn("flex flex-col gap-1", {
                                "opacity-50": !watch("features.discordNotification.enabled"),
                            }) },
                            React.createElement("label", { className: "flex gap-2" },
                                React.createElement("span", { className: "flex-shrink-0" }, "Discord Webhook URL:"),
                                React.createElement("input", { type: "text", disabled: !watch("features.discordNotification.enabled"), className: "min-w-[1rem] flex-1 px-1 border border-gray-500 rounded", ...register("features.discordNotification.webhookURL", {
                                        required: watch("features.discordNotification.enabled"),
                                        pattern: /^https:\/\/discord\.com\/api\/webhooks\//,
                                    }) })),
                            errors.features?.discordNotification
                                ?.webhookURL && (React.createElement(ErrorMessage, { className: "flex gap-1" },
                                React.createElement("i", { className: "bi bi-exclamation-triangle" }),
                                errors.features?.discordNotification
                                    ?.webhookURL?.type === "required" &&
                                    "Discord通知を利用するにはWebhook URLが必要です",
                                errors.features?.discordNotification
                                    ?.webhookURL?.type === "pattern" &&
                                    "有効なDiscordのWebhook URLではありません")))),
                    React.createElement("div", { className: "my-2 border-t" }),
                    React.createElement("footer", { className: "flex items-center justify-between" },
                        React.createElement("div", { className: "flex gap-3 text-gray-500 text-sm" },
                            React.createElement("a", { href: "https://github.com/eai04191/laoplus", target: "_blank", rel: "noreferrer", className: "flex gap-1" },
                                React.createElement("i", { className: "bi bi-github" }),
                                "GitHub"),
                            React.createElement("a", { href: "https://discord.gg/EGWqTuhjrE", target: "_blank", rel: "noreferrer", className: "flex gap-1" },
                                React.createElement("i", { className: "bi bi-discord" }),
                                "Discord")),
                        React.createElement("div", { className: "mx-2" }),
                        React.createElement(SubmitButton, null, "\u4FDD\u5B58"))))));
    };

    const App = () => {
        return (React.createElement(React.Fragment, null,
            React.createElement(Icon, null),
            React.createElement(ConfigModal, null)));
    };
    const initUi = () => {
        const root = document.createElement("div");
        root.id = "laoplus-root";
        ReactDOM.render(React.createElement(App, null), root);
        document.body.appendChild(root);
    };

    const sendToDiscordWebhook = (body) => {
        fetch(unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    };

    const interceptor = (xhr) => {
        if (!xhr.responseURL)
            return;
        const url = new URL(xhr.responseURL);
        if (url.host !== "gate.last-origin.com") {
            return;
        }
        const responseText = new TextDecoder("utf-8").decode(xhr.response);
        // JSONが不正なことがあるのでtry-catch
        try {
            const res = JSON.parse(responseText);
            log("Interceptor", url.pathname, res);
            // TODO: このような処理をここに書くのではなく、各種機能がここを購読しに来るように分離したい
            if (url.pathname === "/wave_clear") {
                if (unsafeWindow.LAOPLUS.config.config.features.discordNotification
                    .enabled) {
                    const embeds = res.CreatePCInfos.map((c) => {
                        // ランクB, Aを無視
                        if (c.Grade === 2 || c.Grade === 3)
                            return;
                        const id = c.Index.replace(/^Char_/, "").replace(/_N$/, "");
                        // クラゲ
                        if (id.startsWith("Core"))
                            return;
                        // 強化モジュール
                        if (id.startsWith("Module"))
                            return;
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
        }
        catch (error) {
            log("Interceptor", "Error", error);
        }
    };
    const initInterceptor = () => {
        (function (open) {
            XMLHttpRequest.prototype.open = function () {
                this.addEventListener("readystatechange", () => {
                    // 完了した通信のみ
                    if (this.readyState === 4) {
                        interceptor(this);
                    }
                }, false);
                // @ts-ignore
                // eslint-disable-next-line prefer-rest-params
                open.apply(this, arguments);
            };
        })(XMLHttpRequest.prototype.open);
    };

    const initResizeObserver = () => {
        const game = document.querySelector("canvas");
        if (!game)
            return;
        const body = document.body;
        const bodyResizeObserver = new ResizeObserver((entries) => {
            if (!entries[0])
                return;
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
    };

    const initTacticsManual = () => {
        GM_xmlhttpRequest({
            url: "https://lo.swaytwig.com/json/locale/JP.json",
            onload: ({ responseText }) => {
                try {
                    const parsedJson = JSON.parse(responseText);
                    log("TacticsManual", "Locale", "Loaded");
                    unsafeWindow.LAOPLUS.tacticsManual.locale = parsedJson;
                }
                catch (error) {
                    log("Tactics Manual", "Locale", "Error", error);
                }
            },
        });
        GM_xmlhttpRequest({
            url: "https://lo.swaytwig.com/json/korea/filterable.unit.json",
            onload: ({ responseText }) => {
                try {
                    const parsedJson = JSON.parse(responseText);
                    log("TacticsManual", "Unit", "Loaded");
                    unsafeWindow.LAOPLUS.tacticsManual.unit = parsedJson;
                }
                catch (error) {
                    log("Tactics Manual", "Unit", "Error", error);
                }
            },
        });
    };

    // 'return' outside of functionでビルドがコケるのを防ぐ即時実行関数
    (function () {
        const isGameWindow = injection();
        if (!isGameWindow)
            return;
        const config = new Config();
        // LAOPLUSオブジェクトを露出させる
        unsafeWindow.LAOPLUS = {
            config: config,
            tacticsManual: {
                locale: {},
                unit: [],
            },
        };
        initUi();
        initInterceptor();
        initResizeObserver();
        initTacticsManual();
    })();

})();
