import React, { useEffect, useState} from 'react'
import LobbyDetails from './LobbyDetails';

import "../../css/lobby/findLobby.css";

export function FindLobby() {

  const dummyLobbies = [{name: "Walter", description: "ijhgrgioerhgoiehgirehgoerhiorehiorehgioerhgiorehgoierhgioerhgioerhgoierhgiorehoehiohgoierhgoirehgoiheriiiiiiiiiiiighieorhgerhgoerhogiehirgwewwewwewwew", password: "1"}, {name: "kid", description: "named finger", password: "1"}, {name: "Joe", description: "Mother", password: "1"}, {name: "kid", description: "named finger", password: "1"}, {name: "kid", description: "named finger", password: "1"}, {name: "kid", description: "named finger", password: "1"}];

  const [lobbies, setLobbies] = useState(dummyLobbies);

  // obtain the lobby details from the server
  useEffect(() => {
    fetch ('/api/lobby', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(data => {
        console.log(data);
        setLobbies(data);
    });
  }, []);

  return (
    <div className="find-lobby-list">
      {lobbies.length > 0 ? lobbies.map(lobby => ( <LobbyDetails key={lobby.name} lobbyDetails={lobby} />))
      : <h1>Loading...</h1>}
    </div>
  )
}