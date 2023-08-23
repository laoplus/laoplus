using LAOPLUS.UI;
using Xunit;

namespace LAOPLUS.Tests.UI
{
    public class VersionCheckerTests
    {
        [Fact(Skip = "ランタイムのアセンブリに依存しているため実行できない")]
        public void Test_CompareSemanticVersions()
        {
            Assert.Equal(0, VersionChecker.CompareSemanticVersions("1.0.0", "1.0.0"));
        }
    }
}
