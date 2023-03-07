using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;
using System.Timers;
using Timer = System.Timers.Timer;

namespace TravelTicket.Hubs
{
    [EnableCors("MyCors")]
    public class MessageHub : Hub
    {
        public enum GameStates {
            Lobby, InGame 
        }

        public class Player
        {
            public string DisplayName { get; set; }
            public string? Guess { get; set; }
        }

        public class GameDetails
        {
            public System.Timers.Timer countDownTimer = new Timer(1000);
            private string groupId;
            private Action callback;
            public GameDetails(string groupId, Action callback)
            {
                Players = new List<Player>();
                TimerStarted = false;
                Timer = 10;
                State = GameStates.Lobby;
                this.groupId = groupId;
                this.callback = callback;
            }

            public List<Player> Players { get; set; }
            public GameStates State { get; set; }
            public int Timer { get; set; }
            public bool TimerStarted { get; set; }

            public void TimerCountDown(object sender, ElapsedEventArgs e)
            {
                try
                {
                    Timer--;
                    if (Timer <= 0)
                    {
                        // TODO transfer everyone into the game state
                        TimerStarted = false;
                        Timer = 10;
                        State = GameStates.InGame;
                        countDownTimer.Elapsed -= TimerCountDown;
                        callback();
                        //c.Clients.Group(groupId).SendAsync("ReceiveData", this);
                    }
                    Console.WriteLine("Tick...");
                    callback();
                } catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

        }

        public static Dictionary<string, GameDetails> games = new Dictionary<string, GameDetails>();

        // set up the lobby information
        public Task JoinLobby(string groupId)
        {
            games.TryAdd(groupId, new GameDetails(groupId, () => Clients.Group(groupId).SendAsync("ReceiveData", games[groupId])));
            games[groupId].Timer = 10;
            games[groupId].TimerStarted = false;
            return Groups.AddToGroupAsync(Context.ConnectionId, groupId);
        }

        public Task AddPlayerToLobby(string groupId, string username)
        {
            // add the player to the lobby on the server side
            Player player = new Player();
            player.DisplayName = username;
            games[groupId].Players.Add(player);

            // send back the lobby id to the player for the client to hold onto
            return Clients.Group(groupId).SendAsync("ReceiveData", games[groupId]);
        }

        public Task ToggleCountDown(string groupId)
        {
            Console.WriteLine("In toggle countdown");
            // reset the timer and remove the countdown delegate from the timer event 
            if (games[groupId].TimerStarted)
            {
                games[groupId].TimerStarted = false;
                games[groupId].Timer = 10;
                games[groupId].countDownTimer.Elapsed -= games[groupId].TimerCountDown;

                return Clients.Group(groupId).SendAsync("ReceiveData", games[groupId]);
            }
            // start the timer and add the countdown delegate to the timer event
            games[groupId].TimerStarted = true;
            games[groupId].countDownTimer.Elapsed += games[groupId].TimerCountDown;
            games[groupId].countDownTimer.Enabled = true;
            games[groupId].countDownTimer.AutoReset = true;
            games[groupId].countDownTimer.Start();

            return Clients.Group(groupId).SendAsync("ReceiveData", games[groupId]);
        }

        public Task RemovePlayerFromLobby(string groupId, string username)
        {
            int removeIndex = games[groupId].Players.FindIndex(p => p.DisplayName == username);
            games[groupId].Players.RemoveAt(removeIndex);
            return Clients.Group(groupId).SendAsync("ReceiveData", games[groupId].Players);
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
