/*import logo from './logo.svg';
import './App.css';
import Map from './mapManager.js'

import io from "socket.io-client";
import React, { useState, useEffect, useRef } from "react";
const ENDPOINT = "http://127.0.0.1:3001";
const socket = io(ENDPOINT);

*/
import React from 'react'
import './App.css';

import Conteneur from "./Conteneur.js"

function App() {
    return (
        < div className="App" >
            <Conteneur />
        </div >
    );
}

export default App;
