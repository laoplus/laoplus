using System.IO;
using UnityEngine;

namespace LAOPLUS.UI;

public static class CustomSkin
{
    // Window
    public static GUIStyle Window;

    // Box
    public static GUIStyle MainBox;
    public static GUIStyle ContentBox;
    public static GUIStyle NavBox;
    public static GUIStyle ControlBox;

    // Button
    public static GUIStyle CloseButton;
    public static GUIStyle NavButton;
    public static GUIStyle NavButtonSelected;

    // Label
    public static GUIStyle CenteredLabel;

    // Primitive
    public static GUIStyle Button;
    public static GUIStyle Label;

    public static GUISkin Skin;

    // ディスプレイ拡大率が100%: 最終的に0.5倍する
    // ディスプレイ拡大率が200%: 最終的に1.0倍する
    public const int InternalRenderScale = 2;

    // static readonly Font GameFont = ResourceManager.LoadFont("FontB_sc");
    static readonly Font GameFont;

    static AssetBundle LoadAssetBundle(string bundlePath)
    {
        var pluginDirPath = Path.GetDirectoryName(
            System.Reflection.Assembly.GetExecutingAssembly().Location
        );
        if (pluginDirPath == null)
        {
            LAOPLUS.Log.LogError("Failed to get plugin path.");
            return null;
        }
        var path = Path.Combine(pluginDirPath, bundlePath);
        LAOPLUS.Log.LogDebug($"Loading AssetBundle: {path}");
        return !File.Exists(path) ? null : AssetBundle.LoadFromFile(path);
    }

    static CustomSkin()
    {
        var ab = LoadAssetBundle("Assets/Fonts/notosansjp/regular");
        GameFont = ab.LoadAsset<Font>("NotoSansJP-Regular.ttf");
        // シーン遷移時に破棄されないようにする
        // 破棄されると文字がちらつくように見える
        GameFont.hideFlags |= HideFlags.HideAndDontSave;

        // Window
        CreateWindow();

        // Box
        CreateMainBox();
        CreateContentBox();
        CreateNavBox();
        // CreateControlBox();

        // Button
        CreateCloseButton();
        CreateNavButton();

        // Label
        CreateCenteredLabel();

        // Primitive
        CreateButton();
        CreateLabel();

        CreateSkin();
    }

    static void CreateWindow()
    {
        Window = new GUIStyle(GUI.skin.window)
        {
            name = nameof(Window),
            alignment = TextAnchor.UpperLeft,
            border =
            {
                top = 7 * InternalRenderScale,
                left = 7 * InternalRenderScale,
                bottom = 7 * InternalRenderScale,
                right = 7 * InternalRenderScale
            },
            padding =
            {
                top = 0,
                left = 0,
                bottom = 0,
                right = 0
            },
            margin =
            {
                top = 0,
                left = 0,
                bottom = 0,
                right = 0
            },
            contentOffset = new Vector2(17 * InternalRenderScale, 10 * InternalRenderScale),
            normal =
            {
                textColor = SkinColor.Light_FillColor_Text_Disabled,
                background = SkinTex.Window
            },
            onNormal =
            {
                textColor = SkinColor.Light_FillColor_Text_Primary,
                background = SkinTex.Window
            },
            font = GameFont,
            fontSize = 12 * InternalRenderScale
        };
    }

    #region Box
    static void CreateMainBox()
    {
        MainBox = new GUIStyle(GUI.skin.box)
        {
            normal = { background = null },
            padding =
            {
                top = 0,
                left = 0,
                bottom = 0,
                right = 0
            },
            margin =
            {
                top =
                    (
                        32 + 1 // 枠線のpadding分
                    ) * InternalRenderScale,
                left = 0,
                bottom = 0,
                right = 0
            },
        };
    }

    static void CreateContentBox()
    {
        ContentBox = new GUIStyle(GUI.skin.box)
        {
            normal = { background = SkinTex.ContentBox },
            border =
            {
                top = 7 * InternalRenderScale,
                left = 7 * InternalRenderScale,
                bottom = 7 * InternalRenderScale,
                right = 7 * InternalRenderScale
            },
            padding =
            {
                top = 24 * InternalRenderScale,
                left = 24 * InternalRenderScale,
                bottom = 7 * InternalRenderScale,
                right = 7 * InternalRenderScale
            },
            margin =
            {
                top = 0,
                left = 0,
                bottom = 0,
                right = 0
            },
        };
    }

