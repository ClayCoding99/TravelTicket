using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.ComponentModel;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Timers;
using TravelTicket.Hubs;
using TravelTicket.Services;

namespace TravelTicket.Controllers
{

    [EnableCors("MyCors")]
    [ApiController]
    [Route("api/[controller]")]
    public class LobbyController : ControllerBase
    {
        private readonly IHubContext<MessageHub> _hubContext;

        // holds all the current lobby's 
        private LobbyManager lobbyManager;

        public LobbyController(IHubContext<MessageHub> hubContext) {
            _hubContext = hubContext;
            lobbyManager = LobbyManager.GetInstance();
        }    

        // api/lobby (creates a new lobby)
        [HttpPost("/api/lobby/create")]
        public IActionResult Create(string name, string password)
        {
            try
            {
                Console.WriteLine("Posted to lobby controller!");
                Console.WriteLine(name + "," + password);

                // finish setting up the lobby
                LobbyDetails lobbyDetails = new LobbyDetails();
                lobbyDetails.Name = name;
                lobbyDetails.Password = password;
                lobbyDetails.ID = Guid.NewGuid().ToString();
                lobbyDetails.Created = DateTime.Now;

                // create the lobby details so that other people can see it and possibly join
                lobbyManager.AddLobby(lobbyDetails);

                // send the lobby details back to the client
                return new JsonResult(lobbyDetails);
            } catch (Exception ex)
            {
                return new JsonResult(ex.Message);
            }
        }

        // api/lobby (obtain the list of lobbies sorted by most recent) 
        [HttpGet]
        public IActionResult Lobby()
        {
            try
            {
                var lobbys = lobbyManager.GetLobbys();
                return new JsonResult(lobbys.AsParallel().OrderByDescending(a => a.Created));
            } catch (Exception ex)
            {
                return new JsonResult($"{ex.Message}");
            }
        }


        [HttpGet("{id}")]
        public IActionResult Lobby(string id)
        {
            try
            {
                if (id == null)
                {
                    return new JsonResult("{errMsg: \"Lobby Id cannot be null!\"}");
                }
                var lobby = lobbyManager.GetLobbys().First(a => a.ID == id);
                return new JsonResult(lobby);
            } catch (Exception ex)
            {
                return new JsonResult(ex.Message);
            }
        }


        // Timer stuff has to be in the controller because if it is done in the hub, the object is disposed of
        public class TimerDetails
        {

            private IHubContext<MessageHub> _hubContext;
            public TimerDetails(IHubContext<MessageHub> hubContext, string groupId)
            {
                this._hubContext = hubContext;
                Timer = new System.Timers.Timer(1000);
                CountDown = 10;
                TimerStarted = false;
                this.groupId = groupId;
            }
            public System.Timers.Timer Timer { get; set; }
            public int CountDown { get; set; }
            public bool TimerStarted { get; set; }

            public string groupId { get; set; }

            public void TimerCountDown(object sender, ElapsedEventArgs e)
            {
                lobbyTimers[groupId].CountDown--;
                if (lobbyTimers[groupId].CountDown <= 0)
                {
                    Console.WriteLine("Starting game...");
                    _hubContext.Clients.All.SendAsync("ReceiveTimer", this);
                    // reset timer
                    lobbyTimers[groupId].TimerStarted = false;
                    lobbyTimers[groupId].CountDown = 10;
                    return;
                }
                Console.WriteLine("Tick...");
                _hubContext.Clients.All.SendAsync("ReceiveTimer", this);
            }
        }

        public static Dictionary<string, TimerDetails> lobbyTimers = new Dictionary<string, TimerDetails>();

        [HttpPost("{id}")]
        public IActionResult ToggleCountDown(string id)
        {
            Console.WriteLine(id);
            Console.WriteLine("In toggle count down");
            // add the timer if it doesnt exist
            if (!lobbyTimers.ContainsKey(id))
            {
                lobbyTimers[id] = new TimerDetails(_hubContext, id);
                lobbyTimers[id].Timer.Elapsed += lobbyTimers[id].TimerCountDown;
            }

            // stop the timer and send the information into the hub where it will update the lobby info and send it back to the clients
            if (lobbyTimers[id].TimerStarted)
            {
                Console.WriteLine("Stopping Timer");
                lobbyTimers[id].TimerStarted = false;
                lobbyTimers[id].CountDown = 10;
                lobbyTimers[id].Timer.Stop();
                _hubContext.Clients.Group(id).SendAsync("ReceiveTimer", lobbyTimers[id]);
                return Ok();
            } 
            // start the timer and add the countdown delegate to the timer event, then send the information to the hub where it can update everything and send back to the clients
            lobbyTimers[id].Timer.Enabled = true;
            lobbyTimers[id].Timer.AutoReset = true;
            lobbyTimers[id].Timer.Start();
            lobbyTimers[id].TimerStarted = true;
            _hubContext.Clients.Group(id).SendAsync("ReceiveTimer", lobbyTimers[id]);
            return Ok();
        }

    }
}
