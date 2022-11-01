namespace LAOPLUS.UI
{
    using UnityEngine;

    // csharpier-ignore
    internal static class SkinColor
    {
        // Colors from Windows UI
        // https://www.figma.com/community/file/1159947337437047524

        // ReSharper disable InconsistentNaming
        // ReSharper disable MemberCanBePrivate.Global
        public static readonly Color Light_StrokeColor_SurfaceStroke_Default;
        public static readonly Color Light_FillColor_Text_Primary;
        public static readonly Color Light_FillColor_Text_Disabled;
        public static readonly Color Light_Shell_FillColor_CaptionControlCloseFill_Primary;
        public static readonly Color Light_Shell_FillColor_CaptionCloseText_Primary;
        public static readonly Color Light_Background_FillColor_SolidBackground_Base;
        public static readonly Color Dark_Shell_FillColor_CaptionControlCloseFill_Secondary;
        public static readonly Color Dark_Shell_FillColor_CaptionCloseText_Secondary;
        public static readonly Color Light_Elevation_Control_Border;
        public static readonly Color Light_FillColor_Control_Default;
        public static readonly Color Light_FillColor_Control_Secondary;

        // ReSharper restore InconsistentNaming
        // ReSharper restore MemberCanBePrivate.Global

        static SkinColor()
        {
            ColorUtility.TryParseHtmlString("#75757566", out Light_StrokeColor_SurfaceStroke_Default);
            ColorUtility.TryParseHtmlString("#000000E4", out Light_FillColor_Text_Primary);
            ColorUtility.TryParseHtmlString("#0000005C", out Light_FillColor_Text_Disabled);
            ColorUtility.TryParseHtmlString(
                "#C42B1C",
                out Light_Shell_FillColor_CaptionControlCloseFill_Primary
            );
            ColorUtility.TryParseHtmlString(
                "#FFFFFF",
                out Light_Shell_FillColor_CaptionCloseText_Primary
            );
            ColorUtility.TryParseHtmlString(
                "#F3F3F3",
                out Light_Background_FillColor_SolidBackground_Base
            );
            ColorUtility.TryParseHtmlString(
                "#C42B1CE5",
                out Dark_Shell_FillColor_CaptionControlCloseFill_Secondary
            );
            ColorUtility.TryParseHtmlString(
                "#FFFFFFB2",
                out Dark_Shell_FillColor_CaptionCloseText_Secondary
            );
            // It's actually a gradient from #0000000F to #00000029.
            ColorUtility.TryParseHtmlString("#0000000F", out Light_Elevation_Control_Border);
            ColorUtility.TryParseHtmlString("#FFFFFFB2", out Light_FillColor_Control_Default);
            ColorUtility.TryParseHtmlString("#F9F9F980", out Light_FillColor_Control_Secondary);
        }
    }
}
