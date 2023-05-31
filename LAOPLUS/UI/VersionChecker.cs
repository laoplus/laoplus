using System.Text.Json;

namespace LAOPLUS.UI
{
    internal class GithubRelease
    {
        public string name { get; set; }
    }

    public static class VersionChecker
    {
        public static (int, string) IsLatestVersion()
        {
            const string owner = "laoplus";
            const string repo = "laoplus";
            const string latestReleaseEndpointUrl =
                $@"https://api.github.com/repos/{owner}/{repo}/releases/latest";
            var response = LAOPLUS.HttpClient.GetAsync(latestReleaseEndpointUrl).Result;
            var responseContent = response.Content.ReadAsStringAsync().Result;
            LAOPLUS.Log.LogDebug($"JSON: {responseContent}");
            var release = JsonSerializer.Deserialize<GithubRelease>(responseContent);

            var currentVersion = MyPluginInfo.PLUGIN_VERSION;
            var latestVersion = release.name.Replace("ver", "").Replace("v", "").Trim();
            LAOPLUS.Log.LogInfo($"Current Ver: {currentVersion}, Latest Ver: {release.name}");
            var compareResult = CompareSemanticVersions(currentVersion, latestVersion);

            return (compareResult, latestVersion);
        }

        public static int CompareSemanticVersions(string version1, string version2)
        {
            var semver1 = new SemanticVersioning.Version(version1);
            var semver2 = new SemanticVersioning.Version(version2);

            return semver1.CompareTo(semver2);
        }
    }
}
