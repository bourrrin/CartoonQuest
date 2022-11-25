import React, { Component } from "react";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom"

import Item from "../03-components/item";
import Heart from "../03-components/heart";
import Stat from "../03-components/stat";
import GameManager from "../02-js/game/gameManager";
import { IS_GAME_RUNNING } from "../App";

/**
*   Fonction pour la création de la page game
**/
export default observer(function Game() {

    //Variables globales
    let location = useLocation();
    let ctx;
    let frameRate = 0
    let data;

    // Fonction qui met à jour dans l'interface utilisateur les variables observées par mobx
    useEffect(() => {
        IS_GAME_RUNNING.val = true;
        location.state == "newGame" ? data = false : data = false;
        location.state == "continueGame" ? data = true : data = false;
        GameManager.createGame(data);
        loadScene();
        setControlListener();
        gameTick();
        incrTimer();
    }, []);

    function loadScene() {
        let canvas = document.getElementById(GameManager.sceneName);
        ctx = canvas.getContext("2d");
        tick();
    }

    function tick() {
        if (IS_GAME_RUNNING.val) {
            wait()
            window.requestAnimationFrame(tick);
        }
    }

    function gameTick() {
        waitList.push(createWaitMethod(() => {
            GameManager.tick()
            ctx.clearRect(0, 0, GameManager.sceneSize[0], GameManager.sceneSize[1]);
            Object.values(GameManager.sceneElements).forEach((layout) => {
                Object.values(layout).forEach((e) => {
                    if (e) {
                        if (e.isAnimated) {
                            e.animator()
                            ctx.drawImage(e.sprite, e.getPos()[0], e.getPos()[1]);
                        } else {
                            try {
                                ctx.drawImage(e.sprite, e.getPos()[0], e.getPos()[1], e.size[0], e.size[1]);
                            } catch {
                                console.warn("Invalid Drawable")
                                GameManager.initScene()
                            }
                        }
                    }
                });
            })
            gameTick()
        },frameRate))
    }
    

    let waitList = new Array()
    function wait() {
        for (let i = 0; i < waitList.length; i++) {
            const element = waitList[i];
            if (element.func(element.timeOut)) {
                waitList.splice(i,1)
            } else {
                element.timeOut += 1
            }
        }
    }
    
    function createWaitMethod(func, val) {
        return {
            func: (e) => {
                if (e >= val) {
                    func()
                    return true
                }
        }, timeOut: 0 }
    }

    //#region DISPLAY DATA 
    function calc_health_display(hp) {
        let fullHeartCount = parseInt(hp / 2);
        let halfHeartCount = hp % 2;
        let arr = [];

        for (let i = 0; i < fullHeartCount; i++) {
            arr.push({ id: i + generateRandomId(), value: 2 });
        }
        if (halfHeartCount) {
            arr.push({ id: arr.length, value: 1 });
        }
        return arr;
    }

    function display_items() {
        let arr = []
        if (GameManager.game != null) {
            // console.log(GameManager.game.player.itemList)
            GameManager.game.player.itemList.forEach((item) => {
                arr.push(<Item key={"item"+generateRandomId()} data={item}></Item>)
            })
        }
        return arr
    }
//#endregion

    //#region UITILS 

    function setControlListener() { //Fonction qui devrait être dans le gameManager
        document.onkeydown = function (e) {
            GameManager.game.controlsOnkeyDown(e.keyCode)
        };

        document.onkeyup = function (e) {
            GameManager.game.controlsOnkeyUp(e.keyCode)
        };
    }

    function generateRandomId() {
        return Math.random(100);
    }

    function relocateToLobby() {
        window.location.href = "/lobby";
    }
    //#endregion

    var sec = 0;
    function pad ( val ) { return val > 9 ? val : "0" + val; }
    function incrTimer() {
        waitList.push(createWaitMethod(() => {
            if (!GameManager.game.isGamePaused) {
                sec += 0.5
                if (Number.isInteger(sec)) {
                    document.getElementById("seconds").innerHTML=pad(sec%60);
                    document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
                }
            }
            incrTimer()
        }, 30))
    }  
    
    //HTML de la page game
    return (
        <div className="pagewrapper">
            <div className="timer">
                <span id="minutes" ></span> <span>:</span> <span id="seconds"></span>
            </div>
            <div className="newLevel text__highlignted--title">NEW LEVEL</div>
            <div className="menu__pause">
                <div className="menu__btn text__highlignted--title menu__pause--resume">PAUSE</div>
                <div className="menu__btn text__highlignted--title menu__pause--resume" onClick={() => { GameManager.game.pause() }} >Reprendre</div>
                <Link to={"/lobby"}className="menu__btn text__highlignted--title menu__pause--return">Retour au Lobby</Link>
                <Link to={"/"} className="menu__btn text__highlignted--title menu__pause--return">Quitter</Link>
                {/* <div className="menu__btn text__highlignted--title menu__pause--quit" onClick={() => {}}>Quitter</div> */}
            </div>
            <div className="loot_key"></div>
            <div className="container__game">
                <div className="ui container__items">
                    <h1 className="text__highlignted--title">OBJETS</h1>
                    <p className= "text__highlignted--title item__price">Price: {GameManager.game != null && GameManager.game.player != null && GameManager.game.player.itemPrice} G</p>
                    <div className="item__list">
                        {display_items()}
                    </div>
                    <h1 className="text__highlignted--title container__gold">
                        {GameManager.game != null && GameManager.game.player != null && GameManager.game.player.gold} G
                    </h1>
                </div>
                <div className="ui container__room">
                    <canvas
                        id="scene"
                        className={GameManager.sceneName}
                        width={GameManager.sceneSize[0]}
                        height={GameManager.sceneSize[1]}
                    ></canvas>
                    <div className="room_cover">
                        <button className="text__highlignted--title" id="gameOver_button" onClick={relocateToLobby}>Quitter</button>
                    </div>
                </div>
                <div className="ui container__stats">
                    <h1 className="text__highlignted--title">STATS</h1>
                    <div className="stat__list">
                        {GameManager.game != null && GameManager.game.player.statList.map((stat) => (
                            <Stat key={"stat" +generateRandomId()} data={stat}></Stat>
                        ))}
                    </div>
                    <div className="container__map">
                        <div className="room_name text__highlignted--title"> {GameManager.game != null && (GameManager.game.levelNumber+" - "+
                            GameManager.currentRoom[0].type+" - "+GameManager.currentRoom[0].id
                        )}
                        </div>
                        <canvas className="map"></canvas>
                    </div>
                </div>
                <div className="container__keys">
                    <div className="key"></div>
                    <h1 className="key--value">{GameManager.game != null && GameManager.game.player.keys["posessed"]}/{GameManager.game != null && GameManager.game.player.keys["max"]}</h1>
                </div>
                <div className="container__heart">
                    <div className="heart__list">
                        {GameManager.game != null && calc_health_display(GameManager.game.player.hp).map((heart) => (
                            <Heart key={"heart" + generateRandomId()} value={heart.value}></Heart>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
});
