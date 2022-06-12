using HarmonyLib;
using LOEventSystem;
using LOEventSystem.Msg;
using UnityEngine;

namespace LAOPLUS.Feature
{
    [HarmonyPatch(typeof(Panel_StageBattle), nameof(Panel_StageBattle.OnEvent))]
    public static class LogBattleLog
    {
        static void Postfix(Base msg, Panel_StageBattle __instance)
        {
            if (!LAOPLUS.ConfigLoggingBattleLog.Value)
            {
                return;
            }

            if (msg.Type != eType.BattleLogText)
            {
                return;
            }

            // msgから取り出すのは上手くいかなかったので、インスタンスの_listBattleLogから最新を取り出す

            var log = __instance._listBattleLog;
            var latestLogText = ((GameObject)log[^1]).GetComponent<UILabel>().text;
            LAOPLUS.Log.LogInfo($"BATTLE-LOG: {latestLogText}");
        }
    }
}