    static void CreateNavBox()
    {
        // NavBox = new GUIStyle(GUI.skin.verticalScrollbar)
        // {
        //     normal = { background = null },
        //     // padding =
        //     // {
        //     //     top = 24 * InternalRenderScale,
        //     //     left = 24 * InternalRenderScale,
        //     //     bottom = 7 * InternalRenderScale,
        //     //     right = 7 * InternalRenderScale
        //     // },
        //     margin = { top = 0, left = 0, bottom = 0, right = 0 },
        // };
    }
    #endregion

    #region Button
    static void CreateCloseButton()
    {
        CloseButton = new GUIStyle(GUI.skin.button)
        {
            name = nameof(CloseButton),
            alignment = TextAnchor.MiddleCenter,
            normal = { background = SkinTex.CloseButtonRest },
            hover = { background = SkinTex.CloseButtonHover },
            active = { background = SkinTex.CloseButtonPressed },
            fontSize = 12 * InternalRenderScale,
        };
    }

    static void CreateNavButton()
    {
        var baseStyle = new GUIStyle(GUI.skin.button)
        {
            normal = { textColor = SkinColor.Light_FillColor_Text_Primary },
            hover = { textColor = SkinColor.Light_FillColor_Text_Primary },
            active = { textColor = SkinColor.Light_FillColor_Text_Primary },
            border =
            {
                top = 12 * InternalRenderScale,
                left = 12 * InternalRenderScale,
                bottom = 12 * InternalRenderScale,
                right = 12 * InternalRenderScale
            },
            padding =
            {
                top = 13 * InternalRenderScale,
                left = 16 * InternalRenderScale,
                bottom = 12 * InternalRenderScale,
                right = 14 * InternalRenderScale
            },
            margin =
            {
                top = 0,
                left = 1 * InternalRenderScale,
                bottom = 0,
                right = 0
            },
            alignment = TextAnchor.MiddleLeft,
            fontSize = 14 * InternalRenderScale,
        };

        NavButton = new GUIStyle(baseStyle)
        {
            name = nameof(NavButton),
            normal = { background = SkinTex.NavButtonRest },
            hover = { background = SkinTex.NavButtonHover },
            active = { background = SkinTex.NavButtonPressed },
        };

        NavButtonSelected = new GUIStyle(baseStyle)
        {
            name = nameof(NavButtonSelected),
            normal = { background = SkinTex.NavButtonSelectedRest },
            hover = { background = SkinTex.NavButtonSelectedHover },
            active = { background = SkinTex.NavButtonSelectedPressed },
        };
    }
    #endregion

    #region Label
    static void CreateCenteredLabel()
    {
        CenteredLabel = new GUIStyle(GUI.skin.label)
        {
            name = nameof(CenteredLabel),
            alignment = TextAnchor.MiddleCenter,
            normal = { textColor = SkinColor.Light_FillColor_Text_Primary },
            font = GameFont,
            fontSize = 12 * InternalRenderScale,
        };
    }
    #endregion

    #region Primitive
    static void CreateButton()
    {
        Button = new GUIStyle(GUI.skin.button)
        {
            name = nameof(Button),
            wordWrap = false,
            alignment = TextAnchor.MiddleCenter,
            border =
            {
                top = 6,
                left = 6,
                bottom = 6,
                right = 6
            },
            padding =
            {
                top = 6,
                left = 6,
                bottom = 6,
                right = 6
            },
            margin =
            {
                top = 0,
                left = 0,
                bottom = 0,
                right = 0
            },
            normal =
            {
                textColor = SkinColor.Light_FillColor_Text_Primary,
                background = SkinTex.ButtonRest
            },
            hover =
            {
                textColor = SkinColor.Light_FillColor_Text_Primary,
                background = SkinTex.ButtonHover
            },
            active =
            {
                textColor = SkinColor.Light_FillColor_Text_Primary,
                background = SkinTex.ButtonPressed
            },
            font = GameFont,
            fontSize = 12 * InternalRenderScale
        };
    }

    static void CreateLabel()
    {
        Label = new GUIStyle(GUI.skin.label)
        {
            name = nameof(Label),
            normal = { textColor = SkinColor.Light_FillColor_Text_Primary },
            font = GameFont,
            fontSize = 12 * InternalRenderScale,
        };
    }
    #endregion

    static void CreateSkin()
    {
        var skin = ScriptableObject.CreateInstance<GUISkin>();
        skin.hideFlags |= HideFlags.HideAndDontSave;
        skin.button = Button;
        skin.window = Window;
        skin.label = Label;
        Skin = skin;
    }
}
