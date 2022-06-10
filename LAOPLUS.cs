using BepInEx;
using BepInEx.Configuration;
using BepInEx.IL2CPP;
using BepInEx.Logging;
using HarmonyLib;
using System.Collections.Generic;
using System.Net.Http;
using System.Reflection;
using LAOPLUS.Notification;

namespace LAOPLUS
{
    [BepInPlugin(PluginInfo.PLUGIN_GUID, PluginInfo.PLUGIN_NAME, PluginInfo.PLUGIN_VERSION)]
    // ReSharper disable once InconsistentNaming
    // ReSharper disable once ClassNeverInstantiated.Global
    public class LAOPLUS : BasePlugin
    {
        internal new static ManualLogSource Log;
        private static readonly HttpClient HttpClient = new();

        const string ConfigDevLabel = "Dev / 開発";
        public static ConfigEntry<bool> ConfigVerboseLogging;

        const string ConfigDiscordLabel = "Discord";
        public static ConfigEntry<string> ConfigDiscordWebhookUrl;
        public static ConfigEntry<bool> ConfigDiscordWebhookEnabled;

        const string ConfigScrollLabel = "Scroll / スクロール";
        public static ConfigEntry<float> ConfigScrollPatchMultiplier;
        public static ConfigEntry<bool> ConfigPreventsScrollingOoB;

        const string ConfigBaseLabel = "Base / 基地";
        public static ConfigEntry<bool> ConfigAutoPressRestartWhenRewarded;

        public static readonly List<INotificationClient> NotificationClients = new();

        public override void Load()
        {
            Log = base.Log;
            Log.LogInfo($"{PluginInfo.PLUGIN_NAME} v{PluginInfo.PLUGIN_VERSION} is loaded!");

            HttpClient.DefaultRequestHeaders.Add(
                "User-Agent",
                $"{PluginInfo.PLUGIN_NAME}/{PluginInfo.PLUGIN_VERSION}"
            );

            // Dev
            ConfigVerboseLogging = Config.Bind(
                ConfigDevLabel,
                "VerboseLogging",
                false,
                new ConfigDescription("Enable verbose logging", null, "Advanced")
            );

            // Discord
            ConfigDiscordWebhookUrl = Config.Bind(
                ConfigDiscordLabel,
                "Webhook URL",
                "",
                "Discord webhook URL"
            );
            ConfigDiscordWebhookEnabled = Config.Bind(
                ConfigDiscordLabel,
                "Send a notification / 通知を送信する",
                true,
                "Toggles whether all notifications are disabled or enabled.\n"
                    + "すべての通知の無効・有効を切り替えます"
            );
            if (!(ConfigDiscordWebhookUrl.Value.Equals("")))
            {
                var discord = new DiscordWebhookClient(HttpClient, ConfigDiscordWebhookUrl.Value);
                NotificationClients.Add(discord);
            }

            // Scroll / スクロール
            ConfigScrollPatchMultiplier = Config.Bind(
                ConfigScrollLabel,
                "Scroll Multiplier / スクロール倍率",
                6.0f,
                "Wheel scroll multiplier for combatant, equipment list, etc.\n"
                    + "戦闘員・装備リストなどのホイールスクロール倍率"
            );
            ConfigPreventsScrollingOoB = Config.Bind(
                ConfigScrollLabel,
                "Disable Scrolling to Out of Bounds / 範囲外へのスクロールを無効にする",
                true,
                "Prevents scrolling outside the bounds of items when scrolling in the list\n"
                    + "リストでのスクロール時に項目の範囲外までスクロールしないようにします"
            );

            // Base / 基地
            ConfigAutoPressRestartWhenRewarded = Config.Bind(
                ConfigBaseLabel,
                "Automatic restart when rewarded / 受取時自動再作動",
                true,
                "When you receive the production reward at the production facility in base, automatically press the restart button in the pop-up.\n"
                    + "基地の生産施設にて製作報酬を受取時、自動でポップアップ内の再作動ボタンを押します"
            );

            Log.LogInfo($"{NotificationClients.Count} notification client(s) loaded.");
            NotificationClients.ForEach(
                w =>
                    w.SendMessageAsync(
                        $"{PluginInfo.PLUGIN_NAME} v{PluginInfo.PLUGIN_VERSION} loaded!"
                    )
            );

            Harmony.CreateAndPatchAll(Assembly.GetExecutingAssembly());
        }
    }
}
