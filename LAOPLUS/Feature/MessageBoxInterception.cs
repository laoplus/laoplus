using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using HarmonyLib;

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

        static void Postfix(object[] __args)
        {
            var msg = (string)__args[0];
            LAOPLUS.Log.LogDebug($"Panel_MessageBox.SetMessage: {msg}");

            if (msg.StartsWith("以下の理由で、これ以上反復戦闘が行えません。"))
            {
                LAOPLUS.SendMessageToAllNotificationClients(msg);
            }
        }
    }
}
