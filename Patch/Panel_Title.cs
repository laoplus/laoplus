using HarmonyLib;

namespace LAOPLUS.Patch
{
    [HarmonyPatch(typeof(Panel_Title), nameof(Panel_Title.Start))]
    public static class TitlePatch
    {
        private static void Postfix(Panel_Title __instance)
        {
            __instance._lblVersion.text +=
                $"\n{PluginInfo.PLUGIN_NAME} {PluginInfo.PLUGIN_VERSION}";
            if (LAOPLUS.ConfigVerboseLogging.Value)
            {
                LAOPLUS.Log.LogInfo($"TitlePatch: {__instance._lblVersion.text}");
            }
        }
    }
}
