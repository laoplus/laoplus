namespace LAOPLUS.Util;

public static class StatsUtil
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
