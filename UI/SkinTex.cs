using System.IO;
using UnityEngine;

// csharpier-ignore
namespace LAOPLUS.UI;

internal static class SkinTex
{
    // Window
    public static readonly Texture2D Window = Load("UI/Surface/App Surface-base.png");

    // Box
    public static readonly Texture2D ContentBox = Load("UI/Surface/App Surface-layer.png");

    // Button
    public static readonly Texture2D CloseButtonRest = Load("UI/Parts/Title Bar Caption Control Button-rest.png");
    public static readonly Texture2D CloseButtonHover = Load("UI/Parts/Title Bar Caption Control Button-hover.png");
    public static readonly Texture2D CloseButtonPressed = Load("UI/Parts/Title Bar Caption Control Button-pressed.png");
    public static readonly Texture2D ButtonRest = null;
    public static readonly Texture2D ButtonHover = null;
    public static readonly Texture2D ButtonPressed = null;
    public static readonly Texture2D NavButtonRest = Load("UI/Side Nav/Parts/Side Nav List Item-rest.png");
    public static readonly Texture2D NavButtonHover = Load("UI/Side Nav/Parts/Side Nav List Item-hover.png");
    public static readonly Texture2D NavButtonPressed = Load("UI/Side Nav/Parts/Side Nav List Item-pressed.png");
    public static readonly Texture2D NavButtonSelectedRest = Load("UI/Side Nav/Parts/Side Nav List Item Selected-rest.png");
    public static readonly Texture2D NavButtonSelectedHover = Load("UI/Side Nav/Parts/Side Nav List Item Selected-hover.png");
    public static readonly Texture2D NavButtonSelectedPressed= Load("UI/Side Nav/Parts/Side Nav List Item Selected-pressed.png");

    public static readonly Texture2D CursorResize = Load("UI/Cursors/Cursor/ResizeNS.png");

    static string GetFullPath(string path)
    {
        // ReSharper disable StringLiteralTypo
        const string basePath = "G:/DMMGP/lastorigin/BepInEx/plugins/LAOPLUS/";
        // ReSharper restore StringLiteralTypo
        var fullPath = Path.Combine(basePath, path);

        if (File.Exists(fullPath))
        {
            return fullPath;
        }

        LAOPLUS.Log.LogError($"File not found: {fullPath}");
        return null;

    }

    static Texture2D Load(string path)
    {
        var fullPath = GetFullPath(path);
        // LoadImage時に読み込んだ画像のサイズに変わるのでこの時点でのテクスチャサイズは気にしなくていい
        var tempTexture = new Texture2D(1, 1, TextureFormat.RGBA32, false);
        tempTexture.LoadImage(File.ReadAllBytes(fullPath));
        tempTexture.hideFlags = HideFlags.HideAndDontSave;

        return tempTexture;
    }
}
