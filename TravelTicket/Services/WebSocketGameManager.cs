using Microsoft.AspNetCore.Http;
using WebSocketSharp.Server;
using WebSocketSharp;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Cors;

namespace TravelTicket.Services
{
    [EnableCors("MyCors")]
    public class GameBehaviour : WebSocketBehavior
    {

        public GameBehaviour() {
            this.IgnoreExtensions = true;
        }

        protected override void OnOpen()
        {
            // Send the socket information back to every client in the meeting room
            Console.WriteLine("Wss has opened!");
            Console.WriteLine(this.Context.RequestUri);
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            

            Console.WriteLine("Received message from client " + e.Data);
            // send a message to the person connected
            //Send(e.Data);

            // send a message to everyone connected to the server
            Sessions.Broadcast(e.Data);
        }

        protected override void OnClose(CloseEventArgs e)
        {
            Console.WriteLine("Wss has closed!");
        }

    }

    public class WebSocketGameManager
    {
        private static int webSocketServerPort = 7890;
        private static string webSocketServerPath = "ws://localhost:" + webSocketServerPort;

        private static WebSocketGameManager instance = null;

        public static WebSocketGameManager GetInstance()
        {
            if (instance == null)
            {
                instance = new WebSocketGameManager();
            }
            return instance;
        }

        private WebSocketServer wss;

        private WebSocketGameManager()
        {
            wss = new WebSocketServer(webSocketServerPath);
            wss.AllowForwardedRequest = true;
            wss.Start();
            Console.WriteLine("Server started on " + webSocketServerPath + "!");
        }

        public void AddLobby(string route)
        {
            wss.AddWebSocketService<GameBehaviour>(route);
            Console.WriteLine("New game added under " + route + "!");
        }

        public void RemoveLobby(string route)
        {
            if (!wss.RemoveWebSocketService(route))
            {
                throw new Exception("Could not remove game under " + webSocketServerPath + route + " because it does not exist!");
            }
            Console.WriteLine("Game removed under " + webSocketServerPath + route + "!");
        }

    }
}
