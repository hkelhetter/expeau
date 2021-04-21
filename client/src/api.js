import openSocket from 'socket.io-client';
import React, { useState, Component, useEffect } from 'react'

const socket = openSocket('http://localhost:8000');
const getMap = () => {
    let a = "aa"
    socket.emit('map');
    /*socket.on('response', response => {
        a = response
        console.log(response)
    })*/
    return <>
        <p>a</p>
    </>
}

export default function Map() {
    return <>
        <p>aaa</p>
    </>
}