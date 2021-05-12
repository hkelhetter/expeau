/* 
    Function : generateHexes

    Syntax  : hexas=generateHexes()
    
    Outputs : hexas : object containing all data to create the hexagones (position)
                        and the data for the game's interaction ( activity,subBasin...)

    Description : return an object containing all the data needed to generate the map in class Bassin
        
*/
/* 
    Function : generateRivers 

    Syntax  : rivers=generateRivers()

    Outputs : array of object containing the start and end of each rivers

    Description : cycle through the hexagones to create and array of object path
                    containing the hexagon where the river starts and and where it ends
                    by reading the downStreamCell property
        
*/
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

/* 
    Function : setMapSize

    Syntax
        
    
    Input
        

    Outputs

    Description
        
*/
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
};


export function generateHexes(data) {
    let hexas = {};
    let hex;
    for (let i = 0; i < data.length; i++) {

        hex = HexUtils.pixelToHex({ x: (data[i].x0 - -0.862395860412026) * 4.75, y: -(data[i].y0 - -0.671732763469417) * 4.75 }, layout)
        //map ardiere
        //hex = HexUtils.pixelToHex({ x: (data[i].x0 + 164.6719013516826) * 4, y: (328 + data[i].y0) * -4 }, layout)

        // merge hex and data[i] into hexas[i]
        hexas[i] = Object.assign(hex, data[i])
        renameProperty(hexas[i], "mainCLC1", "activity")
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
};
export function generateRivers(moreHexas) {
    let rivers = [];
    let path;

    for (let i = 0; i < Object.keys(moreHexas).length; i++) {

        path = {
            start: moreHexas[i],
            end: moreHexas[moreHexas[i].downstreamCell - 1],
        }
        rivers.push(path);
    }

    return rivers;
}
export function setPlayerClass(player) {
    if (player === 0) return "" //attributé à aucun joueur
    switch (player % 3) {
        case 0: return "troisieme" //attribué au joueur 3, 6 ou 9
        case 1: return "premier" //attribué au joueur 1, 4 ou en 7
        case 2: return "deuxieme" //attribué au joueur 2, 5 ou 8
        default: return ""
    }
}

export function activityToString(activity) {
    switch (activity) {
        case 1: return "ville";
        case 2: return "agriculture";
        case 3: return "foret";
        default: return "notInBassin";
    }
}
export function getSubBassin(id) {
    if (id < 4) return 1
    if (id < 7) return 2
    return 3
}
export function setMapSize() {
    return window.matchMedia('(orientation:landscape)').matches ? '50%' : '100%'
}
const a = [
    {
        "Pratique": "ElevageBovinViandeHorsSol",
        "Aleas": "_",
        "Id": 101,
        "Travail": 3,
        "Intrants": 4,
        "Production": 5,
        "Pollution": 3,
        "Technicite": 4
    },
    {
        "Pratique": "ElevageBovinViandeHorsSol",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeHorsSol",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeHorsSol",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeHorsSol",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeHorsSol",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeHorsSol",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeHorsSol",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeHorsSol",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeHorsSol",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeHorsSol",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeHorsSol",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeHorsSol",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeSemiPaturage",
        "Aleas": "_",
        "Id": 102,
        "Travail": 3,
        "Intrants": 2,
        "Production": 4,
        "Pollution": 2,
        "Technicite": 3
    },
    {
        "Pratique": "ElevageBovinViandeSemiPaturage",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeSemiPaturage",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeSemiPaturage",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeSemiPaturage",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeSemiPaturage",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeSemiPaturage",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeSemiPaturage",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeSemiPaturage",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeSemiPaturage",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeSemiPaturage",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeSemiPaturage",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandeSemiPaturage",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandePaturage",
        "Aleas": "_",
        "Id": 103,
        "Travail": 3,
        "Intrants": 1,
        "Production": 2,
        "Pollution": 0,
        "Technicite": 2
    },
    {
        "Pratique": "ElevageBovinViandePaturage",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandePaturage",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandePaturage",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 1,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandePaturage",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandePaturage",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 1,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandePaturage",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandePaturage",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandePaturage",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandePaturage",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandePaturage",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandePaturage",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "ElevageBovinViandePaturage",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelle",
        "Aleas": "_",
        "Id": 201,
        "Travail": 3,
        "Intrants": 3,
        "Production": 5,
        "Pollution": 3,
        "Technicite": 3
    },
    {
        "Pratique": "PolycultureConventionnelle",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelle",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelle",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelle",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelle",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelle",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelle",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelle",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelle",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelle",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelle",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelle",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelleIrriguee",
        "Aleas": "_",
        "Id": 202,
        "Travail": 3,
        "Intrants": 3,
        "Production": 5,
        "Pollution": 3,
        "Technicite": 3
    },
    {
        "Pratique": "PolycultureConventionnelleIrriguee",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelleIrriguee",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelleIrriguee",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelleIrriguee",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelleIrriguee",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelleIrriguee",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelleIrriguee",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 1,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelleIrriguee",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelleIrriguee",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 1,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelleIrriguee",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelleIrriguee",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureConventionnelleIrriguee",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonnee",
        "Aleas": "_",
        "Id": 203,
        "Travail": 4,
        "Intrants": 2,
        "Production": 4,
        "Pollution": 2,
        "Technicite": 4
    },
    {
        "Pratique": "PolycultureRaisonnee",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonnee",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonnee",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonnee",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonnee",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonnee",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonnee",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonnee",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonnee",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonnee",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonnee",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonnee",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonneeIrriguee",
        "Aleas": "_",
        "Id": 204,
        "Travail": 4,
        "Intrants": 2,
        "Production": 4,
        "Pollution": 2,
        "Technicite": 4
    },
    {
        "Pratique": "PolycultureRaisonneeIrriguee",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonneeIrriguee",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonneeIrriguee",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonneeIrriguee",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonneeIrriguee",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonneeIrriguee",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonneeIrriguee",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 1,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonneeIrriguee",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonneeIrriguee",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 1,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonneeIrriguee",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonneeIrriguee",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureRaisonneeIrriguee",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBio",
        "Aleas": "_",
        "Id": 205,
        "Travail": 5,
        "Intrants": 1,
        "Production": 3,
        "Pollution": 1,
        "Technicite": 5
    },
    {
        "Pratique": "PolycultureBio",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBio",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBio",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBio",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBio",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBio",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBio",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBio",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBio",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBio",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBio",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBio",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBioIrri",
        "Aleas": "_",
        "Id": 206,
        "Travail": 5,
        "Intrants": 1,
        "Production": 3,
        "Pollution": 1,
        "Technicite": 5
    },
    {
        "Pratique": "PolycultureBioIrri",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBioIrri",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBioIrri",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBioIrri",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBioIrri",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBioIrri",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBioIrri",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 1,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBioIrri",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBioIrri",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 1,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBioIrri",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBioIrri",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "PolycultureBioIrri",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageConventionnelIrri",
        "Aleas": "_",
        "Id": 301,
        "Travail": 4,
        "Intrants": 3,
        "Production": 5,
        "Pollution": 5,
        "Technicite": 3
    },
    {
        "Pratique": "MaraichageConventionnelIrri",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageConventionnelIrri",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageConventionnelIrri",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageConventionnelIrri",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageConventionnelIrri",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageConventionnelIrri",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageConventionnelIrri",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageConventionnelIrri",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageConventionnelIrri",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageConventionnelIrri",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageConventionnelIrri",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 1,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageConventionnelIrri",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageHVEIrri",
        "Aleas": "_",
        "Id": 301,
        "Travail": 4.5,
        "Intrants": 3,
        "Production": 4,
        "Pollution": 4,
        "Technicite": 4
    },
    {
        "Pratique": "MaraichageHVEIrri",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageHVEIrri",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageHVEIrri",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageHVEIrri",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageHVEIrri",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageHVEIrri",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageHVEIrri",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageHVEIrri",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageHVEIrri",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageHVEIrri",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageHVEIrri",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 1,
        "Production": -1,
        "Pollution": 1,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageHVEIrri",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageBioIrri",
        "Aleas": "_",
        "Id": 302,
        "Travail": 5,
        "Intrants": 4,
        "Production": 5,
        "Pollution": 1,
        "Technicite": 5
    },
    {
        "Pratique": "MaraichageBioIrri",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageBioIrri",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageBioIrri",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageBioIrri",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageBioIrri",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageBioIrri",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageBioIrri",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageBioIrri",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageBioIrri",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageBioIrri",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageBioIrri",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 1,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "MaraichageBioIrri",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonne",
        "Aleas": "_",
        "Id": 401,
        "Travail": 4,
        "Intrants": 2,
        "Production": 4,
        "Pollution": 2,
        "Technicite": 4
    },
    {
        "Pratique": "VergerRaisonne",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonne",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonne",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonne",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonne",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonne",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonne",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonne",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonne",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonne",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonne",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonne",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonneIrri",
        "Aleas": "_",
        "Id": 402,
        "Travail": 4,
        "Intrants": 2,
        "Production": 4,
        "Pollution": 2,
        "Technicite": 4
    },
    {
        "Pratique": "VergerRaisonneIrri",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonneIrri",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonneIrri",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonneIrri",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonneIrri",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 1,
        "Intrants": 1,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonneIrri",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonneIrri",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonneIrri",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonneIrri",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonneIrri",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonneIrri",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerRaisonneIrri",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBio",
        "Aleas": "_",
        "Id": 403,
        "Travail": 5,
        "Intrants": 1,
        "Production": 2,
        "Pollution": 1,
        "Technicite": 5
    },
    {
        "Pratique": "VergerBio",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBio",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBio",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBio",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBio",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBio",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBio",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBio",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBio",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 0,
        "Intrants": 0,
        "Production": -1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBio",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBio",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 0,
        "Production": -2,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBio",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 1,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBioIrri",
        "Aleas": "_",
        "Id": 404,
        "Travail": 5,
        "Intrants": 1,
        "Production": 3,
        "Pollution": 1,
        "Technicite": 5
    },
    {
        "Pratique": "VergerBioIrri",
        "Aleas": "HiverNormal",
        "Id": 1,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBioIrri",
        "Aleas": "HiverDouxSec",
        "Id": 2,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBioIrri",
        "Aleas": "HiverDouxHumide",
        "Id": 3,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBioIrri",
        "Aleas": "HiverFroidSec",
        "Id": 4,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBioIrri",
        "Aleas": "HiverFroidHumide",
        "Id": 5,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBioIrri",
        "Aleas": "EteNormal",
        "Id": 6,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBioIrri",
        "Aleas": "EteDouxSec",
        "Id": 7,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBioIrri",
        "Aleas": "EteDouxHumide",
        "Id": 8,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBioIrri",
        "Aleas": "EteFroidSec",
        "Id": 9,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBioIrri",
        "Aleas": "EteFroidHumide",
        "Id": 10,
        "Travail": 0,
        "Intrants": 0,
        "Production": 0,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBioIrri",
        "Aleas": "Maladies",
        "Id": 11,
        "Travail": 0,
        "Intrants": 0,
        "Production": -2,
        "Pollution": 0,
        "Technicite": 0
    },
    {
        "Pratique": "VergerBioIrri",
        "Aleas": "MarcheLocal",
        "Id": 12,
        "Travail": 0,
        "Intrants": 0,
        "Production": 1,
        "Pollution": 0,
        "Technicite": 0
    }
]