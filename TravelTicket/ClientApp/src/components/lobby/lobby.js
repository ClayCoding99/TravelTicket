import React from 'react'
import { useEffect, useState, useRef} from 'react';

import { io } from "socket.io-client";

import "../../css/lobby/lobby.css";

const startCountDownTimer = 10;

export function Lobby() {

    // TODO: use useRef instead of useState
    const [time, setTime] = useState(startCountDownTimer);

    const countDown = useRef(false);
    const startButton = useRef(null);
    const countDownHeader = useRef(null);

    // test with dummy data for now
    // make the max lobby size of 8 for now
    const [players, setPlayers] = useState([
        // {name: "Walter", id: 1},
        // {name: "Alice", id: 2},
        // {name: "Joe", id: 3},
        // {name: "Pog", id: 4},
        // {name: "Clayton", id: 5},
        // {name: "Jane", id: 6},
        // {name: "Bob", id: 7},
        // {name: "Kid Named Finger", id: 8},
    ]);

    const wssRoute = window.location.pathname.split('/').pop();

    useEffect(() => {

        const wssPath = `ws://localhost:7890/${wssRoute}`;
        console.log(wssRoute);

        // Make a connection to the websocket provided by the server
        const socket = io(wssPath);


        // When the connection is made, log it
        socket.on('connect', () => {
            console.log('Connected to websocket');
        });

    }, []);

    function goToMenu() {
        console.log("go to menu");
        window.location.href = './';
    }

    function startGame() {
        // toggle timer and start button change
        if (!countDown.current) {
            console.log("start countdown...");
            countDownHeader.current.className = "";
            startButton.current.className = "cancel-game";
            startButton.current.innerText = "Cancel";
            countDown.current = true;
        } else {
            console.log("stop countdown...");
            countDown.current = false;
            countDownHeader.current.className = "hidden";
            startButton.current.className = "start-game";
            startButton.current.innerText = "Start";
            setTime(startCountDownTimer);
        }

        // handle the countdown
        let countDownTimer = startCountDownTimer - 1;
        const countDownInterval = setInterval(() => {
            if (!countDown.current) {
                clearInterval(countDownInterval);
                return;
            } 
            console.log('running with time ' + countDownTimer);
            if (countDownTimer === 0) {
                console.log("start game");
                clearInterval(countDownInterval);
                window.location.href = `./game/${wssRoute}`;
            }
            setTime(countDownTimer--);
        }, 1000);
    }

    // make a sample table for now
    return (
    <div className="lobby-container">
        <h1>Lobby Name Here</h1>
        <h2 ref={countDownHeader} className="hidden">Game starts in {time}!</h2>
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
