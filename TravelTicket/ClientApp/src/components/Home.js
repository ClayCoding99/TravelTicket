import React, { Component, useState } from 'react';
import {CreateLobbyModal} from './lobby/CreateLobbyModal';
import "../css/home.css";

export class Home extends Component {
  static displayName = Home.name;

  render() {

    function handleFindGame() {
      window.location.href = './find-lobby';
    }

    return (
      <div className="home-container">
        <h1 className="text-center" >Travel Ticket</h1>
        <button onClick=
        {handleFindGame} variant="success" size="lg">Find Game</button>
        <CreateLobbyModal/>
      </div>
    );
  }
}