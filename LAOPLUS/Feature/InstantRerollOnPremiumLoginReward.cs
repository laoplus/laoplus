using HarmonyLib;

namespace LAOPLUS.Feature
{
    [HarmonyPatch(typeof(Panel_Attendance), nameof(Panel_Attendance.Start))]
    public class InstantRerollOnPremiumLoginReward
    {
        static void Prefix(ref Panel_Attendance __instance)
        {
            if (LAOPLUS.ConfigInstantRerollOnPremiumLoginRewardEnabled.Value)
            {
                __instance._openDuration = 0;
            }
        }
    }
}
