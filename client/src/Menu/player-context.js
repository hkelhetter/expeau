import { createContext, useState } from 'react';

const PlayerContext = createContext({
    name: '',
    playersList: [],
    role: -1,
    room: '',
    updateName: (name) => { },
    updateList: (list) => { },
    updateRole: (role) => { },
    updateRoom: (room) => { },
});

export function PlayerContextProvider(props) {

    const [playerName, setPlayerName] = useState('');
    const [playerList, setPlayerList] = useState([]);
    const [playerRole, setPlayerRole] = useState(-1);
    const [playerRoom, setPlayerRoom] = useState('');

    function updateNameHandler(name) {
        setPlayerName(name);
    }

    function updateListHandler(list) {
        setPlayerList(list);
    }

    function updateRoleHandler(role) {
        setPlayerRole(role);
    }

    function updateRoomHandler(newRoom) {
        setPlayerRoom(newRoom);
    }



    const context = {
        name: playerName,
        playersList: playerList,
        role: playerRole,
        room: playerRoom,

        updateName: updateNameHandler,
        updateList: updateListHandler,
        updateRole: updateRoleHandler,
        updateRoom: updateRoomHandler,
    };

    return <PlayerContext.Provider value={context}>
        {props.children}
    </PlayerContext.Provider>
}

export default PlayerContext;