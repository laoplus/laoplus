using HarmonyLib;

namespace LAOPLUS.Feature
{
    /// <summary>
    /// ホイールスクロールに関連する機能
    /// </summary>
    [HarmonyPatch]
    public static class ScrollTweak
    {
        [HarmonyPrefix]
        [HarmonyPatch(typeof(UIReuseScrollView), nameof(UIReuseScrollView.Scroll))]
        [HarmonyPatch(typeof(UIScrollView), nameof(UIScrollView.Scroll))]
        static void Prefix(ref float delta)
        {
            delta *= LAOPLUS.ConfigScrollPatchMultiplier.Value;
            LAOPLUS.Log.LogDebug($"ScrollPatch: {delta}");
        }

        [HarmonyPatch(
            typeof(UIReuseScrollView),
            nameof(UIReuseScrollView.RestrictWithinBounds),
            typeof(bool),
            typeof(bool),
            typeof(bool)
        )]
        public static class ScrollingOoBPatchForUIReuseScrollView
        {
            static void Prefix(UIReuseScrollView __instance)
            {
                if (LAOPLUS.ConfigPreventsScrollingOoB.Value)
                {
                    __instance.dragEffect = UIReuseScrollView.DragEffect.Momentum;
                }
            }
        }

        [HarmonyPatch(
            typeof(UIScrollView),
            nameof(UIScrollView.RestrictWithinBounds),
            typeof(bool),
            typeof(bool),
            typeof(bool)
        )]
        public static class ScrollingOoBPatchForUIScrollView
        {
            static void Prefix(UIScrollView __instance)
            {
                if (LAOPLUS.ConfigPreventsScrollingOoB.Value)
                {
                    __instance.dragEffect = UIScrollView.DragEffect.Momentum;
                }
            }
        }
    }
}
