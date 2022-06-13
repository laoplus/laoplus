using System;

namespace LAOPLUS.Notification
{
    public interface INotificationClient
    {
        Uri Uri { get; }
        void SendMessageAsync(string message);
        void SendEquipItemDropNotificationAsync(
            string itemName,
            string itemDescription,
            string itemLinkUrl,
            string itemImageUrl
        );
        void SendUnitDropNotificationAsync(
            string unitName,
            string unitLinkUrl,
            string unitImageUrl
        );
    }
}
