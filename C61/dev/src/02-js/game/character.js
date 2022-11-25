//======================================================== En-tete ========================================================
// @fileName:       character.js -> projetsynthese\C61\dev\frontend\src\02-js\game\character.js
// @context:        Classe des personnages                   
// @author:         Luca Reymann
// @teamMembers:    Chloé Boucher, Amélia Desgagné et Luca Reymann
// @lastUpdated:    2022-05-25
// @sources:        
// 
// @explanation:    
// 
//============================================================================================================================
import { makeAutoObservable } from "mobx";
import Movement from "./movement";
import Projectile from "./projectil";
import Item from "./item";
import Drawable from "./drawable";
import SpriteSheetToCanvas from "./spriteSheetToCanvas"

export default class Character {
    //CONSTANTE
    FPS = 60
    PLAYER_BASE_HP = 20
    spriteSize = 100
    maxHp = 48

    //VARIABLE
    shootCadence = 20;
    shootSpeed = 7;
    shootDamage = 4;
    shootEffect = "aucun";
    shootSize = [40,40]
    shootDefaultSprite = [0,0]
    baseSpeed = 7
    gold; hp; keys = { posessed: 0, max: 0 };
    hasKey = true
    coeur = new Array()
    moveStreak = 0
    projectilStreak = 0
    weakness = 1
    itemPrice = 8
    itemPriceModificator = 2
    hpMultiplier = 1
    goldMultiplier = 1
    merryGoRoundCount = 1
    circleShootCount = 1
    sharpShootCount = 1

    itemList = this.setItemList();
    statList = new Array();
    waitList = new Array()
    canShoot = true;
    isDead = false
    isInvincible = false
    invicibilityTime = this.FPS/1.2
    _continueShoot = true
    _continueMov = true
    hasInStateAction = false
    isEffectApplied = false
    lastHit = null
    canGainHP = true
    shootState = () => {}
    moveState = () => { }

    modStats = {
        degats:true,
        vitesse:true,
        cadence:true,
        effet:true,
        taille:true,
        goldBoost:true,
        heartBoost:true,
    }

    ennemieStats = {
        normal:    {hp:[15,30] ,  gold:[0,1,1,1,1,1,2,2,2,5] , coeur:[0,0,1,1,1,1,2,2,3,5],},
        fort:      {hp:[50,100] , gold:[0,0,0,0,1,1,1,1,2,3] , coeur:[0,0,0,0,0,1,1,1,2,3],},
        dangeureux:{hp:[100,500], gold:[0,0,0,0,0,0,1,1,1,2] , coeur:[0]}
    }
    
    shootActionSet = {
        "right":{pressed:false, func:() => { this.shootProjectile("right")} },
        "left" :{pressed:false, func:() => { this.shootProjectile("left")} },
        "up"   :{pressed:false, func:() => { this.shootProjectile("up")} },
        "down" :{pressed:false, func:() => { this.shootProjectile("down")} },
    }

    
    moveStateList = {
        none : () => {},
        random : () => {this.randomMouvement()},
        chaotic : () => {this.chaoticMouvement()},
        merryGoRound : () => {this.merryGoRoundMouvement()},
        fight : () => {this.fightMouvement()},
        flight : () => {this.flightMouvement()},
        vertical : () => {this.vecticalMouvment()},
        horizontal : () => {this.horizontalMouvment()},
    }

    shootStateList = {
        none : () => {},
        random : () => {this.randomShoot()},
        merryGoRound : () => {this.merryGoRoundShoot()},
        circle : () => {this.circleShoot()},
        sharpY : () => {this.sharpShootY()},
        sharpX : () => {this.sharpShootX()},
    }

    effectList = {
        aucun: () => {},
        peur: () => { this.effetPeur();} ,
        confusion: () => {this.effetConfusion()} ,
        paralysie: () => {this.effetParalysie()} ,
        feu: () => {this.effetFeu()} ,
        gele: () => {this.effetGele()},
    }


