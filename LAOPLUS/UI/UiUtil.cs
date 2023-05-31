using UnityEngine;

namespace LAOPLUS.UI;

public static class UiUtil
{
    public static Rect ClampToScreen(Rect rect, float guiScale)
    {
        var screenSizeMultiplier = 1 / guiScale;
        rect.x = Mathf.Clamp(rect.x, 0, Screen.width * screenSizeMultiplier - rect.width);
        rect.y = Mathf.Clamp(rect.y, 0, Screen.height * screenSizeMultiplier - rect.height);

        return rect;
    }

    public static bool IsCursorWithinGameScreen()
    {
        var mousePosition = Input.mousePosition;
        var screenPosition = new Vector3(Screen.width, Screen.height, 0);
        var cursorInScreen = new Rect(Vector3.zero, screenPosition).Contains(mousePosition);
        return cursorInScreen;
    }

    public static bool IsCursorNearResizeGrip(Rect rect)
    {
        const int magicNumber = 16 * CustomSkin.InternalRenderScale;
        return Mathf.Abs(rect.xMax - Event.current.mousePosition.x) < magicNumber
            && Mathf.Abs(rect.yMax - Event.current.mousePosition.y) < magicNumber;
    }

    public enum CursorType
    {
        Default,
        ResizeNs,
    }

    public static void SetCursor(CursorType cursorType)
    {
        const CursorMode cursorMode = CursorMode.Auto;

        Cursor.SetCursor(
            cursorType switch
            {
                CursorType.Default => null,
                CursorType.ResizeNs => SkinTex.CursorResizeNs,
                _ => null
            },
            Vector2.zero,
            cursorMode
        );
    }
}
