using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using BepInEx.Unity.IL2CPP;
using HarmonyLib;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace LAOPLUS.UI;

public class ConfigUI : MonoBehaviour
{
    public BasePlugin Plugin { get; set; }

    const int InitialWindowWidth = 500;
    const int MinimumWindowWidth = 300;
    const int InitialWindowHeight = 200;
    const int MinimumWindowHeight = 100;

    Rect _windowRect = new Rect(10, 10, InitialWindowWidth * 2f, InitialWindowHeight * 2f);
    float _guiScale = 0.5f;
    bool _showWindow = true;
    bool _enableDvdMode;
    Vector2 _dvdMovingDirection = Vector2.one;
    const KeyCode ToggleKey = KeyCode.F1;
    Vector2 _scrollPosNavArea;
    Vector2 _scrollPosContentArea;

    int _metal;
    int _nutrient;
    int _power;
    int _normalModule;
    int _advancedModule;
    int _specialModule;
    int _dropCount;
    readonly List<Table_PC> _obtainPcList = new();
    readonly List<string> _obtainPcLog = new();

    bool _isResizing;

    enum Navigation
    {
        Config,
        About,
        Debug
    }

    Navigation _selectedNav = Navigation.Config;
    string _latestVersion;
    bool? _isLatestVersion = null;

    GUIStyle GetNavButtonStyle(Navigation nav)
    {
        return nav == this._selectedNav ? CustomSkin.NavButtonSelected : CustomSkin.NavButton;
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

        this._windowRect = Util.ClampToScreen(
            GUI.Window(
                21,
                this._windowRect,
                (GUI.WindowFunction)WindowFunc,
                $"{MyPluginInfo.PLUGIN_NAME} {MyPluginInfo.PLUGIN_VERSION} ({this._guiScale}x) ({this._windowRect.width}x{this._windowRect.height})"
            ),
            this._guiScale
        );

        HandleMouseOver();
        HandleResizeGrip();
    }

    // クリック貫通の防止に関する処理
    void HandleMouseOver()
    {
        if (Event.current.type != EventType.Repaint)
        {
            return;
        }

        if (this._isResizing)
        {
            OnMouseEnter();
            return;
        }

        if (this._windowRect.Contains(Event.current.mousePosition))
        {
            OnMouseEnter();
        }
        else
        {
            OnMouseExit();
        }
    }

    void OnMouseEnter()
    {
        UICamera.ignoreAllEvents = true;
    }

    void OnMouseExit()
    {
        UICamera.ignoreAllEvents = false;
    }

    // リサイズグリップの処理
    void HandleResizeGrip()
    {
        var setResizeCursor = this._isResizing;

        if (Util.IsCursorNearResizeGrip(this._windowRect))
        {
            setResizeCursor = true;
        }

        if (!Util.IsCursorWithinGameScreen())
        {
            setResizeCursor = false;
        }

        // Update cursor
        Util.SetCursor(setResizeCursor ? Util.CursorType.ResizeNs : Util.CursorType.Default);

        // Handle mouse events
        if (Event.current.type == EventType.MouseDown)
        {
            if (Util.IsCursorNearResizeGrip(this._windowRect))
            {
                this._isResizing = true;
            }
        }
        else if (Event.current.type == EventType.MouseUp)
        {
            this._isResizing = false;
        }
        else if (Event.current.type == EventType.MouseDrag)
        {
            if (!this._isResizing || !Util.IsCursorWithinGameScreen())
            {
                return;
            }

            this._windowRect.width = Mathf.Max(
                MinimumWindowWidth * CustomSkin.InternalRenderScale,
                Event.current.mousePosition.x - this._windowRect.x
            );
            this._windowRect.height = Mathf.Max(
                MinimumWindowHeight * CustomSkin.InternalRenderScale,
                Event.current.mousePosition.y - this._windowRect.y
            );
        }
    }

    // _showWindowをfalseにしたときに行うべき処理をまとめたもの
    void ClosePostTreatment()
    {
        OnMouseExit();
        Util.SetCursor(Util.CursorType.Default);
    }

    void Update()
    {
        if (Input.GetKeyDown(ToggleKey))
        {
            this._showWindow = !this._showWindow;
            if (!this._showWindow)
            {
                ClosePostTreatment();
            }
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
                    this._windowRect.width - buttonWidth - padding,
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
            ClosePostTreatment();
        }

        // title bar for dragging
        var titleBarRect = new Rect(
            padding,
            padding,
            this._windowRect.width - padding * 2,
            buttonHeight
        );
        GUI.Box(titleBarRect, "", GUIStyle.none);
        GUI.DragWindow(titleBarRect);

        GUILayout.BeginHorizontal(CustomSkin.MainBox);

        // navigation
        this._scrollPosNavArea = GUILayout.BeginScrollView(
            this._scrollPosNavArea,
            GUILayout.MinWidth(220 * s),
            GUILayout.MaxWidth(220 * s)
        );
        {
            if (GUILayout.Button("Config", GetNavButtonStyle(Navigation.Config)))
            {
                this._selectedNav = Navigation.Config;
            }
            if (GUILayout.Button("About", GetNavButtonStyle(Navigation.About)))
            {
                this._selectedNav = Navigation.About;
            }
            if (GUILayout.Button("Debug", GetNavButtonStyle(Navigation.Debug)))
            {
                this._selectedNav = Navigation.Debug;
            }
        }
        GUILayout.EndScrollView();

        // content
        this._scrollPosContentArea = GUILayout.BeginScrollView(this._scrollPosContentArea);
        {
            switch (this._selectedNav)
            {
                case Navigation.Config:
                    RenderConfig();
                    break;
                case Navigation.About:
                    RenderAbout();
                    break;
                case Navigation.Debug:
                    RenderDebug();
                    break;
            }
        }
        GUILayout.EndScrollView();

        GUILayout.EndHorizontal();
    }