    constructor(scene_limit, itemSrc, initial_position, spriteSrc, spriteSheetData, type, playerSize, game ,itemList=[], hasKey=false, dangerLevel="", playerPos = null, state = null) {
        makeAutoObservable(this);
        this.id =type+"_"+Math.random()
        this.type = type
        this.spritesheet_url = spriteSrc
        this.initial_position = initial_position;
        this.scene_limit = scene_limit
        this.hasKey = hasKey
        this.dangerLevel = dangerLevel
        this.game = game
        this.playerPos = playerPos
        this.spriteSize = playerSize
        this.hitBoxSize = spriteSheetData.hitSize
        this.setStats()

        if (state) {
            this.initial_state = state
        } else {
            this.initial_state = {shoot:"none", movement:"none"}
        }

        this.movement = new Movement(this.initial_position, this.hitBoxSize, this.spriteSize, this.scene_limit, this.baseSpeed);
        
        let spriteSheetToCanvas = new SpriteSheetToCanvas(itemSrc, this.shootDefaultSprite, this.shootSize)
        spriteSheetToCanvas.initCanvas()
        spriteSheetToCanvas.image.onload = () => {
            let s = spriteSheetToCanvas.setSprite()
            this.baseStats = {
                "sprite": s,
                "size": this.shootSize,
                "degat": this.shootDamage,
                "speed": this.shootSpeed,
                "cadence": this.shootCadence,
                "effet": this.shootEffect
            }
            this._projectile = new Projectile(this.baseStats)
            this.setStatList(this.shootDamage, this.shootSpeed, this.shootCadence, this.shootEffect, this.shootSize[1], this.goldMultiplier, this.hpMultiplier)
            
            if (itemList.length) {
                this.setPosessedItems(itemList)
            }
            if (this.type === "ennemie") {
                this.setDrawable(spriteSheetData)
                this.setStatesBehaviour()
            }
        }
    }

    //#region GAME LOGIC

    tick() {
        if (!this.hp !== 0) {
            if (this._projectile) {
                this.inStateAction()
                this.shootAction()
            }
            
            if (this._continueMov) {
                this.movement.tick()
            }
            this.wait()
        }
        this.updateAnimation()
    }

    gotShoot(p) {
        if (this.lastHit !== p && !this.isInvincible) {
            this.lastHit = p

            if (!this.isEffectApplied && p.updatedStats.effet !== "aucun") {
                this.isEffectApplied = true
                this.effectList[p.updatedStats.effet]()
            }

            this.incrementHealth(-p.updatedStats.degat)
            this.invincibilityFrame(true)
        }
        return this.hp <= 0
    }

    updateAnimation() {
        if (this.sprite) {
            if (this.hp === 0) {
                this.sprite.changeAnimation("death")
            } else {
                if (this.movement.moveSet["left"].pressed ||
                this.movement.moveSet["right"].pressed ||
                this.movement.moveSet["up"].pressed ||
                this.movement.moveSet["down"].pressed ||
                this.movement.moveSet["left"].pressed &&
                this.movement.moveSet["right"].pressed ||
                this.movement.moveSet["up"].pressed &&
                this.movement.moveSet["down"].pressed) {
                    if (this.gotHit) {
                        this.sprite.changeAnimation("hit")
                    } else {
                        this.sprite.changeAnimation("walk")
                    }
                } else {
                    if (this.gotHit) {
                        this.sprite.changeAnimation("hit")
                    } else {
                        this.sprite.changeAnimation("idle")
                    }
                }
            }

            if (this.type === "player") {
                // console.log(this.sprite._matrixPos);
            }
        }
    }

    hasDied() {
        this.canGainHP = true
        this.isInvincible = true
        this.waitList = new Array()
        this.pauseState()
        this.resetAllMovement()
        this.resetShoot()
    }
    //#endregion

    
    //#region STATE BEHAVIOUR 

