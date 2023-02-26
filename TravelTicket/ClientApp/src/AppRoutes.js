import { Home } from "./components/Home";
import {FindLobby} from "./components/lobby/FindLobby";
import {Lobby} from "./components/lobby/lobby";
import {NotFound} from "./notFound";
import {Game} from "./components/game/game";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/find-lobby',
    element: <FindLobby />
  },
  {
    path: "/lobby/:lobbyId",
    element: <Lobby />
  },
  {
    path: "*",
    element: <NotFound />
  },
  {
    path: "/game/:gameId",
    element: <Game />
  }
];

export default AppRoutes;
