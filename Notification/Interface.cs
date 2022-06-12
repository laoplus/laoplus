using System;

namespace LAOPLUS.Notification
{
    public interface INotificationClient
    {
        Uri Uri { get; }
        void SendMessageAsync(string message);
    }
}