    setEnnemieState() {
        this._continueMov = false
        this._continueShoot = false
        this.hasInStateAction = true
        this.shootState = () => { if (this._continueShoot) { this.shootStateList[this.initial_state.shoot]() }}
        this.moveState = () =>  { if (this._continueMov)   { this.moveStateList[this.initial_state.movement]() }}
        
        if (this.initial_state.movement === "merryGoRound") {
            this.movement.pos = [this.movement.pos[0], this.scene_limit.bottom-50]
        }
    }

    startState() {
        this._continueMov = true
        this._continueShoot = true
    }

    pauseState() {
        this._continueMov = false
        this._continueShoot = false
    }

    inStateAction() {
        if (this.hasInStateAction) {
            this.shootState()
            this.moveState()
        }
    }

    resetAllMovement() {
        const arr = ["up", "down", "left", "right"]
        arr.forEach(direction => {
            this.resetMovement(direction)
        });
    }

    resetMovement(direction) {
        this.setAction(direction, false)
    }


    //#region MOUVEMENT 
	
    randomMouvement() {
        const arr1 = [
            {direction:"up", func: () => { this.resetMovement("down") } },
            {direction:"left",func: ()=>{this.resetMovement("right")}},
            {direction:"down",func: ()=>{this.resetMovement("up")}},
            { direction:"right", func: () => { this.resetMovement("left") } }
        ]
        const m = arr1.sample()
        const moveStreak = this.FPS * this.getRandomIntInclusive(1, 4)
        
        if (this.moveStreak >= moveStreak) {
            this.setAction(m.direction, true)
            m.func()
            this.moveStreak = -1
        }
        this.moveStreak += 1
    }

    chaoticMouvement() {
        const arr1 = [
            {direction:"up", func: () => { this.resetMovement("down") } },
            {direction:"left",func: ()=>{this.resetMovement("right")}},
            {direction:"down",func: ()=>{this.resetMovement("up")}},
            { direction:"right", func: () => { this.resetMovement("left") } }
        ]
        const m = arr1.sample()
        const moveStreak = 4
        

        if (this.moveStreak >= moveStreak) {
            this.setAction(m.direction, true)
            m.func()
            this.moveStreak = -1
        }
        this.moveStreak += 1
            
    }

    merryGoRoundMouvement() {
        if (this.moveStreak === 0) {
            this.setAction("up", true)
            this.moveStreak += 1
        }
        if (this.movement.hitBorder) {
            const arr1 = [ "up", "left", "down", "right"]
            const direction = arr1[this.merryGoRoundCount]
            
            this.resetAllMovement()
            this.setAction(direction, true)

            if (this.merryGoRoundCount < 3) {
                this.merryGoRoundCount +=1
            } else {
                this.merryGoRoundCount = 0
            }
        }
    }

    fightMouvement() {
        const moveStreak = 10
        if (this.moveStreak >= moveStreak) {
            this.resetAllMovement()
            const delatX = this.movement.pos[0] - this.playerPos[0]
            const delatY = this.movement.pos[1] - this.playerPos[1]
            const marge = 50

            if ( delatX > 0 ) {
                this.setAction("left", true)
            } else {
                this.setAction("right", true)
            }
            
            if (delatY > 0 ){
                this.setAction("up", true)
            } else {
                this.setAction("down", true)
            }

            this.moveStreak = 0
        }
        this.moveStreak += 1
    }

