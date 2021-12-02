
// ==UserScript==
// @name        LAOPLUS
// @namespace   net.mizle
// @version     0.1.0
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
// @require     https://unpkg.com/chroma-js@2.1.2/chroma.js
// @require     https://unpkg.com/dayjs@1.10.7/dayjs.min.js
// @require     https://unpkg.com/dayjs@1.10.7/plugin/relativeTime.js
// @require     https://unpkg.com/dayjs@1.10.7/plugin/isSameOrBefore.js
// @require     https://unpkg.com/dayjs@1.10.7/plugin/duration.js
// @resource    TacticsManualIcon https://lo.swaytwig.com/assets/icon.png
// @grant       GM_addStyle
// @grant       GM_getResourceURL
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
                interests: {
                    pcdrop: true,
                    exploration: true,
                },
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

    const cn$3 = classNames;
    const ErrorMessage = ({ children, className }) => {
        return (React.createElement("span", { className: cn$3("text-red-600 text-xs", className) }, children));
    };

    // TODO: テストを書く
    /**
     * StageKeyをプレイヤーが慣れてる表記に変換する
     * @param StageKey Ch01Ev9Stage01Ex
     * @returns Ev1-1Ex
     */
    const humanFriendlyStageKey = (StageKey) => {
        const regex = /(Ch(?<chapter>\d{2}))(Ev(?<event>\d+))?(Stage(?<stage>\d+))((?<Ex>Ex)|(?<side>.))?/;
        const exec = regex.exec(StageKey);
        if (exec && exec.groups) {
            const { chapter: c, event = "", stage: s, side = "" } = exec.groups;
            const isEvent = event !== "";
            const chapter = Number(c);
            const stage = Number(s);
            return `${isEvent ? "Ev" : ""}${chapter}-${stage}${side}`;
        }
        // うまくパースできなかったらそのまま返す
        return StageKey;
    };

    const cn$2 = classNames;
    const ExplorationList = () => {
        const exploration = unsafeWindow.LAOPLUS.exploration.sort((a, b) => a.EndTime - b.EndTime);
        const list = exploration.map((exp) => {
            const endDate = dayjs(exp.EndTime * 1000);
            const duration = dayjs.duration(endDate.diff(dayjs()));
            const isFinished = endDate.isSameOrBefore(dayjs());
            return (React.createElement("div", { key: exp.StageKeyString, className: cn$2("flex gap-3 items-center px-2 py-4 text-gray-800 bg-white rounded-md shadow-md md:px-6 transition-spacing", { "animate-bounce": isFinished }) },
                React.createElement("span", { className: "text-3xl font-bold" }, exp.SquadIndex),
                React.createElement("div", { className: "flex flex-col" },
                    React.createElement("span", { className: "text-sm" }, humanFriendlyStageKey(exp.StageKeyString)),
                    React.createElement("span", { className: "font-mono" }, isFinished ? "00:00:00" : duration.format("HH:mm:ss")))));
        });
        // コンポーネントを毎秒更新する
        const [, setSeconds] = React.useState(0);
        React.useEffect(() => {
            const interval = window.setInterval(() => {
                setSeconds((seconds) => seconds + 1);
            }, 1000);
            return () => {
                clearInterval(interval);
            };
        }, []);
        return React.createElement(React.Fragment, null, list);
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
                                        pattern: /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\//,
                                    }) })),
                            errors.features?.discordNotification
                                ?.webhookURL && (React.createElement(ErrorMessage, { className: "flex gap-1" },
                                React.createElement("i", { className: "bi bi-exclamation-triangle" }),
                                errors.features?.discordNotification
                                    ?.webhookURL?.type === "required" &&
                                    "Discord通知を利用するにはWebhook URLが必要です",
                                errors.features?.discordNotification
                                    ?.webhookURL?.type === "pattern" &&
                                    "有効なDiscordのWebhook URLではありません")),
                            React.createElement("label", { className: "flex gap-2" },
                                React.createElement("span", { className: "flex-shrink-0" }, "\u901A\u77E5\u9805\u76EE:"),
                                React.createElement("div", { className: "flex flex-col gap-1" },
                                    React.createElement("label", { className: "flex gap-2 items-center" },
                                        React.createElement("input", { type: "checkbox", className: "w-4 h-4", disabled: !watch("features.discordNotification.enabled"), ...register("features.discordNotification.interests.pcdrop") }),
                                        React.createElement("span", { className: "flex gap-1 items-center" },
                                            "\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u30C9\u30ED\u30C3\u30D7",
                                            React.createElement("span", { className: "text-gray-600 text-xs" }, "\u73FE\u5728\u306FSS,S\u306E\u307F"))),
                                    React.createElement("label", { className: "flex gap-2 items-center" },
                                        React.createElement("input", { type: "checkbox", className: "w-4 h-4", disabled: !watch("features.discordNotification.enabled"), ...register("features.discordNotification.interests.exploration") }),
                                        React.createElement("span", null, "\u63A2\u7D22\u5B8C\u4E86")))))),
                    React.createElement("div", { className: "my-2 border-t" }),
                    React.createElement("div", { className: "flex flex-col gap-2 items-center" },
                        React.createElement("span", { className: "text-gray-600 text-sm" },
                            GM_info.script.name,
                            "\u306F\u4EE5\u4E0B\u306E\u30B5\u30FC\u30D3\u30B9\u304C\u63D0\u4F9B\u3059\u308B\u30B2\u30FC\u30E0\u30C7\u30FC\u30BF\u3092\u4F7F\u7528\u3057\u3066\u3044\u307E\u3059"),
                        React.createElement("a", { title: "\u6EC5\u4EA1\u524D\u306E\u6226\u8853\u6559\u672C", href: "https://lo.swaytwig.com/", target: "_blank", rel: "noopener", className: "flex gap-1 items-center p-2 px-3 bg-white rounded shadow" },
                            React.createElement("img", { src: GM_getResourceURL("TacticsManualIcon"), className: "w-12" }),
                            React.createElement("div", { className: "flex flex-col" },
                                React.createElement("span", { className: "text-lg font-semibold" }, "\u6EC5\u4EA1\u524D\u306E\u6226\u8853\u6559\u672C"),
                                React.createElement("span", { className: "text-gray-400 text-sm" }, "by WolfgangKurz")))),
                    React.createElement("div", { className: "my-2 border-t" }),
                    React.createElement("footer", { className: "flex items-center justify-between" },
                        React.createElement("div", { className: "flex gap-3 text-gray-500 text-sm" },
                            React.createElement("a", { href: "https://github.com/eai04191/laoplus", target: "_blank", rel: "noopener", className: "flex gap-1" },
                                React.createElement("i", { className: "bi bi-github" }),
                                "GitHub"),
                            React.createElement("a", { href: "https://discord.gg/EGWqTuhjrE", target: "_blank", rel: "noopener", className: "flex gap-1" },
                                React.createElement("i", { className: "bi bi-discord" }),
                                "Discord")),
                        React.createElement("div", { className: "mx-2" }),
                        React.createElement(SubmitButton, null, "\u4FDD\u5B58"))),
                React.createElement("div", { className: "absolute bottom-0 inset-x-0 flex items-center mx-auto w-4/5 h-8 bg-gray-200 bg-opacity-80 rounded-t-lg shadow-lg" },
                    React.createElement("div", { className: "px-2" },
                        React.createElement("span", { className: "text-xl uppercase" }, "Exploration")),
                    React.createElement("div", { className: "top-[-2.5rem] absolute flex gap-2 justify-center mx-auto w-full md:gap-6" },
                        React.createElement(ExplorationList, null))))));
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

    const rankColor = {
        SS: chroma.rgb(255, 223, 33),
        S: chroma.rgb(255, 166, 3),
        A: chroma.rgb(5, 176, 228),
        B: chroma.rgb(30, 160, 13),
    };

    const sendToDiscordWebhook = (body) => {
        if (!unsafeWindow.LAOPLUS.config.config.features.discordNotification.enabled) {
            log("Discord Notification", "設定が無効のため送信しませんでした", body);
            return;
        }
        fetch(unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    };
    /**
     * 16進数のカラーコードを受け取って10進数のカラーコードを返す
     */
    const colorHexToInteger = (hex) => {
        return parseInt(hex.replace("#", ""), 16);
    };

    /**
     * 与えられた日時までの時間と分のみの相対時間に変換する
     * @returns x時間x分
     */
    const toRelativeTime = (target) => {
        const now = dayjs();
        const hour = target.diff(now, "hour");
        const minute = target.diff(now.add(hour, "hour"), "minute");
        if (hour === 0) {
            return `${minute}分`;
        }
        return `${hour}時間${minute}分`;
    };
    /**
     * 1桁の数字を囲み絵文字に変換する
     * @param SquadIndex 1 | 2| 3 | 4
     * @returns 1️⃣ | 2️⃣ | 3️⃣ | 4️⃣
     */
    const squadIndexToEmoji = (SquadIndex) => {
        return SquadIndex + "\uFE0F\u20E3";
    };
    const sendNotification = () => {
        const embedFields = unsafeWindow.LAOPLUS.exploration
            .sort((a, b) => a.EndTime - b.EndTime)
            .map((ex) => {
            const endDate = dayjs(ex.EndTime * 1000);
            const isFinished = endDate.isSameOrBefore(dayjs());
            const value = isFinished
                ? ":white_check_mark: **完了**"
                : `<t:${ex.EndTime}:t> ${toRelativeTime(endDate)}後`;
            // <t:TIMESTAMP> Discord Timestamp Format
            // https://discord.com/developers/docs/reference#message-formatting
            return {
                name: [
                    squadIndexToEmoji(ex.SquadIndex),
                    humanFriendlyStageKey(ex.StageKeyString),
                ].join(" "),
                value: value,
                inline: !isFinished,
            };
        });
        const body = {
            embeds: [
                {
                    title: "探索完了",
                    fields: embedFields,
                },
            ],
        };
        if (unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .interests.exploration) {
            sendToDiscordWebhook(body);
        }
        else {
            log("Exploration Timer", "設定が無効のため、Discord通知を送信しませんでした", body);
        }
    };
    const explorationInginfo = ({ ExplorationList, }) => {
        // 既存のタイマーをすべて破棄する
        unsafeWindow.LAOPLUS.exploration.forEach((ex) => {
            if (ex.timeoutID) {
                window.clearTimeout(ex.timeoutID);
            }
        });
        unsafeWindow.LAOPLUS.exploration = ExplorationList.map((ex) => {
            const msToFinish = ex.EndTime * 1000 - Date.now();
            if (msToFinish > 0) {
                const timeoutID = window.setTimeout(sendNotification, msToFinish);
                return { ...ex, timeoutID };
            }
            else {
                return ex;
            }
        });
        log("Exploration Timer", "Restore Exploration Timers", unsafeWindow.LAOPLUS.exploration);
    };
    const explorationEnter = ({ EnterInfo, }) => {
        const msToFinish = EnterInfo.EndTime * 1000 - Date.now();
        const timeoutID = window.setTimeout(sendNotification, msToFinish);
        unsafeWindow.LAOPLUS.exploration.push({ ...EnterInfo, timeoutID });
        log("Exploration Timer", "Add Exploration Timer", unsafeWindow.LAOPLUS.exploration);
    };
    const explorationReward = ({ SquadIndex, }) => {
        unsafeWindow.LAOPLUS.exploration = unsafeWindow.LAOPLUS.exploration.filter((ex) => ex.SquadIndex !== SquadIndex);
        log("Exploration Timer", "Remove Exploration Timer", unsafeWindow.LAOPLUS.exploration);
    };
    const explorationCancel = ({ SquadIndex, }) => {
        const targetExploration = unsafeWindow.LAOPLUS.exploration.find((ex) => ex.SquadIndex === SquadIndex);
        if (targetExploration?.timeoutID) {
            window.clearTimeout(targetExploration.timeoutID);
        }
        unsafeWindow.LAOPLUS.exploration = unsafeWindow.LAOPLUS.exploration.filter((ex) => ex.SquadIndex !== SquadIndex);
        log("Exploration Timer", "Remove Exploration", unsafeWindow.LAOPLUS.exploration);
    };

    const gradeToRank = (grade) => {
        switch (grade) {
            default:
            case 1:
                return "";
            case 2:
                return "B";
            case 3:
                return "A";
            case 4:
                return "S";
            case 5:
                return "SS";
        }
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
                const embeds = res.CreatePCInfos.map((c) => {
                    // ランクB, Aを無視
                    if (c.Grade === 2 || c.Grade === 3)
                        return;
                    const id = c.Index.replace(/^Char_/, "").replace(/_N$/, "");
                    const name = unsafeWindow.LAOPLUS.tacticsManual.locale[`UNIT_${id}`];
                    const rank = gradeToRank(c.Grade);
                    // クラゲ
                    if (id.startsWith("Core"))
                        return;
                    // 強化モジュール
                    if (id.startsWith("Module"))
                        return;
                    return {
                        title: name || id,
                        color: rank !== ""
                            ? colorHexToInteger(rankColor[rank].hex())
                            : undefined,
                        url: `https://lo.swaytwig.com/units/${id}`,
                        thumbnail: {
                            url: `https://lo.swaytwig.com/assets/webp/tbar/TbarIcon_${id}_N.webp`,
                        },
                    };
                }).filter(Boolean);
                const body = { embeds: embeds };
                if (embeds.length !== 0 &&
                    unsafeWindow.LAOPLUS.config.config.features.discordNotification
                        .interests.pcdrop) {
                    sendToDiscordWebhook(body);
                }
                else {
                    log("Drop Notification", "送信する項目がないか、設定が無効のため、Discord通知を送信しませんでした", body);
                }
            }
            else if (url.pathname === "/exploration_inginfo") {
                explorationInginfo(res);
            }
            else if (url.pathname === "/exploration_enter") {
                explorationEnter(res);
            }
            else if (url.pathname === "/exploration_reward") {
                explorationReward(res);
            }
            else if (url.pathname === "/exploration_cancel") {
                explorationCancel(res);
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

    // tailwindcssの拡張機能で補完を使うために、このファイルを編集する際は tailwind.config.js も同じように編集すること
    const tailwindConfig = {
        darkMode: "media",
        theme: {
            extend: {
                transitionProperty: {
                    spacing: "margin, padding",
                },
            },
        },
        variants: {
            extend: {},
        },
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
            exploration: [],
        };
        // @ts-ignore
        tailwind.config = tailwindConfig;
        dayjs.extend(dayjs_plugin_relativeTime);
        dayjs.extend(dayjs_plugin_isSameOrBefore);
        dayjs.extend(dayjs_plugin_duration);
        initUi();
        initInterceptor();
        initResizeObserver();
        initTacticsManual();
    })();

})();
