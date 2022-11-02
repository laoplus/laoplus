using UnityEngine;

namespace LAOPLUS.UI
{
    public static class Util
    {
        public static (float researchMultiplier, float boostMultiplier, float totalMultiplier) GetResearchMultipliers()
        {
            var dm = SingleTon<DataManager>.Instance;

            var researchMultiplier = 0f;
            var resourceSearchInfo = dm.GetResourceSearchInfo(RESEARCH_RESULT.DISASSEMBLE_UP);
            if (resourceSearchInfo != null)
            {
                researchMultiplier = float.Parse(resourceSearchInfo.EffectValue);
            }

            var boostMultiplier = 0f;
            var boostInfo = Common.GetBoostInfo(FUNCTION_TYPE.BreakSearchBoost_ACTIVATE);
            if (boostInfo != null)
            {
                boostMultiplier = boostInfo.Rate;
            }

            var totalMultiplier = 1f + researchMultiplier + boostMultiplier;

            LAOPLUS.Log.LogDebug($"Research Multiplier: {researchMultiplier}");
            LAOPLUS.Log.LogDebug($"Boost Multiplier: {boostMultiplier}");
            LAOPLUS.Log.LogDebug($"Total Multiplier: {totalMultiplier}");

            return (researchMultiplier, boostMultiplier, totalMultiplier);
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
    }
}
