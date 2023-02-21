using TravelTicket.Controllers;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace TravelTicket.Services
{

    public class LobbyManager
    {

        private static LobbyManager instance = null;

        public static LobbyManager GetInstance()
        {
            if (instance == null)
            {
                instance = new LobbyManager();
            }
            return instance;
        }

        private ICollection<LobbyDetails> _lobbyDetails;

        private LobbyManager()
        {
            _lobbyDetails = new List<LobbyDetails>();
        }

        public void AddLobby(LobbyDetails room)
        {
            if (!_lobbyDetails.Contains(room))
            {
                _lobbyDetails.Add(room);
            } else
            {
                throw new Exception("Room already exists!");
            }
        }

        public void RemoveLobby(LobbyDetails room)
        {
            if (!_lobbyDetails.Contains(room))
            {
                throw new Exception("Room could not be removed because it already exists!");
            }
        }

        public ICollection<LobbyDetails> GetLobbys()
        {
            return _lobbyDetails;
        }

    }

}