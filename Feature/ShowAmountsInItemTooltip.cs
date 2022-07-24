using HarmonyLib;

namespace LAOPLUS.Feature
{
    [HarmonyPatch(
        typeof(Panel_ItemTooltip),
        nameof(Panel_ItemTooltip.SetItemTooltip),
        typeof(Table_ItemConsumable)
    )]
    public class ShowAmountsInItemTooltip
    {
        public static void Postfix(Panel_ItemTooltip __instance, Table_ItemConsumable tableConsume)
        {
            LAOPLUS.Log.LogInfo($"ShowAmountsInItemTooltip.Postfix: {tableConsume.ItemName}");
            var amounts = SingleTon<DataManager>.Instance.GetItemConsumableStackCount(
                tableConsume.Key
            );
            // ラベルの扱いはWarehouseの表記と合わせると良さそう（右寄せ・サイズ変動）
            __instance._lblEnchantLevel.overflowMethod = UILabel.Overflow.ResizeFreely;
            __instance._lblEnchantLevel.text = $"x{amounts}";
        }
    }
}
