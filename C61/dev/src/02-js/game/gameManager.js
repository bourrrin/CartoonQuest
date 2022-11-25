//======================================================== En-tete ========================================================
// @fileName:       gameManager.js -> projetsynthese\C61\dev\frontend\src\02-js\game\gameManager.js
// @context:        Classe s'occupant de lier le jeu avec la scene (affichage)                
// @author:         Luca Reymann
// @teamMembers:    Chloé Boucher, Amélia Desgagné et Luca Reymann
// @lastUpdated:    2022-05-25
// @sources:        
// 
// @explanation:    
// 
//============================================================================================================================

import Drawable from "./drawable";
import { makeAutoObservable } from "mobx";
import Game from "./game";

class GameManager {
    game = null;
    currentRoom = null;
    sceneSize = [0, 0];

    /**
     * Classe gérant le jeu au complet
    **/
    constructor() {
        console.log("new GameManager")
        makeAutoObservable(this);
        this.isNewGame = null; 
        this.sceneName = "scene";
        this.sceneElements = new Object()
    }   

    createGame(data) {
        this.isNewGame = data;
        this.game = new Game(this, this.isNewGame);
        this.currentRoom = this.game.currentRoom
        this.sceneCenter = this.game.getSceneCenter()
        this.sceneSize = this.game.sceneSize
        this._sceneLimit = this.game._sceneLimit

        this.game.sceneElements = this.sceneElements
        this.initScene();
    }

    tick() {
        this.game.tick()
    }

    
    updateScene() {
        //add update on layer
        if (!this.game.pauseDrawingScene) {
            this.currentRoom = this.game.currentRoom
            this.initScene()
        }
    }

    /**
     * Ajoute tous les éléments à dessiner dans la salle
    **/
    addSceneElement(label, layout, drawable) {
        this.sceneElements[layout][label] = drawable

    }

    addSceneLayout(layout) {
        this.sceneElements[layout] = new Object()
    }


    /**
     * Dessine les éléments sur la scène
    **/
    initScene() {
        this.sceneElements = new Object()
        this.addSceneLayout("background")
        this.addSceneLayout("interactable")
        this.addSceneLayout("foreground")
        this.addSceneLayout("effect")
        this.addSceneLayout("projectile")

        const currentElements = this.game.getCurrentRoomData()
        
        this.backgroundSceneElements(currentElements)
        this.characterSceneElements(currentElements)
        this.interactableSceneElements(currentElements)
        this.projectilSceneElements(currentElements)
        this.effectSceneElements(currentElements)

    }

    backgroundSceneElements(currentElements) {
        currentElements.background.forEach(el => {
            this.addSceneElement("background_"+Math.random(),"background", new Drawable(el.sprite, el.pos, el.size));
        });
       
        Object.keys(currentElements.doors).forEach(key => {
            if (currentElements.doors[key].isHere) {
                this.addSceneElement("door_" + key,"background", new Drawable(currentElements.doors[key].sprite, this.sceneCenter, this.sceneSize));
            }
        });
    }

    characterSceneElements(currentElements) {
        currentElements.character.forEach(character => {
            this.addSceneElement(character.type+"_"+Math.random(), "foreground", character.sprite);
        });
    }
    
    projectilSceneElements(currentElements) {
        currentElements.projectile.forEach(element => {
            this.addSceneElement(element.name,"projectile", element.drawable);
        });
    }

    interactableSceneElements(currentElements) {
        currentElements.interactable.forEach(element => {
            this.addSceneElement(element.name,"interactable", new Drawable(element.data.sprite, element.pos, element.size));
        });
    }

    effectSceneElements(currentElements) {
        currentElements.effect.forEach(effect => {
            this.addSceneElement(effect.name+"_"+Math.random(), "effect", effect.drawable);
        });
    }

    displayEffet(color ="rgb(21, 42, 46)" ) {
        const node = document.querySelector(".container__game")
        node.style.backgroundColor = color
    }

