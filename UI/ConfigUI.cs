using System;
using System.Collections.Generic;
using System.Linq;
using HarmonyLib;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace LAOPLUS.UI
{
    public class ConfigUI : MonoBehaviour
    {
        public ConfigUI(IntPtr ptr) : base(ptr) { }

        const int WindowWidth = 500;
        const int WindowHeight = 200;

        Rect _windowRect = new Rect(10, 10, WindowWidth * 2f, WindowHeight * 2f);
        float _guiScale = 0.5f;
        bool _showWindow = true;
        bool _enableDvdMode;
        Vector2 _dvdMovingDirection = Vector2.one;
        const KeyCode ToggleKey = KeyCode.F1;
        Vector2 _scrollPosition;

        int _metal;
        int _nutrient;
        int _power;
        int _normalModule;
        int _advancedModule;
        int _specialModule;
        int _dropCount;
        readonly List<Table_PC> _obtainPcList = new();
        readonly List<string> _obtainPcLog = new();

        void OnGUI()
        {
            if (!this._showWindow)
            {
                return;
            }

            GUI.skin = CustomSkin.Skin;
            GUI.matrix = Matrix4x4.TRS(
                Vector3.zero,
                Quaternion.identity,
                new Vector3(this._guiScale, this._guiScale, 1)
            );

            this._windowRect = ClampToScreen(
                GUI.Window(
                    21,
                    this._windowRect,
                    (GUI.WindowFunction)WindowFunc,
                    $"{PluginInfo.PLUGIN_NAME} {PluginInfo.PLUGIN_VERSION} ({this._guiScale}x)"
                )
            );

            // this._windowRect = GUI.Window(
            //     0,
            //     this._windowRect,
            //     (GUI.WindowFunction)WindowFunc,
            //     $"{PluginInfo.PLUGIN_NAME} {PluginInfo.PLUGIN_VERSION}"
            // );
        }

        void Update()
        {
            if (Input.GetKeyDown(ToggleKey))
            {
                this._showWindow = !this._showWindow;
            }

            if (Input.GetKeyDown(KeyCode.Minus))
            {
                this._guiScale = Mathf.Max(0.5f, this._guiScale - 0.25f);
            }
            else if (Input.GetKeyDown(KeyCode.Equals))
            {
                this._guiScale = Mathf.Min(1, this._guiScale + 0.25f);
            }
            if (Input.GetKeyDown(KeyCode.F3))
            {
                this._enableDvdMode = !this._enableDvdMode;
            }
        }

        // moving rect like a bouncing dvd logo
        void Dvd()
        {
            var screenSizeMultiplier = 1 / this._guiScale;
            var screenWidth = Screen.width * screenSizeMultiplier;
            var screenHeight = Screen.height * screenSizeMultiplier;

            var rect = this._windowRect;
            rect.x += this._dvdMovingDirection.x;
            rect.y += this._dvdMovingDirection.y;

            if (rect.x < 0)
            {
                rect.x = 0;
                this._dvdMovingDirection.x *= -1;
            }
            else if (rect.x + rect.width > screenWidth)
            {
                rect.x = screenWidth - rect.width;
                this._dvdMovingDirection.x *= -1;
            }

            if (rect.y < 0)
            {
                rect.y = 0;
                this._dvdMovingDirection.y *= -1;
            }
            else if (rect.y + rect.height > screenHeight)
            {
                rect.y = screenHeight - rect.height;
                this._dvdMovingDirection.y *= -1;
            }

            this._windowRect = rect;
        }

        void FixedUpdate()
        {
            if (!this._showWindow)
            {
                return;
            }

            if (this._enableDvdMode)
            {
                // do 2 times per frame to make it faster moving
                for (var i = 0; i < 2; i++)
                {
                    Dvd();
                }
            }
        }

        void WindowFunc(int windowID)
        {
            const int s = CustomSkin.InternalRenderScale;
            const int padding = 1 * s;
            const int buttonWidth = 46 * s;
            const int buttonHeight = 32 * s;
            if (
                GUI.Button(
                    new Rect(
                        WindowWidth * s - buttonWidth - padding,
                        padding,
                        buttonWidth,
                        buttonHeight
                    ),
                    "",
                    CustomSkin.CloseButton
                )
            )
            {
                this._showWindow = false;
            }

            GUILayout.BeginHorizontal(CustomSkin.MainBox);

            var gm = SingleTon<GameManager>.Instance;

            GUILayout.BeginHorizontal();
            {
                GUILayout.Label($"Current Scene: {SceneManager.GetActiveScene().name}");
                if (GUILayout.Button("Reset"))
                {
                    LAOPLUS.Log.LogInfo("Button Reset");
                    ResetStats();
                }
            }
            GUILayout.EndHorizontal();

            GUILayout.BeginVertical(CustomSkin.ContentBox);
            {
                GUILayout.BeginHorizontal();
                {
                    GUILayout.Label($"Battle Repeat Count: {gm.BattleRepeatCount}");
                    GUILayout.Label($"Total Drop Count: {this._dropCount}");
                }
                GUILayout.EndHorizontal();

                GUILayout.BeginHorizontal();
                {
                    GUILayout.Label($"Metal: {this._metal}");
                    GUILayout.Label($"Nutrient: {this._nutrient}");
                    GUILayout.Label($"Power: {this._power}");
                }
                GUILayout.EndHorizontal();

                GUILayout.BeginHorizontal();
                {
                    GUILayout.Label($"Normal Module: {this._normalModule}");
                    GUILayout.Label($"Advanced Module: {this._advancedModule}");
                    GUILayout.Label($"Special Module: {this._specialModule}");
                }
                GUILayout.EndHorizontal();

                GUILayout.Label("Unit Acquired History:");
                this._scrollPosition = GUILayout.BeginScrollView(this._scrollPosition);
                {
                    // 新しい順に表示したいので逆順にする
                    var tempObtainPcLog = new List<string>(this._obtainPcLog);
                    tempObtainPcLog.Reverse();
                    foreach (var log in tempObtainPcLog)
                    {
                        GUILayout.Label(log);
                    }
                }
                GUILayout.EndScrollView();
            }
            GUILayout.EndVertical();

            GUILayout.EndHorizontal();

            GUI.DragWindow();
        }

        Rect ClampToScreen(Rect rect)
        {
            var screenSizeMultiplier = 1 / this._guiScale;
            rect.x = Mathf.Clamp(rect.x, 0, Screen.width * screenSizeMultiplier - rect.width);
            rect.y = Mathf.Clamp(rect.y, 0, Screen.height * screenSizeMultiplier - rect.height);

            return rect;
        }

        public void IncreaseBattleStats(Table_PC tablePc)
        {
            var dm = SingleTon<DataManager>.Instance;

            this._dropCount++;
            this._obtainPcList.Add(tablePc);
            this._obtainPcLog.Add(
                $"[{GradeToRank(tablePc.StartGrade)}] {dm.GetLocalization(tablePc.Name)}"
            );

            var researchMultipliers = Util.GetResearchMultipliers();

            var metal = 0;
            var nutrient = 0;
            var power = 0;
            var normalModule = 0;
            var advancedModule = 0;
            var specialModule = 0;

            foreach (var pc in this._obtainPcList)
            {
                var disassembleTable = dm.GetTableDisassemble(pc.Disassemblekey);
                metal += disassembleTable.MetalObtain;
                nutrient += disassembleTable.NutrientObtain;
                power += disassembleTable.PowerObtain;

                var itemCountClone = new List<int>();
                var itemKeyClone = new List<string>();
                foreach (var count in disassembleTable.GiveItemCount)
                {
                    itemCountClone.Add(count);
                }

                foreach (var itemKey in disassembleTable.GiveItemKeyString)
                {
                    itemKeyClone.Add(itemKey);
                }

                var itemCountDict = itemKeyClone
                    .Zip(itemCountClone, (k, v) => new { k, v })
                    .ToDictionary(x => x.k, x => x.v);

                foreach (var (key, count) in itemCountDict)
                {
                    switch (key)
                    {
                        case "Normal_Module":
                            normalModule += count;
                            break;
                        case "Advanced_Module":
                            advancedModule += count;
                            break;
                        case "Special_Module":
                            specialModule += count;
                            break;
                    }
                }
            }

            this._metal = (int)(metal * researchMultipliers.totalMultiplier);
            this._nutrient = (int)(nutrient * researchMultipliers.totalMultiplier);
            this._power = (int)(power * researchMultipliers.totalMultiplier);
            this._normalModule = normalModule;
            this._advancedModule = advancedModule;
            this._specialModule = specialModule;
        }

        static string GradeToRank(int grade)
        {
            return grade switch
            {
                1 => "",
                2 => "B",
                3 => "A",
                4 => "S",
                5 => "SS",
                _ => "??"
            };
        }

        void ResetStats()
        {
            this._metal = 0;
            this._nutrient = 0;
            this._power = 0;
            this._normalModule = 0;
            this._advancedModule = 0;
            this._specialModule = 0;
            this._dropCount = 0;
            this._obtainPcList.Clear();
            this._obtainPcLog.Clear();
        }
    }

    [HarmonyPatch(typeof(Panel_RewardCha), nameof(Panel_RewardCha.GetPc))]
    internal class GetPcEventWatcher
    {
        static void Postfix(Panel_RewardCha __instance, Table_PC tablePc)
        {
            // よくわからないがPanel_RewardCha以外のインスタンスで呼ばれることがある
            // その時にメンバを参照してしまうと落ちるのでスキップする
            // なぜ判定方法がこれなのかは謎

            if (!__instance.ToString().Contains("Panel_RewardCha"))
            {
                return;
            }
            if (tablePc.ToString() == "System.Action")
            {
                return;
            }

            LAOPLUS.Log.LogInfo($"tablePc: {tablePc.ToString()}");
            LAOPLUS.Log.LogInfo($"instance: {__instance.ToString()}");
            LAOPLUS.Log.LogInfo($"GetPc: {tablePc.Name}");

            var statsWindows = Resources.FindObjectsOfTypeAll<ConfigUI>();
            var statsWindow = statsWindows.FirstOrDefault();
            if (statsWindow == null)
            {
                LAOPLUS.Log.LogInfo("Not Found Sample");
                return;
            }

            statsWindow.IncreaseBattleStats(tablePc);
        }
    }
}
