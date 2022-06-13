using System.Text.RegularExpressions;
using HarmonyLib;
using LO_ClientNetwork;

namespace LAOPLUS.Feature
{
    [HarmonyPatch(
        typeof(Panel_StageBattle),
        nameof(Panel_StageBattle.OnEventChangeStateRoundEnding)
    )]
    public class WaveDropNotification
    {
        static string CreateUnitTbarIconUrl(string key)
        {
            var id = Regex.Replace(key, "^Char_", "");
            return $"https://lo.swaytwig.com/assets/webp/tbar/TbarIcon_{id}.webp";
        }

        static string CreateItemIconUrl(string key)
        {
            return $"https://lo.swaytwig.com/assets/webp/item/UI_Icon_{key}.webp";
        }

        static string CreateUnitSwaytwigPageUrl(string key)
        {
            var key1 = Regex.Replace(key, "^Char_", "");
            var key2 = Regex.Replace(key1, "_N$", "");
            return $"https://lo.swaytwig.com/units/{key2}";
        }

        static string CreateEquipSwaytwigPageUrl(string key)
        {
            var key1 = Regex.Replace(key, "^Equip_", "");
            return $"https://lo.swaytwig.com/equips/{key1}";
        }

        static void NotifyUnit(GiveRewardPCInfo pc)
        {
            LAOPLUS.Log.LogInfo($"Drop PC: {pc.PCKeyString}");
            var unit = SingleTon<DataManager>.Instance.GetTablePC(pc.PCKeyString);

            LAOPLUS.SendUnitDropNotificationToAllNotificationClients(
                unit.Name,
                CreateUnitSwaytwigPageUrl(pc.PCKeyString),
                CreateUnitTbarIconUrl(unit.Key)
            );

            LAOPLUS.Log.LogDebug($"Drop PC Name: {unit.Name}");
            LAOPLUS.Log.LogDebug($"Drop PC URL: {CreateUnitSwaytwigPageUrl(pc.PCKeyString)}");
            LAOPLUS.Log.LogDebug($"Drop PC Image URL: {CreateUnitTbarIconUrl(unit.Key)}");
        }

        static void NotifyEquip(ItemInfo item)
        {
            var dm = SingleTon<DataManager>.Instance;

            // itemはItemConsumableかItemEquipかItemMaterialの可能性があるが、ここではItemEquip以外関心がない
            var itemEquip = dm.GetTableItemEquip(item.ItemKeyString);
            if (itemEquip == null)
            {
                return;
            }

            LAOPLUS.SendItemDropNotificationToAllNotificationClients(
                itemEquip.ItemName,
                itemEquip.ItemDesc_Detail,
                CreateEquipSwaytwigPageUrl(itemEquip.Key),
                CreateItemIconUrl(itemEquip.Key)
            );

            LAOPLUS.Log.LogDebug($"Drop Item Name: {itemEquip.ItemName}");
            LAOPLUS.Log.LogDebug($"Drop Item Desc: {itemEquip.ItemDesc_Detail}");
            LAOPLUS.Log.LogDebug($"Drop Item URL: {CreateEquipSwaytwigPageUrl(itemEquip.Key)}");
            LAOPLUS.Log.LogDebug($"Drop Item Image URL: {CreateItemIconUrl(itemEquip.Key)}");
        }

        static void Postfix(S2C_CHANGE_WAVE_BEGIN waveEndData)
        {
            var reward = waveEndData.ClearRewardInfo;

            if (LAOPLUS.ConfigUnitDropNotificationEnabled.Value)
            {
                foreach (var pc in reward.PCRewardList)
                {
                    // TODO: 通知するレアリティなどを指定できるようにする
                    // SS以外は流す
                    if (pc.Grade != 5)
                    {
                        continue;
                    }

                    NotifyUnit(pc);
                }
            }

            if (LAOPLUS.ConfigEquipItemDropNotificationEnabled.Value)
            {
                foreach (var item in reward.ItemRewardList)
                {
                    // TODO: 通知するレアリティなどを指定できるようにする
                    // SS以外は流す
                    if (!item.ItemKeyString.Contains("T4"))
                    {
                        continue;
                    }

                    NotifyEquip(item);
                }
            }
        }
    }
}
