import React from 'react'
import { useEffect, useState } from 'react';

import { io } from "socket.io-client";

export function Lobby() {

    const wssRoute = window.location.pathname.split('/').pop();
    const wssPath = `ws://localhost:7890/${wssRoute}`;
    console.log(wssRoute);

    // Make a connection to the websocket provided by the server
    const socket = io(wssPath);

    //When the connection is made, log it
    socket.on('connect', () => {
        console.log('Connected to websocket');
    });

    return (
    <div>
        Lobby Screen
    </div>
    );
}
