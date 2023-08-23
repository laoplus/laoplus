using System;
using System.Collections.Generic;
using System.Linq;
using BepInEx.Unity.IL2CPP;
using BepInEx.Unity.IL2CPP.Utils.Collections;
using LAOPLUS.Singleton;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace LAOPLUS.UI;

public class UI : MonoBehaviour
{
    readonly NavManager _navManager = new();

    public BasePlugin Plugin { get; set; }

    const int InitialWindowWidth = 500;
    const int MinimumWindowWidth = 300;
    const int InitialWindowHeight = 200;
    const int MinimumWindowHeight = 100;

    Rect _windowRect = new Rect(10, 10, InitialWindowWidth * 2f, InitialWindowHeight * 2f);
    float _guiScale = 0.5f;
    bool _showWindow = true;
    bool _enableDvdMode;
    const KeyCode ToggleKey = KeyCode.F1;

    bool _isResizing;

    string _latestVersion;
    int? _versionCheckResult;
    string _versionCheckMessage;

    void Start()
    {
        CallVersionCheckCoroutine();
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

        var windowTitle =
            $"{MyPluginInfo.PLUGIN_NAME} {MyPluginInfo.PLUGIN_VERSION} {(this._versionCheckResult == -1 ? "[⚠️NEW VERSION AVAILABLE!]" : "")}";

        this._windowRect = UiUtil.ClampToScreen(
            GUI.Window(21, this._windowRect, (GUI.WindowFunction)WindowFunc, windowTitle),
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

        if (UiUtil.IsCursorNearResizeGrip(this._windowRect))
        {
            setResizeCursor = true;
        }

        if (!UiUtil.IsCursorWithinGameScreen())
        {
            setResizeCursor = false;
        }

        // Update cursor
        UiUtil.SetCursor(setResizeCursor ? UiUtil.CursorType.ResizeNs : UiUtil.CursorType.Default);

        // Handle mouse events
        if (Event.current.type == EventType.MouseDown)
        {
            if (UiUtil.IsCursorNearResizeGrip(this._windowRect))
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
            if (!this._isResizing || !UiUtil.IsCursorWithinGameScreen())
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
        UiUtil.SetCursor(UiUtil.CursorType.Default);
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

        // if (Input.GetKeyDown(KeyCode.F3))
        // {
        //     this._enableDvdMode = !this._enableDvdMode;
        // }
    }

    // moving rect like a bouncing dvd logo
    void Dvd()
    {
        var dvdMovingDirection = Vector2.one;
        var screenSizeMultiplier = 1 / this._guiScale;
        var screenWidth = Screen.width * screenSizeMultiplier;
        var screenHeight = Screen.height * screenSizeMultiplier;

        var rect = this._windowRect;
        rect.x += dvdMovingDirection.x;
        rect.y += dvdMovingDirection.y;

        if (rect.x < 0)
        {
            rect.x = 0;
            dvdMovingDirection.x *= -1;
        }
        else if (rect.x + rect.width > screenWidth)
        {
            rect.x = screenWidth - rect.width;
            dvdMovingDirection.x *= -1;
        }

        if (rect.y < 0)
        {
            rect.y = 0;
            dvdMovingDirection.y *= -1;
        }
        else if (rect.y + rect.height > screenHeight)
        {
            rect.y = screenHeight - rect.height;
            dvdMovingDirection.y *= -1;
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

    void CallVersionCheckCoroutine()
    {
        this._versionCheckResult = null;
        this._latestVersion = null;
        this._versionCheckMessage = "Checking for updates...";

        var coroutine = VersionChecker.IsLatestVersionCoroutine(
            (result) =>
            {
                this._versionCheckResult = result.Item1;
                this._latestVersion = result.Item2;

                this._versionCheckMessage = this._versionCheckResult switch
                {
                    -1 => $"New Version Available!: v{this._latestVersion}",
                    0 => "You are using the latest version!",
                    _
                        => string.Join(
                            "\n",
                            "Futures made of virtual insanity NOW!",
                            "(You are using a newer version than the latest release)"
                        )
                };
            }
        );
        StartCoroutine(coroutine.WrapToIl2Cpp());
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

        this._navManager.SetScrollPos(
            "_nav",
            GUILayout.BeginScrollView(
                this._navManager.GetScrollPos("_nav"),
                GUILayout.MinWidth(220 * s),
                GUILayout.MaxWidth(220 * s)
            )
        );
        {
            if (
                GUILayout.Button(
                    "Config",
                    this._navManager.GetNavButtonStyle(NavManager.Navigation.Config)
                )
            )
            {
                this._navManager.Nav = NavManager.Navigation.Config;
            }
            if (
                GUILayout.Button(
                    "About",
                    this._navManager.GetNavButtonStyle(NavManager.Navigation.About)
                )
            )
            {
                this._navManager.Nav = NavManager.Navigation.About;
            }
            if (
                GUILayout.Button(
                    "Stats",
                    this._navManager.GetNavButtonStyle(NavManager.Navigation.Stats)
                )
            )
            {
                this._navManager.Nav = NavManager.Navigation.Stats;
            }
        }
        GUILayout.EndScrollView();

        // content
        GUILayout.BeginVertical(CustomSkin.ContentBox);
        this._navManager.SetScrollPos(
            "_content",
            GUILayout.BeginScrollView(this._navManager.GetScrollPos("_content"))
        );
        {
            switch (this._navManager.Nav)
            {
                case NavManager.Navigation.Config:
                    RenderConfig();
                    break;
                case NavManager.Navigation.About:
                    RenderAbout();
                    break;
                case NavManager.Navigation.Stats:
                    RenderStats();
                    break;
            }
        }
        GUILayout.EndScrollView();
        GUILayout.EndVertical();

        GUILayout.EndHorizontal();
    }

    void RenderConfig()
    {
        GUILayout.BeginVertical();
        GUILayout.Label("Config", CustomSkin.TitleLabel);
        var values = Plugin.Config.Values;
        var groupedEntries = values.GroupBy(entry => entry.Definition.Section);
        foreach (var group in groupedEntries)
        {
            GUILayout.Label(group.Key, CustomSkin.SubtitleLabel);
            foreach (var entry in group)
            {
                GUILayout.Label($"{entry.Definition.Key.Replace(" / ", "\n")}");
                switch (entry.BoxedValue)
                {
                    case bool value:
                    {
                        if (GUILayout.Button(value ? "True" : "False"))
                        {
                            entry.BoxedValue = !value;
                        }

                        break;
                    }
                    case string value:
                    {
                        GUILayout.Label(value);
                        GUILayout.BeginHorizontal();

                        if (GUILayout.Button("Copy"))
                        {
                            GUIUtility.systemCopyBuffer = value;
                        }
                        if (GUILayout.Button("Paste"))
                        {
                            entry.BoxedValue = GUIUtility.systemCopyBuffer;
                        }

                        GUILayout.EndHorizontal();

                        break;
                    }
                    default:
                        GUILayout.Label($"{entry.BoxedValue.GetType()}: {entry.BoxedValue}");
                        break;
                }
            }
        }
        GUILayout.EndVertical();
    }

    void RenderAbout()
    {
        GUILayout.BeginVertical();
        {
            if (
                GUILayout.Button(
                    SkinTex.BrandingHeader,
                    new GUIStyle { alignment = TextAnchor.MiddleCenter },
                    GUILayout.MinWidth(0)
                )
            )
            {
                Application.OpenURL("https://github.com/laoplus/laoplus");
            }
            GUILayout.Label($"ver {MyPluginInfo.PLUGIN_VERSION}", CustomSkin.CenteredLabel);
            GUILayout.Label($"by Eai and LAOPLUS Contributors", CustomSkin.CenteredLabel);
            GUILayout.Label(
                $"Unity {BepInEx.Unity.Common.UnityInfo.Version}",
                CustomSkin.CenteredLabel
            );

            GUILayout.Label("Update", CustomSkin.SubtitleLabel);
            if (GUILayout.Button("Check for Updates"))
            {
                try
                {
                    CallVersionCheckCoroutine();
                }
                catch (Exception e)
                {
                    LAOPLUS.Log.LogError(e);
                }
            }
            if (this._versionCheckResult != null)
            {
                GUILayout.Label($"{this._versionCheckMessage}", CustomSkin.CenteredLabel);
                GUILayout.Label(
                    $"Current Version: {MyPluginInfo.PLUGIN_VERSION} | Latest Version: {this._latestVersion}",
                    CustomSkin.CenteredLabel
                );
            }

            GUILayout.Label("Debug", CustomSkin.SubtitleLabel);
            GUILayout.Label(
                $"UI Scale: {this._guiScale}x ({this._windowRect.width}x{this._windowRect.height})"
            );
            GUILayout.Label($"Current Scene: {SceneManager.GetActiveScene().name}");
            GUILayout.Label($"Current FPS: {Mathf.RoundToInt(1 / Time.deltaTime)}");
            GUILayout.Label($"Current Time: {DateTime.Now}");
            GUILayout.Label($"Current Game Mode: {GameManager.Instance.GameMode}");
            GUILayout.Label($"Current StageIndex: {GameManager.Instance.CurrentStageIndex}");
            GUILayout.Label($"Current SquadIndex: {GameManager.Instance.CurrentSquadIndex}");
        }
        GUILayout.EndVertical();
    }

    void RenderStats()
    {
        var gm = SingleTon<GameManager>.Instance;
        var statsManager = StatsManager.Instance;

        GUILayout.Label("Stats", CustomSkin.TitleLabel);
        GUILayout.BeginVertical();
        {
            if (GUILayout.Button("Reset Stats"))
            {
                statsManager.ResetStats();
            }
            GUILayout.Space(12f);
            GUILayout.Label($"Battle Repeat Count: {gm.BattleRepeatCount}");
            GUILayout.Label($"Total Drop Count: {statsManager.DropCount}");

            GUILayout.Label($"Metal: {statsManager.Metal}");
            GUILayout.Label($"Nutrient: {statsManager.Nutrient}");
            GUILayout.Label($"Power: {statsManager.Power}");

            GUILayout.Label($"Normal Module: {statsManager.NormalModule}");
            GUILayout.Label($"Advanced Module: {statsManager.AdvancedModule}");
            GUILayout.Label($"Special Module: {statsManager.SpecialModule}");

            GUILayout.Label("Unit Acquired History:");

            this._navManager.SetScrollPos(
                "Unit Acquired History",
                GUILayout.BeginScrollView(
                    this._navManager.GetScrollPos("Unit Acquired History"),
                    GUILayout.MaxHeight(100)
                )
            );
            {
                // 新しい順に表示したいので逆順にする
                var tempObtainPcLog = new List<string>(statsManager.ObtainPcLog);
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
}
