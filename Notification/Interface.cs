using System.Threading.Tasks;

namespace LAOPLUS
{
    interface NotificationClient
    {
        string GetClientName { get; }
        Task<bool> SendMessageAsync(string message);

    }
}
