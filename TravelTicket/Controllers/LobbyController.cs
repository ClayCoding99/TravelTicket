using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;
using TravelTicket.Services;

namespace TravelTicket.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class LobbyController : ControllerBase
    {
        // holds all the current lobby's 
        private LobbyManager lobbyManager;
        private WebSocketGameManager gameManager;

        public LobbyController() {
            lobbyManager = LobbyManager.GetInstance();
            gameManager = WebSocketGameManager.GetInstance();
        }    

        // api/lobby (creates a new lobby)
        [EnableCors("MyCors")]
        [HttpPost]
        public IActionResult Lobby(string name, string password)
        {
            try
            {
                Console.WriteLine("Posted to lobby controller!");
                Console.WriteLine(name + "," + password);

                // finish setting up the lobby
                LobbyDetails lobbyDetails = new LobbyDetails();
                lobbyDetails.Name = name;
                lobbyDetails.Password = password;
                lobbyDetails.ID = Guid.NewGuid().ToString().Substring(0, 5);
                lobbyDetails.Created = DateTime.Now;

                // create the lobby details so that other people can see it and possibly join
                lobbyManager.AddLobby(lobbyDetails);

                // create the web socket server lobby
                gameManager.AddLobby("/" + lobbyDetails.ID);

                return new JsonResult(lobbyDetails);
            } catch (Exception ex)
            {
                return new JsonResult(ex.Message);
            }
        }

        // api/lobby (obtain the list of lobbies sorted by most recent) 
        [EnableCors("MyCors")]
        [HttpGet]
        public IActionResult Lobby()
        {
            var lobbys = lobbyManager.GetLobbys();
            return new JsonResult(lobbys.AsParallel().OrderByDescending(a => a.Created));
        } 

    }
}
