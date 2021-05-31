import React, { useState, useEffect } from "react";
import './App.css';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

const socket = socketIOClient(ENDPOINT);



function App() {

  const [room, setRoom] = useState("");
  const [joinedRoom, setJRoom] = useState("");
  const [joinInput, setInput] = useState({
    roomName : "",
    playerName : "",
    role : "0",
  });
  const [players, setPlayers] = useState({});
  const [lookRoom, setLook] = useState("");

  // useEffect(() => {
  //   if(room !== ""){
  //     socket.emit("playersInRoom", room, (lobbyPlayers) => {
  //       setPlayers(lobbyPlayers);
  //       console.log(lobbyPlayers);
  //     });
  //   }
  // });

  const roomCreated = (roomName) => {
    console.log("Created room " + roomName)
    setRoom("Created room " + roomName);
  };
  const roomJoined = (roomName) => {
    setJRoom("Joined room " + roomName);
  }

  
  
  return (
    <div className="App">
      
      <p>
          Create Room
      </p>
      <form onSubmit={createRoom}>
        <label>
          Nickname
          <input type="text" name="playerName" value={joinInput.playerName} onChange={handleChange} />
        </label>
        <input type="submit" value="CreateRoom" />
      </form>
      <p>
          Join Room
      </p>
      <form onSubmit={joinRoom}>
        <label>
          Room Name
          <input type="text" name="roomName" value={lookRoom} onChange={handleChange} />
        </label>
        <label>
          Nickname
          <input type="text" name="playerName" value={joinInput.playerName} onChange={handleChange} />
        </label>
        <label>
          Role
          <input type="number" name="role" value={joinInput.role} onChange={handleChange} />
        </label>
        <input type="submit" value="Join" />
      </form>
      <p>
        {room}
        {joinedRoom}
      </p>
    </div>
  );

  function createRoom(event){
    event.preventDefault();
    setInput({role : "0"});
    console.log("createRoom with", joinInput.playerName)
    socket.emit("createRoom", joinInput.playerName, 0, roomCreated);
  }
  function joinRoom(event){
    
    console.log("Joining", lookRoom, joinInput.playerName, joinInput.role);
    socket.emit("joinRoom", lookRoom, joinInput.playerName, 0, roomJoined);
    event.preventDefault();
  }
  function handleChange(event){
    switch(event.target.name) {
      case "roomName":
        setLook(event.target.value);
        //setInput({roomName: event.target.value});
        break;
      case "playerName":
        setInput({playerName: event.target.value});
        break;
      case "role":
        //setInput({role: parseInt(event.target.value)});
        break;
    }

    
  }

}



export default App;
