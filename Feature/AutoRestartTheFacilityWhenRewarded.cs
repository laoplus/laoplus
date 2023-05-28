using System;
using System.Collections;
using BepInEx.Unity.IL2CPP.Utils;
using HarmonyLib;

namespace LAOPLUS.Feature
{
    [HarmonyPatch]
    [HarmonyPatch(typeof(Panel_FacilityRewardResult), nameof(Panel_FacilityRewardResult.Awake))]
    public class AutoRestartTheFacilityWhenRewarded
    {
        static IEnumerator AutoClickRestart(Panel_FacilityRewardResult __instance)
        {
            var buttons = __instance.gameObject.GetComponentsInChildren<UIButton>();
            foreach (var button in buttons)
            {
                if (button.name != "RestartButton")
                {
                    continue;
                }

                //すぐ実行するとnull参照になるから1f待つ
                yield return null;

                try
                {
                    button.OnClick();
                }
                catch (Exception e)
                {
                    LAOPLUS.Log.LogError(e.ToString());
                }
            }
        }

        static void Postfix(Panel_FacilityRewardResult __instance)
        {
            if (LAOPLUS.ConfigAutoPressRestartWhenRewarded.Value)
            {
                __instance.StartCoroutine(AutoClickRestart(__instance));
            }
        }
    }
}
