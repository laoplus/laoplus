using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using BepInEx.IL2CPP.Utils;
using HarmonyLib;
using UnityEngine;

namespace LAOPLUS.Feature
{
    /// <summary>
    /// メッセージボックスの表示をフックする機能
    /// 内容に応じた通知など
    /// </summary>
    [HarmonyPatch]
    public static class MessageBoxInterception
    {
        static IEnumerable<MethodBase> TargetMethods()
        {
            var methods = typeof(Panel_MessageBox).GetMethods();
            return methods.Where(method => method.Name == "SetMessage");
        }

        static void Postfix(Panel_MessageBox __instance)
        {
            __instance.StartCoroutine(Call(__instance));
        }

        static IEnumerator Call(Panel_MessageBox __instance)
        {
            // すぐに処理すると描画が欠けることがあるため1秒待つ
            yield return new WaitForSeconds(1);

            LAOPLUS.Log.LogDebug($"Panel_MessageBox.SetMessage: {__instance.msg}");
            if (__instance.msg.StartsWith("以下の理由で、これ以上反復戦闘が行えません。"))
            {
                LAOPLUS.SendMessageToAllNotificationClients(__instance.msg);
            }
        }
    }
}
