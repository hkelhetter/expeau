import { createContext, useState } from 'react';

const MenuContext = createContext({
    loc: "menu",
    updateLocation: (loc) => {}
});

export function MenuContextProvider(props) {

    const [location, setLocation] = useState("menu");

    function updateLocationHandler(loc) {
        setLocation(loc);
    }

    const context = {
        loc: location,
        updateLocation: updateLocationHandler
    }

    return <MenuContext.Provider value={context}>
        {props.children}
    </MenuContext.Provider>
}

export default MenuContext;