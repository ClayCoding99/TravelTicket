import React from 'react'
import { useEffect, useState } from 'react';

import { io } from "socket.io-client";

import "../../css/lobby/lobby.css";

export function Lobby() {

    const wssRoute = window.location.pathname.split('/').pop();
    const wssPath = `ws://localhost:7890/${wssRoute}`;
    console.log(wssRoute);

    // // Make a connection to the websocket provided by the server
    // const socket = io(wssPath);

    // //When the connection is made, log it
    // socket.on('connect', () => {
    //     console.log('Connected to websocket');
    // });

    // test with dummy data for now
    // make the max lobby size of 8 for now
    const [players, setPlayers] = useState([
        {name: "Walter", id: 1},
        {name: "Alice", id: 2},
        {name: "Joe", id: 3},
        {name: "Pog", id: 4},
        {name: "Clayton", id: 5},
        {name: "Jane", id: 6},
        {name: "Bob", id: 7},
        {name: "Kid Named Finger", id: 8},
    ]);

    function goToMenu() {
        console.log("go to menu");
        window.location.href = './';
    }

    // make a sample table for now
    return (
    <div>
        <h1>Lobby Name Here</h1>
        <table>
            <thead>
                <tr>
                    <th>Lobby ID</th>
                    <th>Player Name</th>
                </tr>
            </thead>
            <tbody>
                {players.map(player => {
                    return (
                        <tr key={player.id}>
                            <td>{player.id}</td>
                            <td>{player.name}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        <h2>Game starts in 3!</h2>
        <div id="button-div">
            <button onClick={goToMenu} className="cancel">Leave</button>
            <button className="start">Start Game</button>
        </div>
    </div>
    );
}
