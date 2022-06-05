using BepInEx;
using BepInEx.Configuration;
using BepInEx.IL2CPP;
using BepInEx.Logging;
using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Reflection;

namespace LAOPLUS
{
    [BepInPlugin(PluginInfo.PLUGIN_GUID, PluginInfo.PLUGIN_NAME, PluginInfo.PLUGIN_VERSION)]
    public class Plugin : BasePlugin
    {
        internal static new ManualLogSource Log;
        internal static HttpClient httpClient = new();

        // Dev
        public static ConfigEntry<bool> configVerboseLogging;
        // Discord
        public static ConfigEntry<string> configDiscordWebhookUrl;
        public static ConfigEntry<bool> configUseDiscordWebhook;
        // ScrollPatch
        public static ConfigEntry<float> configScrollPatchMultiplier;

        public static List<NotificationClient> NotificationClients = new();

        public override void Load()
        {
            Log = base.Log;
            Log.LogInfo($"{PluginInfo.PLUGIN_NAME} v{PluginInfo.PLUGIN_VERSION} is loaded!");

            httpClient.DefaultRequestHeaders.Add("User-Agent", $"{PluginInfo.PLUGIN_NAME}/{PluginInfo.PLUGIN_VERSION}");

            // Dev
            configVerboseLogging = Config.Bind("Dev", "VerboseLogging", false, new ConfigDescription("Enable verbose logging", null, "Advanced"));

            // Discord
            configDiscordWebhookUrl = Config.Bind("Discord Notification", "Webhook URL", "", "Discord webhook URL");
            configUseDiscordWebhook = Config.Bind("Discord Notification", "Webhookを送信する", true, "すべてのWebhookの無効・有効を切り替えます");
            if (!(configDiscordWebhookUrl.Value.Equals("")))
            {
                var Discord = new DiscordWebhookClient(httpClient, configDiscordWebhookUrl.Value);
                NotificationClients.Add(Discord);
            }

            // ScrollPatch
            configScrollPatchMultiplier = Config.Bind("Scroll Patch", "スクロール倍率", 6.0f, "戦闘員・装備リストなどのホイールスクロール倍率");

            Log.LogInfo($"{NotificationClients.Count} notification client(s) loaded.");
            NotificationClients.ForEach(async w => await w.SendMessageAsync($"{PluginInfo.PLUGIN_NAME} v{PluginInfo.PLUGIN_VERSION} loaded!"));

            Harmony.CreateAndPatchAll(Assembly.GetExecutingAssembly());
        }
    }
}
