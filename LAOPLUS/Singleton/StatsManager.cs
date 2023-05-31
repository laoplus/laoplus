using System.Collections.Generic;
using System.Linq;

namespace LAOPLUS.Singleton;

public class StatsManager
{
    static StatsManager _instance;

    public int Metal { get; private set; }
    public int Nutrient { get; private set; }
    public int Power { get; private set; }
    public int NormalModule { get; private set; }
    public int AdvancedModule { get; private set; }
    public int SpecialModule { get; private set; }
    public int DropCount { get; private set; }

    public List<Table_PC> ObtainPcList { get; private set; }
    public List<string> ObtainPcLog { get; private set; }

    // singleton accessor
    public static StatsManager Instance => _instance ??= new StatsManager();

    // private constructor
    StatsManager() => ResetStats();

    public void ResetStats()
    {
        LAOPLUS.Log.LogDebug("StatsManager.ResetStats()");

        Metal = 0;
        Nutrient = 0;
        Power = 0;
        NormalModule = 0;
        AdvancedModule = 0;
        SpecialModule = 0;
        DropCount = 0;
        ObtainPcList = new List<Table_PC>();
        ObtainPcLog = new List<string>();
    }

    public void IncreaseBattleStats(Table_PC tablePc)
    {
        LAOPLUS.Log.LogDebug("StatsManager.IncreaseBattleStats()");

        var dm = SingleTon<DataManager>.Instance;

        DropCount++;
        ObtainPcList.Add(tablePc);
        ObtainPcLog.Add(
            $"[{Util.StatsUtil.GradeToRank(tablePc.StartGrade)}] {dm.GetLocalization(tablePc.Name)}"
        );

        var researchMultipliers = Util.StatsUtil.GetDisassembleMultipliers();

        var metal = 0;
        var nutrient = 0;
        var power = 0;
        var normalModule = 0;
        var advancedModule = 0;
        var specialModule = 0;

        foreach (var pc in ObtainPcList)
        {
            var disassembleTable = dm.GetTableDisassemble(pc.Disassemblekey);
            metal += disassembleTable.MetalObtain;
            nutrient += disassembleTable.NutrientObtain;
            power += disassembleTable.PowerObtain;

            var itemCountClone = new List<int>();
            var itemKeyClone = new List<string>();
            foreach (var count in disassembleTable.GiveItemCount)
            {
                itemCountClone.Add(count);
            }

            foreach (var itemKey in disassembleTable.GiveItemKeyString)
            {
                itemKeyClone.Add(itemKey);
            }

            var itemCountDict = itemKeyClone
                .Zip(itemCountClone, (k, v) => new { k, v })
                .ToDictionary(x => x.k, x => x.v);

            foreach (var (key, count) in itemCountDict)
            {
                switch (key)
                {
                    case "Normal_Module":
                        normalModule += count;
                        break;
                    case "Advanced_Module":
                        advancedModule += count;
                        break;
                    case "Special_Module":
                        specialModule += count;
                        break;
                }
            }
        }

        Metal = (int)(metal * researchMultipliers.total);
        Nutrient = (int)(nutrient * researchMultipliers.total);
        Power = (int)(power * researchMultipliers.total);
        NormalModule = normalModule;
        AdvancedModule = advancedModule;
        SpecialModule = specialModule;
    }
}
