using HarmonyLib;

namespace LAOPLUS.Feature
{
    /// <summary>
    /// タイトル画面のバージョン情報にLAOPLUSのバージョンを表示する機能
    /// </summary>
    [HarmonyPatch(typeof(Panel_Title), nameof(Panel_Title.Start))]
    public static class TitleScreenVersion
    {
        static void Postfix(Panel_Title __instance)
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
