import React from 'react'

import {useState, useEffect, useRef} from 'react';
import {FaUpload, FaClock, FaHeart} from "react-icons/fa";

import "../../css/game/game.css";

const startCountDownTimer = 5;

let currentTimer = startCountDownTimer;
let currentTurnId = 1;

export function Game() {

    // store your id on the client side to determine if it's your turn
    // hard code for now
    const yourId = 2;

    // test with dummy data for now
    // make the max lobby size of 8 for now

    const [players, setPlayers] = useState([]);
    const [playerTakingTurn, setPlayerTakingTurn] = useState(null);
    const [timer, setTimer] = useState(startCountDownTimer);
    const [turnId, setTurnId] = useState(1);

    const [guess, setGuess] = useState("");

    const changeTurnId = () => {
        setTurnId(prevTurnId => prevTurnId + 1 > players.length ? 1 : prevTurnId + 1);
    }

    const guessInput = useRef(null);

    function initPlayers() {
        let updatedPlayers = [
            {name: "Walter", id: 1},
            {name: "Alice", id: 2},
            {name: "Joe", id: 4},
            {name: "Pog", id: 3},
            {name: "Clayton", id: 5},
            {name: "Jane", id: 6},
            {name: "Bob", id: 7},
            {name: "Kid Named Finger", id: 8},
        ];
        updatedPlayers.forEach(player => {
            player.lives = 3;
            if (player.id === turnId) {
                player.turn = true;
                setPlayerTakingTurn(player);
            }
            else {
                player.turn = false;
            }
        });
        return updatedPlayers;
    }

    function changePlayerTurn(outOfTime) {
        const playerGuess = guessInput.current.value;
        guessInput.current.value = "";
        console.log(playerGuess);

        // update turn id
        console.log(currentTurnId);
        const turnId = currentTurnId;
        currentTurnId = currentTurnId >= 8 ? 1 : currentTurnId + 1;

        // update player data based on new turn
        setPlayers(prevPlayers => {
            const updatedPlayers = prevPlayers.map(player => {
                console.log(currentTurnId);
                if (player.id == turnId) {
                    if (outOfTime) {
                        player.lives -= 1;
                    }
                    player.turn = false;
                } else if (player.id == currentTurnId) {
                    player.turn = true;
                    setPlayerTakingTurn(player);
                }
                return player;
            });
            console.log(updatedPlayers);
            return updatedPlayers;
        });

        setTurnId(currentTurnId);
        setTimer(startCountDownTimer);
    }

    // initialize players
    useEffect(() => {
        console.log("in useEffect");
        const updatedPlayers = initPlayers();
        setPlayers(updatedPlayers);
            
        // run the game clock
        const clockInterval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
            --currentTimer;
            if (currentTimer <= 0) {
                changePlayerTurn(true);
                currentTimer = startCountDownTimer;
            }
        }, 1000);
        return () => clearInterval(clockInterval); 
    }, []);

    // sort by id to determine who goes first
    players.sort((a, b) => a.id - b.id);

    return (
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
                <h1>{turnId === yourId ? "Your turn" : playerTakingTurn?.name + "'s turn"}</h1>
                <h1><FaClock/>{timer}</h1>
                <h2>Previous Guess: <span>Vancouver</span></h2>
                <h2>Incorrect Guess!</h2>
            </section>
            <section className="guess">
                <input ref={guessInput} onChange={(e) => setGuess(e.target.value)} disabled={turnId !== yourId} className={turnId !== yourId ? "not-your-turn" : null} placeholder="enter your guess!"></input>
                <FaUpload id="send-icon" onClick={() => {
                    changePlayerTurn(false);
                    currentTimer = startCountDownTimer;
                }} />
            </section>
        </div>
    )
}