using HarmonyLib;
using LOEventSystem.Msg;

namespace LAOPLUS
{
    [HarmonyPatch(typeof(Panel_StageBattle), nameof(Panel_StageBattle.OnEvent))]
    public static class LogBattleLog
    {
        static void Postfix(Base msg, Panel_StageBattle __instance)
        {
            if (Plugin.configLoggingBattleLog.Value)
            {
                if (msg.Type == LOEventSystem.eType.BattleLogText)
                {
                    var log = __instance._listBattleLog;
                    var latestLogText = log[log.Count - 1].GetComponent<UILabel>().text;
                    Plugin.Log.LogInfo($"BATTLELOG: {latestLogText}");

                    // why is not this working?
                    // BattleLogText battleLogText = msg as BattleLogText;
                    // Plugin.Log.LogInfo($"BATTLELOG: {battleLogText.logText}");
                }
            }
        }
    }

}