    flightMouvement() {
        //PEUT ETRE AMELIORER
        let moveStreak = 20
        if (this.moveStreak >= moveStreak) {
            this.movement.speedModificateur = 1
            this.resetAllMovement()
            const limit = 200
            const delatX = this.movement.pos[0] - this.playerPos[0]
            const delatY = this.movement.pos[1] - this.playerPos[1]
            
            const distPlayer = this.getDistance(this.playerPos, this.movement.pos)
            const distWallUp = this.movement.pos[1] - this.scene_limit.top
            const distWallDown = this.scene_limit.bottom - this.movement.pos[1]
            const distWallLeft =  this.movement.pos[0] - this.scene_limit.left
            const distWallRight = this.scene_limit.right - this.movement.pos[0]
            
            const arr = [distWallUp, distWallDown, distWallLeft, distWallRight,distPlayer]
            const direction = [
                () => {this.setAction("down",true)},
                () => {this.setAction("up",true)},
                () => {this.setAction("right",true)},
                () => {this.setAction("left", true) },
                () => {
                    if ( delatX < 0 ) {
                        this.setAction("left", true)
                    } else {
                        this.setAction("right", true)
                    }
                    
                    if (delatY < 0 ){
                        this.setAction("up", true)
                    } else {
                        this.setAction("down", true)
                    }
                }
            ]
            
            let arrLow = JSON.parse(JSON.stringify(arr));
            arrLow.sort(function (a, b) { return a - b; })
            
            if (arrLow[0] < limit) {
                this.movement.speedModificateur = 1.5
                direction[arr.indexOf(arrLow[0])]()
            }
            this.moveStreak = 0
        }
        this.moveStreak += 1
    }

    vecticalMouvment() {
        const moveStreak = 10
        if (this.moveStreak >= moveStreak) {
            this.resetAllMovement()
            const delatX = this.movement.pos[0] - this.playerPos[0]
            const delatY = this.movement.pos[1] - this.playerPos[1]
            
            if (delatY > 0 ){
                this.setAction("up", true)
            } else {
                this.setAction("down", true)
            }

            this.moveStreak = 0
        }
        this.moveStreak += 1
    }

    horizontalMouvment() {
        const moveStreak = 10
        if (this.moveStreak >= moveStreak) {
            this.resetAllMovement()
            const delatX = this.movement.pos[0] - this.playerPos[0]
            
            if (delatX > 0 ){
                this.setAction("left", true)
            } else {
                this.setAction("right", true)
            }

            this.moveStreak = 0
        }
        this.moveStreak += 1
    }

    //#endregion
 

    //#region SHOOT 

    sharpShootX() {
        const shootStreak = 10
        if (this.projectilStreak >= shootStreak) {
            this.resetShoot()
            this.projectilStreak = 0

            const delatX = this.movement.pos[0] - this.playerPos[0]

            if ( delatX > 0 ) {
                this.shootActionSet.left.pressed = true
            } else {
                this.shootActionSet.right.pressed = true
            }
        }
        this.projectilStreak += 1
    }

    sharpShootY() {
        const shootStreak = 10
        if (this.projectilStreak >= shootStreak) {
            this.resetShoot()
            this.projectilStreak = 0

            const delatY = this.movement.pos[1] - this.playerPos[1]

            if ( delatY > 0 ) {
                this.shootActionSet.up.pressed = true
            } else {
                this.shootActionSet.down.pressed = true
            }
        }
        this.projectilStreak += 1
    }

    circleShoot() {
        const shootStreak = this.shootCadence * 3
        if (this.projectilStreak === 0) {
            this.shootActionSet.up.pressed = true
        }
        if (this.projectilStreak >= shootStreak) {
            this.resetShoot()
            this.projectilStreak = 0
            
            const arr1 = [ "up", "left", "down", "right"]
            const direction = arr1[this.circleShootCount]
            this.shootActionSet[direction].pressed = true

            if (this.circleShootCount < 3) {
                this.circleShootCount +=1
            } else {
                this.circleShootCount = 0
            }
        }
        this.projectilStreak += 1

    }

