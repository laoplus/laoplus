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

        private ConfigEntry<string> configDiscordWebhookUrl;
        private ConfigEntry<bool> configSendDiscordWebhook;

        static List<NotificationClient> NotificationClients = new();

        public override void Load()
        {
            Log = base.Log;
            Log.LogInfo($"{PluginInfo.PLUGIN_NAME} v{PluginInfo.PLUGIN_VERSION} is loaded!");

            httpClient.DefaultRequestHeaders.Add("User-Agent", $"{PluginInfo.PLUGIN_NAME}/{PluginInfo.PLUGIN_VERSION}");

            configDiscordWebhookUrl = Config.Bind("Discord", "Webhook URL", "", "Discord webhook URL");
            configSendDiscordWebhook = Config.Bind("Discord", "Send webhook", true, "Send Discord webhook");

            if (!(configDiscordWebhookUrl.Value.Equals("")))
            {
                var Discord = new DiscordWebhookClient(httpClient, configDiscordWebhookUrl.Value);
                NotificationClients.Add(Discord);
            }

            Log.LogInfo($"{NotificationClients.Count} notification client(s) loaded.");
            NotificationClients.ForEach(async w => await w.SendMessageAsync("Plugin loaded!"));

            Harmony.CreateAndPatchAll(Assembly.GetExecutingAssembly());
        }

        [HarmonyPatch]
        public static class PanelPatch
        {
            static IEnumerable<MethodBase> TargetMethods()
            {
                MethodInfo[] methods = typeof(Panel_MessageBox).GetMethods();
                return methods.Where(method => method.Name == "SetMessage").Cast<MethodBase>();
            }

            static void Postfix(object[] __args, MethodBase __originalMethod)
            {
                string msg = (string)__args[0];
                Log.LogInfo("msg: " + msg);

                if (msg.StartsWith("以下の理由で、これ以上反復戦闘が行えません。"))
                {
                    string data = msg.Replace(Environment.NewLine, "\n");
                    NotificationClients.ForEach(w => w.SendMessageAsync(data));
                }
            }
        }
    }
}
