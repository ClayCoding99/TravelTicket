import React from 'react'

import {useState, useEffect, useRef} from 'react';
import {FaUpload, FaClock, FaHeart} from "react-icons/fa";

import "../../css/game/game.css";

import EndGameModal from "./endGameModal";

const startCountDownTimer = 2;

let currentTimer = startCountDownTimer;
let currentTurnId = 1;
let clockInterval = null;

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

    const [modalDetails, setModalDetails] = useState({show: false, title: "", body: ""});

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
            player.lives = 1;
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

        // update player data based on new turn
        setPlayers(prevPlayers => {
            // update the player lives
            let updatedPlayers = prevPlayers.map(player => {
                if (player.id == currentTurnId) {
                    if (outOfTime) {
                        if (player.lives > 0) {
                            player.lives -= 1;
                        }
                    }
                }
                return player;
            });

            // update turn id (skip over those who are dead)
            const turnId = currentTurnId;
            currentTurnId = currentTurnId >= 8 ? 1 : currentTurnId + 1;
            for (let i = currentTurnId - 1; i < updatedPlayers.length; i++) {
                if ((updatedPlayers[i % updatedPlayers.length].lives) > 0) {
                    console.log(updatedPlayers[i % updatedPlayers.length]);
                    currentTurnId = updatedPlayers[i].id;
                    break;
                }
            }

            // update the turn data
            updatedPlayers = prevPlayers.map(player => {
                if (player.id == turnId) {
                    player.turn = false;
                } else if (player.id == currentTurnId) {
                    player.turn = true;
                    setPlayerTakingTurn(player);
                }
                return player;
            });

            return updatedPlayers;
        });

        setTurnId(currentTurnId);
        setTimer(startCountDownTimer);
    }

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
        const updatedPlayers = initPlayers();
        setPlayers(updatedPlayers);
            
        // run the game clock
        clockInterval = setInterval(() => {
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
                <h1>{turnId === yourId ? "Your turn" : playerTakingTurn?.name + "'s turn"}</h1>
                <h1><FaClock/>{timer}</h1>
                <h2>Previous Guess: <span>Vancouver</span></h2>
                <h2>Incorrect Guess!</h2>
            </section>
            <section className="guess">
                <input ref={guessInput} onChange={(e) => setGuess(e.target.value)} disabled={turnId !== yourId} className={turnId !== yourId ? "not-your-turn" : null} placeholder="enter your guess!"></input>
                <FaUpload id="send-icon" className={turnId !== yourId ? "not-your-turn" : null} onClick={() => {
                    if (turnId != yourId) {
                        return;
                    }
                    changePlayerTurn(false);
                    currentTimer = startCountDownTimer;
                }} />
            </section>
        </div>
        </>
    )
}