    merryGoRoundShoot() {
        const shootStreak = this.shootCadence * 3
        if (this.projectilStreak >= shootStreak || this.projectilStreak === 0) {
            this.resetShoot()
            this.projectilStreak = 0
            if (this.sharpShootCount === 0) {
                const shoot = {
                    "right":() => {            
                        if ( this.movement.pos[1] - this.playerPos[1] > 0 ) {
                            this.shootActionSet.up.pressed = true
                        } else {
                            this.shootActionSet.down.pressed = true
                        }
                    },
                    "left" :() => {            
                        if ( this.movement.pos[1] - this.playerPos[1] > 0 ) {
                            this.shootActionSet.up.pressed = true
                        } else {
                            this.shootActionSet.down.pressed = true
                        }
                    },
                    "up"   :() => {            
                        if ( this.movement.pos[0] - this.playerPos[0] > 0 ) {
                            this.shootActionSet.left.pressed = true
                        } else {
                            this.shootActionSet.right.pressed = true
                        }
                    },
                    "down" :() => {            
                        if ( this.movement.pos[0] - this.playerPos[0] > 0 ) {
                            this.shootActionSet.left.pressed = true
                        } else {
                            this.shootActionSet.right.pressed = true
                        }
                    },
                }  
                const direction = this.movement.getDirection()
                if (direction) {
                    shoot[direction]()
                }

                this.sharpShootCount +=1
            } else {
                this.sharpShootCount = 0
            }
        }
        this.projectilStreak += 1
    }

    randomShoot() {
        const shootStreak = 2
        
        if (this.projectilStreak >= shootStreak) {
            this.resetShoot()
            this.projectilStreak = 0

            const direction = ["up","left","down","right"].sample()
            this.shootActionSet[direction].pressed = true
        }
        this.projectilStreak += 1
    }

    shootAction() {
        if (this._continueShoot) {
            Object.values(this.shootActionSet).forEach(val => {
                if (val.pressed) {
                    val.func()
                }
            })
        }
    }
    //#endregion


    //#endregion
    
    
    //#region SHOOT 

    shootProjectile(direction) {
        if (this.canShoot) {
            this.shootCoolDown()

            const projectileData = this._projectile.getConstructor()
            let p = new Projectile(projectileData[0], projectileData[1])
            p.initMouvement(direction, this.getCenterHitBox(), this.movement._sceneLimit)

            this.game.addProjectilToScene(this.type,this.getProjectilDrawable(p), p)
        }
    }

    getProjectilDrawable(p) {
        let sprite = p.updatedStats.sprite
        if (sprite === undefined) {
            sprite = p.baseStats.sprite 
        }
        const pos = p.movement.pos
        const size = p.updatedStats.size
        return new Drawable(sprite,pos,size )
    }

    shootCoolDown() {
        this.canShoot = false;
        this.waitList.push(this.createWaitMethod(() => {
            this.canShoot = true
        }, this.shootCadence))
    }

    resetShoot() {
        Object.values(this.shootActionSet).forEach(element => {
            element.pressed = false
        });
    }

    //#region EFFECTS 

    effetPeur(){
        console.log("cant shoot, move random")
        this._continueShoot = false
        this.moveState = () => { if (this._continueMov) { this.chaoticMouvement() }}
        this.hasInStateAction = true
        this.movement.setSpeed(10)
        this.game.addEffect(this, "peur")
        
        this.waitList.push(this.createWaitMethod(() => {
            this.isEffectApplied = false
            this.hasInStateAction = true
            this._continueShoot = true;
            this.movement.setSpeed(this.baseSpeed)
            this.resetAllMovement()
            this.moveStreak = 0
            this.moveState = () => {if (this._continueMov) { this.moveStateList[this.initial_state.movement]() }}
            this.game.removeEffect()
        }, this.FPS*1.5))
    }

    effetConfusion(){
        // console.log("controle inverser")
        this.movement.invert = true
        this.game.addEffect(this,"confusion")

        this.waitList.push(this.createWaitMethod(() => {
            this.isEffectApplied = false
            this.movement.invert = false
            this.game.removeEffect()
        }, this.FPS*2.5))
    }

    effetParalysie(){
        console.log("cant move, cant shoot")
        this._continueMov = false
        this._continueShoot = false
        this.resetShoot()
        this.resetAllMovement()
        this.game.addEffect(this,"paralysie")

        this.waitList.push(this.createWaitMethod(() => {
            this.isEffectApplied = false
            this._continueMov = true
            this._continueShoot = true
            this.moveStreak = 0
            this.game.removeEffect()
        }, this.FPS*1))
    }

