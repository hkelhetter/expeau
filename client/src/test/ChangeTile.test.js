import React from "react";
import ReactDOM from 'react-dom';

import { act } from "react-dom/test-utils";
import { getByLabelText, getByText, render, screen, fireEvent } from '@testing-library/react';
import ChangeTile from '../Game/animator/ChangeTile.js'
import { lstPlayer, lstTile, map, lstRefinedTiles } from "./dataSample.js"

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});
it("helper is invisible at start", () => {
    act(() => {
        ReactDOM.render(<ChangeTile lstPlayer={lstPlayer} lstTile={lstTile} map={map} selectedTile={lstRefinedTiles[1]} />, container)
    })
    const help = document.querySelector("[id=helpSubmit]")
    expect(help.innerHTML).toBe("")
})
it("agriculture no action selected", () => {
    act(() => {
        ReactDOM.render(<ChangeTile lstPlayer={lstPlayer} lstTile={lstTile} map={map} selectedTile={lstRefinedTiles[1]} />, container)
    })
    const button = document.querySelector("[data-testid=submit]")
    expect(button.innerHTML).toBe("Valider")
    const help = document.querySelector("[id=helpSubmit]")
    expect(help.innerHTML).toBe("")
    act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    //expect(screen.getByText("selectionné le joueur qui reçoit la case")).toBeInTheDocument()
    expect(help.innerHTML).toBe("quelque chose s'est mal passé")
})
it("agriculture no action selected", () => {
    act(() => {
        ReactDOM.render(<ChangeTile lstPlayer={lstPlayer} lstTile={lstTile} map={map} selectedTile={lstRefinedTiles[2]} />, container)
    })
    const button = document.querySelector("[data-testid=submit]")
    expect(button.innerHTML).toBe("Valider")
    const help = document.querySelector("[id=helpSubmit]")
    expect(help.innerHTML).toBe("")
    act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(help.innerHTML).toBe("")
})
it("forest default", () => {
    act(() => {
        ReactDOM.render(<ChangeTile lstPlayer={lstPlayer} lstTile={lstTile} map={map} selectedTile={lstRefinedTiles[3]} />, container)
    })
    const button = document.querySelector("[data-testid=submit]")
    expect(button.innerHTML).toBe("Valider")
    const help = document.querySelector("[id=helpSubmit]")
    expect(help.innerHTML).toBe("")
    act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(help.innerHTML).toBe("selectionnez l'action à effectuer")
})
it("water is not valid tile", () => {
    act(() => {
        ReactDOM.render(<ChangeTile lstPlayer={lstPlayer} lstTile={lstTile} map={map} selectedTile={lstRefinedTiles[4]} />, container)
    })
    const button = document.querySelector("[data-testid=submit]")
    expect(button.innerHTML).toBe("Valider")
    const help = document.querySelector("[id=helpSubmit]")
    expect(help.innerHTML).toBe("")
    act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(help.innerHTML).toBe("case non valide")
})

it("agriculture no receiver selected", () => {
    act(() => {
        ReactDOM.render(<ChangeTile lstPlayer={lstPlayer} lstTile={lstTile} map={map} selectedTile={lstRefinedTiles[1]} />, container)
    })
    const button = document.querySelector("[data-testid=submit]")
    //const radio = getByText("selectionné le joueur qui reçoit la case")
    const radio = screen.getByText("donner la case")

    const help = document.querySelector("[id=helpSubmit]")
    expect(help.innerHTML).toBe("")
    act(() => {
        //fireEvent.change(radio, { target: { value: true } });
        radio.dispatchEvent(new MouseEvent('mouseDown', { bubbles: true }))
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    //expect(radio.value).toBe('1')
    expect(help.innerHTML).toBe("selectionnez le joueur qui reçoit la case")
})
it("agriculture add infrastructure", () => {
    act(() => {
        ReactDOM.render(<ChangeTile lstPlayer={lstPlayer} lstTile={lstTile} map={map} selectedTile={lstRefinedTiles[1]} />, container)
    })
    const button = document.querySelector("[data-testid=submit]")
    const label = document.querySelector("[id=addInfra]")
    const help = document.querySelector("[id=helpSubmit]")
    expect(help.innerHTML).toBe("")
    act(() => {
        //label.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        //fireEvent.change(radio, { target: { value: "1" } });

        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(help.innerHTML).toBe("")
})