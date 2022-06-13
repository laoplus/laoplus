using System;
using System.Net.Http;
using System.Text;

namespace LAOPLUS.Notification
{
    internal class DiscordWebhookClient : INotificationClient
    {
        readonly HttpClient _client;
        public Uri Uri { get; }

        static string GetClientName => "Discord";

        public DiscordWebhookClient(HttpClient client, string webhookUrl)
        {
            this._client = client;
            Uri = new Uri(webhookUrl);
        }

        public async void SendMessageAsync(string message)
        {
            if (LAOPLUS.ConfigDiscordWebhookEnabled.Value == false)
            {
                return;
            }

            try
            {
                // JSONに改行は含めない
                var escapedMessage = message.Replace(Environment.NewLine, "\\n");
                var body = $"{{\"embeds\": [{{\"title\": \"{escapedMessage}\"}}]}}";
                var content = new StringContent(body, Encoding.UTF8, "application/json");
                var response = await this._client.PostAsync(Uri, content);
                var success = response.IsSuccessStatusCode;
                LAOPLUS.Log.LogInfo($"SendMessageAsync on {GetClientName} is Success? {success}");

                if (success)
                {
                    return;
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                LAOPLUS.Log.LogWarning($"The request was unsuccessful: {responseContent}");
            }
            catch (Exception e)
            {
                LAOPLUS.Log.LogError(e.Message);
            }
        }

        public async void SendEquipItemDropNotificationAsync(
            string itemName,
            string itemDescription,
            string itemLinkUrl,
            string itemImageUrl
        )
        {
            try
            {
                var body =
                    $@"
                    {{
	                    ""embeds"": [
		                    {{
			                    ""title"": ""{itemName}"",
			                    ""description"":""{itemDescription}"",
			                    ""url"":""{itemLinkUrl}"",
			                    ""thumbnail"": {{
				                    ""url"":""{itemImageUrl}""
			                    }},
			                    ""author"":{{
				                    ""name"":""装備品ドロップ""
			                    }}
		                    }}
	                    ]
                    }}";
                var content = new StringContent(body, Encoding.UTF8, "application/json");
                var response = await this._client.PostAsync(Uri, content);
                var success = response.IsSuccessStatusCode;

                if (success)
                {
                    return;
                }

                var requestContent = await response.RequestMessage.Content.ReadAsStringAsync();
                var responseContent = await response.Content.ReadAsStringAsync();
                LAOPLUS.Log.LogWarning($"Item Notification request was unsuccessful:");
                LAOPLUS.Log.LogWarning($"Request: {requestContent}");
                LAOPLUS.Log.LogWarning($"Response: {responseContent}");
            }
            catch (Exception e)
            {
                LAOPLUS.Log.LogError(e.Message);
            }
        }

        public async void SendUnitDropNotificationAsync(
            string unitName,
            string unitLinkUrl,
            string unitImageUrl
        )
        {
            try
            {
                var body =
                    $@"
                    {{
	                    ""embeds"": [
		                    {{
			                    ""title"": ""{unitName}"",
			                    ""url"":""{unitLinkUrl}"",
			                    ""thumbnail"": {{
				                    ""url"":""{unitImageUrl}""
			                    }},
			                    ""author"":{{
				                    ""name"":""ユニットドロップ""
			                    }}
		                    }}
	                    ]
                    }}";
                var content = new StringContent(body, Encoding.UTF8, "application/json");
                var response = await this._client.PostAsync(Uri, content);
                var success = response.IsSuccessStatusCode;

                if (success)
                {
                    return;
                }

                var requestContent = await response.RequestMessage.Content.ReadAsStringAsync();
                var responseContent = await response.Content.ReadAsStringAsync();
                LAOPLUS.Log.LogWarning($"Unit Notification request was unsuccessful:");
                LAOPLUS.Log.LogWarning($"Request: {requestContent}");
                LAOPLUS.Log.LogWarning($"Response: {responseContent}");
            }
            catch (Exception e)
            {
                LAOPLUS.Log.LogError(e.Message);
            }
        }
    }
}
