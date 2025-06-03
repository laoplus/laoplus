using System.Diagnostics.CodeAnalysis;
using System.Linq;
using HarmonyLib;
using Il2CppSystem.Collections.Generic;

namespace LAOPLUS.Feature
{
    [HarmonyPatch]
    public class BGMToBeBGM
    {
        class Music
        {
            public string Key { get; }
            string Name { get; }
            string Res { get; }
            string Desc { get; }
            int Type { get; }
            string BGMIcon { get; }

            public Music(
                string key,
                string name,
                string res,
                string desc = "",
                int type = 1,
                string bgmIcon = "UI_Icon_02_BGM_Lobby"
            )
            {
                Key = key;
                Name = name;
                Res = res;
                Desc = desc;
                Type = type;
                BGMIcon = bgmIcon;
            }

            public Table_LobbyBGM ToTable()
            {
                return new Table_LobbyBGM(
                    Key,
                    Name,
                    (Desc + " (Added by LAOPLUS)").Trim(),
                    Res,
                    Type,
                    new List<string>(),
                    "",
                    BGMIcon
                );
            }
        }

        [SuppressMessage("ReSharper", "StringLiteralTypo")]
        [SuppressMessage("ReSharper", "CommentTypo")]
        static readonly System.Collections.Generic.List<Music> ScenarioBGMList =
            new()
            {
                // 格納場所が違うためそのままでは流せない
                // new Music("01_BGM_Title", "Title", "01 BGM_Title", "BGM 01"),
                // 元からあるので追加しない
                // new Music("02_BGM_Lobby", "Lobby", "02 BGM_Lobby", "BGM 02"),
                new Music("03_BGM_Battle_01", "Battle 1", "03 BGM_Battle_01", "BGM 03"),
                new Music(
                    "04_BGM_Battle_Boss_01",
                    "Battle BOSS 1",
                    "04 BGM_Battle_Boss_01",
                    "BGM 04"
                ),
                new Music("05_BGM_Battle_02", "Battle 2", "05 BGM_Battle_02", "BGM 05"),
                new Music(
                    "06_BGM_Battle_Boss_02",
                    "Battle BOSS 2",
                    "06 BGM_Battle_Boss_02",
                    "BGM 06"
                ),
                new Music("07_BGM_Talk_01", "Talk 1", "07 BGM_Talk_01", "BGM 07"),
                new Music("08_BGM_Talk_02", "Talk 2", "08 BGM_Talk_02", "BGM 08"),
                new Music("09_BGM_Talk_03", "Talk 3", "09 BGM_Talk_03", "BGM 09"),
                new Music("10_BGM_Talk_04", "Talk 4", "10 BGM_Talk_04", "BGM 10"),
                new Music("11_BGM_Talk_05", "Talk 5", "11 BGM_Talk_05", "BGM 11"),
                new Music("12_BGM_Battle_03", "Battle 3", "12 BGM_Battle_03", "BGM 12"),
                new Music("13_BGM_Christmas_01", "Christmas 1", "13 BGM_Christmas_01", "BGM 13"),
                // 元からあるので追加しない
                // new Music("14_BGM_Christmas_02", "Christmas 2", "14 BGM_Christmas_02", "BGM 14"),
                // 無意味なので追加しない
                // new Music("15_BGM_Empty", "Empty", "15 BGM_Empty", "BGM 15"),
                new Music("16_BGM_Marriage_01", "Marriage 1", "16 BGM_Marriage_01", "BGM 16"),
                new Music("17_BGM_Marriage_02", "Marriage 2", "17 BGM_Marriage_02", "BGM 17"),
                new Music(
                    "18_BGM_Forest_of_Elves",
                    "Forest of Elves",
                    "18 BGM_Forest_of_Elves",
                    "BGM 18"
                ),
                new Music("19_BGM_Summer_01", "Summer 1", "19 BGM_Summer_01", "BGM 19"),
                new Music("20_BGM_Summer_02", "Summer 2", "20 BGM_Summer_02", "BGM 20"),
                new Music("21_BGM_Thrill_01", "Thrill 1", "21 BGM_Thrill_01", "BGM 21"),
                new Music("22_BGM_Battle_04", "Battle 4", "22 BGM_Battle_04", "BGM 22"),
                new Music("23_BGM_Noire_01", "Noire 1", "23 BGM_Noire_01", "BGM 23"),
                new Music("24_BGM_Noire_02", "Noire 2", "24 BGM_Noire_02", "BGM 24"),
                new Music("25_BGM_Mystic", "Mystic", "25 BGM_Mystic", "BGM 25"),
                new Music("26_BGM_Talk_06", "Talk 6", "26 BGM_Talk_06", "BGM 26"),
                new Music("27_BGM_Talk_07", "Talk 7", "27 BGM_Talk_07", "BGM 27"),
                new Music("28_BGM_IronPrince", "IronPrince", "28 BGM_IronPrince", "BGM 28"),
                new Music("29_BGM_Sanctum", "Sanctum", "29 BGM_Sanctum", "BGM 29"),
                new Music("30_BGM_Battle_05", "Battle 5", "30 BGM_Battle_05", "BGM 30"),
                new Music(
                    "31_BGM_Battle_Boss_03",
                    "Battle BOSS 3",
                    "31 BGM_Battle_Boss_03",
                    "BGM 31"
                ),
                new Music(
                    "32_BGM_LoverLover",
                    "LoverLover (Instrumental)",
                    "32 BGM_LoverLover",
                    "BGM 32"
                ),
                new Music(
                    "33_BGM_HeartbeatOME",
                    "HeartbeatOME (Instrumental)",
                    "33 BGM_HeartbeatOME",
                    "BGM 33"
                ),
                // 以下現状未使用のため追加しない
                // new Music("34_BGM_Starlight", "", "34 BGM_Starlight", "BGM 34"),
                // new Music("35_BGM_SongForYou", "", "35 BGM_SongForYou", "BGM 35"),
                // new Music("36_BGM_WithYou_01", "", "36 BGM_WithYou_01", "BGM 36"),
                // new Music("37_BGM_WithYou_02", "", "37 BGM_WithYou_02", "BGM 37"),
                // new Music("38_BGM_Moment", "", "38 BGM_Moment", "BGM 38"),
                // new Music("39_BGM_MyLove_01", "", "39 BGM_MyLove_01", "BGM 39"),
                // new Music("40_BGM_MyLove_02", "", "40 BGM_MyLove_02", "BGM 40"),
                // 元からあるので追加しない
                // new Music("41_BGM_Valentine_01", "", "41 BGM_Valentine_01", "BGM 41"),
                // Ev17で使用済み
                new Music(
                    "42_BGM_ArkofMemory_01",
                    "Ark of Memory 1",
                    "42 BGM_ArkofMemory_01",
                    "BGM 42"
                ),
                // new Music("43_BGM_ArkofMemory_02", "", "43 BGM_ArkofMemory_02", "BGM 43"),
                // Ev17で使用済み
                new Music("44_BGM_MemoryofTime", "Memory of Time", "44 BGM_MemoryofTime", "BGM 44"),
                // new Music("45_BGM_EndofFarewell_01", "", "45 BGM_EndofFarewell_01", "BGM 45"),
                // new Music("46_BGM_EndofFarewell_02", "", "46 BGM_EndofFarewell_02", "BGM 46"),
                // new Music("47_BGM_GrayClouds", "", "47 BGM_GrayClouds", "BGM 47"),
                // new Music("48_BGM_ParfaitLOVE_01", "", "48 BGM_ParfaitLOVE_01", "BGM 48"),
                // new Music("49_BGM_ParfaitLOVE_02", "", "49 BGM_ParfaitLOVE_02", "BGM 49"),
            };

