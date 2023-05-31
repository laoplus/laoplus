using System.IO;
using UnityEngine;

// csharpier-ignore
namespace LAOPLUS.UI;

internal static class SkinTex
{
    // Window
    public static readonly Texture2D Window = Load("Surface/App Surface-base.png");

    // Box
    public static readonly Texture2D ContentBox = Load("Surface/App Surface-layer.png");

    // Button
    public static readonly Texture2D CloseButtonRest = Load("Parts/Title Bar Caption Control Button-rest.png");
    public static readonly Texture2D CloseButtonHover = Load("Parts/Title Bar Caption Control Button-hover.png");
    public static readonly Texture2D CloseButtonPressed = Load("Parts/Title Bar Caption Control Button-pressed.png");
    public static readonly Texture2D ButtonRest = null;
    public static readonly Texture2D ButtonHover = null;
    public static readonly Texture2D ButtonPressed = null;
    public static readonly Texture2D NavButtonRest = Load("Side Nav/Parts/Side Nav List Item-rest.png");
    public static readonly Texture2D NavButtonHover = Load("Side Nav/Parts/Side Nav List Item-hover.png");
    public static readonly Texture2D NavButtonPressed = Load("Side Nav/Parts/Side Nav List Item-pressed.png");
    public static readonly Texture2D NavButtonSelectedRest = Load("Side Nav/Parts/Side Nav List Item Selected-rest.png");
    public static readonly Texture2D NavButtonSelectedHover = Load("Side Nav/Parts/Side Nav List Item Selected-hover.png");
    public static readonly Texture2D NavButtonSelectedPressed= Load("Side Nav/Parts/Side Nav List Item Selected-pressed.png");

    // Cursor
    public static readonly Texture2D CursorResizeNs = Load("Cursors/Cursor/ResizeNS.png");

    // Branding
    public static readonly Texture2D BrandingHeader = Load("Branding/Header.png");


    static string GetFullPath(string path)
    {
        var pluginDirPath = Path.GetDirectoryName(
            System.Reflection.Assembly.GetExecutingAssembly().Location
        );
        if (pluginDirPath == null)
        {
            return null;
        }

        var fullPath = Path.Combine(pluginDirPath, "Assets/UI/", path);
        if (File.Exists(fullPath))
        {
            return fullPath;
        }

        LAOPLUS.Log.LogError($"File not found: {fullPath}, {path}, {pluginDirPath}");
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
