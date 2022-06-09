using System;
using System.Net.Http;
using System.Text;

namespace LAOPLUS.Notification
{
    internal class DiscordWebhookClient : INotificationClient
    {
        readonly HttpClient _client;
        readonly Uri _uri;

        string GetClientName => "Discord";

        public DiscordWebhookClient(HttpClient client, string webhookUrl)
        {
            this._client = client;
            this._uri = new Uri(webhookUrl);
        }

        public async void SendMessageAsync(string message)
        {
            if (LAOPLUS.ConfigUseDiscordWebhook.Value == false)
            {
                return;
            }

            try
            {
                // JSONに改行は含めない
                var escapedMessage = message.Replace(Environment.NewLine, "\\n");
                var body = $"{{\"embeds\": [{{\"title\": \"{escapedMessage}\"}}]}}";
                var content = new StringContent(body, Encoding.UTF8, "application/json");
                var response = await this._client.PostAsync(this._uri, content);
                var success = response.IsSuccessStatusCode;
                LAOPLUS.Log.LogInfo(
                    $"SendMessageAsync on {this.GetClientName} is Success? {success}"
                );

                if (success == false)
                {
                    string responseContent = await response.Content.ReadAsStringAsync();
                    LAOPLUS.Log.LogWarning($"The request was unsuccessful: {responseContent}");
                }
            }
            catch (Exception e)
            {
                LAOPLUS.Log.LogError(e.Message);
                LAOPLUS.Log.LogError(e.ToString());
            }
        }
    }
}
