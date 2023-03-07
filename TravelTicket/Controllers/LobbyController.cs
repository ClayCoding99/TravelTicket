using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
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

    }
}
