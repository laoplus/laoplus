using System.Threading.Tasks;

namespace LAOPLUS
{
    public interface NotificationClient
    {
        string GetClientName { get; }
        Task<bool> SendMessageAsync(string message);

    }
}
