//======================================================== En-tete ========================================================
// @fileName:       game.js -> projetsynthese\C61\dev\frontend\src\02-js\game\game.js
// @context:        Classe s'occupant des items du jeu              
// @author:         Luca Reymann
// @teamMembers:    Chloé Boucher, Amélia Desgagné et Luca Reymann
// @lastUpdated:    2022-05-25
// @sources:        
// 
// @explanation:    
// 
//============================================================================================================================

import { makeAutoObservable } from "mobx"
import SpriteSheetToCanvas from "./spriteSheetToCanvas"

class Item{
    //DEPLACER LA GESTION DES SPRITE D'IMAGE (TILEDIMAGE) DE PROJECTIL A ICI
    
    /**
    * @param {string} name Nom de l'objet afficher dans le ui
    * @param {Array} description Array de string afficher dans le ui 
    * @param {string} sprite source de l'image
    * @param {Array} data Array d'objet {type:string, value:any} qui modifie le projectil
    */
    constructor(name = "", description = "",src , matrixPos = "", data = []) {
        makeAutoObservable(this)
        this.name = name
        this.description = description
        this.data = data

        this.spriteSheetToCanvas = new SpriteSheetToCanvas(src, matrixPos, [80,80])
        this.spriteSheetToCanvas.initCanvas()
        this.spriteSheetToCanvas.image.onload = () => {
            this.sprite = this.spriteSheetToCanvas.setSprite()
            this.data.push({ type: "sprite", value: this.sprite })
        }
    }

    
    getUpgrades() {
        return this.data
    }
}

export default Item