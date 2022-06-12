using System;

namespace LAOPLUS.Notification
{
    public interface INotificationClient
    {
        Uri Uri { get; }
        void SendMessageAsync(string message);
        void SendItemNotificationAsync(
            string itemName,
            string itemDescription,
            string itemLinkUrl,
            string itemImageUrl
        );
        void SendUnitNotificationAsync(
            string unitName,
            string unitLinkUrl,
            string unitImageUrl
        );
    }
}
