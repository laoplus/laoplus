using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace LAOPLUS
{
    internal class DiscordWebhookClient : NotificationClient
    {
        internal readonly HttpClient client;
        internal readonly Uri uri;

        public string GetClientName => "Discord";

        public DiscordWebhookClient(HttpClient client, string webhookUrl)
        {
            this.client = client;
            this.uri = new Uri(webhookUrl);
        }

        public async Task<bool> SendMessageAsync(string message)
        {
            if (Plugin.configUseDiscordWebhook.Value == false)
            {
                return false;
            }

            var body = $"{{\"embeds\": [{{\"title\": \"{message}\"}}]}}";
            var content = new StringContent(body, Encoding.UTF8, "application/json");
            var response = await client.PostAsync(this.uri, content);
            Plugin.Log.LogInfo($"SendMessageAsync on {this.GetClientName} is Success?" + response.IsSuccessStatusCode);
            return response.IsSuccessStatusCode;
        }
    }
}
