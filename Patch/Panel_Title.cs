using HarmonyLib;

namespace LAOPLUS
{
    [HarmonyPatch(typeof(Panel_Title), nameof(Panel_Title.Start))]
    public static class TitlePatch
    {
        static void Postfix(Panel_Title __instance)
        {
            __instance._lblVersion.text += $"\n{PluginInfo.PLUGIN_NAME} {PluginInfo.PLUGIN_VERSION}";
            if (Plugin.configVerboseLogging.Value)
            {
                Plugin.Log.LogInfo($"TitlePatch: {__instance._lblVersion.text}");
            }
        }
    }

}
