import { Home } from "./components/Home";
import {FindLobby} from "./components/lobby/FindLobby";
import {Lobby} from "./components/lobby/lobby";

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
];

export default AppRoutes;
