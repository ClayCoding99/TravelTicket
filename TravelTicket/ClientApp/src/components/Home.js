import React, { Component, useState } from 'react';
import {CreateLobbyModal} from './util/CreateLobbyModal';

export class Home extends Component {
  static displayName = Home.name;

  render() {

    function handleFindGame() {
      window.location.href = './find-lobby';
    }

    return (
      <div className="home-container">
        <h1>Travel Ticket</h1>
        <CreateLobbyModal/>
        <button onClick={handleFindGame}>Find Game</button>
      </div>
    );
  }
}