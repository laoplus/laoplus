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

        // Dev
        public static ConfigEntry<bool> ConfigVerboseLogging;

        // Discord
        public static ConfigEntry<string> ConfigDiscordWebhookUrl;
        public static ConfigEntry<bool> ConfigUseDiscordWebhook;

        // ScrollPatch
        public static ConfigEntry<float> ConfigScrollPatchMultiplier;
        public static ConfigEntry<bool> ConfigDisableScrollingOoB;

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
                "Dev",
                "VerboseLogging",
                false,
                new ConfigDescription("Enable verbose logging", null, "Advanced")
            );

            // Discord
            ConfigDiscordWebhookUrl = Config.Bind(
                "Discord Notification",
                "Webhook URL",
                "",
                "Discord webhook URL"
            );
            ConfigUseDiscordWebhook = Config.Bind(
                "Discord Notification",
                "Webhookを送信する",
                true,
                "すべてのWebhookの無効・有効を切り替えます"
            );
            if (!(ConfigDiscordWebhookUrl.Value.Equals("")))
            {
                var discord = new DiscordWebhookClient(HttpClient, ConfigDiscordWebhookUrl.Value);
                NotificationClients.Add(discord);
            }

            // ScrollTweak
            ConfigScrollPatchMultiplier = Config.Bind(
                "Scroll Patch",
                "スクロール倍率",
                6.0f,
                "戦闘員・装備リストなどのホイールスクロール倍率"
            );
            ConfigDisableScrollingOoB = Config.Bind(
                "Scroll Patch",
                "範囲外へのスクロールを無効にする",
                true,
                "リストでのスクロール時に項目の範囲外までスクロールしないようにします"
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
