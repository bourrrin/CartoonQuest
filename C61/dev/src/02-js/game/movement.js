//======================================================== En-tete ========================================================
// @fileName:       game.js -> projetsynthese\C61\dev\frontend\src\02-js\game\game.js
// @context:        Classe s'occupant movement de tout les element mobile du jeu               
// @author:         Luca Reymann
// @teamMembers:    Chloé Boucher, Amélia Desgagné et Luca Reymann
// @lastUpdated:    2022-05-25
// @sources:        
// 
// @explanation:    
// 
//============================================================================================================================

import { makeAutoObservable } from "mobx";

export default class Movement {
    pos = [0, 0];
    hitBorder = false
    /**
    * Cette classe gere tout ce qui est rapport avec la position d'une entite  
    * @param {array} pos Position [x, y] coin superieur gauche
    * @param {array} size Taille [width, height] 
    * @param {array} scene_limit Defini les dimension de la ou se deplace les objets (scene) 
    * @param {int} posIncrement Nombre de pixel entre la pos_initial et pos_final d'un deplacement  
    * @param {str} direction Direction (up, down, left, right) vers lequel le deplacement ce fait 
    */
    constructor(pos, hitBoxSize, spriteSize, scene_limit, posIncrement, direction = null) {
        // console.log("new Mouvement")
        makeAutoObservable(this)
        this.initial_position = pos
        this.pos = this.initial_position;
        this._sceneLimit = scene_limit;
        this._posIncrement = posIncrement;
        this.speedModificateur = 1
        this.invert = false
        this.moveSet = {
            "right":{pressed:false, canMove:true, func:() => {
                if(!this.invert){this.moveRight()}
                else{this.moveLeft()}
            } },
            "left" :{pressed:false, canMove:true, func:() => {
                if(!this.invert){this.moveLeft()}
                else{this.moveRight()}
            } },
            "up"   :{pressed:false, canMove:true, func:() => {
                if(!this.invert){this.moveUp()}
                else{this.moveDown()}
            } },
            "down" :{pressed:false, canMove:true, func:() => {
                if(!this.invert){this.moveDown()}
                else{this.moveUp()}
            } },
        }

        if (direction != null) {
            this.moveSet[direction].pressed = true
        }

        this.setHitbox(hitBoxSize,spriteSize)

        this.tick()
    }

    getDirection() {
        let direction = ""
        Object.keys(this.moveSet).forEach(key => {
            if (this.moveSet[key].pressed) {
                direction = key
            }
        })
        return direction
    }

    setHitbox(hitBoxSize,spriteSize) {
        this.spriteSize = spriteSize
        this.hitBox = {
            top:   () =>  { return this.pos[1] + (this.spriteSize[1]/2) - (hitBoxSize[1])},
            bottom: () => { return this.pos[1] + (this.spriteSize[1] / 2) },
            left:  () =>  { return this.pos[0] - (this.spriteSize[0]/2) + (hitBoxSize[0]/2)},
            right: () =>  { return this.pos[0] + (this.spriteSize[0]/2) - (hitBoxSize[0]/2)},
        }
        
    }

    getHitBox() {
        return {
            top:    this.hitBox.top(),
            left:   this.hitBox.left(),
            right:  this.hitBox.right(),
            bottom: this.hitBox.bottom(),
        }
    }

    setSpeed(speed) {
        this._posIncrement = speed
    }

    /**
    * Fonction recursive qui modifie la poition selon la ou les direction choisie dans this.moveSet
    */
    tick() {
        Object.values(this.moveSet).forEach(val => {
            if (val.pressed && val.canMove) {
                this.hitBorder = false
                val.func()
            }
        })
    }

    isCollinding() {
        // FIND A WAY TO RESTRAIN THE MOVEMENT ON ONE OR MULTIPLE DIRECTION
        // TO PREVENT CHARACTERS TO WALK ON EACH OTHERS

        // Object.values(this.moveSet).forEach(val => {
        //     if (val.pressed) {
        //         val.canMove = false
        //     }
        // })
        // setTimeout(() => {
        //     Object.values(this.moveSet).forEach(val => {
        //         val.canMove = true
        //     })
        // }, 1000);
    }

    stop() {
        // console.log("stop");
        // Object.values(this.moveSet).forEach(val => {
        //     val.pressed = false
        // })
        this.hitBorder = true

    }

    setPositionToInitial() {
        this.pos[0] = this.initial_position[0]
        this.pos[1] = this.initial_position[1]
    }

    getBoundingBox() {
        return {
            top:this.hitBox.top()   ,
            left:this.hitBox.left()  ,
            right:this.hitBox.right() ,
            bottom:this.hitBox.bottom() ,
        }
    }

    getCenter() {
        return [this.pos[0] + (this.spriteSize[0]/2), this.pos[1] + (this.spriteSize[1]/2)]
    }

    moveRight() {
        if (this.hitBox.right() + (this._posIncrement * this.speedModificateur) < this._sceneLimit.right) {
            this.pos[0] += (this._posIncrement * this.speedModificateur);
        } else {
            // this.pos[0] =  this._sceneLimit.right;
            this.stop()
        }
    }

    moveLeft() {
        if (this.hitBox.left() - (this._posIncrement * this.speedModificateur) > this._sceneLimit.left) {
            this.pos[0] -= (this._posIncrement * this.speedModificateur);
        } else {
            this.stop()
        }
    }

    moveUp() {
        if (this.hitBox.top() - (this._posIncrement * this.speedModificateur) > this._sceneLimit.top) {
            this.pos[1] -= (this._posIncrement * this.speedModificateur);
        } else {
            // this.pos[1] =  this._sceneLimit.top;
            this.stop()
        }
    }

    moveDown() {
        if (this.hitBox.bottom() + (this._posIncrement * this.speedModificateur) < this._sceneLimit.bottom) {
            this.pos[1] += (this._posIncrement * this.speedModificateur);
        } else {
            this.stop()
        }
    }

}
