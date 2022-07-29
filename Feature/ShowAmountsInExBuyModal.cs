using HarmonyLib;

namespace LAOPLUS.Feature
{
    [HarmonyPatch(typeof(Panel_ExShopBuyMsg), nameof(Panel_ExShopBuyMsg.SetExShopData))]
    public class ShowAmountsInExBuyModal
    {
        public static void Postfix(Panel_ExShopBuyMsg __instance)
        {
            var shopData = __instance._exShopData;
            LAOPLUS.Log.LogInfo($"ShowAmountsInExBuyModal.Postfix: {shopData.SellItemKeyString}");

            switch (shopData.SellItemKeyString)
            {
                // Equipで始まるものだと「設備研究施設品」が引っかかる
                case { } s
                    when s.StartsWith("Equip_Chip_")
                        || s.StartsWith("Equip_Sub_")
                        || s.StartsWith("Equip_System_"):
                {
                    var items = SingleTon<DataManager>.Instance._invenItemInfo;
                    var amounts = 0;
                    foreach (var item in items)
                    {
                        if (item.ItemKeyString == shopData.SellItemKeyString)
                        {
                            amounts++;
                        }
                    }

                    __instance._lblItemDesc.text =
                        $"（{amounts}個所持）\n" + __instance._lblItemDesc.text;
                    return;
                }
                case "Normal_Module":
                case "Advanced_Module":
                case "Special_Module":
                case { } s
                    when s.StartsWith("Consumable_")
                        || s.StartsWith("Ev_Consumable_")
                        || s.StartsWith("CharTicket_Char_Core_") // 代用コア
                        || s.StartsWith("Favor_MaxExpand_Lv1")
                        || s.StartsWith("TestItem_") // 急速完成回路・リンク解除器など
                        || s.StartsWith("Favor_") // ケーキ・花束
                        || s.StartsWith("RobotParts_")
                        || s.EndsWith("Parts_T1")
                        || s.EndsWith("Parts_T2")
                        || s.EndsWith("Parts_T3"):
                {
                    var amounts = SingleTon<DataManager>.Instance.GetItemConsumableStackCount(
                        shopData.SellItemKeyString
                    );

                    __instance._lblItemDesc.text =
                        $"{amounts:N0}個所持\n" + __instance._lblItemDesc.text;
                    return;
                }
            }
        }
    }
}