    effetFeu(){
        console.log("degat subit x2")
        this.weakness = 2
        this.game.addEffect(this,"feu")
        this.waitList.push(this.createWaitMethod(() => {
            this.isEffectApplied = false
            this.weakness = 1
            this.game.removeEffect()
        }, this.FPS*2.5))
    }

    effetGele(){
        console.log("movement speed reduit de 50%,")
        this.movement.speedModificateur = 0.5
        this.game.addEffect(this,"gele")
        this.waitList.push(this.createWaitMethod(() => {
            this.isEffectApplied = false
            this.movement.speedModificateur = 1
            this.game.removeEffect()
        }, this.FPS*2.5))
    }

    //#endregion

    //#endregion


    //#region MOUVEMENT 
    setAction(action, val) {
        if (this.movement.moveSet[action] === undefined) {
            console.log(action,this);
        }
        this.movement.moveSet[action].pressed = val
    }


    //#endregion

    
    //#region ITEMS 
    
    /**
     * Creer un array de 8 element vide
     * @return {Array}
     */
    setItemList() {
        let arr = []
        for (let i = 0; i < 8; i++) {
           arr.push("");
        }
        return arr
    }

    /**
     * Ajoute un objet Item() a la fin de la list d'item
     * @param {Item} item
     */
    addItem(item) {
        if (this._projectile != undefined) {
            for (let i = 0; i < this.itemList.length; i++){
                if (!(this.itemList[i] instanceof Item)) {
                    this.itemList[i] = item
                    this._projectile.addItemUpgrade(item.getUpgrades())
                    this.updatePlayer(item.getUpgrades())
                    this.updateStats()
                    this.showChanges(item.getUpgrades());
                    return true;
                }
            }
            return false
        } else {
            this.waitList.push(this.createWaitMethod(() => {
                this.addItem(item)
            },1))
        }
    }

        /**
    * Eleve l'objet Item()de la list d'item
    * @param {Item} item
    */
    deleteItem(item) {
        this._projectile.deleteItemUpgrade(item.data)
        this.updateStats()
        for (let i = 0; i < this.itemList.length; i++){
            if (this.itemList[i] === item) {
                this.itemList[i] = ""
                return false;
            }
        }
    }
    
    buyItem(item) {
        if (!this.isInventoryFull()) {
            if (this.gold >= this.itemPrice && this.addItem(item)) {
                this.gold -= this.itemPrice
                this.itemPrice *= this.itemPriceModificator
                if (this.isInventoryFull()) {
                    this.game.gameManager.animationInventoryFull(true)
                }
                return true
            } else {
                this.game.gameManager.animationNotEnoughGold()
            }
        }
        return false
    }
    
    updatePlayer(items) {
        items.forEach(item => {
            if (item.type === "gold") {
                this.goldMultiplier *= item.value[0]
            } else if (item.type === "coeur") {
                this.hpMultiplier *= item.value[0]
            }else if (item.type === "deplacement") {
                this.movement.speedModificateur = item.value[0]
            }
        });
    }

    setPosessedItems(itemList) {
        itemList.forEach(item => {
            this.addItem(item)
        });
    }

    isInventoryFull() {
        for (let i = 0; i < this.itemList.length; i++){
            if (!(this.itemList[i] instanceof Item)) {
                return false;
            }
        }
        return true
    }


    //#endregion


    //#region STATS 

    setStats() {
        const data = { hp: 16, gold: 10 }
        if (this.type === "player") {
            this.hp = data.hp
            this.gold = data.gold
        }
    }
    
    setStatesBehaviour() {
        const data = {hp: 10, gold:1}
        if (this.type === "player") {
        } else if (this.type === "ennemie") {
            this.movement.setSpeed(4)
            this.shootDamage = 2
        } else if (this.type === "boss") {
        }
    }
    
