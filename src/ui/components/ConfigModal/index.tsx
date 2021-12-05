/* eslint-disable react/jsx-no-undef */
import { Config } from "config";
import { log } from "~/utils";
import { ErrorMessage } from "./ErrorMessage";
import { ExplorationList } from "./ExplorationList";
import { HelpIcon } from "./HelpIcon";
import { SubmitButton } from "./SumitButton";

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

export const ConfigModal = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = ReactHookForm.useForm<Config["config"]>({
        defaultValues: unsafeWindow.LAOPLUS.config.config,
    });

    const onSubmit = (config: Config["config"]) => {
        log.log("Config Modal", "Config submitted", config);
        unsafeWindow.LAOPLUS.config.set(config);
        setIsOpen(false);
    };

    if (!_.isEmpty(errors)) {
        log.error("Config Modal", "Error", errors);
    }

    return (
        <>
            <button
                onClick={() => {
                    setIsOpen(true);
                }}
                className="absolute bottom-0 left-0"
            >
                ➕
            </button>

            <ReactModal
                appElement={
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    document.querySelector<HTMLDivElement>("#laoplus-root")!
                }
                shouldCloseOnOverlayClick={false}
                // .ReactModal__Overlayに指定してるduration
                closeTimeoutMS={150}
                isOpen={isOpen}
                overlayClassName="fixed inset-0 backdrop-blur backdrop-saturate-[0.75] flex items-center justify-center"
                className="min-w-[50%] max-w-[90%] max-h-[90%] p-4 bg-gray-50 rounded shadow overflow-auto"
                id="laoplus-modal"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-2"
                >
                    <header className="flex items-center place-content-between">
                        <div className="flex gap-2 items-end">
                            <h2 className="text-xl font-semibold">
                                {GM_info.script.name}
                            </h2>
                            <span className="pb-0.5 text-gray-500 text-sm">
                                {GM_info.script.version}
                            </span>
                        </div>
                    </header>

                    <div className="my-2 border-t"></div>

                    <main className="flex flex-col gap-1 ml-6">
                        <div className="flex flex-col gap-1">
                            <label className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    id="laoplus-discord-notification"
                                    className="-ml-6 w-4 h-4"
                                    {...register(
                                        "features.discordNotification.enabled"
                                    )}
                                />
                                <span>Discord通知</span>
                                <HelpIcon href="https://github.com/eai04191/laoplus/wiki/features-discordNotification" />
                            </label>
                        </div>

                        <div
                            className={cn("flex flex-col gap-1", {
                                "opacity-50": !watch(
                                    "features.discordNotification.enabled"
                                ),
                            })}
                        >
                            <label className="flex gap-2">
                                <span className="flex-shrink-0">
                                    Discord Webhook URL:
                                </span>
                                <input
                                    type="text"
                                    disabled={
                                        !watch(
                                            "features.discordNotification.enabled"
                                        )
                                    }
                                    className="min-w-[1rem] flex-1 px-1 border border-gray-500 rounded"
                                    {...register(
                                        "features.discordNotification.webhookURL",
                                        {
                                            required: watch(
                                                "features.discordNotification.enabled"
                                            ),
                                            pattern:
                                                /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\//,
                                        }
                                    )}
                                />
                            </label>
                            {errors.features?.discordNotification
                                ?.webhookURL && (
                                <ErrorMessage className="flex gap-1">
                                    <i className="bi bi-exclamation-triangle"></i>
                                    {errors.features?.discordNotification
                                        ?.webhookURL?.type === "required" &&
                                        "Discord通知を利用するにはWebhook URLが必要です"}
                                    {errors.features?.discordNotification
                                        ?.webhookURL?.type === "pattern" &&
                                        "有効なDiscordのWebhook URLではありません"}
                                </ErrorMessage>
                            )}

                            <label className="flex gap-2">
                                <span className="flex-shrink-0">通知項目:</span>
                                <div className="flex flex-col gap-1">
                                    <label className="flex gap-2 items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4"
                                            disabled={
                                                !watch(
                                                    "features.discordNotification.enabled"
                                                )
                                            }
                                            {...register(
                                                "features.discordNotification.interests.pcdrop"
                                            )}
                                        />
                                        <span className="flex gap-1 items-center">
                                            キャラクタードロップ
                                            <span className="text-gray-600 text-xs">
                                                現在はSS,Sのみ
                                            </span>
                                        </span>
                                    </label>
                                    <label className="flex gap-2 items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4"
                                            disabled={
                                                !watch(
                                                    "features.discordNotification.enabled"
                                                )
                                            }
                                            {...register(
                                                "features.discordNotification.interests.exploration"
                                            )}
                                        />
                                        <span>探索完了</span>
                                    </label>
                                </div>
                            </label>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    className="-ml-6 w-4 h-4"
                                    {...register(
                                        "features.wheelAmplify.enabled"
                                    )}
                                />
                                <span>ホイールスクロール増幅</span>
                                <HelpIcon href="https://github.com/eai04191/laoplus/wiki/features-wheelAmplify" />
                            </label>
                            <span className="flex gap-1 text-gray-600 text-sm">
                                <i className="bi bi-info-circle"></i>
                                この設定はページ再読み込み後に反映されます
                            </span>
                        </div>

                        <div
                            className={cn("flex flex-col gap-1", {
                                "opacity-50": !watch(
                                    "features.wheelAmplify.enabled"
                                ),
                            })}
                        >
                            <label className="flex gap-2">
                                <span className="flex-shrink-0">増幅倍率:</span>
                                <input
                                    // numberだと値が二重になる
                                    type="text"
                                    disabled={
                                        !watch("features.wheelAmplify.enabled")
                                    }
                                    className="min-w-[1rem] flex-1 px-1 border border-gray-500 rounded"
                                    {...register(
                                        "features.wheelAmplify.ratio",
                                        {
                                            required: watch(
                                                "features.wheelAmplify.enabled"
                                            ),
                                            validate: (value) =>
                                                // prettier-ignore
                                                typeof Number(value) === "number"
                                                && !Number.isNaN(Number(value)),
                                        }
                                    )}
                                />
                            </label>
                            {errors.features?.wheelAmplify?.ratio && (
                                <ErrorMessage className="flex gap-1">
                                    <i className="bi bi-exclamation-triangle"></i>
                                    {errors.features?.wheelAmplify?.ratio
                                        ?.type === "required" &&
                                        "ホイールスクロール増幅を利用するには増幅倍率の指定が必要です"}
                                    {errors.features?.wheelAmplify?.ratio
                                        ?.type === "validate" &&
                                        "ホイールスクロール増幅は数字で入力してください"}
                                </ErrorMessage>
                            )}
                        </div>
                    </main>

                    <div className="my-2 border-t"></div>

                    <div className="flex flex-col gap-2 items-center">
                        <span className="text-gray-600 text-sm">
                            {GM_info.script.name}
                            は以下のサービスが提供するゲームデータを使用しています
                        </span>
                        <a
                            title="滅亡前の戦術教本"
                            href="https://lo.swaytwig.com/"
                            target="_blank"
                            rel="noopener"
                            className="flex gap-1 items-center p-2 px-3 bg-white rounded shadow"
                        >
                            <img
                                src={GM_getResourceURL("TacticsManualIcon")}
                                className="w-12"
                            />
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold">
                                    滅亡前の戦術教本
                                </span>
                                <span className="text-gray-400 text-sm">
                                    by WolfgangKurz
                                </span>
                            </div>
                        </a>
                    </div>

                    <div className="my-2 border-t"></div>

                    <footer className="flex items-center justify-between">
                        <div className="flex gap-3 text-gray-500 text-sm">
                            <a
                                href="https://github.com/eai04191/laoplus"
                                target="_blank"
                                rel="noopener"
                                className="flex gap-1"
                            >
                                <i className="bi bi-github"></i>
                                GitHub
                            </a>
                            <a
                                href="https://discord.gg/EGWqTuhjrE"
                                target="_blank"
                                rel="noopener"
                                className="flex gap-1"
                            >
                                <i className="bi bi-discord"></i>
                                Discord
                            </a>
                        </div>
                        <div className="mx-2" />
                        <SubmitButton>保存</SubmitButton>
                    </footer>
                </form>

                <div className="absolute bottom-0 inset-x-0 flex items-center mx-auto w-4/5 h-8 bg-gray-200 bg-opacity-80 rounded-t-lg shadow-lg">
                    <div className="px-2">
                        <span className="text-xl uppercase">Exploration</span>
                    </div>
                    <div className="top-[-2.5rem] absolute flex gap-2 justify-center mx-auto w-full md:gap-6">
                        <ExplorationList />
                    </div>
                </div>
            </ReactModal>
        </>
    );
};
