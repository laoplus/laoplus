using HarmonyLib;

namespace LAOPLUS.Feature
{
    [HarmonyPatch(typeof(LobbyCamera), nameof(LobbyCamera.Awake))]
    public class LobbyCameraNoRevert
    {
        static void Prefix(ref LobbyCamera __instance)
        {
            // if (LAOPLUS.ConfigInstantRerollOnPremiumLoginRewardEnabled.Value)
            // {
            __instance.kMoveRevertSpeed = 0;
            // }
        }
    }
}
