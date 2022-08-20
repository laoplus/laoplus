using GlobalDefines;
using HarmonyLib;

namespace LAOPLUS.Feature
{
    /// <summary>
    /// 「閉じる」しかアクションのないメッセージモーダルをトーストに変更する機能
    /// </summary>
    [HarmonyPatch(
        typeof(Panel_Base),
        nameof(Panel_Base.ShowMessage),
        typeof(string),
        typeof(MessageType),
        typeof(MessageDialogCallBack),
        typeof(MessageDialogCallBack)
    )]
    public class UselessMessageModalToToast
    {
        // ReSharper disable InconsistentNaming
        // ReSharper disable IdentifierTypo
        // ReSharper disable UnusedParameter.Local
        static bool Prefix(
            Panel_Base __instance,
            string message,
            MessageType mtype = MessageType.OK,
            MessageDialogCallBack eventYESOKCallback = null,
            MessageDialogCallBack eventNOCancelCallback = null
        )
        // ReSharper restore InconsistentNaming
        // ReSharper restore IdentifierTypo
        // ReSharper restore UnusedParameter.Local
        {
            LAOPLUS.Log.LogDebug("UselessMessageBuster: " + message);
            if (eventYESOKCallback != null || eventNOCancelCallback != null)
            {
                // do default behaviour
                return true;
            }

            __instance.ShowToastMsg(message);
            return false;
        }
    }
}