    drawMap(level) {
        const canvas = document.querySelector(".map")
        const ctx = canvas.getContext("2d")

        // console.log(level);

        canvas.width = window.innerHeight * 0.2
        canvas.height = window.innerHeight* 0.2
        const { width, height } = canvas.getBoundingClientRect();
        
        const row = level[0].length 
        const col = level.length
        const border = [width * 0.025, height * 0.025]
        const space =  [width * 0.03,  height * 0.03]
        

        const roomW = parseInt(width/row - space[0])
        const roomH = parseInt((height/ col - space[1]))
        
        for (let i = 0; i < level.length; i++) {
            for (let ii = 0; ii < level[i].length; ii++) {
                const element = level[i][ii];

                if (element != 0) {
                    const x = border[0] + parseInt(ii * (roomW + space[0]))
                    const y = border[1] + parseInt(i  * (roomH + space[1]))
                    ctx.fillStyle = "white";
                    ctx.fillRect(x, y, roomW, roomH);
                }
            }
        }
        const center = [parseInt(level[0].length/2), parseInt( level.length/2)]
        const x = border[0] + parseInt(center[0]* (roomW + space[0]))
        const y = border[1] + parseInt(center[1]* (roomH + space[1]))
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, roomW, roomH);
        canvas.style.transform = "rotate(-90deg)"
    }

    animationMaxHp(bool) {
        const container = document.querySelector(".heart__list")
        if (bool) {
            container.classList.add("max_hp")
        } else {
            container.classList.remove("max_hp")
        }
    }

    animationMaxKey(bool) {
        const container = document.querySelector(".container__keys")
        if (bool) {
            container.classList.add("max_key")
        } else {
            container.classList.remove("max_key")
        }
    }

    
    animationInventoryFull(bool) {
        const container = document.querySelector(".item__list")
        container.classList.add("inventory--full")
        if (bool) {
            container.classList.add("inventory--full")
        } else {
            container.classList.remove("inventory--full")
        }
    }

    animationLootKey() {
        const container = document.querySelector(".loot_key")
        container.classList.add("animate_loot_key")
        setTimeout(() => {
            document.querySelector(".key").classList.add("animate_loot_key_container")
        }, 800);
        setTimeout(() => {
            container.classList.remove("animate_loot_key")
        }, 2000);
    }

    animationGainHp() {
        const container = document.querySelector(".heart__list")
        container.classList.add("gain_hp")
        setTimeout(() => {
            container.classList.remove("gain_hp")
        }, 1000);
    }

    animationGainGold() {
        const container = document.querySelector(".container__gold")
        container.classList.add("gain_gold")
        setTimeout(() => {
            container.classList.remove("gain_gold")
        }, 1000);
    }

    animationDamageChanged(id, bool) {
        window.requestAnimationFrame(() => {
            const container = document.getElementById(id)
            if (container != null){
                let classe = "stat_changed";
                
                if (!bool) {
                    classe = "stat_decreased"
                }

                container.classList.add(classe)
                setTimeout(() => {
                    container.classList.remove("stat_changed")
                }, 1000);
            }
        });
    }

    animationNotEnoughGold() {
        const container = document.querySelector(".container__gold")
        container.classList.add("not_enought_gold")
        setTimeout(() => {
            container.classList.remove("not_enought_gold")
        }, 1000);
    }

    animatitionNewLevel() {
        const container = document.querySelector(".newLevel")
        container.classList.add("newLevel--show")
        setTimeout(() => {
            container.classList.remove("newLevel--show")
        }, 5000);
    }

    animationPauseMenu(bool) {
        const container = document.querySelector(".menu__pause")
        if (bool) {
            container.classList.remove("fade")
            container.classList.add("fade-in")
        } else {
            container.classList.remove("fade-in")
            container.classList.add("fade")
        }
    }
}

export default new GameManager();
