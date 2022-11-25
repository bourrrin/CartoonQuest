//======================================================== En-tete ========================================================
// @fileName:       spriteSheetToCanvas.js -> projetsynthese\C61\dev\frontend\src\02-js\game\spriteSheetToCanvas.js
// @context:        Classe qui creer un canvas a partir d'une spritsheet           
// @author:         Luca Reymann
// @teamMembers:    Chloé Boucher, Amélia Desgagné et Luca Reymann
// @lastUpdated:    2022-05-25
// @sources:        
// 
// @explanation:    
// 
//============================================================================================================================


class SpriteSheetToCanvas{
    constructor(src , matrixPos, size){
        this.image = new Image()
        this.image.src = src
        this.matrixPos = matrixPos
        this.size = size
    }

    initCanvas() {
        this._canvas = document.createElement("canvas")
        this._ctx = this._canvas.getContext("2d")
        this.magic_numberX = this.size[0] * Math.max((200 / this.size[0]) * 1.5, 1) 
        this.magic_numberY = this.size[1] * Math.max((100 / this.size[1]) * 1.5, 1)
        this._ctx.width = this.magic_numberX
        this._ctx.height = this.magic_numberY
        
        this._gap = [0,0]
        this._animatedSpriteSize = [32, 32]
    }

    showCanvas() {
        this._ctx.fillStyle = "red";
        this._ctx.fillRect(0, 0, this._ctx.width, this._ctx.height);
    }

    clearCanvas() {
        this._ctx.clearRect(0, 0, this._ctx.width, this._ctx.height);
    }
    
    setSprite() {
        // this.showCanvas()

        let sx = (this._animatedSpriteSize[0] + (this._gap[0]*2)) * this.matrixPos[0]
        let dx = (this._animatedSpriteSize[0] + (this._gap[0]*2)) 
        let sy = (this._animatedSpriteSize[1] + (this._gap[1]*2)) * this.matrixPos[1]
        let dy = (this._animatedSpriteSize[1] + (this._gap[1]*2))
        
        this._ctx.drawImage(this.image, sx, sy, dx, dy, 0, 0,  this._ctx.width, this._ctx.height)
        
        return this._canvas
    }
}

export default SpriteSheetToCanvas