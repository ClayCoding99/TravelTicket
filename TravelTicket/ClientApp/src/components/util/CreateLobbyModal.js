import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function CreateLobbyModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [lobbyName, setLobbyName] = useState("");
  const [lobbyPassword, setLobbyPassword] = useState("");

  // creates the lobby upon clicking the create lobby button
  function handleCreateLobby() {

    if (lobbyName === "" || lobbyPassword === "") {
      alert("Must provide a lobby name and password!");
      return;
    }

    const lobby = {
      Name: lobbyName,
      Password: lobbyPassword
    };

    console.log(lobby);

    // post to server and have the server return the lobby id
    const response = fetch(`/api/lobby?name=${lobbyName}&password=${lobbyPassword}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => response.json()).then(data => {
      // store the lobby id in local storage, redirect to the lobby page
      console.log(data.id);
      localStorage.setItem('lobbyId', data.id);

      handleClose();
    });
  }

  return (
    <>
      <button onClick={handleShow}>Create Lobby</button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Lobby</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Enter Lobby Name</label>
          <input value={lobbyName} onChange={e => setLobbyName(e.target.value)}type="text" />
          <label>Enter Lobby Password</label>
          <input value={lobbyPassword} onChange={e => setLobbyPassword(e.target.value)} type="text" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleCreateLobby} variant="primary">Create</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}