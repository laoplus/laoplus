using HarmonyLib;

using Il2CppList = Il2CppSystem.Collections.Generic.List<ClientItemInfo>;

namespace LAOPLUS.Feature
{
    [HarmonyPatch(typeof(Panel_ItemTooltip))]
    public class ShowAmountsInItemTooltip
    {
        [HarmonyPostfix]
        [HarmonyPatch(nameof(Panel_ItemTooltip.SetItemTooltip), typeof(Table_ItemConsumable))]
        public static void ConsumableTooltip(
            Panel_ItemTooltip __instance,
            Table_ItemConsumable tableConsume
        )
        {
            LAOPLUS.Log.LogInfo($"ConsumableTooltip.Postfix: {tableConsume.Key}");
            var amounts = SingleTon<DataManager>.Instance.GetItemConsumableStackCount(
                tableConsume.Key
            );
            // ラベルの扱いはWarehouseの表記と合わせると良さそう（右寄せ・サイズ変動）
            __instance._lblEnchantLevel.overflowMethod = UILabel.Overflow.ResizeFreely;
            __instance._lblEnchantLevel.text = $"x{amounts}";
        }

        [HarmonyPostfix]
        [HarmonyPatch(nameof(Panel_ItemTooltip.SetItemTooltip), typeof(Table_ItemEquip))]
        public static void ItemTooltip(Panel_ItemTooltip __instance, Table_ItemEquip tableEquip)
        {

            LAOPLUS.Log.LogInfo($"ItemTooltip.Postfix: {tableEquip.Key}");
            var items = SingleTon<DataManager>.Instance._invenItemInfo;
            var amounts2 = items.Select(x => x.Key).Where(x => x == tableEquip.Key).ToList();
            // var amounts = items.Cast<System.Collections.Generic.List<ClientItemInfo>>();
            var amounts = 0;
            foreach (var item in items)
            {
                if (item.ItemKeyString == tableEquip.Key)
                {
                    amounts++;
                }
            }

            // ラベルの扱いはWarehouseの表記と合わせると良さそう（右寄せ・サイズ変動）
            __instance._lblEnchantLevel.overflowMethod = UILabel.Overflow.ResizeFreely;
            __instance._lblEnchantLevel.text = $"x{amounts}";
        }
    }
}
