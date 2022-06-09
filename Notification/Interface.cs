namespace LAOPLUS.Notification
{
    public interface INotificationClient
    {
        void SendMessageAsync(string message);
    }
}
