/* eslint-disable react/jsx-no-undef */
import { Config } from "config";
import { log } from "~/utils";
import { ErrorMessage } from "./ErrorMessage";
import { ExplorationList } from "./ExplorationList";
import { SubmitButton } from "./SumitButton";
import { FeatureSection } from "./FeatureSection";
import { FeatureSectionSummary } from "./FeatureSectionSummary";
import { FeatureSectionContent } from "./FeatureSectionContent";
import { FooterLink } from "./FooterLink";
import { WebhookTestButton } from "./WebhookTestButton";
import "./index.css";
import { resetLoginInfo } from "~/features/resetLoginInfo";

const cn = classNames;
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
`;
document.head.appendChild(element);

const isValidNumber = (value: string) => {
  if (value.includes(".")) return false;
  const number = Number(value);
  return !isNaN(number) && number >= 0;
};

export const ConfigModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
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
        title={`${GM_info.script.name}の設定画面を開く`}
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
        onAfterOpen={() => {
          // 外部からconfig.setをされてもいいようにdefaultValueを読み直す
          reset();
        }}
        overlayClassName="backdrop-saturate-[0.75] fixed inset-0 flex items-center justify-center pb-24 backdrop-blur z-10"
        className="flex max-h-[90%] min-w-[50%] max-w-[90%] overflow-hidden rounded bg-gray-50 shadow"
        id="laoplus-modal"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
          <div className="divide-y overflow-auto">
            <header className="flex place-content-between items-center p-4">
              <div className="flex items-end gap-2">
                <h1 className="text-xl font-semibold">{GM_info.script.name}</h1>
                <span className="pb-0.5 text-sm text-gray-500">{GM_info.script.version}</span>
              </div>
            </header>

            <main className="p-4">
              <div className="flex flex-col gap-4">
                <FeatureSection hasError={!!errors.features?.discordNotification}>
                  <FeatureSectionSummary
                    register={register("features.discordNotification.enabled")}
                    title="Discord通知"
                    helpLink="https://github.com/eai04191/laoplus/wiki/features-discordNotification"
                  />
                  <FeatureSectionContent enable={watch("features.discordNotification.enabled")}>
                    <label className="flex items-center gap-2">
                      <span className="flex-shrink-0">Discord Webhook URL:</span>
                      <input
                        type="text"
                        disabled={!watch("features.discordNotification.enabled")}
                        className="min-w-[1rem] flex-1 rounded border border-gray-500 px-1"
                        {...register("features.discordNotification.webhookURL", {
                          required: watch("features.discordNotification.enabled"),
                          pattern: /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\//,
                        })}
                      />
                      <WebhookTestButton
                        webhookURL={watch("features.discordNotification.webhookURL")}
                      />
                    </label>
                    {errors.features?.discordNotification?.webhookURL && (
                      <ErrorMessage className="flex gap-1">
                        <i className="bi bi-exclamation-triangle"></i>
                        {errors.features?.discordNotification?.webhookURL?.type === "required" &&
                          "Discord通知を利用するにはWebhook URLが必要です"}
                        {errors.features?.discordNotification?.webhookURL?.type === "pattern" &&
                          "有効なDiscordのWebhook URLではありません"}
                      </ErrorMessage>
                    )}

                    <span className="flex gap-2">
                      <span className="flex-shrink-0">通知項目:</span>
                      <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            disabled={!watch("features.discordNotification.enabled")}
                            {...register("features.discordNotification.interests.pcDrop")}
                          />
                          キャラクタードロップ
                        </label>
                        <div
                          className={cn("ml-1 flex gap-3 pl-4", {
                            "opacity-50": !watch("features.discordNotification.interests.pcDrop"),
                          })}
                        >
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              disabled={!watch("features.discordNotification.interests.pcDrop")}
                              {...register("features.discordNotification.interests.pcRank.B")}
                            />
                            B
                          </label>
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              disabled={!watch("features.discordNotification.interests.pcDrop")}
                              {...register("features.discordNotification.interests.pcRank.A")}
                            />
                            A
                          </label>
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              disabled={!watch("features.discordNotification.interests.pcDrop")}
                              {...register("features.discordNotification.interests.pcRank.S")}
                            />
                            S
                          </label>
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              disabled={!watch("features.discordNotification.interests.pcDrop")}
                              {...register("features.discordNotification.interests.pcRank.SS")}
                            />
                            SS
                          </label>
                        </div>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            disabled={!watch("features.discordNotification.enabled")}
                            {...register("features.discordNotification.interests.itemDrop")}
                          />
                          <span className="flex items-center gap-1">
                            アイテムドロップ
                            <span className="text-xs text-gray-600">現在はSSのみ</span>
                          </span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            disabled={!watch("features.discordNotification.enabled")}
                            {...register("features.discordNotification.interests.exploration")}
                          />
                          <span>探索完了</span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            disabled={!watch("features.discordNotification.enabled")}
                            {...register("features.discordNotification.interests.autorunStop")}
                          />
                          <span>自動周回停止</span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            disabled={!watch("features.discordNotification.enabled")}
                            {...register("features.discordNotification.interests.levelUp")}
                          />
                          <span>レベリング通知（キャラレベル）</span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            disabled={!watch("features.discordNotification.enabled")}
                            {...register("features.discordNotification.interests.skillLevelUp")}
                          />
                          <span>レベリング通知（スキルレベル）</span>
                        </label>
                      </div>
                    </span>
                  </FeatureSectionContent>
                </FeatureSection>

                <FeatureSection hasError={!!errors.features?.wheelAmplify}>
                  <FeatureSectionSummary
                    register={register("features.wheelAmplify.enabled")}
                    title="ホイールスクロール増幅"
                    helpLink="https://github.com/eai04191/laoplus/wiki/features-wheelAmplify"
                  />
                  <FeatureSectionContent enable={watch("features.wheelAmplify.enabled")}>
                    <span className="flex gap-1 text-sm text-gray-600">
                      <i className="bi bi-info-circle"></i>
                      この設定の変更はページ再読み込み後に反映されます
                    </span>
                    <label className="flex items-center gap-2">
                      <span className="flex-shrink-0">増幅倍率:</span>
                      <input
                        // numberだと値が二重になる
                        type="text"
                        disabled={!watch("features.wheelAmplify.enabled")}
                        className="w-16 min-w-[1rem] rounded border border-gray-500 px-1"
                        {...register("features.wheelAmplify.ratio", {
                          required: watch("features.wheelAmplify.enabled"),
                          validate: (value) =>
                            // prettier-ignore
                            typeof Number(value) === "number"
                                                        && !Number.isNaN(Number(value)),
                        })}
                      />
                    </label>
                    {errors.features?.wheelAmplify?.ratio && (
                      <ErrorMessage className="flex gap-1">
                        <i className="bi bi-exclamation-triangle"></i>
                        {errors.features?.wheelAmplify?.ratio?.type === "required" &&
                          "ホイールスクロール増幅を利用するには増幅倍率の指定が必要です"}
                        {errors.features?.wheelAmplify?.ratio?.type === "validate" &&
                          "増幅倍率は数字で入力してください"}
                      </ErrorMessage>
                    )}
                  </FeatureSectionContent>
                </FeatureSection>

                <FeatureSection hasError={!!errors.features?.autorunDetection}>
                  <FeatureSectionSummary
                    register={register("features.autorunDetection.enabled")}
                    title="自動周回停止判定"
                    helpLink="https://github.com/eai04191/laoplus/wiki/features-autorunDetection"
                  />
                  <FeatureSectionContent enable={watch("features.autorunDetection.enabled")}>
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        disabled={!watch("features.autorunDetection.enabled")}
                        {...register("features.autorunDetection.hideTimer")}
                      />
                      画面にタイマーを表示しない
                    </label>

                    <label className="flex items-center gap-2">
                      <span className="flex-shrink-0">インターバルのしきい値(分):</span>
                      <input
                        type="text"
                        disabled={!watch("features.autorunDetection.enabled")}
                        className="w-16 min-w-[1rem] rounded border border-gray-500 px-1"
                        {...register("features.autorunDetection.threshold", {
                          required: watch("features.autorunDetection.enabled"),
                          validate: (value) =>
                            // prettier-ignore
                            typeof Number(value) === "number"
                                                && !Number.isNaN(Number(value)),
                        })}
                      />
                    </label>
                    {errors.features?.autorunDetection?.threshold && (
                      <ErrorMessage className="flex gap-1">
                        <i className="bi bi-exclamation-triangle"></i>
                        {errors.features?.autorunDetection?.threshold?.type === "required" &&
                          "自動周回停止判定を利用するにはしきい値の指定が必要です"}
                        {errors.features?.autorunDetection?.threshold?.type === "validate" &&
                          "しきい値は数字で入力してください"}
                      </ErrorMessage>
                    )}
                  </FeatureSectionContent>
                </FeatureSection>

                <FeatureSection hasError={!!errors.features?.farmingStats}>
                  <FeatureSectionSummary
                    register={register("features.farmingStats.enabled")}
                    title="周回統計"
                    helpLink="https://github.com/eai04191/laoplus/wiki/features-FarmingStats"
                  />
                  <FeatureSectionContent enable={watch("features.farmingStats.enabled")}>
                    <span className="flex gap-1 text-sm text-gray-600">
                      <i className="bi bi-info-circle"></i>
                      ページ読み込み後に周回統計を有効化した場合、表示するにはページの再読み込みが必要です
                    </span>

                    <label className="flex items-center gap-2">
                      <span className="flex-shrink-0">戦闘員 分解獲得資源の上昇率:</span>
                      <input
                        type="text"
                        disabled={!watch("features.farmingStats.enabled")}
                        className="w-16 min-w-[1rem] rounded border border-gray-500 px-1"
                        {...register("features.farmingStats.unitDisassemblyMultiplier", {
                          required: watch("features.farmingStats.enabled"),
                          validate: isValidNumber,
                        })}
                      />
                    </label>
                    {errors.features?.farmingStats?.unitDisassemblyMultiplier && (
                      <ErrorMessage className="flex gap-1">
                        <i className="bi bi-exclamation-triangle"></i>
                        {errors.features?.farmingStats.unitDisassemblyMultiplier.type ===
                          "required" && "周回統計を利用するには上昇率の指定が必要です"}
                        {errors.features?.farmingStats?.unitDisassemblyMultiplier?.type ===
                          "validate" && "上昇率は整数で入力してください（%は不要）"}
                      </ErrorMessage>
                    )}

                    <label className="flex items-center gap-2">
                      <span className="flex-shrink-0">装備 分解獲得資源の上昇率:</span>
                      <input
                        type="text"
                        disabled={!watch("features.farmingStats.enabled")}
                        className="w-16 min-w-[1rem] rounded border border-gray-500 px-1"
                        {...register("features.farmingStats.equipmentDisassemblyMultiplier", {
                          required: watch("features.farmingStats.enabled"),
                          validate: isValidNumber,
                        })}
                      />
                    </label>
                    {errors.features?.farmingStats?.equipmentDisassemblyMultiplier && (
                      <ErrorMessage className="flex gap-1">
                        <i className="bi bi-exclamation-triangle"></i>
                        {errors.features?.farmingStats.equipmentDisassemblyMultiplier.type ===
                          "required" && "周回統計を利用するには上昇率の指定が必要です"}
                        {errors.features?.farmingStats?.equipmentDisassemblyMultiplier?.type ===
                          "validate" && "上昇率は整数で入力してください（%は不要）"}
                      </ErrorMessage>
                    )}
                  </FeatureSectionContent>
                </FeatureSection>

                <FeatureSection hasError={!!errors.features?.levelupDetection}>
                  <FeatureSectionSummary
                    register={register("features.levelupDetection.enabled")}
                    title="レベリング通知"
                  />
                  <FeatureSectionContent enable={watch("features.levelupDetection.enabled")}>
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        disabled={!watch("features.levelupDetection.enabled")}
                        {...register("features.levelupDetection.watchUnitLevel")}
                      />
                      戦闘員のレベルを監視する
                    </label>

                    <label
                      className={cn("flex items-center gap-2", {
                        "opacity-50": !watch("features.levelupDetection.watchUnitLevel"),
                      })}
                    >
                      <span className="flex-shrink-0">
                        部隊の全員のレベルが上回ったら通知する目標値:
                      </span>
                      <input
                        type="text"
                        disabled={
                          !watch("features.levelupDetection.enabled") ||
                          !watch("features.levelupDetection.watchUnitLevel")
                        }
                        className="w-16 min-w-[1rem] rounded border border-gray-500 px-1"
                        {...register("features.levelupDetection.unitLevelRequirement", {
                          required:
                            watch("features.levelupDetection.enabled") &&
                            watch("features.levelupDetection.watchUnitLevel"),
                          validate: isValidNumber,
                        })}
                      />
                    </label>
                    {errors.features?.levelupDetection?.unitLevelRequirement && (
                      <ErrorMessage className="flex gap-1">
                        <i className="bi bi-exclamation-triangle"></i>
                        {errors.features?.levelupDetection?.unitLevelRequirement?.type ===
                          "required" && "レベリング通知を利用するには目標値の指定が必要です"}
                        {errors.features?.levelupDetection?.unitLevelRequirement?.type ===
                          "validate" && "目標値は整数で入力してください"}
                      </ErrorMessage>
                    )}

                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        disabled={!watch("features.levelupDetection.enabled")}
                        {...register("features.levelupDetection.watchSkillLevel")}
                      />
                      戦闘員のスキルレベルを監視する
                    </label>

                    <label
                      className={cn("flex items-center gap-2", {
                        "opacity-50": !watch("features.levelupDetection.watchSkillLevel"),
                      })}
                    >
                      <span className="flex-shrink-0">
                        部隊の全員のスキルレベルが上回ったら通知する目標値:
                      </span>
                      <input
                        type="text"
                        disabled={
                          !watch("features.levelupDetection.enabled") ||
                          !watch("features.levelupDetection.watchSkillLevel")
                        }
                        className="w-16 min-w-[1rem] rounded border border-gray-500 px-1"
                        {...register("features.levelupDetection.skillLevelRequirement", {
                          required:
                            watch("features.levelupDetection.enabled") &&
                            watch("features.levelupDetection.watchSkillLevel"),
                          validate: isValidNumber,
                        })}
                      />
                    </label>
                    {errors.features?.levelupDetection?.skillLevelRequirement && (
                      <ErrorMessage className="flex gap-1">
                        <i className="bi bi-exclamation-triangle"></i>
                        {errors.features?.levelupDetection?.skillLevelRequirement?.type ===
                          "required" && "レベリング通知を利用するには目標値の指定が必要です"}
                        {errors.features?.levelupDetection?.skillLevelRequirement?.type ===
                          "validate" && "目標値は整数で入力してください"}
                      </ErrorMessage>
                    )}
                  </FeatureSectionContent>
                </FeatureSection>
              </div>
            </main>

            <div className="flex flex-col items-center gap-2 p-4">
              <span className="text-sm text-gray-600">
                {GM_info.script.name}
                は以下のサービスが提供するゲームデータを使用しています
              </span>
              <a
                title="滅亡前の戦術教本"
                href="https://lo.swaytwig.com/"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-1 rounded bg-white p-2 px-3 shadow"
              >
                <img src={GM_getResourceURL("TacticsManualIcon")} className="w-12" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">滅亡前の戦術教本</span>
                  <span className="text-sm text-gray-400">by WolfgangKurz</span>
                </div>
              </a>
            </div>

            <div className="p-4">
              <details className="flex flex-col gap-4">
                <summary>危険エリア</summary>

                <div className="flex flex-col gap-2 p-4">
                  <button
                    className="rounded-lg bg-amber-300 px-1 py-2 ring-1 ring-amber-900/5"
                    onClick={resetLoginInfo}
                  >
                    ログイン情報を削除する
                  </button>
                  <span className="flex gap-1 text-sm text-gray-600">
                    <i className="bi bi-info-circle"></i>
                    タイトル画面でTouch
                    Screenが出なくなったときに使うと再ダウンロードしなくても直るかもしれません。
                  </span>
                </div>
              </details>
            </div>
          </div>
          <footer className="flex flex-shrink-0 items-center justify-between border-t p-4">
            <div className="flex h-full gap-3 text-sm text-gray-500">
              <FooterLink href="https://github.com/eai04191/laoplus">
                <i className="bi bi-github"></i>
                GitHub
              </FooterLink>
              <FooterLink href="https://discord.gg/EGWqTuhjrE">
                <i className="bi bi-discord"></i>
                Discord
              </FooterLink>
            </div>
            <SubmitButton>保存</SubmitButton>
          </footer>
        </form>

        <div className="absolute inset-x-0 bottom-0 mx-auto flex h-8 w-4/5 items-center rounded-t-lg bg-gray-200 bg-opacity-80 shadow-lg">
          <div className="px-2">
            <span className="text-xl uppercase">Exploration</span>
          </div>
          <div className="absolute top-[-2.5rem] mx-auto flex w-full justify-center gap-2 md:gap-6">
            <ExplorationList />
          </div>
        </div>
      </ReactModal>
    </>
  );
};
