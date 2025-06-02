using System;
using System.Collections;
using System.Text.Json;
using System.Threading.Tasks;

namespace LAOPLUS.UI
{
    internal class GithubRelease
    {
        public string name { get; set; }
    }

    public static class VersionChecker
    {
        public static IEnumerator IsLatestVersionCoroutine(Action<(int, string)> callback)
        {
            const string owner = "laoplus";
            const string repo = "laoplus";
            const string latestReleaseEndpointUrl =
                $@"https://api.github.com/repos/{owner}/{repo}/releases/latest";

            var fetchTask = GetAsync(latestReleaseEndpointUrl);

            // Wait for the task to complete
            while (!fetchTask.IsCompleted)
            {
                yield return null;
            }

            var responseContent = fetchTask.Result;

            LAOPLUS.Log.LogDebug($"JSON: {responseContent}");
            var release = JsonSerializer.Deserialize<GithubRelease>(responseContent);

            var currentVersion = MyPluginInfo.PLUGIN_VERSION;
            var latestVersion = release.name.Replace("ver", "").Replace("v", "").Trim();
            LAOPLUS.Log.LogInfo($"Current Ver: {currentVersion}, Latest Ver: {release.name}");
            var compareResult = CompareSemanticVersions(currentVersion, latestVersion);

            callback((compareResult, latestVersion));
        }

        async static Task<string> GetAsync(string uri)
        {
            var httpClient = LAOPLUS.HttpClient;
            var response = await httpClient.GetAsync(uri);
            return await response.Content.ReadAsStringAsync();
        }

        public static int CompareSemanticVersions(string version1, string version2)
        {
            var semver1 = new SemanticVersioning.Version(version1);
            var semver2 = new SemanticVersioning.Version(version2);

            return semver1.CompareTo(semver2);
        }
    }
}
