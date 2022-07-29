using HarmonyLib;

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
            __instance._lblSimpleDesc.text = $"（{amounts}個所持）\n" + __instance._lblSimpleDesc.text;
        }

        [HarmonyPostfix]
        [HarmonyPatch(nameof(Panel_ItemTooltip.SetItemTooltip), typeof(Table_ItemEquip))]
        public static void ItemTooltip(Panel_ItemTooltip __instance, Table_ItemEquip tableEquip)
        {
            LAOPLUS.Log.LogInfo($"ItemTooltip.Postfix: {tableEquip.Key}");
            var items = SingleTon<DataManager>.Instance._invenItemInfo;
            var amounts = 0;
            foreach (var item in items)
            {
                if (item.ItemKeyString == tableEquip.Key)
                {
                    amounts++;
                }
            }

            __instance._lblSimpleDesc.text = $"（{amounts}個所持）\n" + __instance._lblSimpleDesc.text;
        }
    }
}
