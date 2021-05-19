import { HexUtils } from 'react-hexgrid'
export const layout = {
    spacing: 1,
    orientation: {
        f0: Math.sqrt(3.0), f1: Math.sqrt(3.0) / 2.0, f2: 0.0, f3: 3.0 / 2.0, b0: Math.sqrt(3.0) / 3.0, b1: -1.0 / 3.0, b2: 0.0, b3: 2.0 / 3.0, startAngle: 0.5
    },
    size: {
        y: 3,
        x: 3,
    },
    origin: {
        x: 0,
        y: 0,
    },
}
/* 
    Function : generateHexes

    Syntax  : hexas=generateHexes()
    
    Outputs : hexas : object containing all data to create the hexagones (position)
                        and the data for the game's interaction ( activity,subBasin...)

    Description : return an object containing all the data needed to generate the map in class Bassin
        
*/
export function generateHexes(data) {
    let hexas = {};
    let hex;
    for (let i = 0; i < data.length; i++) {

        hex = HexUtils.pixelToHex({ x: (data[i].xOutlet), y: (data[i].yOutlet) }, layout)
        //map ardiere
        //hex = HexUtils.pixelToHex({ x: (data[i].x0 + 164.6719013516826) * 4, y: (328 + data[i].y0) * -4 }, layout)
        // merge hex and data[i] into hexas[i]
        hexas[i] = Object.assign(hex, data[i])
        //renameProperty(hexas[i], "mainCLC1", "activity")
    }
    return hexas;
}
function renameProperty(obj, oldName, newName) {
    // Do nothing if the names are the same
    if (oldName === newName) {
        return this;
    }
    // Check for the old property name to avoid a ReferenceError in strict mode.
    if (obj.hasOwnProperty(oldName)) {
        obj[newName] = obj[oldName];
        delete obj[oldName];
    }
    return obj;
}
/* 
    Function : generateRivers 

    Syntax  : rivers=generateRivers()

    Outputs : array of object containing the start and end of each rivers

    Description : cycle through the hexagones to create and array of object path
                    containing the hexagon where the river starts and and where it ends
                    by reading the downStreamCell property
        
*/
export function generateRivers(moreHexas) {
    let rivers = [];
    let path;

    for (let i = 0; i < Object.keys(moreHexas).length; i++) {
        path = {
            start: moreHexas[i],
            end: moreHexas[moreHexas[i].downTile - 1],
            outletFlowAcc: moreHexas[i].outletFlowAcc
        }
        rivers.push(path);
    }
    return rivers;

}
/* 
    Function : setPlayerClass

    Syntax
        playerClass=setPlayerClass(PlayerId)
    
    Input
        PlayerId    :player's id

    Outputs
        playerClass :player's id on subBasin

    Description
        Compute player's id on their subBasin based on their global id
*/
export function setPlayerClass(player) {
    if (player === 0) return "" //attributé à aucun joueur
    switch (player % 3) {
        case 0: return "troisieme" //attribué au joueur 3, 6 ou 9
        case 1: return "premier" //attribué au joueur 1, 4 ou en 7
        case 2: return "deuxieme" //attribué au joueur 2, 5 ou 8
        default: return ""
    }
}
/* 
    Function : activityToString

    Syntax
        tileActivity=activityToString(activity)
    
    Input
        activity    :tile's activity

    Outputs
        tileactivity:string corresponding to the activity

    Description
        returns a string based on the input
        this is meant to set className to components and apply css style
*/
export function activityToString(activity) {
    switch (activity) {
        case 1: return "ville";
        case 2: return "agriculture";
        case 3: return "foret";
        case 5: return "water"
        default: return "notInBassin";
    }
}
/* 
    Function : getSubBassin

    Syntax
        subBassin=getSubBassin(id)
    
    Input
        id    :player's id

    Outputs
        playerClass :player's subBasin

    Description
        Calculate player's subBassin based on their id
*/
export function getSubBassin(id) {
    if (id < 4) return 1
    if (id < 7) return 2
    return 3
}
/* 
    Function : setMapSize

    Syntax
        
    
    Input
        

    Outputs

    Description
        
*/
export function setMapSize() {
    return window.matchMedia('(orientation:landscape)').matches ? '50%' : '100%'
}
