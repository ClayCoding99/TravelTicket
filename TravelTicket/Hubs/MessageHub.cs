using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;
using System.Timers;
using TravelTicket.Controllers;
using Timer = System.Timers.Timer;

namespace TravelTicket.Hubs
{
    [EnableCors("MyCors")]
    public class MessageHub : Hub
    {

        public class Player
        {
            public Player() {
                DisplayName = "";
                Lives = 3;
                Turn = false;
                Guess = "";
            } 
            public string DisplayName { get; set; }
            public string? Guess { get; set; }
            public int Lives { get; set; }
            bool Turn { get; set; }
        }

        public class GameDetails
        {
            public GameDetails()
            {
                Players = new List<Player>();
                TimerStarted = false;
                Timer = 10;
                State = "lobby";
                playerTakingTurn = null;
            }
            public List<Player> Players { get; set; }
            public string State { get; set; }
            public int Timer { get; set; }
            public bool TimerStarted { get; set; }
            public Player? playerTakingTurn { get; set; }
    
        }

        public static Dictionary<string, GameDetails> games = new Dictionary<string, GameDetails>();

        // set up the lobby information
        public Task JoinLobby(string groupId)
        {
            games.TryAdd(groupId, new GameDetails());
            games[groupId].Timer = 10;
            games[groupId].TimerStarted = false;
            return Groups.AddToGroupAsync(Context.ConnectionId, groupId);
        }

        public Task AddPlayerToLobby(string groupId, string username)
        {
            // TODO: make an AddPlayerToGame

            // add the player to the lobby on the server side
            Player player = new Player();
            player.DisplayName = username;
            games[groupId].Players.Add(player);

            if (games[groupId].State == "lobby")
            {
                games[groupId].State = "game";
            }

            Console.WriteLine(games[groupId]);

            // send back the lobby id to the player for the client to hold onto
            if (games[groupId].State == "game")
            {
                return Clients.Group(groupId).SendAsync("ReceivGameeData", games[groupId]);

            } else
            {
                return Clients.Group(groupId).SendAsync("ReceiveData", games[groupId]);
            }
        }

        public void UpdateTimer(string groupId, LobbyController.TimerDetails timerDetails)
        {
            games[groupId].Timer = timerDetails.CountDown;
            games[groupId].TimerStarted = timerDetails.TimerStarted;
            if (timerDetails.CountDown <= 0)
            {
                games[groupId].State = "game";
            }
            Console.WriteLine("Going to send back to client");
            Clients.Group(groupId).SendAsync("ReceiveData", games[groupId]);
        }

        public Task RemovePlayerFromLobby(string groupId, string username)
        {
            int removeIndex = games[groupId].Players.FindIndex(p => p.DisplayName == username);
            games[groupId].Players.RemoveAt(removeIndex);
            return Clients.Group(groupId).SendAsync("ReceiveData", games[groupId].Players);
        }

        public Task InitializeGameData(string groupId)
        {
            games[groupId].playerTakingTurn = games[groupId].Players[0];
            return Clients.Group(groupId).SendAsync("ReceiveGameMessage", games[groupId]);
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("UserConnected", Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        // probably will need to use this to handle players leaving the game
        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await Clients.All.SendAsync("UserDisconnected", Context.ConnectionId);
            await base.OnDisconnectedAsync(ex);
        }

    }
}
