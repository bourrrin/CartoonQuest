//======================================================== En-tete ========================================================
// @fileName:       drawable.js -> projetsynthese\C61\dev\frontend\src\02-js\game\drawable.js
// @context:        Classe permettant au game.jsx de dessiner des images                
// @author:         Luca Reymann
// @teamMembers:    Chloé Boucher, Amélia Desgagné et Luca Reymann
// @lastUpdated:    2022-05-25
// @sources:        
// 
// @explanation:    
// 
//============================================================================================================================


export default class Drawable{
/**
 * Creer un objet Drawable a partir d'une image ou d'une tiledImage.
 * Peut gerer plusieur animation de longueur differentes.
 * isAnimated, animatedSpriteSize, rowSpriteCount, rowLabel, rowLoop, gap, timeOut sont optinel pour les images non-animé 
 * @param {string} src Path de l'image(str), image() ou canvas()
 * @param {array} pos Position [x, y] dans la scene (canvas), coin superieur gauche
 * @param {array} size Taille [width, height] de l'objet dessiner dans la scene (canvas) 
 * @param {boolean} isAnimated Defini s'il s'agis d'une image animé 
 * @param {array} animatedSpriteSize Taille [width, height] d'un sprite de l'animation 
 * @param {array} rowSpriteCount Nombre de dessin par animation 
 * @param {array} rowLabel Nomme les differentes animation de la TiledImage (row) 
 * @param {array} rowLoop Nombres de sprites par animation (row)
 * @param {array} gap Ecart [x,y] entre les sprites
 * @param {int} timeOut Nombre de frame ou 1 sprite reste afficher
 * @param {array} rowLoop [boolean] Indique pour chaque row si elle loop
 */
    
    constructor(src, pos, size, moveSet=null, isAnimated = false, animatedSpriteSize=[], rowSpriteCount=[], rowLabel=[], gap= [], timeOut = 1, rowLoop=[true,true,false,true], hitboxSize=[] , hitBoxPos = [], effectSprite = {}) {
        // VARIABLE UTILISER PAR LE MAIN TICK POUR DESSINER SUR LE this._canvas
        this.pos = pos
        this.size = size
        if (typeof src === 'string') {
            this.image = new Image()
            this.image.src = src
        } else {
            this.image = src
        }

        this.hitboxSize = hitboxSize
        this.hitBoxPos = hitBoxPos
        this.isLooping = true
        if (typeof effectSprite.peur === 'string') {
            this.effectSprite = new Image()
            this.effectSprite.src = effectSprite.peur
        } else {
            this.effectSprite = effectSprite.peur
        }

        this.isAnimated = isAnimated
        
        //VARIABLE UTILISER POUR GERER L'ANIMATION
        this.rowLabel = rowLabel
        this._rowLoop = rowLoop
        this._animatedSpriteSize = animatedSpriteSize
        this._rowSpriteCount = rowSpriteCount
        this._gap = gap
        this._matrixPos = [1,1]
        this._timeOut = timeOut
        this._count = this._timeOut
        this._hasEnded = false
        this._isCanvasVisible = false
        this.isFlipped = false
        this._moveSet = moveSet
        this.isDead = false
        this.setSprite()

        if (this._moveSet !== null) {
            this._moveSet["left"]["anim"] = () => {
                if (!this.isFlipped) {
                    this.flip()
                }
            }
            this._moveSet["right"]["anim"] = () => {
                if (this.isFlipped) {
                    this.flip()
                }
            }

            this._moveSet["up"]["anim"] = () => { }
            this._moveSet["down"]["anim"] = () => { }
        } else {
            
            this._moveSet = {
                left: {anim: () => { },},
                right: {anim: () => { },},
                up: {anim: () => { },},
                down: {anim: () => { },},
            }
        }
    }

    getHitbox() {
       return {
            top:    this.pos[1] + (this.size[1]/2) - (this.size[1]),
            bottom: this.pos[1] + (this.size[1] / 2) ,
            left:   this.pos[0] - (this.size[0]/2) + (this.size[0]/2),
            right:  this.pos[0] + (this.size[0]/2) - (this.size[0]/2),
        }
        
    }

    getPos() {
        return [this.pos[0] - this.size[0]/2, this.pos[1] - this.size[1]/2]
    }

    setSprite() {
        let sprite = this.image
        if (this.isAnimated) {
            this._canvas = document.createElement("canvas")
            this._ctx = this._canvas.getContext("2d")

            let magic_numberX = Math.min(this.size[0]*1, 150)
            let magic_numberY = Math.min(this.size[1]*1, 150)

            this._ctx.width = magic_numberX
            this._ctx.height = magic_numberY
            
            this.animator()

        } else {
            this.sprite = sprite
        }
    }
    
    changeAnimation(label) {
        this._matrixPos[0] = this.rowLabel.indexOf(label) + 1
    }

    getAnimation() {
        return this.rowLabel[this._matrixPos[0] - 1]
    }

    flip() {
        this.isFlipped = !this.isFlipped
        this._ctx.translate(this._ctx.width, 0);
        this._ctx.scale(-1, 1);
    }

    drawHitbox() {
        const x = this.hitBoxPos[0]
        const y = this.hitBoxPos[1]
        this._ctx.fillStyle = "yellow";
        this._ctx.fillRect(x, y, this.hitboxSize[0], this.hitboxSize[1]);
    }

    drawCanvas() {
        this._ctx.fillStyle = "red";
        this._ctx.fillRect(0, 0, this._ctx.width, this._ctx.height);
    }


    animator() {
        if (this._count >= this._timeOut && !this._hasEnded) {
            try {
                Object.values(this._moveSet).forEach(val => {
                    if (val.pressed) {
                        val.anim()
                    }
                })
            }catch{}
   
            //CLEAR LE PRECEDENT CANVAS
            this._ctx.clearRect(0, 0, this.size[0], this.size[0]);
            const sprite = this.image
            if (this._isCanvasVisible) {
                this.drawCanvas()
                this.drawHitbox()
            }

            //ISOLE LE SPRITE VOULUE DE LA SPRITESHEET ET LE DESSINE
            let sx = (this._animatedSpriteSize[0] + this._gap[1]) * this._matrixPos[1] - this._animatedSpriteSize[0]
            let dx = this._animatedSpriteSize[0]
            let sy = (this._animatedSpriteSize[1] + this._gap[0]) * this._matrixPos[0] - this._animatedSpriteSize[1]
            let dy = this._animatedSpriteSize[1]
            this._ctx.drawImage(sprite, sx, sy, dx, dy, 0, 0, this._ctx.width, this._ctx.height)
            
            //CHANGE DE COLONE
            if (this._matrixPos[1] >= this._rowSpriteCount[this._matrixPos[0] - 1]) {
                this._matrixPos[1] = 1
                //TEST POUR L'ANIMATION EN COURS LOOP
                if (!this._rowLoop[this._matrixPos[0]-1]) {
                    this._hasEnded = true;
                }
            } else {
                this._matrixPos[1] +=1
            }
            this.sprite = this._canvas

            //RESET LE COMPTEUR DE CHANGEMENT DE FRAME  
            this._count = 0
        } else {
            this._count += 1
        }
    }
}