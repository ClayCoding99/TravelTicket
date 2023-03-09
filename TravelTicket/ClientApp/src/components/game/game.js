import React from 'react'

import {useState, useEffect, useRef} from 'react';
import {FaUpload, FaClock, FaHeart} from "react-icons/fa";

import "../../css/game/game.css";
import { HubConnectionBuilder } from '@microsoft/signalr';

import EndGameModal from "./endGameModal";

const startCountDownTimer = 2;

let currentTimer = startCountDownTimer;
let currentTurnId = 1;
let clockInterval = null;

export function Game() {
    // your display name (Keep in mind that the display name is your id as well)
    const displayName = localStorage.getItem("displayName");

    const [players, setPlayers] = useState([]);
    const [playerTakingTurn, setPlayerTakingTurn] = useState(null);
    const [timer, setTimer] = useState(startCountDownTimer);
    const [modalDetails, setModalDetails] = useState({show: false, title: "", body: ""});
    const [guess, setGuess] = useState("");
    const [connection, setConnection] = useState(null);
    const guessInput = useRef(null);

    // WEBSOCKETS
    useEffect(() => {
        if (connection == null) {
            console.log("connecting to hub");
            // connect to the hub
            let newConnection = new HubConnectionBuilder().withUrl("https://localhost:7150/messages").withAutomaticReconnect().build();
            setConnection(newConnection);
        }
    }, []);

    const lobbyId = window.location.pathname.split('/').pop();

    // WEBSOCKETS
    useEffect(() => {
        if (connection) {
            connection.start().then((result) => {
                console.log("Connected to game");
                
                connection.on("ReceivGameeData", (message) => {
                    console.log("in receive game message");
                    console.log(message);

                    // update player data
                    let newPlayerData = [];
                    for (let i = 0; i < message.players.length; i++) {
                        newPlayerData.push({name: message.players[i], id: i});
                    }
                    console.log(newPlayerData);
                    setPlayers(newPlayerData);
                    setPlayerTakingTurn(message.playerTakingTurn);
                });

                // join the specific lobby group
                connection.invoke("AddPlayerToLobby", lobbyId).then((message) => {
                    console.log("Invoked websocket lobby");
                    console.log(message);
                }).catch((err) => {
                    console.log("Error joining lobby: " + err);
                });

                // receive timer data
                connection.on("ReceiveGameTimer", (message) => {
                    // if (message.countDown <= 0) {
                    //     window.location.href = `./game/${lobbyId}`;
                    // }
                    // const timerData = {
                    //     timerStarted: message.timerStarted,
                    //     countDown: message.countDown
                    // }
                    // setCountDown(timerData);

                    // initialize game data
                }).catch((err) => {
                    console.log("Error receiving timer: " + err);
                });
    
                // initial call to get the game data
                connection.invoke("InitializeGameData", lobbyId).then((message) => {
                    console.log("Obtained game data");
                });

            }).catch((err) => {
                console.log("Error connecting to game: " + err);
            });
        }
    }, [connection]);


    // TODO: move to server side
    // function changePlayerTurn(outOfTime) {
    //     const playerGuess = guessInput.current.value;
    //     guessInput.current.value = "";
    //     console.log(playerGuess);

    //     // update player data based on new turn
    //     setPlayers(prevPlayers => {
    //         // update the player lives
    //         let updatedPlayers = prevPlayers.map(player => {
    //             if (player.id == currentTurnId) {
    //                 if (outOfTime) {
    //                     if (player.lives > 0) {
    //                         player.lives -= 1;
    //                     }
    //                 }
    //             }
    //             return player;
    //         });

    //         // update turn id (skip over those who are dead)
    //         const turnId = currentTurnId;
    //         currentTurnId = currentTurnId >= 8 ? 1 : currentTurnId + 1;
    //         for (let i = currentTurnId - 1; i < updatedPlayers.length; i++) {
    //             if ((updatedPlayers[i % updatedPlayers.length].lives) > 0) {
    //                 console.log(updatedPlayers[i % updatedPlayers.length]);
    //                 currentTurnId = updatedPlayers[i].id;
    //                 break;
    //             }
    //         }

    //         // update the turn data
    //         updatedPlayers = prevPlayers.map(player => {
    //             if (player.id == turnId) {
    //                 player.turn = false;
    //             } else if (player.id == currentTurnId) {
    //                 player.turn = true;
    //                 setPlayerTakingTurn(player);
    //             }
    //             return player;
    //         });

    //         return updatedPlayers;
    //     });

    //     setTurnId(currentTurnId);
    //     setTimer(startCountDownTimer);
    // }

    // check conditions when players update
    useEffect(() => {
        console.log("in useEffect");
        const playersAlive = players.filter(player => player.lives > 0);
        if (playersAlive.length === 1) {
            clearInterval(clockInterval);
            // display game over screen
            //alert(playersAlive[0].name + " wins!");
            setModalDetails({
                title: "Game Over",
                body: `${playersAlive[0].name} wins!`,
                show: true
            });
        }
    }, [players]);

    // initialize players
    useEffect(() => {
        console.log("in useEffect");

            
        // run the game clock
        // clockInterval = setInterval(() => {
        //     setTimer(prevTimer => prevTimer - 1);
        //     --currentTimer;
        //     if (currentTimer <= 0) {
        //         changePlayerTurn(true);
        //         currentTimer = startCountDownTimer;
        //     }
        // }, 1000);
        // return () => clearInterval(clockInterval); 
    }, []);

    // sort by id to determine who goes first
    players.sort((a, b) => a.id - b.id);

    return (
        <>
            <EndGameModal details={modalDetails}/>
            <div className="game-container">
            <section className="player-queue">
                <table>
                    <thead>
                        <tr>
                            <th>Turn order</th>
                            <th>Player Name</th>
                            <th>Lives</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map(player => {
                            let lives = [];
                            for (let i = 0; i < player.lives; i++) {
                                lives.push(<FaHeart className="heart" key={i} />);
                            }
                            return (
                                <tr className={player.turn ? "player-turn" : null || player.lives === 0 ? "dead" : null} key={player.id}>
                                    <td>{player.id}</td>
                                    <td>{player.name}</td>
                                    <td>
                                        {lives}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>
            <section className="game-screen">
                <h1>{displayName == playerTakingTurn?.name ? "Your turn" : playerTakingTurn?.name + "'s turn"}</h1>
                <h1><FaClock/>{timer}</h1>
                <h2>Previous Guess: <span>Vancouver</span></h2>
                <h2>Incorrect Guess!</h2>
            </section>
            <section className="guess">
                <input ref={guessInput} onChange={(e) => setGuess(e.target.value)} disabled={displayName !== playerTakingTurn?.name} className={displayName !== playerTakingTurn?.name ? "not-your-turn" : null} placeholder="enter your guess!"></input>
                <FaUpload id="send-icon" className={displayName !== playerTakingTurn?.name ? "not-your-turn" : null} onClick={() => {
                    if (displayName != playerTakingTurn?.name) {
                        return;
                    }
                    //changePlayerTurn(false);
                    currentTimer = startCountDownTimer;
                }} />
            </section>
        </div>
        </>
    )
}