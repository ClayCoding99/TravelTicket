import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import "../../css/lobby/joinLobbyModal.css";

export function JoinGameModal({lobbyDetails}) {
  const [show, setShow] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [inputDisplayName, setInputDisplayName] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleJoin() {
    if (inputDisplayName === "") {
        alert("Must provide a display name!");
        return;
    }
    if (inputPassword !== lobbyDetails.password) {
      alert("Incorrect password!");
      return;
    }
    localStorage.setItem('displayName', inputDisplayName);
    console.log(lobbyDetails.id);
    window.location.href = './lobby/' + lobbyDetails.id;
  }

  return (
    <>
      <button onClick={handleShow}>Join Lobby</button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Join Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input className="modal-body" onChange={e => setInputDisplayName(e.target.value)} type="text" placeholder='Enter Display Name' />
          <input className="modal-body" onChange={e => setInputPassword(e.target.value)} type="text" placeholder='Enter password' />
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-foot">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={handleJoin} variant="primary">Join</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}