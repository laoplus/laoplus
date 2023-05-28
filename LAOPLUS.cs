using System;
using BepInEx;
using BepInEx.Configuration;
using BepInEx.Unity.IL2CPP;
using BepInEx.Logging;
using HarmonyLib;
using System.Collections.Generic;
using System.Net.Http;
using System.Reflection;
using LAOPLUS.Notification;
using UnityEngine;

namespace LAOPLUS
{
    [BepInPlugin(MyPluginInfo.PLUGIN_GUID, MyPluginInfo.PLUGIN_NAME, MyPluginInfo.PLUGIN_VERSION)]
    // ReSharper disable once InconsistentNaming
    // ReSharper disable once ClassNeverInstantiated.Global
    public class LAOPLUS : BasePlugin
    {
        internal new static ManualLogSource Log;
        static readonly HttpClient HttpClient = new();

        const string ConfigDiscordLabel = "Discord";
        public static ConfigEntry<string> ConfigDiscordWebhookUrl;
        public static ConfigEntry<bool> ConfigDiscordWebhookEnabled;

        const string ConfigNotificationLabel = "Notification / 通知";

        // public static ConfigEntry<bool> ConfigNotificationEnabled;
        public static ConfigEntry<bool> ConfigUnitDropNotificationEnabled;
        public static ConfigEntry<bool> ConfigEquipItemDropNotificationEnabled;

        const string ConfigScrollLabel = "Scroll / スクロール";
        public static ConfigEntry<float> ConfigScrollPatchMultiplier;
        public static ConfigEntry<bool> ConfigPreventsScrollingOoB;

        const string ConfigLobbyLabel = "Lobby / ロビー";
        public static ConfigEntry<bool> ConfigPreventLobbyCameraAutoRevertEnabled;

        const string ConfigBaseLabel = "Base / 基地";
        public static ConfigEntry<bool> ConfigAutoPressRestartWhenRewarded;

        const string ConfigLoggingLabel = "Logging / ログ";
        public static ConfigEntry<bool> ConfigLoggingBattleLog;

        const string ConfigOtherLabel = "Other / その他";
        public static ConfigEntry<bool> ConfigInstantRerollOnPremiumLoginRewardEnabled;
        public static ConfigEntry<bool> ConfigShowTheNumberOfItemsInItemTooltipEnabled;
        public static ConfigEntry<bool> ConfigShowTheNumberOfItemsInExBuyModalEnabled;

        static readonly List<INotificationClient> NotificationClients = new();

        static void ConfigDiscordWebhookUrlChangedHandler(object sender, EventArgs e)
        {
            RemoveAllClientsFromNotificationClients();

            if (e is not SettingChangedEventArgs newEvent)
            {
                return;
            }

            var newClient = CreateDiscordWebhookClient(
                newEvent.ChangedSetting.BoxedValue.ToString()
            );
            AddClientToNotificationClients(newClient);

            SendTestMessageToAllNotificationClients();
        }

        static DiscordWebhookClient CreateDiscordWebhookClient(string webhookUrl)
        {
            if (string.IsNullOrEmpty(webhookUrl))
            {
                return null;
            }

            try
            {
                var client = new DiscordWebhookClient(HttpClient, webhookUrl);
                return client;
            }
            catch (Exception e)
            {
                Log.LogError($"Failed to create DiscordWebhookClient: {webhookUrl}");
                Log.LogError(e.Message);
                return null;
            }
        }

        static void AddClientToNotificationClients(INotificationClient client)
        {
            if (client == null)
            {
                return;
            }

            try
            {
                NotificationClients.Add(client);
                Log.LogInfo($"Notification Client Added: {client.Uri}");
            }
            catch (Exception e)
            {
                Log.LogError(e.ToString());
            }
        }

        static void RemoveAllClientsFromNotificationClients()
        {
            NotificationClients.Clear();
            Log.LogInfo("All Notification Clients Cleared");
        }

        static void SendTestMessageToAllNotificationClients()
        {
            Log.LogInfo($"{NotificationClients.Count} notification client(s) loaded.");
            SendMessageToAllNotificationClients(
                $"{MyPluginInfo.PLUGIN_NAME} v{MyPluginInfo.PLUGIN_VERSION} loaded!"
            );
        }

        static void InitNotificationClients()
        {
            // Discord Webhook
            var discordWebhookUrl = ConfigDiscordWebhookUrl.Value;
            var discordWebhookClient = CreateDiscordWebhookClient(discordWebhookUrl);
            AddClientToNotificationClients(discordWebhookClient);

            SendTestMessageToAllNotificationClients();
        }

        public static void SendMessageToAllNotificationClients(string message)
        {
            NotificationClients.ForEach(w => w.SendMessageAsync(message));
        }

        public static void SendUnitDropNotificationToAllNotificationClients(
            string unitName,
            string unitLinkUrl,
            string unitImageUrl
        )
        {
            NotificationClients.ForEach(
                w => w.SendUnitDropNotificationAsync(unitName, unitLinkUrl, unitImageUrl)
            );
        }

