import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import Conteneur from './Conteneur'
//import { SocketContext, socket } from './context/socket.js';
require('./index.css')

ReactDOM.render(
    <React.StrictMode>
        {/*         <SocketContext.Provider value={socket}>
        </SocketContext.Provider>
 */}        <Conteneur />

    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
