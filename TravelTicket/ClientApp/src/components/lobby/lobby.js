import React from 'react'
import { useEffect, useState, useRef} from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import "../../css/lobby/lobby.css";

export function Lobby() {

    const [countDown, setCountDown] = useState(null);

    //const countDown = useRef(false);
    const startButton = useRef(null);
    const countDownHeader = useRef(null);
    const [connection, setConnection] = useState(null);

    const [lobbyName, setLobbyName] = useState(null);

    const [players, setPlayers] = useState([]);

    const lobbyId = window.location.pathname.split('/').pop();

    useEffect(() => {
        if (connection == null) {
            // connect to the hub
            let newConnection = new HubConnectionBuilder().withUrl("https://localhost:7150/messages").withAutomaticReconnect().build();
            setConnection(newConnection);
        }
        fetch (`/api/lobby/${lobbyId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
            setLobbyName(data.name);
        });
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start().then((result) => {
                console.log("Connected to lobby");

                // join the specific lobby group
                connection.invoke("JoinLobby", lobbyId).then((message) => {
                    console.log("Invoked websocket lobby");
                    console.log(message);
                }).catch((err) => {
                    console.log("Error joining lobby: " + err);
                });

                // add the client to the lobby
                const displayName = localStorage.getItem("displayName");
                connection.invoke("AddPlayerToLobby", lobbyId, displayName).catch((err) => {
                    console.log("Error sending message to lobby: " + err);
                });

                // recieve and update the player data
                connection.on("ReceiveData", (message) => {
                    console.log(message);
                    let newPlayerData = [];
                    for (let i = 0; i < message.players.length; i++) {
                        const currentDisplayName = message.players[i].displayName;
                        newPlayerData.push({name: currentDisplayName, id: i});
                    }
                    console.log(newPlayerData);
                    setPlayers(newPlayerData);

                    if (message.state == "game") {
                        window.location.href = `./game/${lobbyId}`;
                    }
                });

                // receive timer data
                connection.on("ReceiveTimer", (message) => {

                    if (message.countDown <= 0) {
                        window.location.href = `./game/${lobbyId}`;
                    }
                    const timerData = {
                        timerStarted: message.timerStarted,
                        countDown: message.countDown
                    }
                    setCountDown(timerData);

                    console.log("Count down is changed in use effect");
                    console.log(countDown);
                    if (timerData.timerStarted) {
                        countDownHeader.current.className = "";
                        startButton.current.className = "cancel-game";
                        startButton.current.innerText = "Cancel";
                    } else {
                        countDownHeader.current.className = "hidden";
                        startButton.current.className = "start-game";
                        startButton.current.innerText = "Start";
                    }
                }).catch((err) => {
                    console.log("Error receiving timer: " + err);
                });
    
            }).catch((err) => {
                console.log("Error connecting to lobby: " + err);
            });
        }
    }, [connection]);


    function goToMenu() {
        // remove player from the lobby
        const displayName = localStorage.getItem("displayName");
        connection.invoke("RemovePlayerFromLobby", lobbyId, displayName).catch((err) => {
            console.log("Error sending message to lobby: " + err);
        });
        console.log("go to menu");
        window.location.href = './';
    }

    function startGame() {
        // handle countdown
        fetch("api/lobby/" + lobbyId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }   

    // make a sample table for now
    return (
    <div className="lobby-container">
        <h1>{lobbyName == null ? "Lobby Name Here" : lobbyName}</h1>
        <h2 ref={countDownHeader} className="hidden">{countDown ? `Game starts in ${countDown.countDown}!` : null}</h2>
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
        <div id="button-div">
            <button onClick={goToMenu} className="cancel">Leave</button>
            <button ref={startButton} onClick={startGame} className="start">Start Game</button>
        </div>
    </div>
    );
}