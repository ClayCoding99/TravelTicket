import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import {useState} from "react";

export default function EndGameModal({details}) {

    const [show, setShow] = useState(false);

    const disable = () => { setShow(false); };
    const enable = () => { setShow(true); };

    function returnToLobby() {
        const gameId = window.location.pathname.split('/').pop();
        window.location.href = "/lobby/" + gameId;
    }

    return (
        <>
            <Modal
                show={details.show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
            >
                <Modal.Title id="contained-modal-title-vcenter">
                    {details.title}
                </Modal.Title>
            
            <Modal.Body className="text-center">
                <p>
                    {details.body}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={returnToLobby}>Return to lobby</Button>
            </Modal.Footer>
            </Modal>
        </>
    );
};