        public static void SendItemDropNotificationToAllNotificationClients(
            string itemName,
            string itemDescription,
            string itemLinkUrl,
            string itemImageUrl
        )
        {
            NotificationClients.ForEach(
                w =>
                    w.SendEquipItemDropNotificationAsync(
                        itemName,
                        itemDescription,
                        itemLinkUrl,
                        itemImageUrl
                    )
            );
        }

        public override void Load()
        {
            Log = base.Log;
            Log.LogInfo($"{MyPluginInfo.PLUGIN_NAME} v{MyPluginInfo.PLUGIN_VERSION} is loaded!");

            HttpClient.DefaultRequestHeaders.Add(
                "User-Agent",
                $"{MyPluginInfo.PLUGIN_NAME}/{MyPluginInfo.PLUGIN_VERSION}"
            );

            // Discord
            ConfigDiscordWebhookUrl = Config.Bind(
                ConfigDiscordLabel,
                "Webhook URL",
                "",
                "Discord webhook URL"
            );
            ConfigDiscordWebhookUrl.SettingChanged += ConfigDiscordWebhookUrlChangedHandler;
            ConfigDiscordWebhookEnabled = Config.Bind(
                ConfigDiscordLabel,
                "Send a notification / 通知を送信する",
                true,
                "Toggles whether all notifications are disabled or enabled.\n"
                    + "すべての通知の無効・有効を切り替えます"
            );

            // Notifications / 通知
            ConfigUnitDropNotificationEnabled = Config.Bind(
                ConfigNotificationLabel,
                "Unit Drop Notification / ユニットドロップ通知",
                true,
                "Toggles whether unit drop notifications are disabled or enabled.\n"
                    + "ユニットドロップ通知の無効・有効を切り替えます\n"
                    + "Currently only supports SS ranks. / 現在SSランクのみ対応しています"
            );
            ConfigEquipItemDropNotificationEnabled = Config.Bind(
                ConfigNotificationLabel,
                "Equip Item Drop Notification / 装備品ドロップ通知",
                true,
                "Toggles whether equip item drop notifications are disabled or enabled.\n"
                    + "装備品ドロップ通知の無効・有効を切り替えます\n"
                    + "Currently only supports SS ranks. / 現在SSランクのみ対応しています"
            );

            // Scroll / スクロール
            ConfigScrollPatchMultiplier = Config.Bind(
                ConfigScrollLabel,
                "Scroll Multiplier / スクロール倍率",
                6.0f,
                "Wheel scroll multiplier for combatant, equipment list, etc.\n"
                    + "戦闘員・装備リストなどのホイールスクロール倍率"
            );
            ConfigPreventsScrollingOoB = Config.Bind(
                ConfigScrollLabel,
                "Disable Scrolling to Out of Bounds / 範囲外へのスクロールを無効にする",
                true,
                "Prevents scrolling outside the bounds of items when scrolling in the list.\n"
                    + "リストでのスクロール時に項目の範囲外までスクロールしないようにします"
            );

            // Lobby / ロビー
            ConfigPreventLobbyCameraAutoRevertEnabled = Config.Bind(
                ConfigLobbyLabel,
                "Prevent Camera Auto Revert / カメラの自動移動を防ぐ",
                false,
                "Prevents the camera from returning to the center when moving the camera in the lobby.\n"
                    + "ロビーでのカメラ移動時にカメラが自動で中央に戻らないようにします"
            );

            // Base / 基地
            ConfigAutoPressRestartWhenRewarded = Config.Bind(
                ConfigBaseLabel,
                "Automatic restart when rewarded / 受取時自動再作動",
                true,
                "When you receive the production reward at the production facility in base, automatically press the restart button in the pop-up.\n"
                    + "基地の生産施設にて製作報酬を受取時、自動でポップアップ内の再作動ボタンを押します"
            );

            // Logging / ログ
            ConfigLoggingBattleLog = Config.Bind(
                ConfigLoggingLabel,
                "Output battle log / バトルログを出力",
                false,
                "Output battle log to BepinEx log output.\n" + "バトルログをBepinExのログに出力する"
            );

            // Other / その他
            ConfigInstantRerollOnPremiumLoginRewardEnabled = Config.Bind(
                ConfigOtherLabel,
                "Instant Reroll on Premium Login Reward / プレミアムログインボーナスの振り直しを高速化",
                true,
                "Remove the animation wait when reroll the Premium Login Reward.\n"
                    + "プレミアムログインボーナス振り直し時の表示待機時間を削除します"
            );
            ConfigShowTheNumberOfItemsInItemTooltipEnabled = Config.Bind(
                ConfigOtherLabel,
                "Show the Number of Items in Item Tooltip / アイテム詳細ツールチップに所持数を表示",
                true,
                "Show the number of items in item detail tooltip.\n"
                    + "アイテム長押し時に表示される項目詳細情報にそのアイテムの所持数を表示します"
            );
            ConfigShowTheNumberOfItemsInExBuyModalEnabled = Config.Bind(
                ConfigOtherLabel,
                "Show the Number of Items in Item Exchange Modal / アイテム交換所の交換画面に所持数を表示",
                true,
                "Show the number of items in item exchange modal.\n"
                    + "アイテム交換所の交換画面にそのアイテムの所持数を表示します"
            );

            InitNotificationClients();
            Harmony.CreateAndPatchAll(Assembly.GetExecutingAssembly());
        }
    }
}
