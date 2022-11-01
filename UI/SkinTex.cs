using System.IO;
using UnityEngine;

// csharpier-ignore
namespace LAOPLUS.UI;

internal static class SkinTex
{
    // Window
    public static readonly Texture2D Window = Load("UI/Surface_/App Surface-base.png");

    // Box
    public static readonly Texture2D ContentBox = Load("UI/Surface_/App Surface-layer.png");

    // Button
    public static readonly Texture2D CloseButtonRest = Load("UI/Parts_/Title Bar Caption Control Button-rest.png");
    public static readonly Texture2D CloseButtonHover = Load("UI/Parts_/Title Bar Caption Control Button-hover.png");
    public static readonly Texture2D CloseButtonPressed = Load("UI/Parts_/Title Bar Caption Control Button-pressed.png");
    public static readonly Texture2D ButtonRest = null;
    public static readonly Texture2D ButtonHover = null;
    public static readonly Texture2D ButtonPressed = null;
    public static readonly Texture2D NavButtonRest = Load("UI/Side Nav_/Parts_/Side Nav List Item-rest.png");
    public static readonly Texture2D NavButtonHover = Load("UI/Side Nav_/Parts_/Side Nav List Item-hover.png");
    public static readonly Texture2D NavButtonPressed = Load("UI/Side Nav_/Parts_/Side Nav List Item-pressed.png");
    public static readonly Texture2D NavButtonSelectedRest = Load("UI/Side Nav_/Parts_/Side Nav List Item Selected-rest.png");
    public static readonly Texture2D NavButtonSelectedHover = Load("UI/Side Nav_/Parts_/Side Nav List Item Selected-hover.png");
    public static readonly Texture2D NavButtonSelectedPressed= Load("UI/Side Nav_/Parts_/Side Nav List Item Selected-pressed.png");

    static SkinTex()
    {
        // Window
        Window.hideFlags = HideFlags.HideAndDontSave;

        // Box
        ContentBox.hideFlags = HideFlags.HideAndDontSave;

        // Button
        CloseButtonRest.hideFlags = HideFlags.HideAndDontSave;
        CloseButtonHover.hideFlags = HideFlags.HideAndDontSave;
        CloseButtonPressed.hideFlags = HideFlags.HideAndDontSave;
        // ButtonRest.hideFlags = HideFlags.HideAndDontSave;
        // ButtonHover.hideFlags = HideFlags.HideAndDontSave;
        // ButtonPressed.hideFlags = HideFlags.HideAndDontSave;
        NavButtonRest.hideFlags = HideFlags.HideAndDontSave;
        NavButtonHover.hideFlags = HideFlags.HideAndDontSave;
        NavButtonPressed.hideFlags = HideFlags.HideAndDontSave;
        NavButtonSelectedRest.hideFlags = HideFlags.HideAndDontSave;
        NavButtonSelectedHover.hideFlags = HideFlags.HideAndDontSave;
        NavButtonSelectedPressed.hideFlags = HideFlags.HideAndDontSave;
    }

    static Texture2D Load(string path)
    {
        // ReSharper disable StringLiteralTypo
        const string basePath = "G:/DMMGP/lastorigin/BepInEx/plugins/LAOPLUS";
        // ReSharper restore StringLiteralTypo
        var fullPath = Path.Combine(basePath, path);

        if (!File.Exists(fullPath))
        {
            Debug.LogError($"File not found: {fullPath}");
            return null;
        }

        // LoadImage時に読み込んだ画像のサイズに変わるのでこの時点でのテクスチャサイズは気にしなくていい
        var tempTexture = new Texture2D(1, 1);
        tempTexture.LoadImage(File.ReadAllBytes(fullPath));

        return tempTexture;
    }
}