    void RenderConfig()
    {
        var values = Plugin.Config.Values;
        foreach (var entry in values)
        {
            GUILayout.BeginHorizontal();
            {
                GUILayout.Label($@"[{entry.Definition.Section}] {entry.Definition.Key}");
                GUILayout.Label(entry.BoxedValue.ToString());
            }
            GUILayout.EndHorizontal();
        }
    }

    void RenderAbout()
    {
        GUILayout.BeginVertical();
        {
            if (GUILayout.Button(SkinTex.BrandingHeader))
            {
                Application.OpenURL("https://github.com/laoplus/laoplus");
            }
            GUILayout.Label($"ver {MyPluginInfo.PLUGIN_VERSION}", CustomSkin.CenteredLabel);
            GUILayout.Label($"by Eai and LAOPLUS Contributors", CustomSkin.CenteredLabel);
            GUILayout.Label(
                $"Unity {BepInEx.Unity.Common.UnityInfo.Version}",
                CustomSkin.CenteredLabel
            );
            GUILayout.Label(
                $"{this._guiScale}x ({this._windowRect.width}x{this._windowRect.height})"
            );
            if (GUILayout.Button("Check for Updates"))
            {
                // create a new thread to avoid blocking the main thread
                new Thread(() =>
                {
                    try
                    {
                        // TODO: use github api to get latest version
                        this._isLatestVersion = false;
                    }
                    catch (Exception e)
                    {
                        LAOPLUS.Log.LogError(e);
                    }
                }).Start();
                if (this._isLatestVersion != null)
                {
                    GUILayout.Label(
                        this._isLatestVersion == true
                            ? $"You are using the latest version of LAOPLUS"
                            : $"There is a newer version of LAOPLUS available",
                        CustomSkin.CenteredLabel
                    );
                }
            }
        }
        GUILayout.EndVertical();
    }

    void RenderDebug()
    {
        Vector2 scrollPos = default;
        var gm = SingleTon<GameManager>.Instance;

        GUILayout.Label($"Current Scene: {SceneManager.GetActiveScene().name}");

        GUILayout.BeginVertical();
        {
            if (GUILayout.Button("Reset Stats"))
            {
                ResetStats();
            }
            GUILayout.Space(0f);
            GUILayout.Label($"Battle Repeat Count: {gm.BattleRepeatCount}");
            GUILayout.Label($"Total Drop Count: {this._dropCount}");

            GUILayout.Label($"Metal: {this._metal}");
            GUILayout.Label($"Nutrient: {this._nutrient}");
            GUILayout.Label($"Power: {this._power}");

            GUILayout.Label($"Normal Module: {this._normalModule}");
            GUILayout.Label($"Advanced Module: {this._advancedModule}");
            GUILayout.Label($"Special Module: {this._specialModule}");

            GUILayout.Label("Unit Acquired History:");
            scrollPos = GUILayout.BeginScrollView(scrollPos, GUILayout.MaxHeight(100));
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
    }

    public void IncreaseBattleStats(Table_PC tablePc)
    {
        var dm = SingleTon<DataManager>.Instance;

        this._dropCount++;
        this._obtainPcList.Add(tablePc);
        this._obtainPcLog.Add(
            $"[{Util.GradeToRank(tablePc.StartGrade)}] {dm.GetLocalization(tablePc.Name)}"
        );

        var researchMultipliers = Util.GetDisassembleMultipliers();

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

        this._metal = (int)(metal * researchMultipliers.total);
        this._nutrient = (int)(nutrient * researchMultipliers.total);
        this._power = (int)(power * researchMultipliers.total);
        this._normalModule = normalModule;
        this._advancedModule = advancedModule;
        this._specialModule = specialModule;
    }
}

[HarmonyPatch(typeof(Panel_RewardCha), nameof(Panel_RewardCha.GetPc))]
internal class GetPcEventWatcher
{
    static void Postfix(Panel_RewardCha __instance, Table_PC tablePc)
    {
        // よくわからないがPanel_RewardCha以外のインスタンスで呼ばれることがある
        // その時にメンバを参照してしまうと落ちるのでスキップする
        // 判定方法がこれでいいのかは謎

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
