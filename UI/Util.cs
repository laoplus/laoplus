namespace LAOPLUS.UI
{
    public class Util
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
    }
}