    setEnnemieStats() {
        this.hp = this.getRandomIntInclusive(this.ennemieStats[this.dangerLevel].hp[0],this.ennemieStats[this.dangerLevel].hp[1])
        this.gold = this.ennemieStats[this.dangerLevel].gold
        this.coeur = this.ennemieStats[this.dangerLevel].coeur
    }

    setStatList(degat, vitesse, cadence, effet, taille, goldB, heartB) {
        this.statList = [
            {name: "degats", value: degat },
            {name: "vitesse", value: vitesse },
            {name: "cadence", value: this.FPS / cadence +" /s"},
            {name: "effet", value: effet},
            {name: "taille", value: taille},
            {name: "gold Boost", value: goldB},
            {name: "heart Boost", value: heartB},
        ];
    }

    /**
     * Modifie la value de la stats avec le nom donner
     * @param {string} name
     * @param {any} value
     */
    updateStats() {
        if (this.type === "player") {
            this.statList.forEach(stat => {
                if (stat.name === "degats") {
                    if (stat.value > this._projectile.updatedStats.degat) {
                        this.modStats.degats = false
                    }else{
                        this.modStats.effet = true
                    }
                    stat.value = this._projectile.updatedStats.degat
                }
                else if (stat.name === "vitesse") {
                    if (stat.value > this._projectile.updatedStats.speed) {
                        this.modStats.vitesse = false
                    }else{
                        this.modStats.effet = true
                    }
                    stat.value = this._projectile.updatedStats.speed
                }
                else if (stat.name === "cadence") {
                    const cadence = this._projectile.updatedStats.cadence
                    stat.value = parseInt(this.FPS / cadence) + " /s"
                    if (this.shootCadence < this._projectile.updatedStats.cadence) {
                        this.modStats.cadence = false
                    }else{
                        this.modStats.effet = true
                    }
                    this.shootCadence = cadence
                }
                else if (stat.name === "effet") {
                    stat.value = this._projectile.updatedStats.effet
                }
                else if (stat.name === "taille") {
                    if (stat.value > this._projectile.updatedStats.size[0]) {
                        this.modStats.taille = false
                    }else{
                        this.modStats.effet = true
                    }
                    stat.value = this._projectile.updatedStats.size[0]
                }
                else if (stat.name === "gold Boost") {
                    if (stat.value > this.goldMultiplier) {
                        this.modStats.goldBoost = false
                    }else{
                        this.modStats.effet = true
                    }
                    stat.value = this.goldMultiplier    
                }
                else if (stat.name === "heart Boost") {
                    if (stat.value > this.hpMultiplier) {
                        this.modStats.heartBoost = false
                    }else{
                        this.modStats.effet = true
                    }
                    stat.value = this.hpMultiplier
                }
            });
        }
    }

    showChanges(statList) {
        if (this.type === "player") {
            statList.forEach(stat => {
                if (stat.type === "degat") {
                    this.game.gameManager.animationDamageChanged("degats", this.modStats.degats)
                }
                else if (stat.type === "speed") {
                    this.game.gameManager.animationDamageChanged("vitesse", this.modStats.vitesse)
                }
                else if (stat.type === "cadence") {
                    this.game.gameManager.animationDamageChanged("cadence", this.modStats.cadence)
                }
                else if (stat.type === "effet") {
                    this.game.gameManager.animationDamageChanged("effet", this.modStats.effet)
                }
                else if (stat.type === "size") {
                    this.game.gameManager.animationDamageChanged("taille", this.modStats.taille)
                }
                else if (stat.type === "gold") {
                    this.game.gameManager.animationDamageChanged("gold Boost", this.modStats.goldBoost)
                }
                else if (stat.type === "coeur") {
                    this.game.gameManager.animationDamageChanged("heart Boost", this.modStats.heartBoost)
                }
            });
        }
    }

