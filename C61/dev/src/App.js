import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./01-pages/login";
import Lobby from "./01-pages/lobby";
import Game from "./01-pages/game";
import Item from "./01-pages/item";
export let IS_GAME_RUNNING = {val: false};

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/lobby" element={<Lobby />} />
                <Route path="/game" element= {<Game /> } />
                <Route path="/item" element= {<Item /> } />
                <Route path="*" element={<h1>Hmmm...</h1>} />
            </Routes>
        </Router>
    );
}
