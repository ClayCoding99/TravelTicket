import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function JoinGameModal({lobbyDetails}) {
  const [show, setShow] = useState(false);
  const [inputPassword, setInputPassword] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleJoin() {
    if (inputPassword === lobbyDetails.password) {
        console.log(lobbyDetails.id);
        window.location.href = './lobby/' + lobbyDetails.id;
    }
    else {
        alert("Incorrect password!");
    }
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
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input onChange={e => setInputPassword(e.target.value)} type="text" placeholder='Enter password' />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleJoin} variant="primary">Join</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}