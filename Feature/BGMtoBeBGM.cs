using HarmonyLib;
using Il2CppSystem.Collections.Generic;

namespace LAOPLUS.Feature
{
    [HarmonyPatch]
    public class BGMToBeBGM
    {
        static readonly Table_LobbyBGM Table = new Table_LobbyBGM(
            "32_BGM_LoverLover",
            "LoverLover(Instrumental)",
            "Added by LAOPLUS",
            "32 BGM_LoverLover",
            1,
            new List<string>(),
            "",
            "UI_Icon_02_BGM_Lobby"
        );

        [HarmonyPatch(typeof(DataManager), nameof(DataManager.GetTableLobbyBGMList))]
        public static class Class1
        {
            static void Postfix(List<Table_LobbyBGM> __result)
            {
                __result.Add(Table);
                LAOPLUS.Log.LogInfo("BGMToBeBGM Class1 Postfix");
            }
        }

        [HarmonyPatch(typeof(DataManager), nameof(DataManager.GetTableLobbyBGM), typeof(string))]
        public static class Class2
        {
            static void Postfix(ref Table_LobbyBGM __result, string bgmKey)
            {
                LAOPLUS.Log.LogInfo("BGMToBeBGM Class2 Postfix");
                LAOPLUS.Log.LogInfo("BGMKey: " + bgmKey);
                if (bgmKey == "32_BGM_LoverLover")
                {
                    __result = Table;
                }
                LAOPLUS.Log.LogInfo(__result.ToString());
            }
        }
    }
}
