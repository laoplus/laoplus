using HarmonyLib;

namespace LAOPLUS.Feature
{
    /// <summary>
    /// ホイールスクロールに関連する機能
    /// </summary>
    [HarmonyPatch(typeof(UIReuseScrollView), nameof(UIReuseScrollView.Scroll))]
    public static class ScrollTweak
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
