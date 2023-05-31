using HarmonyLib;
using LAOPLUS.Singleton;

namespace LAOPLUS.Feature
{
    [HarmonyPatch(typeof(Panel_RewardCha), nameof(Panel_RewardCha.GetPc))]
    public static class StatsCollector
    {
        static void Postfix(Panel_RewardCha __instance, Table_PC tablePc)
        {
            // よくわからないがPanel_RewardCha以外のインスタンスで呼ばれることがある
            // その時にメンバを参照してしまうと落ちるのでスキップする
            // 判定方法がこれでいいのかは謎

            if (!__instance.ToString().Contains("Panel_RewardCha"))
            {
                return;
            }

            if (tablePc.ToString() == "System.Action")
            {
                return;
            }

            LAOPLUS.Log.LogDebug($"Panel_RewardCha.tablePc: {tablePc.ToString()}");
            LAOPLUS.Log.LogDebug($"Panel_RewardCha.instance: {__instance.ToString()}");
            LAOPLUS.Log.LogDebug($"Panel_RewardCha.GetPc: {tablePc.Name}");

            var statsManager = StatsManager.Instance;
            statsManager.IncreaseBattleStats(tablePc);
        }
    }
}