        [HarmonyPatch(typeof(DataManager), nameof(DataManager.GetTableLobbyBGMList))]
        public static class Class1
        {
            static void Postfix(List<Table_LobbyBGM> __result)
            {
                foreach (var music in ScenarioBGMList)
                {
                    __result.Add(music.ToTable());
                }
            }
        }

        [HarmonyPatch(typeof(DataManager), nameof(DataManager.GetTableLobbyBGM), typeof(string))]
        public static class Class2
        {
            static void Postfix(ref Table_LobbyBGM __result, string bgmKey)
            {
                LAOPLUS.Log.LogDebug($"Loading BGMKey: {bgmKey}");

                if (__result == null)
                {
                    LAOPLUS.Log.LogDebug(
                        $"Perhaps {bgmKey} is not official BGM. Trying to load from LAOPLUS BGM list..."
                    );
                    foreach (var music in ScenarioBGMList.Where(music => bgmKey == music.Key))
                    {
                        __result = music.ToTable();
                    }
                }

                if (__result == null)
                {
                    LAOPLUS.Log.LogError(
                        $"Finally, the BGM {bgmKey} was not found. Fallback to default..."
                    );
                    var dm = SingleTon<DataManager>.Instance;
                    __result = dm.GetTableLobbyBGMDefault();
                }
            }
        }
    }
}