    incrementGold(i) {
        if (i > 0) {
            this.gold += parseInt(i * this.goldMultiplier)
            this.game.gameManager.animationGainGold()
        } else {
            this.gold += i;
        }
    }

    incrementHealth(val) {
        val *= this.weakness
        if (this.type === "player") {
            if (this.hp + val >= this.maxHp) {
                if (this.hp < this.maxHp) {
                    this.hp = this.maxHp
                    this.game.gameManager.animationMaxHp(true)
                }
            } else {
                if (this.hp + val < 0) {
                    this.hp = 0
                } else {
                    if (val > 0) {
                        this.hp += parseInt(val * this.hpMultiplier)
                        this.game.gameManager.animationGainHp()
                    } else {
                        this.game.gameManager.animationMaxHp(false)
                        this.hp += val;
                    }
                }
            }
        } else {
            this.hp += val;
        }
    }

    incrementKey(bool) {
        if (bool) {
            this.keys.posessed += 1;
            this.game.gameManager.animationLootKey()
        }
        
        if (this.keys.posessed >= this.keys.max) {
            this.game.openPortail()
            this.game.gameManager.animationMaxKey(true)
        }
    }

    resetKeys(max) {
        this.keys.posessed = 0
        this.keys.max = max
        this.game.gameManager.animationMaxKey(false)
    }
    
    invincibilityFrame(bool = false) {
        if (this.type === "player") {
            this.isInvincible = true;
            this.gotHit = bool
            let val = this.invicibilityTime
            if (bool) {
                val *= 1.2
            }
            this.waitList.push(this.createWaitMethod(() => {
                this.isInvincible = false;
                this.gotHit = false
            }, val))
        }
    }


    //#endregion


    //#region SCENE ELEMENT 

    setDrawable(spriteSheetData) {
        const rowLabel = spriteSheetData.rowLabel
        const animatedSpriteSize = spriteSheetData.animatedSpriteSize
        const spriteSheetMatrix = spriteSheetData.spriteSheetMatrix
        const gap = spriteSheetData.gap
        const timeOut = spriteSheetData.timeOut
        this.sprite = new Drawable(this.spritesheet_url, this.movement.pos, this.spriteSize,
            this.movement.moveSet, true, animatedSpriteSize, spriteSheetMatrix, rowLabel, gap, timeOut, [true, true, false, true], this.hitBoxSize, this.hitBoxPos, this.game.effectSprite)
    }

    setSprite(sp, d, si) {
        this.spriteSize = si
        this.spritesheet_url = sp
        this.hitBoxSize = d.hitSize
        this.hitBoxPos = [this.spriteSize / 2 - this.hitBoxSize[0] / 2 - 10, this.spriteSize - this.hitBoxSize[1]]

        this.setDrawable(d)
    }

    setHitbox(hitBoxSize, spriteSize) {
        this.spriteSize = spriteSize
        this.hitBoxSize = hitBoxSize
        this.movement.setHitbox(this.hitBoxSize,this.spriteSize)
    }

    getCenterHitBox() {
        const hitBox = this.movement.getHitBox()
        return [this.movement.pos[0], hitBox.top + this.hitBoxSize[1]/2] 
    }

    //#endregion


    //#region UTILS 
	utils() {
		Array.prototype.sample = function () {
			return this[Math.floor(Math.random() * this.length)];
        }

    }

    getDistance(arr2, arr1){
        let y = arr2[0] - arr1[0];
        let x = arr2[1] - arr1[1];
        return Math.sqrt(x * x + y * y);
    }
    
    
	getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min +1)) + min;
	}

    wait() {
        for (let i = 0; i < this.waitList.length; i++) {
            const element = this.waitList[i];
            if (element.func(element.timeOut)) {
                this.waitList.splice(i,1)
            } else {
                element.timeOut += 1
            }
        }
    }
    
    createWaitMethod(func, val) {
        return {
            func: (e) => {
                if (e >= val) {
                    func()
                    return true
                }
        }, timeOut: 0 }
    }
    //#endregion
}