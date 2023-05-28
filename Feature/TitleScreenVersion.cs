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
                $"\n{MyPluginInfo.PLUGIN_NAME} {MyPluginInfo.PLUGIN_VERSION}";
            LAOPLUS.Log.LogDebug($"TitlePatch: {__instance._lblVersion.text}");
        }
    }
}
