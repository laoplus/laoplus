using HarmonyLib;

namespace LAOPLUS.Patch
{
    [HarmonyPatch(typeof(UIReuseScrollView), nameof(UIReuseScrollView.Scroll))]
    public static class ScrollPatch
    {
        static void Prefix(ref float delta)
        {
            delta = delta * LAOPLUS.ConfigScrollPatchMultiplier.Value;
            if (LAOPLUS.ConfigVerboseLogging.Value)
            {
                LAOPLUS.Log.LogInfo($"ScrollPatch: {delta}");
            }
        }
    }
}
