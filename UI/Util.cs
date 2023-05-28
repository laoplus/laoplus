using UnityEngine;

namespace LAOPLUS.UI
{
    public static class Util
    {
        public static (float research, float boost, float total) GetDisassembleMultipliers()
        {
            var dm = SingleTon<DataManager>.Instance;

            var research = 0f;
            var resourceSearchInfo = dm.GetResourceSearchInfo(RESEARCH_RESULT.DISASSEMBLE_UP);
            if (resourceSearchInfo != null)
            {
                research = float.Parse(resourceSearchInfo.EffectValue);
            }

            var boost = 0f;
            var boostInfo = Common.GetBoostInfo(FUNCTION_TYPE.BreakSearchBoost_ACTIVATE);
            if (boostInfo != null)
            {
                boost = boostInfo.Rate;
            }

            var total = 1f + research + boost;

            LAOPLUS.Log.LogDebug($"Research Multiplier: {research}");
            LAOPLUS.Log.LogDebug($"Boost Multiplier: {boost}");
            LAOPLUS.Log.LogDebug($"Total Multiplier: {total}");

            return (research, boost, total);
        }

        public static Rect ClampToScreen(Rect rect, float guiScale)
        {
            var screenSizeMultiplier = 1 / guiScale;
            rect.x = Mathf.Clamp(rect.x, 0, Screen.width * screenSizeMultiplier - rect.width);
            rect.y = Mathf.Clamp(rect.y, 0, Screen.height * screenSizeMultiplier - rect.height);

            return rect;
        }

        public static string GradeToRank(int grade)
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
    }
}
