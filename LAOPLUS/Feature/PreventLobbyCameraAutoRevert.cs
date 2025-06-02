using HarmonyLib;

namespace LAOPLUS.Feature
{
    [HarmonyPatch(typeof(LobbyCamera), nameof(LobbyCamera.CameraRevertUpdate))]
    public class PreventLobbyCameraAutoRevert
    {
        static bool Prefix()
        {
            // skip(return false) when enabled
            return !LAOPLUS.ConfigPreventLobbyCameraAutoRevertEnabled.Value;
        }
    }
}
