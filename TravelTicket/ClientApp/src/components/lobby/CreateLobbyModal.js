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

  // creates the lobby upon clicking the create lobby button
  function handleCreateLobby() {

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
            <label id="one">Enter Lobby Name</label>
            <input id="two" value={lobbyName} onChange={e => setLobbyName(e.target.value)}type="text" />
            <label id="three">Enter Lobby Password</label>
            <input id="four" value={lobbyPassword} onChange={e => setLobbyPassword(e.target.value)} type="text" />
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