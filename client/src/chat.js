import React, { Component, useState } from 'react'
import { unmountComponentAtNode, render } from "react-dom";
const ChoseName = ({ defineName }) => {
    const [text, setText] = useState("");
    const handle = (e) => {
        e.preventDefault();
        defineName(text)
        console.log(this)
    }
    return <div id="name">
        <form onSubmit={handle}>
            <input type="text" value={text} onChange={e => setText(e.target.value)}></input>
            <input type="submit" />
        </form>
    </div>
}
const DisplayConv = (conv) => {
    console.log(conv)
    return <>
        {
            conv.conv.map((item, i) => <div>
                <p>{item.text}</p> {item.name}
            </div>
            )

        }

    </>
}
const WriteMessage = ({ addMessage, name }) => {
    const handle = (e) => {
        e.preventDefault();
        //console.log(msg)
        addMessage({ message: msg, name: name })
        setMsg("")
        unmountComponentAtNode(document.getElementById('name'));

    }
    const [msg, setMsg] = useState([]);
    return <form onSubmit={handle}>
        <input type="text" value={msg} onChange={e => setMsg(e.target.value)}></input>
        <input type="submit" />
    </form >
}

export default function Chat() {
    const [conv, setConv] = useState([]);
    const [name, setName] = useState("");
    const addMessage = (msg) => {
        console.log(conv.length, conv)
        setConv(conv => [...conv, msg])
        console.log(conv.length, conv)
    }
    const defineName = (name) => {
        setName(name)
    }
    return <>
        {name == "" ? <ChoseName defineName={defineName} /> : ""}
        <DisplayConv conv={conv} />
        <WriteMessage addMessage={addMessage} name={name} />
    </>
}