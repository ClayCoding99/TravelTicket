import React from 'react'
import { JoinGameModal } from './JoinLobbyModal';

export default function LobbyDetails({lobbyDetails}) {
    return (
    <div className="lobbyDetails">
        <h1 className='flex-item'>{lobbyDetails.name}</h1>
        <p className='flex-item'>{lobbyDetails.description}</p>
        <JoinGameModal className="flex-item" lobbyDetails={lobbyDetails}/>
    </div>
  )
};