import React from 'react'
import { JoinGameModal } from './util/JoinLobbyModal';

export default function LobbyDetails({lobbyDetails}) {
    return (
    <div className="lobbyDetails">
        <h1>{lobbyDetails.name}</h1>
        <h1>{lobbyDetails.description}</h1>
        <JoinGameModal lobbyDetails={lobbyDetails}/>
    </div>
  )
};