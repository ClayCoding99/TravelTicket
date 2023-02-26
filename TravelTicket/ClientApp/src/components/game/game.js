import React from 'react'

import {useState, useEffect, useRef} from 'react';
import {FaUpload, FaClock, FaHeart} from "react-icons/fa";

import "../../css/game/game.css";

export function Game() {

    // store your id on the client side to determine if it's your turn
    // hard code for now
    const yourId = 5;

    // test with dummy data for now
    // make the max lobby size of 8 for now

    const [players, setPlayers] = useState([]);
    const [playerTakingTurn, setPlayerTakingTurn] = useState(null);
    const [turnId, setTurnId] = useState(5);
    const [timer, setTimer] = useState(15);

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
            if (player.id === turnId) {
                player.turn = true;
                setPlayerTakingTurn(player);
            }
            else {
                player.turn = false;
            }
            player.lives = 3;
        });
        return updatedPlayers;
    }

    function changePlayerTurn() {
        let updatedPlayers = [];
        players.forEach(player => {
            updatedPlayers.push([...player]);
        });
        updatedPlayers.forEach(player => {
            if (player.id === turnId) {
                player.turn = true;
                setPlayerTakingTurn(player);
            }
            else {
                player.turn = false;
            }
        });
        setPlayers(updatedPlayers);
    }

    // initialize players
    useEffect(() => {
        const updatedPlayers = initPlayers();
        setPlayers(updatedPlayers);
            
        // run the game clock
        let currentTime = timer;
        const clockInterval = setInterval(() => {
            setTimer(--currentTime);
            if (currentTime <= 0) {
                setTimer(15);
                currentTime = timer;
                setTurnId(turnId + 1);
                changePlayerTurn();
            }
        }, 1000); 
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
                                <tr className={player.turn ? "player-turn" : null} key={player.id}>
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
                <h1><FaClock /> {timer}</h1>
                <h2>Previous Guess: <span>Vancouver</span></h2>
                <h2>Incorrect Guess!</h2>
            </section>
            <section className="guess">
                <input disabled={turnId !== yourId} className={turnId !== yourId ? "not-your-turn" : null} placeholder="enter your guess!"></input>
                <FaUpload id="send-icon" />
            </section>
        </div>
    )
}
