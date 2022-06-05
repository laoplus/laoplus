using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace LAOPLUS
{
    [HarmonyPatch]
    public static class PanelPatch
    {
        static IEnumerable<MethodBase> TargetMethods()
        {
            MethodInfo[] methods = typeof(Panel_MessageBox).GetMethods();
            return methods.Where(method => method.Name == "SetMessage").Cast<MethodBase>();
        }

        static void Postfix(object[] __args, MethodBase __originalMethod)
        {
            string msg = (string)__args[0];
            if (Plugin.configVerboseLogging.Value)
            {
                Plugin.Log.LogInfo($"Panel_MessageBox.SetMessage: {msg}");
            }

            if (msg.StartsWith("以下の理由で、これ以上反復戦闘が行えません。"))
            {
                Plugin.NotificationClients.ForEach(async w => await w.SendMessageAsync(msg));
            }
        }
    }
}
