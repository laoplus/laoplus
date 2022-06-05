using HarmonyLib;

namespace LAOPLUS
{
    [HarmonyPatch(typeof(UIReuseScrollView), nameof(UIReuseScrollView.Scroll))]
    public static class ScrollPatch
    {
        static void Prefix(ref float delta)
        {
            delta = delta * Plugin.configScrollPatchMultiplier.Value;
            if (Plugin.configVerboseLogging.Value)
            {
                Plugin.Log.LogInfo($"ScrollPatch: {delta}");
            }
        }
    }
}
