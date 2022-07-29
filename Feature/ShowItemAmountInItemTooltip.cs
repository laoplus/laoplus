using HarmonyLib;

namespace LAOPLUS.Feature
{
    [HarmonyPatch(typeof(Panel_ItemTooltip))]
    public class ShowAmountsInItemTooltip
    {
        static void SetLabel(UIGrid grid, int amount)
        {
            var label = grid.gameObject.GetComponentInChildren<UILabel>();
            label.text = $"{amount:N0}個所持\n{label.text}";
        }

        [HarmonyPostfix]
        [HarmonyPatch(nameof(Panel_ItemTooltip.SetItemTooltip), typeof(Table_ItemConsumable))]
        public static void ConsumableTooltip(
            Panel_ItemTooltip __instance,
            Table_ItemConsumable tableConsume
        )
        {
            LAOPLUS.Log.LogDebug($"ConsumableTooltip.Postfix: {tableConsume.Key}");
            var amount = SingleTon<DataManager>.Instance.GetItemConsumableStackCount(
                tableConsume.Key
            );
            SetLabel(__instance._grid, amount);
        }

        [HarmonyPostfix]
        [HarmonyPatch(nameof(Panel_ItemTooltip.SetItemTooltip), typeof(Table_ItemEquip))]
        public static void ItemTooltip(Panel_ItemTooltip __instance, Table_ItemEquip tableEquip)
        {
            LAOPLUS.Log.LogDebug($"ItemTooltip.Postfix: {tableEquip.Key}");
            var items = SingleTon<DataManager>.Instance._invenItemInfo;
            var amount = 0;
            foreach (var item in items)
            {
                if (item.ItemKeyString == tableEquip.Key)
                {
                    amount++;
                }
            }

            SetLabel(__instance._grid, amount);
        }
    }
}
