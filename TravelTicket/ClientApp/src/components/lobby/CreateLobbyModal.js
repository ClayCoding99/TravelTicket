import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "../../css/lobby/createLobbyModal.css";

export function CreateLobbyModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [lobbyName, setLobbyName] = useState("");
  const [lobbyPassword, setLobbyPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  // creates the lobby upon clicking the create lobby button
  function handleCreateLobby() {
    if (displayName === "") {
      alert("Must provide a display name!");
      return;
    }

    if (lobbyName === "" || lobbyPassword === "") {
      alert("Must provide a lobby name and password!");
      return;
    }

    // post to server and have the server return the lobby id
    fetch(`/api/lobby/create?name=${lobbyName}&password=${lobbyPassword}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => response.json()).then(data => {
      // redirect the creator to the lobby with the corresponding id
      handleClose();
      localStorage.setItem('displayName', displayName);
      window.location.href = `/lobby/${data.id}`;
    });
  }

  return (
    <>
      <button className="btn-secondary d-flex btn-block" onClick={handleShow}>Create Lobby</button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Create Lobby</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body">
            <label id="one">Enter Your Display Name</label>
            <input id="two" value={displayName} onChange={e => setDisplayName(e.target.value)}/>
            <label id="three">Enter Lobby Name</label>
            <input id="four" value={lobbyName} onChange={e => setLobbyName(e.target.value)}type="text" />
            <label id="five">Enter Lobby Password</label>
            <input id="six" value={lobbyPassword} onChange={e => setLobbyPassword(e.target.value)} 
            type="text" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-foot">
            <Button variant="secondary" onClick={handleClose}> Cancel</Button>
            <Button onClick={handleCreateLobby} variant="primary">Create</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}