
// ==UserScript==
// @name        LAOPLUS-DEVELOP
// @namespace   net.mizle
// @version     1640699609-e099490c2ab94c9d5ba157a3867ddc7d68830c4a
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
// @require     https://cdn-tailwindcss.vercel.app?plugins=forms
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
// @require     https://unpkg.com/mitt@3.0.0/dist/mitt.umd.js
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

    /* eslint-disable no-console */
    const style = "padding-right:.6rem;padding-left:.6rem;background:gray;color:white;border-radius:.25rem";
    const log = {
        debug: (moduleName, ...args) => {
            console.debug(`%c🐞LAOPLUS :: ${moduleName}`, style, ..._.cloneDeep(args));
        },
        log: (moduleName, ...args) => {
            console.log(`%cLAOPLUS :: ${moduleName}`, style, ..._.cloneDeep(args));
        },
        warn: (moduleName, ...args) => {
            console.warn(`%cLAOPLUS :: ${moduleName}`, style, ..._.cloneDeep(args));
        },
        error: (moduleName, ...args) => {
            console.error(`%cLAOPLUS :: ${moduleName}`, style, ..._.cloneDeep(args));
        },
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
        log.log("Injection", "DMM Page", "Style injected.");
    };

    const initDMMInnerPage = () => {
        const frame = document.querySelector("#my_frame");
        if (frame === null)
            return;
        frame.removeAttribute("height");
        frame.style.height = "100vh";
        log.log("Injection", "DMM Inner Page", "iframe Style injected.");
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
        log.log("Injection", "Game Page", "Style injected.");
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

    /**
     * 与えられた日時までを時間と分のみの相対時間に変換する
     * @returns x時間x分
     * @returns x分
     */
    const dateToRelativeTime = (target) => {
        const now = dayjs();
        const hour = target.diff(now, "hour");
        const minute = target.diff(now.add(hour, "hour"), "minute");
        if (hour === 0) {
            return `${minute}分`;
        }
        return `${hour}時間${minute}分`;
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

    /**
     * 1桁の数字を囲み絵文字に変換する
     * @param SquadIndex 1 | 2| 3 | 4
     * @returns 1️⃣ | 2️⃣ | 3️⃣ | 4️⃣
     */
    const numberToEmoji = (number) => {
        if (String(number).length !== 1) {
            throw new Error("1桁以外の数字を処理することはできません");
        }
        return number + "\uFE0F\u20E3";
    };

    const defaultConfig = {
        features: {
            discordNotification: {
                enabled: false,
                webhookURL: "",
                interests: {
                    pcDrop: true,
                    pcRank: {
                        B: false,
                        A: false,
                        S: false,
                        SS: true,
                    },
                    itemDrop: true,
                    exploration: true,
                    autorunStop: true,
                },
            },
            wheelAmplify: {
                enabled: true,
                ratio: "10",
            },
            autorunDetection: {
                enabled: false,
                hideTimer: false,
                threshold: "5",
            },
        },
    };
    class Config {
        config;
        constructor() {
            this.config = _.merge(defaultConfig, GM_getValue("config", defaultConfig));
        }
        events = mitt();
        set(value) {
            _.merge(this.config, value);
            GM_setValue("config", this.config);
            log.log("Config", "Config Updated", this.config);
            this.events.emit("changed", this.config);
        }
    }

    const defaultStatus = {
        autorunDetection: {
            enterTimerId: null,
            latestEnterTime: null,
        },
    };
    class Status {
        status;
        constructor() {
            this.status = defaultStatus;
        }
        events = mitt();
        set(value) {
            _.merge(this.status, value);
            log.log("Status", "Status Updated", this.status);
            this.events.emit("changed", this.status);
        }
    }

    const Icon = () => {
        return (React.createElement("link", { rel: "stylesheet", href: "https://unpkg.com/bootstrap-icons@1.7.1/font/bootstrap-icons.css" }));
    };

    const cn$7 = classNames;
    const ErrorMessage = ({ children, className }) => {
        return (React.createElement("span", { className: cn$7("text-red-600 text-sm", className) }, children));
    };

    const cn$6 = classNames;
    const ExplorationList = () => {
        const exploration = unsafeWindow.LAOPLUS.exploration.sort((a, b) => a.EndTime - b.EndTime);
        const list = exploration.map((exp) => {
            const endDate = dayjs(exp.EndTime * 1000);
            const duration = dayjs.duration(endDate.diff(dayjs()));
            const isFinished = endDate.isSameOrBefore(dayjs());
            return (React.createElement("div", { key: exp.StageKeyString, className: cn$6("flex gap-3 items-center px-2 py-4 text-gray-800 bg-white rounded-md shadow-md md:px-6 transition-spacing", { "animate-bounce": isFinished }) },
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

    const cn$5 = classNames;
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
            React.createElement("button", { type: "submit", className: cn$5("bg-amber-300 min-w-[6rem] p-3 font-bold leading-none", { rounded: variant === 1 }, className), style: clipStyle }, children)));
    };

    const cn$4 = classNames;
    const FeatureSection = ({ children, hasError }) => {
        return (React.createElement("details", { className: cn$4("pl-10 rounded shadow border", hasError
                ? "border-red-600 shadow-red-300/50"
                : "border-b-transparent") }, children));
    };

    const HelpIcon = ({ href }) => {
        return (React.createElement("a", { href: href, target: "_blank", rel: "noopener", title: "\u30D8\u30EB\u30D7" },
            React.createElement("i", { className: "bi bi-question-circle" })));
    };

    const FeatureSectionSummary = ({ register, title, helpLink }) => {
        return (React.createElement("summary", { className: "relative flex justify-between pr-4 py-4 cursor-pointer select-none" },
            React.createElement("h2", { className: "inline-flex gap-2 items-center" },
                title,
                helpLink && React.createElement(HelpIcon, { href: helpLink })),
            React.createElement("div", { className: "details-chevron flex items-center" },
                React.createElement("i", { className: "bi bi-chevron-down" })),
            React.createElement("label", { className: "absolute left-0 top-0 flex items-center justify-center -ml-10 w-10 h-full cursor-pointer" },
                React.createElement("input", { type: "checkbox", className: "w-4 h-4 before:cursor-pointer", ...register }))));
    };

    const cn$3 = classNames;
    const FeatureSectionContent = ({ children, enable }) => {
        return (React.createElement("div", { className: cn$3("flex flex-col gap-2 p-4 pl-0 border-t", {
                "opacity-50": !enable,
            }) }, children));
    };

    const FooterLink = ({ href, children }) => {
        return (React.createElement("a", { href: href, className: "flex gap-1 items-center", target: "_blank", rel: "noopener" }, children));
    };

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z = "details[open] .details-chevron {\n    transform: rotate(180deg);\n}\n";
    styleInject(css_248z);

    const cn$2 = classNames;
    ReactModal.defaultStyles = {};
    const element = document.createElement("style");
    element.setAttribute("type", "text/tailwindcss");
    element.innerText = `
.ReactModal__Overlay {
    @apply opacity-0 transition-opacity duration-150;
}
.ReactModal__Overlay--after-open {
    @apply opacity-100;
}
.ReactModal__Overlay--before-close {
    @apply opacity-0;
}
i.bi {
    @apply flex items-center;
}
`;
    document.head.appendChild(element);
    const ConfigModal = () => {
        const [isOpen, setIsOpen] = React.useState(false);
        const { register, handleSubmit, watch, formState: { errors }, reset, } = ReactHookForm.useForm({
            defaultValues: unsafeWindow.LAOPLUS.config.config,
        });
        const onSubmit = (config) => {
            log.log("Config Modal", "Config submitted", config);
            unsafeWindow.LAOPLUS.config.set(config);
            setIsOpen(false);
        };
        if (!_.isEmpty(errors)) {
            log.error("Config Modal", "Error", errors);
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("button", { onClick: () => {
                    setIsOpen(true);
                }, className: "absolute bottom-0 left-0" }, "\u2795"),
            React.createElement(ReactModal, { appElement: 
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                document.querySelector("#laoplus-root"), shouldCloseOnOverlayClick: false, 
                // .ReactModal__Overlayに指定してるduration
                closeTimeoutMS: 150, isOpen: isOpen, onAfterOpen: () => {
                    // 外部からconfig.setをされてもいいようにdefaultValueを読み直す
                    reset();
                }, overlayClassName: "backdrop-saturate-[0.75] fixed inset-0 flex items-center justify-center pb-24 backdrop-blur", className: "min-w-[50%] max-w-[90%] max-h-[90%] flex bg-gray-50 rounded shadow overflow-hidden", id: "laoplus-modal" },
                React.createElement("form", { onSubmit: handleSubmit(onSubmit), className: "relative flex flex-col w-full divide-y overflow-auto" },
                    React.createElement("header", { className: "flex items-center place-content-between p-4" },
                        React.createElement("div", { className: "flex gap-2 items-end" },
                            React.createElement("h1", { className: "text-xl font-semibold" }, GM_info.script.name),
                            React.createElement("span", { className: "pb-0.5 text-gray-500 text-sm" }, GM_info.script.version))),
                    React.createElement("main", { className: "p-4" },
                        React.createElement("div", { className: "flex flex-col gap-4" },
                            React.createElement(FeatureSection, { hasError: !!errors.features?.discordNotification },
                                React.createElement(FeatureSectionSummary, { register: register("features.discordNotification.enabled"), title: "Discord\u901A\u77E5", helpLink: "https://github.com/eai04191/laoplus/wiki/features-discordNotification" }),
                                React.createElement(FeatureSectionContent, { enable: watch("features.discordNotification.enabled") },
                                    React.createElement("label", { className: "flex gap-2 items-center" },
                                        React.createElement("span", { className: "flex-shrink-0" }, "Discord Webhook URL:"),
                                        React.createElement("input", { type: "text", disabled: !watch("features.discordNotification.enabled"), className: "min-w-[1rem] flex-1 px-1 border border-gray-500 rounded", ...register("features.discordNotification.webhookURL", {
                                                required: watch("features.discordNotification.enabled"),
                                                pattern: /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\//,
                                            }) })),
                                    errors.features?.discordNotification
                                        ?.webhookURL && (React.createElement(ErrorMessage, { className: "flex gap-1" },
                                        React.createElement("i", { className: "bi bi-exclamation-triangle" }),
                                        errors.features
                                            ?.discordNotification
                                            ?.webhookURL?.type ===
                                            "required" &&
                                            "Discord通知を利用するにはWebhook URLが必要です",
                                        errors.features
                                            ?.discordNotification
                                            ?.webhookURL?.type ===
                                            "pattern" &&
                                            "有効なDiscordのWebhook URLではありません")),
                                    React.createElement("span", { className: "flex gap-2" },
                                        React.createElement("span", { className: "flex-shrink-0" }, "\u901A\u77E5\u9805\u76EE:"),
                                        React.createElement("div", { className: "flex flex-col gap-1" },
                                            React.createElement("label", { className: "flex gap-1 items-center" },
                                                React.createElement("input", { type: "checkbox", disabled: !watch("features.discordNotification.enabled"), ...register("features.discordNotification.interests.pcDrop") }),
                                                "\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u30C9\u30ED\u30C3\u30D7"),
                                            React.createElement("div", { className: cn$2("flex gap-3 pl-4 ml-1", {
                                                    "opacity-50": !watch("features.discordNotification.interests.pcDrop"),
                                                }) },
                                                React.createElement("label", { className: "flex gap-1 items-center" },
                                                    React.createElement("input", { type: "checkbox", disabled: !watch("features.discordNotification.interests.pcDrop"), ...register("features.discordNotification.interests.pcRank.B") }),
                                                    "B"),
                                                React.createElement("label", { className: "flex gap-1 items-center" },
                                                    React.createElement("input", { type: "checkbox", disabled: !watch("features.discordNotification.interests.pcDrop"), ...register("features.discordNotification.interests.pcRank.A") }),
                                                    "A"),
                                                React.createElement("label", { className: "flex gap-1 items-center" },
                                                    React.createElement("input", { type: "checkbox", disabled: !watch("features.discordNotification.interests.pcDrop"), ...register("features.discordNotification.interests.pcRank.S") }),
                                                    "S"),
                                                React.createElement("label", { className: "flex gap-1 items-center" },
                                                    React.createElement("input", { type: "checkbox", disabled: !watch("features.discordNotification.interests.pcDrop"), ...register("features.discordNotification.interests.pcRank.SS") }),
                                                    "SS")),
                                            React.createElement("label", { className: "flex gap-1 items-center" },
                                                React.createElement("input", { type: "checkbox", disabled: !watch("features.discordNotification.enabled"), ...register("features.discordNotification.interests.itemDrop") }),
                                                React.createElement("span", { className: "flex gap-1 items-center" },
                                                    "\u30A2\u30A4\u30C6\u30E0\u30C9\u30ED\u30C3\u30D7",
                                                    React.createElement("span", { className: "text-gray-600 text-xs" }, "\u73FE\u5728\u306FSS\u306E\u307F"))),
                                            React.createElement("label", { className: "flex gap-1 items-center" },
                                                React.createElement("input", { type: "checkbox", disabled: !watch("features.discordNotification.enabled"), ...register("features.discordNotification.interests.exploration") }),
                                                React.createElement("span", null, "\u63A2\u7D22\u5B8C\u4E86")),
                                            React.createElement("label", { className: "flex gap-1 items-center" },
                                                React.createElement("input", { type: "checkbox", disabled: !watch("features.discordNotification.enabled"), ...register("features.discordNotification.interests.autorunStop") }),
                                                React.createElement("span", null, "\u81EA\u52D5\u5468\u56DE\u505C\u6B62")))))),
                            React.createElement(FeatureSection, { hasError: !!errors.features?.wheelAmplify },
                                React.createElement(FeatureSectionSummary, { register: register("features.wheelAmplify.enabled"), title: "\u30DB\u30A4\u30FC\u30EB\u30B9\u30AF\u30ED\u30FC\u30EB\u5897\u5E45", helpLink: "https://github.com/eai04191/laoplus/wiki/features-wheelAmplify" }),
                                React.createElement(FeatureSectionContent, { enable: watch("features.wheelAmplify.enabled") },
                                    React.createElement("span", { className: "flex gap-1 text-gray-600 text-sm" },
                                        React.createElement("i", { className: "bi bi-info-circle" }),
                                        "\u3053\u306E\u8A2D\u5B9A\u306E\u5909\u66F4\u306F\u30DA\u30FC\u30B8\u518D\u8AAD\u307F\u8FBC\u307F\u5F8C\u306B\u53CD\u6620\u3055\u308C\u307E\u3059"),
                                    React.createElement("label", { className: "flex gap-2 items-center" },
                                        React.createElement("span", { className: "flex-shrink-0" }, "\u5897\u5E45\u500D\u7387:"),
                                        React.createElement("input", { 
                                            // numberだと値が二重になる
                                            type: "text", disabled: !watch("features.wheelAmplify.enabled"), className: "min-w-[1rem] px-1 w-16 border border-gray-500 rounded", ...register("features.wheelAmplify.ratio", {
                                                required: watch("features.wheelAmplify.enabled"),
                                                validate: (value) => 
                                                // prettier-ignore
                                                typeof Number(value) === "number"
                                                    && !Number.isNaN(Number(value)),
                                            }) })),
                                    errors.features?.wheelAmplify?.ratio && (React.createElement(ErrorMessage, { className: "flex gap-1" },
                                        React.createElement("i", { className: "bi bi-exclamation-triangle" }),
                                        errors.features?.wheelAmplify
                                            ?.ratio?.type === "required" &&
                                            "ホイールスクロール増幅を利用するには増幅倍率の指定が必要です",
                                        errors.features?.wheelAmplify
                                            ?.ratio?.type === "validate" &&
                                            "増幅倍率は数字で入力してください")))),
                            React.createElement(FeatureSection, { hasError: !!errors.features?.autorunDetection },
                                React.createElement(FeatureSectionSummary, { register: register("features.autorunDetection.enabled"), title: "\u81EA\u52D5\u5468\u56DE\u505C\u6B62\u5224\u5B9A", helpLink: "https://github.com/eai04191/laoplus/wiki/features-autorunDetection" }),
                                React.createElement(FeatureSectionContent, { enable: watch("features.autorunDetection.enabled") },
                                    React.createElement("label", { className: "flex gap-1 items-center" },
                                        React.createElement("input", { type: "checkbox", disabled: !watch("features.autorunDetection.enabled"), ...register("features.autorunDetection.hideTimer") }),
                                        "\u753B\u9762\u306B\u30BF\u30A4\u30DE\u30FC\u3092\u8868\u793A\u3057\u306A\u3044"),
                                    React.createElement("label", { className: "flex gap-2 items-center" },
                                        React.createElement("span", { className: "flex-shrink-0" }, "\u30A4\u30F3\u30BF\u30FC\u30D0\u30EB\u306E\u3057\u304D\u3044\u5024(\u5206):"),
                                        React.createElement("input", { type: "text", disabled: !watch("features.autorunDetection.enabled"), className: "min-w-[1rem] px-1 w-16 border border-gray-500 rounded", ...register("features.autorunDetection.threshold", {
                                                required: watch("features.autorunDetection.enabled"),
                                                validate: (value) => 
                                                // prettier-ignore
                                                typeof Number(value) === "number"
                                                    && !Number.isNaN(Number(value)),
                                            }) })),
                                    errors.features?.autorunDetection
                                        ?.threshold && (React.createElement(ErrorMessage, { className: "flex gap-1" },
                                        React.createElement("i", { className: "bi bi-exclamation-triangle" }),
                                        errors.features?.autorunDetection
                                            ?.threshold?.type ===
                                            "required" &&
                                            "自動周回停止判定を利用するにはしきい値の指定が必要です",
                                        errors.features?.autorunDetection
                                            ?.threshold?.type ===
                                            "validate" &&
                                            "しきい値は数字で入力してください")))))),
                    React.createElement("div", { className: "flex flex-col gap-2 items-center p-4" },
                        React.createElement("span", { className: "text-gray-600 text-sm" },
                            GM_info.script.name,
                            "\u306F\u4EE5\u4E0B\u306E\u30B5\u30FC\u30D3\u30B9\u304C\u63D0\u4F9B\u3059\u308B\u30B2\u30FC\u30E0\u30C7\u30FC\u30BF\u3092\u4F7F\u7528\u3057\u3066\u3044\u307E\u3059"),
                        React.createElement("a", { title: "\u6EC5\u4EA1\u524D\u306E\u6226\u8853\u6559\u672C", href: "https://lo.swaytwig.com/", target: "_blank", rel: "noopener", className: "flex gap-1 items-center p-2 px-3 bg-white rounded shadow" },
                            React.createElement("img", { src: GM_getResourceURL("TacticsManualIcon"), className: "w-12" }),
                            React.createElement("div", { className: "flex flex-col" },
                                React.createElement("span", { className: "text-lg font-semibold" }, "\u6EC5\u4EA1\u524D\u306E\u6226\u8853\u6559\u672C"),
                                React.createElement("span", { className: "text-gray-400 text-sm" }, "by WolfgangKurz")))),
                    React.createElement("footer", { className: "sticky bottom-0 flex items-center justify-between p-4 border-t backdrop-blur-md" },
                        React.createElement("div", { className: "flex gap-3 h-full text-gray-500 text-sm" },
                            React.createElement(FooterLink, { href: "https://github.com/eai04191/laoplus" },
                                React.createElement("i", { className: "bi bi-github" }),
                                "GitHub"),
                            React.createElement(FooterLink, { href: "https://discord.gg/EGWqTuhjrE" },
                                React.createElement("i", { className: "bi bi-discord" }),
                                "Discord")),
                        React.createElement(SubmitButton, null, "\u4FDD\u5B58"))),
                React.createElement("div", { className: "absolute bottom-0 inset-x-0 flex items-center mx-auto w-4/5 h-8 bg-gray-200 bg-opacity-80 rounded-t-lg shadow-lg" },
                    React.createElement("div", { className: "px-2" },
                        React.createElement("span", { className: "text-xl uppercase" }, "Exploration")),
                    React.createElement("div", { className: "top-[-2.5rem] absolute flex gap-2 justify-center mx-auto w-full md:gap-6" },
                        React.createElement(ExplorationList, null))))));
    };

    const cn$1 = classNames;
    /**
     * @package
     */
    const Spinner = ({ className, style }) => {
        return (React.createElement("i", { className: cn$1("bi bi-arrow-repeat", className), style: style }));
    };

    const cn = classNames;
    /**
     * @package
     */
    const Timer = ({ targetDate, className }) => {
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
        if (targetDate !== null) {
            const duration = dayjs.duration(dayjs(targetDate).diff(dayjs()));
            return (React.createElement("div", { className: cn("text-[10vh]", className) }, duration.format("mm:ss")));
        }
        return React.createElement("div", { className: cn("text-[6vh]", className) }, "WAITING");
    };

    const AutorunStatus = () => {
        const config = unsafeWindow.LAOPLUS.config;
        const status = unsafeWindow.LAOPLUS.status;
        const [shown, setShown] = React.useState(config.config.features.autorunDetection.enabled &&
            !config.config.features.autorunDetection.hideTimer);
        const [enterDate, setEnterDate] = React.useState(null);
        config.events.on("changed", (e) => {
            setShown(e.features.autorunDetection.enabled &&
                !e.features.autorunDetection.hideTimer);
        });
        status.events.on("changed", (e) => {
            setEnterDate(e.autorunDetection.latestEnterTime);
        });
        if (!shown) {
            return React.createElement(React.Fragment, null);
        }
        return (React.createElement("div", { className: "-translate-x-[50%] absolute inset-y-0 left-0 flex items-center text-white opacity-90 pointer-events-none select-none drop-shadow-lg" },
            React.createElement(Spinner, { className: "text-[70vh] leading-zero animate-spin", style: { animationDuration: "12s" } }),
            React.createElement("div", { className: "pl-[50%] absolute inset-0 flex items-center justify-center" },
                React.createElement(Timer, { targetDate: enterDate, className: "pt-[50%] rotate-90" }))));
    };

    const App = () => {
        return (React.createElement(React.Fragment, null,
            React.createElement(Icon, null),
            React.createElement(ConfigModal, null),
            React.createElement(AutorunStatus, null)));
    };
    const initUi = () => {
        const root = document.createElement("div");
        root.id = "laoplus-root";
        ReactDOM.render(React.createElement(App, null), root);
        document.body.appendChild(root);
    };

    const sendToDiscordWebhook = (body) => {
        if (!unsafeWindow.LAOPLUS.config.config.features.discordNotification.enabled) {
            log.debug("Discord Notification", "設定が無効のため送信しませんでした", body);
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

    const sendNotification$1 = () => {
        const embedFields = unsafeWindow.LAOPLUS.exploration
            .sort((a, b) => a.EndTime - b.EndTime)
            .map((ex) => {
            const endDate = dayjs(ex.EndTime * 1000);
            // たま～に早く実行されてisFinishedがfalseになってしまうので1秒猶予をもたせる
            const isFinished = endDate.isSameOrBefore(dayjs().add(1, "second"));
            const value = isFinished
                ? ":white_check_mark: **完了**"
                : `<t:${ex.EndTime}:t> ${dateToRelativeTime(endDate)}後`;
            // <t:TIMESTAMP> Discord Timestamp Format
            // https://discord.com/developers/docs/reference#message-formatting
            return {
                name: [
                    numberToEmoji(ex.SquadIndex),
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
            log.debug("Exploration Timer", "設定が無効のため、Discord通知を送信しませんでした", body);
        }
    };
    /**
     * @package
     */
    const loginto = ({ ExplorationList, }) => {
        // 既存のタイマーをすべて破棄する
        unsafeWindow.LAOPLUS.exploration.forEach((ex) => {
            if (ex.timeoutID) {
                window.clearTimeout(ex.timeoutID);
            }
        });
        unsafeWindow.LAOPLUS.exploration = ExplorationList.map((ex) => {
            const msToFinish = ex.EndTime * 1000 - Date.now();
            if (msToFinish > 0) {
                const timeoutID = window.setTimeout(sendNotification$1, msToFinish);
                return { ...ex, timeoutID };
            }
            else {
                return ex;
            }
        });
        log.log("Exploration Timer", "Restore Exploration Timers", unsafeWindow.LAOPLUS.exploration);
    };
    /**
     * @package
     */
    const enter$1 = ({ EnterInfo }) => {
        const msToFinish = EnterInfo.EndTime * 1000 - Date.now();
        const timeoutID = window.setTimeout(sendNotification$1, msToFinish);
        unsafeWindow.LAOPLUS.exploration.push({ ...EnterInfo, timeoutID });
        log.log("Exploration Timer", "Add Exploration Timer", unsafeWindow.LAOPLUS.exploration);
    };
    /**
     * @package
     */
    const reward = ({ SquadIndex }) => {
        unsafeWindow.LAOPLUS.exploration = unsafeWindow.LAOPLUS.exploration.filter((ex) => ex.SquadIndex !== SquadIndex);
        log.log("Exploration Timer", "Remove Exploration Timer", unsafeWindow.LAOPLUS.exploration);
    };
    /**
     * @package
     */
    const cancel = ({ SquadIndex }) => {
        const targetExploration = unsafeWindow.LAOPLUS.exploration.find((ex) => ex.SquadIndex === SquadIndex);
        if (targetExploration?.timeoutID) {
            window.clearTimeout(targetExploration.timeoutID);
        }
        unsafeWindow.LAOPLUS.exploration = unsafeWindow.LAOPLUS.exploration.filter((ex) => ex.SquadIndex !== SquadIndex);
        log.log("Exploration Timer", "Remove Exploration", unsafeWindow.LAOPLUS.exploration);
    };

    // TODO: 型を用意してanyをキャストする
    const invoke$2 = ({ res, url }) => {
        switch (url.pathname) {
            case "/exploration_inginfo":
                loginto(res);
                return;
            case "/exploration_enter":
                enter$1(res);
                return;
            case "/exploration_reward":
                reward(res);
                return;
            case "/exploration_cancel":
                cancel(res);
                return;
        }
    };

    const rankColor = {
        SS: chroma.rgb(255, 223, 33),
        S: chroma.rgb(255, 166, 3),
        A: chroma.rgb(5, 176, 228),
        B: chroma.rgb(30, 160, 13),
    };
    const uiColor = {
        // tailwindcss lime-500
        success: chroma.hex("#84CC16"),
        // tailwindcss red-500
        error: chroma.hex("#EF4444"),
        // tailwindcss yellow-300
        warninig: chroma.hex("#FDE047"),
        // tailwindcss sky-400
        info: chroma.hex("#38BDF8"),
    };

    /**
     * @package
     */
    const PcDropNotification = (res) => {
        const embeds = res.ClearRewardInfo.PCRewardList.reduce((embeds, pc) => {
            const { B: notifyRankB, A: notifyRankA, S: notifyRankS, SS: notifyRankSS, } = unsafeWindow.LAOPLUS.config.config.features.discordNotification
                .interests.pcRank;
            if (pc.Grade === 2 && notifyRankB === false)
                return embeds;
            if (pc.Grade === 3 && notifyRankA === false)
                return embeds;
            if (pc.Grade === 4 && notifyRankS === false)
                return embeds;
            if (pc.Grade === 5 && notifyRankSS === false)
                return embeds;
            const id = pc.PCKeyString.replace(/^Char_/, "").replace(/_N$/, "");
            const name = unsafeWindow.LAOPLUS.tacticsManual.locale[`UNIT_${id}`];
            const rank = gradeToRank(pc.Grade);
            // クラゲ
            if (id.startsWith("Core"))
                return embeds;
            // 強化モジュール
            if (id.startsWith("Module"))
                return embeds;
            embeds.push({
                title: name || id,
                color: rank !== ""
                    ? colorHexToInteger(rankColor[rank].hex())
                    : undefined,
                url: `https://lo.swaytwig.com/units/${id}`,
                thumbnail: {
                    url: `https://lo.swaytwig.com/assets/webp/tbar/TbarIcon_${id}_N.webp`,
                },
            });
            return embeds;
        }, []);
        const body = { embeds };
        if (embeds.length !== 0 &&
            unsafeWindow.LAOPLUS.config.config.features.discordNotification
                .interests.pcDrop) {
            sendToDiscordWebhook(body);
        }
        else {
            log.debug("Drop Notification", "送信する項目がないか、設定が無効のため、Discord通知を送信しませんでした", body);
        }
    };
    /**
     * @package
     */
    const itemDropNotification = (res) => {
        const embeds = res.ClearRewardInfo.ItemRewardList.reduce((embeds, item) => {
            // SSのみ
            if (!item.ItemKeyString.includes("T4"))
                return embeds;
            const localeKey = item.ItemKeyString.replace(/^Equip_/, "EQUIP_");
            const id = item.ItemKeyString.replace(/^Equip_/, "");
            const name = unsafeWindow.LAOPLUS.tacticsManual.locale[localeKey];
            embeds.push({
                title: name || localeKey,
                color: colorHexToInteger(rankColor["SS"].hex()),
                url: `https://lo.swaytwig.com/equips/${id}`,
                thumbnail: {
                    url: `https://lo.swaytwig.com/assets/webp/item/UI_Icon_${item.ItemKeyString}.webp`,
                },
            });
            return embeds;
        }, []);
        const body = { embeds };
        if (embeds.length !== 0 &&
            unsafeWindow.LAOPLUS.config.config.features.discordNotification
                .interests.itemDrop) {
            sendToDiscordWebhook(body);
        }
        else {
            log.debug("Drop Notification", "送信する項目がないか、設定が無効のため、Discord通知を送信しませんでした", body);
        }
    };

    // TODO: 渡す前にキャストする
    const invoke$1 = ({ res, url }) => {
        switch (url.pathname) {
            case "/wave_clear":
                PcDropNotification(res);
                itemDropNotification(res);
                return;
        }
    };

    const sendNotification = () => {
        const threshold = unsafeWindow.LAOPLUS.config.config.features.autorunDetection.threshold;
        const body = {
            embeds: [
                {
                    color: colorHexToInteger(uiColor.error.hex()),
                    title: "自動周回停止",
                    description: `戦闘開始のインターバルがしきい値(${threshold}分)を超えました`,
                },
            ],
        };
        if (unsafeWindow.LAOPLUS.config.config.features.discordNotification
            .interests.autorunStop) {
            sendToDiscordWebhook(body);
        }
        else {
            log.debug("Autorun Detection", "設定が無効のため、Discord通知を送信しませんでした", body);
        }
        unsafeWindow.LAOPLUS.config.set({
            features: { autorunDetection: { enabled: false } },
        });
        log.debug("Autorun Detection", "Autorun Detection Disabled");
        clearTimer();
    };
    const getDalayMs = () => {
        const threshold = Number(unsafeWindow.LAOPLUS.config.config.features.autorunDetection.threshold);
        const thresholdMs = threshold * 60 * 1000;
        return thresholdMs;
    };
    const getLatestDate = (delayMs) => {
        const now = new Date().getTime();
        return new Date(now + delayMs);
    };
    const clearTimer = () => {
        const status = unsafeWindow.LAOPLUS.status;
        const { enterTimerId } = status.status.autorunDetection;
        if (enterTimerId) {
            window.clearTimeout(enterTimerId);
            status.set({
                autorunDetection: { enterTimerId: null, latestEnterTime: null },
            });
            log.debug("Autorun Detection", "Reset enterTimer");
        }
        log.log("Autorun Detection", "Reset Timers", status.status.autorunDetection);
    };
    /**
     * @package
     */
    const enter = () => {
        const status = unsafeWindow.LAOPLUS.status;
        const { enterTimerId } = status.status.autorunDetection;
        if (enterTimerId !== null) {
            window.clearTimeout(enterTimerId);
            log.debug("Autorun Detection", "Remove Current Enter Timer");
        }
        const delay = getDalayMs();
        const newEnterTimerId = window.setTimeout(sendNotification, delay);
        status.set({
            autorunDetection: {
                enterTimerId: newEnterTimerId,
                latestEnterTime: getLatestDate(delay),
            },
        });
        log.log("Autorun Detection", "Set Enter Timer", delay);
    };

    const invoke = ({ url }) => {
        switch (url.pathname) {
            case "/battleserver_enter":
                if (unsafeWindow.LAOPLUS.config.config.features.autorunDetection
                    .enabled) {
                    enter();
                }
                return;
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
            log.debug("Interceptor", url.pathname, res);
            const invokeProps = { xhr, res, url };
            // TODO: このような処理をここに書くのではなく、各種機能がここを購読しに来るように分離したい
            invoke$2(invokeProps);
            invoke$1(invokeProps);
            invoke(invokeProps);
        }
        catch (error) {
            log.error("Interceptor", "Error", error);
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
        if (!game) {
            log.error("ResizeObserver", "Game Canvas Not Found");
            return;
        }
        const body = document.body;
        const bodyResizeObserver = new ResizeObserver((entries) => {
            if (!entries[0])
                return;
            const { width, height } = entries[0].contentRect;
            game.height = height;
            game.width = width;
            log.log("ResizeObserver", "Game resized:", `${game.width}x${game.height}`);
        });
        const canvasAttributeObserver = new MutationObserver(() => {
            bodyResizeObserver.observe(body);
            log.log("CanvasAttributeObserver", "Game initialized. ResizeObserver Started.");
            canvasAttributeObserver.disconnect();
            log.log("CanvasAttributeObserver", "CanvasAttributeObserver Stopped.");
        });
        canvasAttributeObserver.observe(game, { attributes: true });
        log.log("CanvasAttributeObserver", "CanvasAttributeObserver Started.");
    };

    const initTacticsManual = () => {
        GM_xmlhttpRequest({
            url: "https://lo.swaytwig.com/json/locale/JP.json",
            onload: ({ responseText }) => {
                try {
                    const parsedJson = JSON.parse(responseText);
                    log.log("TacticsManual", "Locale", "Loaded");
                    unsafeWindow.LAOPLUS.tacticsManual.locale = parsedJson;
                }
                catch (error) {
                    log.error("Tactics Manual", "Locale", "Error", error);
                }
            },
        });
        GM_xmlhttpRequest({
            url: "https://lo.swaytwig.com/json/korea/filterable.unit.json",
            onload: ({ responseText }) => {
                try {
                    const parsedJson = JSON.parse(responseText);
                    log.log("TacticsManual", "Unit", "Loaded");
                    unsafeWindow.LAOPLUS.tacticsManual.unit = parsedJson;
                }
                catch (error) {
                    log.error("Tactics Manual", "Unit", "Error", error);
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
                lineHeight: {
                    zero: "0",
                },
            },
        },
        variants: {
            extend: {},
        },
    };
    /**
     * アプリ全体で使いたい大きめのセレクタに関しての設定
     */
    const initTailwindCustomStyle = () => {
        const style = document.createElement("style");
        style.setAttribute("type", "text/tailwindcss");
        style.innerText = `
    button[type='submit'], [type='checkbox'] {
        @apply hover:brightness-105;
    }
    /* フォーカス */
    [type='text']:focus, [type='email']:focus, [type='url']:focus, [type='password']:focus, [type='number']:focus, [type='date']:focus, [type='datetime-local']:focus, [type='month']:focus, [type='search']:focus, [type='tel']:focus, [type='time']:focus, [type='week']:focus, [multiple]:focus, [type='checkbox']:focus, textarea:focus, select:focus {
        @apply ring ring-offset-0 ring-amber-400/50
    }
    [type='text'] {
        @apply rounded leading-zero p-1 border-gray-400;
    }
    [type='checkbox'] {
        @apply rounded shadow-sm border-gray-400 text-amber-400;
    }
    /* checkedのsvgのfillをblackにする */
    [type='checkbox']:checked {
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
    }
    `;
        document.head.appendChild(style);
    };

    const isInputElement = (target) => {
        if (target === null)
            return false;
        const t = target;
        if (t.tagName !== "INPUT")
            return false;
        return t;
    };
    const getCursorPosition = (element) => {
        // https://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
        // なんかtextじゃないとnullになる
        element.type = "text";
        const cursorPosition = element.selectionStart;
        if (cursorPosition === null) {
            throw new Error("cursor position should not be null");
        }
        return cursorPosition;
    };
    // https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js#46012210
    const getNativeInputValueSetter = () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        if (!nativeInputValueSetter) {
            throw new Error("nativeInputValueSetter is not found");
        }
        return nativeInputValueSetter;
    };
    const dispatchEvent = (input, newValue) => {
        const nativeInputValueSetter = getNativeInputValueSetter();
        nativeInputValueSetter.call(input, newValue);
        const inputEvent = new Event("input", { bubbles: true });
        input.dispatchEvent(inputEvent);
    };
    const keypressObserver = () => {
        // prettier-ignore
        // addEventListenerで改行されるとネストが深くなるため
        unsafeWindow.addEventListener("keypress", ({ key, target: eventTraget }) => {
            const target = isInputElement(eventTraget);
            if (!target)
                return;
            // dispatchした時点でカーソルの位置が吹っ飛んでしまうのでここで抑えておく
            const cursorPosition = getCursorPosition(target);
            const lastValue = target.value;
            const newValue = [
                ...[...lastValue].slice(0, cursorPosition),
                key,
                ...[...lastValue].slice(cursorPosition),
            ].join("");
            dispatchEvent(target, newValue);
            target.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
        });
    };
    const keydownObserver = () => {
        unsafeWindow.addEventListener("keydown", ({ key, target: eventTraget }) => {
            const target = isInputElement(eventTraget);
            if (!target)
                return;
            if (!(key === "ArrowRight" ||
                key === "ArrowLeft" ||
                key === "Backspace")) {
                return;
            }
            const cursorPosition = getCursorPosition(target);
            let newCursorPosition;
            if (key === "Backspace") {
                const lastValue = target.value;
                const newValue = [
                    ...[...lastValue].slice(0, cursorPosition - 1),
                    ...[...lastValue].slice(cursorPosition),
                ].join("");
                dispatchEvent(target, newValue);
            }
            if (key === "ArrowRight") {
                newCursorPosition = cursorPosition + 1;
            }
            else {
                // Backspace, ArrowLeftで共通
                // 左端で左を押したとき、0未満にならないようにする
                newCursorPosition =
                    cursorPosition - 1 >= 0 ? cursorPosition - 1 : cursorPosition;
            }
            target.setSelectionRange(newCursorPosition, newCursorPosition);
        });
    };
    const initInputObserver = () => {
        keypressObserver();
        keydownObserver();
    };

    const isCanvasElement = (target) => {
        if (target === null)
            return false;
        const t = target;
        if (t.tagName !== "CANVAS")
            return false;
        return t;
    };
    const initWheelAmplfy = () => {
        // TODO: 追加したときのイベントを取っておいていつでも消せるようにする
        // canvasにイベントつけると無限ループするので注意
        unsafeWindow.addEventListener("wheel", ({ deltaY, target: eventTraget }) => {
            if (!unsafeWindow.LAOPLUS.config.config.features.wheelAmplify
                .enabled) {
                return;
            }
            log.debug("WheelAmplify", "Swoosh!");
            const target = isCanvasElement(eventTraget);
            if (!target)
                return;
            const newWheelEvent = new WheelEvent("wheel", {
                deltaY: deltaY *
                    Number(unsafeWindow.LAOPLUS.config.config.features.wheelAmplify
                        .ratio),
            });
            target.dispatchEvent(newWheelEvent);
        });
    };

    // 'return' outside of functionでビルドがコケるのを防ぐ即時実行関数
    (function () {
        const isGameWindow = injection();
        if (!isGameWindow)
            return;
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

})();
