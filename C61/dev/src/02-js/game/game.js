//======================================================== En-tete ========================================================
// @fileName:       game.js -> projetsynthese\C61\dev\frontend\src\02-js\game\game.js
// @context:        Classe s'occupant du jeu                
// @author:         Luca Reymann
// @teamMembers:    Chloé Boucher, Amélia Desgagné et Luca Reymann
// @lastUpdated:    2022-05-25
// @sources:        
// 
// @explanation:    
// 
//============================================================================================================================

import Level from "./level";
import Player from "./character";
import Ennemy from "./character";
import Item from "./item";
import DAO from "./DAO";

//IMPORT IMAGE
import ADVENTURETIME_PLAYER from "../../04-assets/game/characterSpriteSheet/ADVENTURE_TIME/player.png"
import ADVENTURETIME_ENNEMI_1 from "../../04-assets/game/characterSpriteSheet/ADVENTURE_TIME/ennemie_1.png"
import ADVENTURETIME_ENNEMI_2 from "../../04-assets/game/characterSpriteSheet/ADVENTURE_TIME/ennemie_2.png"
import ADVENTURETIME_ENNEMI_3 from "../../04-assets/game/characterSpriteSheet/ADVENTURE_TIME/ennemie_3.png"
import ADVENTURETIME_ENNEMI_4 from "../../04-assets/game/characterSpriteSheet/ADVENTURE_TIME/ennemie_4.png"
import ADVENTURETIME_ENNEMI_5 from "../../04-assets/game/characterSpriteSheet/ADVENTURE_TIME/ennemie_5.png"
import ADVENTURETIME_MAP from "../../04-assets/game/backgrounds/ADVENTURE_TIME/AdventureTime_Map1.png"
import ADVENTURETIME_MAP_DOOR_TOP from "../../04-assets/game/backgrounds/ADVENTURE_TIME/AdventureTime_TopDoor1.png"
import ADVENTURETIME_MAP_DOOR_BOTTOM from "../../04-assets/game/backgrounds/ADVENTURE_TIME/AdventureTime_BottomDoor1.png"
import ADVENTURETIME_MAP_DOOR_RIGHT from "../../04-assets/game/backgrounds/ADVENTURE_TIME/AdventureTime_RightDoor1.png"
import ADVENTURETIME_MAP_DOOR_LEFT from "../../04-assets/game/backgrounds/ADVENTURE_TIME/AdventureTime_LeftDoor1.png"


import SPONGEBOB_PLAYER from "../../04-assets/game/characterSpriteSheet/SPONGE_BOB/player.png"
import SPONGEBOB_ENNEMI_1 from "../../04-assets/game/characterSpriteSheet/SPONGE_BOB/ennemie_1.png"
import SPONGEBOB_ENNEMI_2 from "../../04-assets/game/characterSpriteSheet/SPONGE_BOB/ennemie_2.png"
import SPONGEBOB_ENNEMI_3 from "../../04-assets/game/characterSpriteSheet/SPONGE_BOB/ennemie_3.png"
import SPONGEBOB_ENNEMI_4 from "../../04-assets/game/characterSpriteSheet/SPONGE_BOB/ennemie_4.png"
import SPONGEBOB_ENNEMI_5 from "../../04-assets/game/characterSpriteSheet/SPONGE_BOB/ennemie_5.png"
import SPONGEBOB_MAP from "../../04-assets/game/backgrounds/SPONGE_BOB/SpongeBob_Map.PNG"
import SPONGEBOB_MAP_DOOR_TOP from "../../04-assets/game/backgrounds/SPONGE_BOB/SpongeBob_TopDoor.PNG"
import SPONGEBOB_MAP_DOOR_BOTTOM from "../../04-assets/game/backgrounds/SPONGE_BOB/SpongeBob_BottomDoor.PNG"
import SPONGEBOB_MAP_DOOR_RIGHT from "../../04-assets/game/backgrounds/SPONGE_BOB/SpongeBob_RightDoor.PNG"
import SPONGEBOB_MAP_DOOR_LEFT from "../../04-assets/game/backgrounds/SPONGE_BOB/SpongeBob_LeftDoor.PNG"


import POWERPUFFGIRLS_PLAYER from "../../04-assets/game/characterSpriteSheet/POWERPUFF_GIRLS/player.png"
import POWERPUFFGIRLS_ENNEMI_1 from "../../04-assets/game/characterSpriteSheet/POWERPUFF_GIRLS/ennemie_1.png"
import POWERPUFFGIRLS_ENNEMI_2 from "../../04-assets/game/characterSpriteSheet/POWERPUFF_GIRLS/ennemie_2.png"
import POWERPUFFGIRLS_ENNEMI_3 from "../../04-assets/game/characterSpriteSheet/POWERPUFF_GIRLS/ennemie_3.png"
import POWERPUFFGIRLS_ENNEMI_4 from "../../04-assets/game/characterSpriteSheet/POWERPUFF_GIRLS/ennemie_4.png"
import POWERPUFFGIRLS_ENNEMI_5 from "../../04-assets/game/characterSpriteSheet/POWERPUFF_GIRLS/ennemie_5.png"
import POWERPUFFGIRLS_MAP from "../../04-assets/game/backgrounds/POWERPUFF_GIRLS/PowerPuffGirls_Map.PNG"
import POWERPUFFGIRLS_MAP_DOOR_TOP from "../../04-assets/game/backgrounds/POWERPUFF_GIRLS/PowerPuffGirls_TopDoor.PNG"
import POWERPUFFGIRLS_MAP_DOOR_BOTTOM from "../../04-assets/game/backgrounds/POWERPUFF_GIRLS/PowerPuffGirls_BottomDoor.PNG"
import POWERPUFFGIRLS_MAP_DOOR_RIGHT from "../../04-assets/game/backgrounds/POWERPUFF_GIRLS/PowerPuffGirls_RightDoor.PNG"
import POWERPUFFGIRLS_MAP_DOOR_LEFT from "../../04-assets/game/backgrounds/POWERPUFF_GIRLS/PowerPuffGirls_LeftDoor.PNG"

import TUTORIAL_BLACK from "../../04-assets/game/backgrounds/tuto.png"

import EXIT_OFF from "../../04-assets/game/backgrounds/exit_fermer.png"
import EXIT_ON from "../../04-assets/game/backgrounds/exit.png"
import ITEM_SPRITESHEET from "../../04-assets/game/items/item_tiledImage.png"

import EFFECT_PEUR from "../../04-assets/game/general/Buff_Effect_Peur.png"
import EFFECT_FEU from "../../04-assets/game/general/Buff_Effect_Feu.png"
import EFFECT_PARALYSIE from "../../04-assets/game/general/Buff_Effect_Paralysie.png"
import EFFECT_GELE from "../../04-assets/game/general/Buff_Effect_Gele.png"
import EFFECT_CONFUSION from "../../04-assets/game/general/Buff_Effect_Confusion.png"
import Drawable from "./drawable";
import { set } from "mobx";


class Game {
	/** NON TERMINÉ
	 * Classe gérant la partie courante
	**/

	interactList =  new Array()
	ennemies = new Array()
	sceneElements = new Array()
	waitList = new Array()
	
	pauseDrawingScene = false
	canUseControls = true
	themeList =["spongeBob","adventureTime","powerPuffGirls"]

	levelNumber = 0
	doorSprite = {
		top:null ,
		bottom:null ,
		left:null ,
		right:null ,
	}
	sceneSize = [window.innerWidth * 0.70, window.innerHeight * 0.85];
	_sceneLimit = {
		top: this.sceneSize[1] * 0.1,
		left: this.sceneSize[0] * 0.11,
		bottom: this.sceneSize[1] * 0.88,
		right: this.sceneSize[0] * 0.89,
	};
	
	nbrItemPerDangerLevel = {
		normal: 3,
		fort: 5,
		dangeureux: 8,
	}
	
	effect = {		
		peur: {
			name: EFFECT_PEUR,
			rowLabel: ["idle"],
			animatedSpriteSize: [100, 100],
			spriteSheetMatrix: [30],
			gap: [0, 0],
			timeOut: 5,
			size: [300, 300],
			loop: [true]
		},
		feu: {
			name: EFFECT_FEU,
			rowLabel: ["idle"],
			animatedSpriteSize: [100, 100],
			spriteSheetMatrix: [10],
			gap: [0, 0],
			timeOut: 3,
			size: [300, 300],
			loop: [true]
		},
		confusion: {
			name: EFFECT_CONFUSION,
			rowLabel: ["idle"],
			animatedSpriteSize: [100, 100],
			spriteSheetMatrix: [10],
			gap: [0, 0],
			timeOut: 5,
			size: [300, 300],
			loop: [true]
		},
		paralysie: {
			name: EFFECT_PARALYSIE,
			rowLabel: ["idle"],
			animatedSpriteSize: [100, 100],
			spriteSheetMatrix: [25],
			gap: [0, 0],
			timeOut: 1,
			size: [300, 300],
			loop: [true]
		},
		gele: {
			name: EFFECT_GELE,
			rowLabel: ["idle"],
			animatedSpriteSize: [100, 100],
			spriteSheetMatrix: [15],
			gap: [0, 0],
			timeOut: 5,
			size: [300, 300],
			loop: [false]
		}
	}
	sceneLimitList = {
		spongeBob: {
			top: this.sceneSize[1] * 0.11,
			left: this.sceneSize[0] * 0.125,
			bottom: this.sceneSize[1] * 0.88,
			right: this.sceneSize[0] * 0.875,
		},
		adventureTime: {
			top: this.sceneSize[1] * 0.12,
			left: this.sceneSize[0] * 0.11,
			bottom: this.sceneSize[1] * 0.88,
			right: this.sceneSize[0] * 0.87,
		},
		powerPuffGirls: {
			top: this.sceneSize[1] * 0.14,
			left: this.sceneSize[0] * 0.11,
			bottom: this.sceneSize[1] * 0.87,
			right: this.sceneSize[0] * 0.85,
		}
	};

	constructor(gameManager, isOldGame) {
		this.gameManager = gameManager
		this.utils()
		this.setControls()
		this.createItemList()
		
		const defaultData ={
			rowLabel: ["idle", "walk", "death"],
			animatedSpriteSize: [100, 100],
			spriteSheetMatrix: [7, 7, 6],
			gap: [0, 0],
			timeOut: 5,
			size: [100,100],
			hitSize: [65,80],
			sprite: SPONGEBOB_PLAYER,
		}
		this.player = new Player(this._sceneLimit, ITEM_SPRITESHEET, [this.getSceneCenter()[0], this.getSceneCenter()[1] - 100], defaultData.sprite, defaultData , "player", defaultData.size, this);
		this.theme = this.themeList.sample()

		if (isOldGame) {
			const lastGame = DAO.getLastGame()
			this.player.gold = lastGame.gold
			this.player.hp = lastGame.hp
			this.levelNumber = lastGame.levelNumber
			lastGame.items.forEach(item => {
				this.player.addItem(item)
			});
			this.theme = lastGame.theme
			this.isOldGame = true
		} else {
			this.isNewGame = true
		}
		this.createNewWorld()
		let transitionScreen = document.querySelector(".room_cover");
		transitionScreen.style.animationDuration = 1+"ms"
		transitionScreen.classList.add("fade-in")
	}

	//#region SCENE ELEMENTS 

	createNewWorld() {
		this._sceneLimit = this.sceneLimitList[this.theme]
		this.getSpriteForTheme(this.theme)
		this.player.movement._sceneLimit = this._sceneLimit
		this.player.setSprite(this.playerSprite, this.playerSpriteSheetData, this.playerSize)
		this.player.setHitbox(this.playerSpriteSheetData.hitSize, this.playerSize)

		this.createNewRoom()
	}

	createNewRoom() {
		const timeout = 500
		this.pauseDrawingScene = true
		this.displayTransitionBetweenLevel(timeout)
		setTimeout(() => {
			this.pauseDrawingScene = false
			this.gameManager.drawMap(this.level.rooms)
			this.gameManager.initScene()
		}, timeout);
		
		this.changeLevelNumber()
		this.loadNewLevel();
		
		if (this.gameManager.game) {
			this.gameManager.drawMap(this.level.rooms)
			this.gameManager.animatitionNewLevel()
		}

		this.player.resetKeys(this.level.keys)
		this.currentRoom = this.level.getRoomData(this.level.roomPosIndex["start"][0][1])
		this.player.movement.setPositionToInitial()
		
		this.createRoomsScene()
		this.initRoomEnnemie()
		this.startRoomEnnemie()
	}

	loadNewLevel() {
		this.level = new Level(this.levelNumber);
	}

	createRoomsScene() {
		this.roomSceneElements = new Object()
		Object.values(this.level.roomPosIndex).forEach(rooms => {
			rooms.forEach(r => {
				const room = r[0];
				const pos = r[1]
				this.roomSceneElements[pos] = new Object()
				this.roomSceneElements[pos].doors = this.getDoors(this.bobDoorsSprite, pos)
				this.roomSceneElements[pos].background = [{ sprite: this.backgroundImageSource, pos: this.getSceneCenter(), size: this.sceneSize }]
				this.roomSceneElements[pos].interactable = this.getInteractableList(room)
				this.roomSceneElements[pos].character = this.getChracterList(room)
				this.roomSceneElements[pos].projectile = new Array()
				this.roomSceneElements[pos].effect = new Array()
				if (room.type === "exit") {
					this.roomSceneElements[pos].interactable.push(this.getExit())
				}
				else if (room.type === "start") {
					this.roomSceneElements[pos].background.push({ sprite: TUTORIAL_BLACK, pos: this.getSceneCenter(), size: this.sceneSize })
				}
			});
		});
	}
	
	getLevelEnnemieList() {
		const levelRooms = this.roomSceneElements
		let arr = new Array()
		Object.values(levelRooms).forEach(room => {
			for (let i = 1; i < room.character.length; i++) {
				arr.push(room.character[i])
			}
		});
		return arr
	}

	getEnnemiesUpdatedStats(ennemieList) {
		let arr = new Array()
		ennemieList.forEach(ennemie => {
			arr.push(ennemie._projectile.updatedStats)
		});
		return arr
	}

	changeTheme() {
		this.theme = this.themeList.sample()
	}

	changeLevelNumber() {
		if (this.isOldGame) {
			this.isOldGame = false
		} else {
			this.levelNumber += 1
		}
	}

	getCurrentLevelEnnemieList() {
		let arr = new Array()
		const levelRooms = this.roomSceneElements
		Object.values(levelRooms).forEach(room => {
			arr.push(this.getCurrentRoomEnnemieList(room))
		});

		return arr
	}

	initRoomEnnemie() {
		const currentLevelEnnemieList = this.getCurrentLevelEnnemieList()
		currentLevelEnnemieList.forEach(ennemieList => {
			if (ennemieList.length > 0) {
				ennemieList.forEach(ennemie => {
					ennemie.setEnnemieState()            
				});
			}
		});
	}

	startRoomEnnemie() {
		const ennemieList = this.getCurrentRoomEnnemieList()
		ennemieList.forEach(ennemie => {
			ennemie.startState()
		});
	}

	pauseRoomEnnemie() {
		const ennemieList = this.getCurrentRoomEnnemieList()
		ennemieList.forEach(ennemie => {
			ennemie.pauseState()
		});
	}

	pauseScene(timeout) {
		this.pauseDrawingScene = true
		this.waitList.push(this.createWaitMethod(() => {
			this.pauseDrawingScene = false
		}, timeout))		
	}
	
	addSceneElement(key, newObj) {
		this.roomSceneElements[this.currentRoom[1]][key].push(newObj)
		this.gameManager.updateScene()
	}

	getCurrentRoomEnnemieList(room = this.getCurrentRoomData()) {
		const characterList = room.character
		let arr = new Array()
		for (let i = 1; i < characterList.length; i++) {
			arr.push(characterList[i])
		}
		return arr
	}

	getCurrentRoomCollidableElements() {
		const data = this.getCurrentRoomData()
		//, "projctil","interactable"
		const wantedLayers = ["character","projectile"]
		let arr = new Array()
		let pos  = null;
		let size = null;
		let funcs = null;
		let name = null;
		let team = null;
		let type = null;
		let obj = null;
		let getHitBox = null;

		Object.keys(data).forEach(key => {
			if (wantedLayers.includes(key)) {
				data[key].forEach(element => {
					type = key
					if (key === "character") {
						name = element.type + "_" + Math.random()
						pos = element.movement.pos
						size = element.hitBoxSize
						getHitBox = () => {
							return element.movement.getHitBox()
						}
						funcs = {
							character: () => {element.movement.isCollinding()},
							projectile: (p) => {this.characterGotShoot(element, p)},
							item: () => {},
							wall: () => {}
						}

					} else if (key === "projectile") {
						let collidableSources = {
							character: () => {element.isDead = true},
							wall: () => {element.isDead = true}
						}
						name = element.name
						pos = element.drawable.pos
						size = element.drawable.size
						funcs = collidableSources
						obj = element.obj;
						// console.log(element);
						getHitBox = () => {
							return element.drawable.getHitbox()
						}
					}

					if (name.includes("player")) {
						team = "player"
					} else {
						team = "ennemie"
					}
					
					arr.push({name:name, type:type, team: team, pos: pos, getHitBox: getHitBox, size: size, funcs : funcs , obj : obj})
				});
			}
		});

		const walls = ["top", "left", "bottom", "right"]
		walls.forEach(side => {
			arr.push(this.getInteractableWall(side))
		});
		
		return arr
	}
	
	characterGotShoot(character, p) {
		if (character.gotShoot(p)) {
			character.hasDied()
			if (character.type === "player") {
				this.gameOver(character)
			} else {
				if (this.player.lastHit !== character.id) {
					if (this.player.canGainHP) {
						this.player.lastHit = character.id
						this.player.incrementGold(character.gold.sample())
						this.player.incrementHealth(character.coeur.sample())
						if (character.hasKey) {
							this.player.incrementKey(character.hasKey, character)
							character.hasKey = false
						}
					}
					
					setTimeout(() => {
						this.removeEffect()
						character.isDead = true
					}, 1000);
				}
			}
		}
		
	}

	gameOver(character) {
		console.warn("GAME OVER")

		setTimeout(() => {
			let transitionScreen = document.querySelector(".room_cover");
			transitionScreen.classList.add("gameOver");
			document.querySelector("#gameOver_button").style.opacity = 1;
			character.isDead = true
		}, 2000);
		//Supprimer de la bd la game courante
	}

	getInteractableWall(side) {
		const epaisseur = 18
		const walls = {
			top:{
				pos : [this.getSceneCenter()[0], this._sceneLimit.top],
				size :[this._sceneLimit.right - this._sceneLimit.left, epaisseur],
			},
			bottom:{
				pos : [this.getSceneCenter()[0], this._sceneLimit.bottom],
				size :[this._sceneLimit.right - this._sceneLimit.left, epaisseur],
			},
			left: {
				pos : [this._sceneLimit.left, this.getSceneCenter()[1]],
				size :[epaisseur, this._sceneLimit.bottom - this._sceneLimit.top],
			},
			right:{
				pos : [this._sceneLimit.right, this.getSceneCenter()[1]],
				size :[epaisseur, this._sceneLimit.bottom - this._sceneLimit.top],
			},
		}
		
		let pos = walls[side].pos
		let size = walls[side].size
		let name = side+"_wall"
		let type = "wall";
		let team = null
		let funcs = null
		let getHitBox = () => {
			return this.getBoundingBox(pos,size)
		}

		return {name:name, type:type, team: team, getHitBox: getHitBox, pos: pos, size: size, funcs : funcs}
	}

	getCurrentRoomData() {
		return this.roomSceneElements[this.currentRoom[1]]
	}

	getDoors(doorSprite, pos=this.currentRoom[1]) {
		let obj = this.level.nextRoomPos(pos[0], pos[1])
		let door = new Object()

		door.top = {isHere:obj.top, sprite:doorSprite.top}
		door.bottom = {isHere:obj.bottom, sprite:doorSprite.bottom}
		door.left = {isHere:obj.left, sprite:doorSprite.left}
		door.right = { isHere: obj.right, sprite: doorSprite.right }

		return door
	}

	removeInteractableObject(object) {
		const itemList = this.roomSceneElements[this.currentRoom[1]].interactable
		Object.values(itemList).forEach(element => {
			if (element.data === object){
				itemList.splice(itemList.indexOf(element), 1)
			}
		});
	}

	removeSceneElement(list, el) {
		const index = list.indexOf(el)
		
		delete list[index]
		list.splice(index, 1)
		this.gameManager.updateScene()
	}
	
	displayTransitionBetweenRoom(timeout) {
		const t = timeout *0.6
		const hold = timeout *0.4
		let transitionScreen = document.querySelector(".room_cover");
		transitionScreen.style.animationDuration = t+"ms"
		transitionScreen.classList.add("fade-in")
		
		setTimeout(() => {
			setTimeout(() => {
				transitionScreen.classList.remove("fade-in")
				transitionScreen.classList.add("fade")
				setTimeout(() => {
					transitionScreen.classList.remove("fade")
					this.gameManager.updateScene()

				},t)
			}, hold)
		},t)
	}

	displayTransitionBetweenLevel(timeout) {
		const t = timeout *0.5
		const hold = timeout 
		let transitionScreen = document.querySelector(".room_cover");
		transitionScreen.style.animationDuration = t+"ms"
		transitionScreen.classList.add("fade-in")
		
		setTimeout(() => {
			setTimeout(() => {
				transitionScreen.classList.remove("fade-in")
				transitionScreen.classList.add("fade")
				setTimeout(() => {
					transitionScreen.classList.remove("fade")
					this.gameManager.updateScene()

				},t)
			}, hold)
		},t)
	}

	//#endregion
	
	
	//#region GAME ELEMENT 

	removeEffect() {
		this.getCurrentRoomData().effect = new Array()
		this.gameManager.initScene()
	}

	addEffect(character, effectName) {
		const effect = this.effect[effectName]
		if (effect) {
			let effectList = this.getCurrentRoomData().effect
			effectList.push({
				drawable: new Drawable(effect.name, character.sprite.pos, character.sprite.size, null,
					true, effect.animatedSpriteSize, effect.spriteSheetMatrix, effect.rowLabel, effect.gap,effect.timeOut,effect.loop),
					name: effectName
				})
			this.gameManager.initScene()
		} else {
			console.warn("INVALID KEY '"+ effectName+"' FOR EFFECT LIST")
		}
	}

	createItemList() {
		const dataItem = DAO.getAllItems()
		this.itemList = new Array()
		dataItem.forEach(item => {
			this.itemList.push(new Item(item[0], item[1], ITEM_SPRITESHEET, item[2], item[3]),)
		});
	}

	openPortail() {
		const levelRooms = this.roomSceneElements
		Object.values(levelRooms).forEach(room => {
			if (room.interactable[0] !== undefined) {
				if (room.interactable[0].name === "exit") {
					const portail = room.interactable[0]
					portail.data.sprite = EXIT_ON
					this.gameManager.initScene()
				}
			}
		});
    }

	getExit() {
		const sprite = { sprite: EXIT_OFF }
		const size = [150, 200]
		const range = [50, 50]
		const func = () => { return this.exitLevel()}
		let pos = this.getSceneCenter()
		
		return ({ range: this.getBoundingBox(pos, range), data:sprite , func:func, name:"exit", pos:pos, size:size})
	}

	getInteractableList(room = this.currentRoom[0]) {
		let arr = new Array()
		for (let i = 0; i < room.itemCount; i++) {
			const item = this.itemList.sample()
			const size = [100, 100]
			const range = [50, 50]
			const func = () => {return this.player.buyItem(item)}
			let pos = this.centerItemPos(i, room.itemCount)
			if (room.type === "start") {
				pos = [pos[0], pos[1]+100]
			}
			
			arr.push({range:this.getBoundingBox(pos,range), data:item, func:func, name:"item_" + i, pos:pos, size:size})
		}
		return arr
	}
	
	getChracterList(room) {
		let arr = [this.player]
		let hasKey = room.hasKey
		let ennemiDangerLevel = room.ennemyDangerLevel
		
		Object.keys(ennemiDangerLevel).forEach(key => {
			for (let i = 0; i < ennemiDangerLevel[key]; i++) {
				arr.push(this.createEnnemie(hasKey, key))
				hasKey = false
			}
		});
		return arr
	}

	createEnnemie(key, dangerLevel) {
		let ennemi = this.ennemySpriteSheet.sample()
		const size = [150, 150]

		let itemList = new Array()
		for (let i = 0; i < this.nbrItemPerDangerLevel[dangerLevel]; i++) {
			const item = this.getItemByName(ennemi.items[i])
			if (item) {
				itemList.push(item)
			}
		}

		ennemi = new Ennemy(this._sceneLimit, ITEM_SPRITESHEET, this.getRandomPos(), ennemi.sprite, ennemi.data, "ennemie", size,this, itemList, key, dangerLevel, this.player.movement.pos, ennemi.states)
		ennemi.setEnnemieStats()

		return ennemi
	}

	getItemByName(name) {
		let returnItem = undefined
		Object.values(this.itemList).forEach(item => {
			if (item.name === name) {
				returnItem = item
			}
		});
		return returnItem
	}

	//#endregion

	
	//#region GAME LOGIC 

	changeRoom(side) {
		let roomPos = JSON.parse(JSON.stringify(this.currentRoom[1]))
		switch (side) {
			case "left": roomPos[0] -= 1; break;
			case "top": roomPos[1] += 1; break;
			case "right": roomPos[0] += 1; break;
			case "bottom": roomPos[1] -= 1; break;
			default: break;
		}

		const timeout = 40
		if (this.level.hasRoom(roomPos)) {
			this.displayTransitionBetweenRoom(timeout*17)
			this.pauseScene(timeout)
			this.canUseControls = true
			// this.player.resetAllMovement()
			
			this.waitList.push(this.createWaitMethod(() => {
				this.canUseControls = true
				this.pauseRoomEnnemie()
				this.getCurrentRoomData().effect = new Array()
				this.getCurrentRoomData().projectile = new Array()

				this.currentRoom = this.level.getRoomData(roomPos)
				this.startRoomEnnemie()
				this.gameManager.updateScene()
				this.player.invincibilityFrame()
					
				const spacing = 50
				switch (side) {
					case "left": this.player.movement.pos[0] = this._sceneLimit.right - this.player.hitBoxSize[0] - spacing; break;
					case "top": this.player.movement.pos[1] = this._sceneLimit.bottom - this.player.hitBoxSize[1] - spacing; break;
					case "right": this.player.movement.pos[0] = this._sceneLimit.left + this.player.hitBoxSize[0] + spacing; break;
					case "bottom": this.player.movement.pos[1] = this._sceneLimit.top + this.player.hitBoxSize[1] + spacing; break;
					default: break;
				}
			}, timeout));
		}
	}

	exitLevel() {
		const posessed = this.player.keys.posessed
		const max = this.player.keys.max
		if (posessed >= max) {
			if (this.levelNumber % 2 === 0) {
				this.canUseControls = false
				this.player.resetAllMovement()
				setTimeout(() => {
					this.canUseControls = true
				}, 1000);
				this.changeTheme()
				this.createNewWorld()
			} else {
				this.createNewRoom()
			}
			return true
		}
		return false
	}

	setControls() {
		this.controlKeyMap = {
			shootRight : [39],
			shootLeft : [37],
			shootUp : [38],
			shootDown : [40],
			right : [68],
			left : [65],
			up : [87],
			down : [83],
			interact : [32], //spacebar,
			pause : [27] //esc,
		}
	}

	controlsOnkeyDown(key) {
		if (this.canUseControls) {
			
			if (this.controlKeyMap.right.includes(key)) {
				this.player.setAction("right",true);
			} else if (this.controlKeyMap.left.includes(key)) {
				this.player.setAction("left",true);
			} else if (this.controlKeyMap.up.includes(key)) {
				this.player.setAction("up",true);
			} else if (this.controlKeyMap.down.includes(key)) {
				this.player.setAction("down",true);
			}else if (this.controlKeyMap.interact.includes(key)) {
				this.interact();
			}else if (this.controlKeyMap.pause.includes(key)) {
				this.pause();
			}
			
			if (this.controlKeyMap.shootRight.includes(key)) {
				this.player.shootActionSet["right"].pressed = true
			}else if (this.controlKeyMap.shootLeft.includes(key)) {
				this.player.shootActionSet["left"].pressed = true
			}else if (this.controlKeyMap.shootUp.includes(key)) {
				this.player.shootActionSet["up"].pressed = true
			}else if (this.controlKeyMap.shootDown.includes(key)) {
				this.player.shootActionSet["down"].pressed = true
			}
		}
	}

	controlsOnkeyUp(key) {
		if (this.canUseControls) {
			
			if (this.controlKeyMap.right.includes(key)) {
				this.player.setAction("right",false);
			} else if (this.controlKeyMap.left.includes(key)) {
				this.player.setAction("left",false);
			} else if (this.controlKeyMap.up.includes(key)) {
				this.player.setAction("up",false);
			} else if (this.controlKeyMap.down.includes(key)) {
				this.player.setAction("down",false);
			}
			
			if (this.controlKeyMap.shootRight.includes(key)) {
				this.player.shootActionSet["right"].pressed = false
			}else if (this.controlKeyMap.shootLeft.includes(key)) {
				this.player.shootActionSet["left"].pressed = false
			}else if (this.controlKeyMap.shootUp.includes(key)) {
				this.player.shootActionSet["up"].pressed = false
			}else if (this.controlKeyMap.shootDown.includes(key)) {
				this.player.shootActionSet["down"].pressed = false
			}
		}
	}

	isGamePaused = false
	pause() {
		if (this.isGamePaused) {
			this.isGamePaused = false
		} else {
			this.isGamePaused = true
		}
		this.gameManager.animationPauseMenu(this.isGamePaused)
	}

    interact() {
        const DISTANCE_RANGE = 200;
        let leftDoorPos = [this._sceneLimit.left + DISTANCE_RANGE, this._sceneLimit.bottom / 2];
        let topDoorPos = [this._sceneLimit.right / 2, this._sceneLimit.top + DISTANCE_RANGE];
        let rightDoorPos = [this._sceneLimit.right - DISTANCE_RANGE, this._sceneLimit.bottom / 2];
        let bottomDoorPos = [this._sceneLimit.right / 2, this._sceneLimit.bottom - DISTANCE_RANGE];
        let direction = null
        
        if (this.player.movement.pos[0] <= leftDoorPos[0] && Math.abs(leftDoorPos[1] - this.player.movement.pos[1]) <= DISTANCE_RANGE) {
            direction = 'left';
        } else if (Math.abs(topDoorPos[0] - this.player.movement.pos[0]) <= DISTANCE_RANGE && this.player.movement.pos[1] <= topDoorPos[1]) {
            direction = 'top';
        } else if (this.player.movement.pos[0] >= rightDoorPos[0] && Math.abs(rightDoorPos[1] - this.player.movement.pos[1]) <= DISTANCE_RANGE) {
            direction = 'right';
        } else if (Math.abs(bottomDoorPos[0] - this.player.movement.pos[0]) <= DISTANCE_RANGE && this.player.movement.pos[1] >= bottomDoorPos[1]) {
            direction = 'bottom';
        }

        if (direction != null) {
			this.changeRoom(direction)
        }
	}

	addProjectilToScene(name, drawable, p) {
		const objToPush = {name:name+"Projectile_" + Math.random(100), drawable:drawable, obj:p, isDead: false}
		this.addSceneElement("projectile", objToPush)
	}

	isColliding(box1, box2) {
		return (this.isEdgeColliding(box1, box2) || this.isEdgeColliding(box2, box1))
	}

	isEdgeColliding(box1, box2) {
		let l = (box2.left <= box1.left && box1.left<= box2.right )
		let r = (box2.left <= box1.right && box1.right<= box2.right )
		let t = (box2.top <= box1.top && box1.top<= box2.bottom )
		let b = (box2.top <= box1.bottom && box1.bottom <= box2.bottom)

		let c_l_t = l && t

		let c_l_b = l && b
		let c_r_t = r && t
		let c_r_b = r && b

		return (
			c_l_t || c_l_b || c_r_t || c_r_b
		)
	}

	interactObject() {
		const playerMatrix = this.player.movement.getBoundingBox()
		const itemList = this.roomSceneElements[this.currentRoom[1]].interactable
		Object.values(itemList).forEach(element => {
			const objectMatrix = element.range
			if (this.isColliding(playerMatrix, objectMatrix)) {
				if (element.func()) {
					this.removeSceneElement(itemList, element)
				}
			} 
		});
	}

	tick() {
		if (!this.isGamePaused) {
			if (this.roomSceneElements) {
				this.characterTick()
				this.projectilTick()
				this.interactObject()
				this.checkCollision()
				this.checkIsDead()
			}
			this.wait()
		}
	}

	projectilTick() {
		const projectilList = this.getCurrentRoomData().projectile
		projectilList.forEach(p => {
			p.obj.movement.tick()
		});
	}

	characterTick() {
		const currentCharacters = this.getCurrentRoomData().character
		Object.values(currentCharacters).forEach(character => {
			character.tick()
		});
	}

	hasCollided(funcs, source, obj) {
		if (funcs !== null) {
			if (Object.keys(funcs).includes(source)) {
				funcs[source](obj)
			} else {
				console.warn("KEY "+source+" NOT FOUND ON :"+ obj,)
			}
		}
    }

	checkCollision() {
		const collidableElementsList = this.getCurrentRoomCollidableElements()
		collidableElementsList.forEach(collidableElement1 => {
			collidableElementsList.forEach(collidableElement2 => {
				if (collidableElement1.team !== collidableElement2.team) {
					const obj1 = collidableElement1.getHitBox()
					const obj2 = collidableElement2.getHitBox()
					if (this.isColliding(obj1, obj2)) {
						this.hasCollided(collidableElement1.funcs, collidableElement2.type, collidableElement2.obj)
						this.hasCollided(collidableElement2.funcs, collidableElement1.type, collidableElement1.obj)
					}
				} 
			});
		});

	}

	checkIsDead() {
		const currentElements = this.getCurrentRoomData()
		const layerToCheck = ["projectile", "character"]

		Object.keys(currentElements).forEach(key => {
			if (layerToCheck.includes(key)) {
				const projectilList = currentElements[key]
				Object.values(projectilList).forEach(el => {
					if (el.isDead) {
						this.removeSceneElement(projectilList,el )
					}
				});
			}
		});
	}
					
	//#endregion


	//#region UTILS 
	
	utils() {
		Array.prototype.sample = function () {
			return this[Math.floor(Math.random() * this.length)];
		}
	}

	getBoundingBox(pos, range=0) {
        return {
            top:    pos[1] - range[1]/2,
            left:   pos[0] - range[0]/2,
            right:  pos[0] + range[0]/2,
            bottom: pos[1] + range[1]/2,
        }
	}

	centerItemPos(i, nbr) {
		let pos = this.getSceneCenter()
		if (nbr === 3) {
			if (i === 0) {
				pos = [pos[0]-200,pos[1]]
			} else if (i === 2) {
				pos = [pos[0]+200,pos[1]]
			}
		} else if (nbr === 2) {
			if (i === 0) {
				pos = [pos[0]-100,pos[1]]
			} else if (i === 1) {
				pos = [pos[0]+100,pos[1]]
			}
		}
		return pos
	}
	
	getRandomPos() {
		let margin = 80
		let x = this.getRandomIntInclusive(this._sceneLimit.left+margin, this._sceneLimit.right-margin)
		let y = this.getRandomIntInclusive(this._sceneLimit.top+margin, this._sceneLimit.bottom-margin)
		let arr = [x,y];
		return arr
	}

	getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min +1)) + min;
	}

	getSceneCenter() {
		return [this.sceneSize[0]/2,this.sceneSize[1]/2]
	}

	wait() {
        for (let i = 0; i < this.waitList.length; i++) {
            const element = this.waitList[i];
            if (element.func(element.timeOut)) {
				this.waitList.splice(i, 1)
				i--
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


	//#region DAO 

	getSpriteForTheme(monde) {
		const ennemieSpriteData = {
			adventureTime: [
				ADVENTURETIME_ENNEMI_1,
				ADVENTURETIME_ENNEMI_2,
				ADVENTURETIME_ENNEMI_3,
				ADVENTURETIME_ENNEMI_4,
				ADVENTURETIME_ENNEMI_5
			],
			spongeBob: [
				SPONGEBOB_ENNEMI_1,
				SPONGEBOB_ENNEMI_2,
				SPONGEBOB_ENNEMI_3,
				SPONGEBOB_ENNEMI_4,
				SPONGEBOB_ENNEMI_5
			],
			powerPuffGirls: [
				POWERPUFFGIRLS_ENNEMI_1,
				POWERPUFFGIRLS_ENNEMI_2,
				POWERPUFFGIRLS_ENNEMI_3,
				POWERPUFFGIRLS_ENNEMI_4,
				POWERPUFFGIRLS_ENNEMI_5
			],
		}

		const playerSprite = {
			adventureTime: ADVENTURETIME_PLAYER,
			spongeBob: SPONGEBOB_PLAYER,
			powerPuffGirls: POWERPUFFGIRLS_PLAYER,
		}

		const backgroundSprite = {
			spongeBob: {
				background:SPONGEBOB_MAP,
				top: SPONGEBOB_MAP_DOOR_TOP,
				bottom: SPONGEBOB_MAP_DOOR_BOTTOM,
				left: SPONGEBOB_MAP_DOOR_RIGHT,
				right: SPONGEBOB_MAP_DOOR_LEFT,
			},		
			adventureTime: {
				background:ADVENTURETIME_MAP,
				top: ADVENTURETIME_MAP_DOOR_TOP,
				bottom: ADVENTURETIME_MAP_DOOR_BOTTOM,
				left: ADVENTURETIME_MAP_DOOR_RIGHT,
				right: ADVENTURETIME_MAP_DOOR_LEFT,
			}	,	
			powerPuffGirls: {
				background:POWERPUFFGIRLS_MAP,
				top: POWERPUFFGIRLS_MAP_DOOR_TOP,
				bottom: POWERPUFFGIRLS_MAP_DOOR_BOTTOM,
				left: POWERPUFFGIRLS_MAP_DOOR_RIGHT,
				right: POWERPUFFGIRLS_MAP_DOOR_LEFT,
			}
		}

		this.bobDoorsSprite = backgroundSprite[monde]
		this.backgroundImageSource = backgroundSprite[monde].background
		this.playerSprite = playerSprite[monde]
		this.playerSpriteSheetData = DAO.getPlayerByTheme(monde)
		this.playerSize = this.playerSpriteSheetData.size

		const ennemySpriteSheetData = DAO.getEnnemiesByTheme(monde)
		const ennemieSprite = ennemieSpriteData[monde]
		this.ennemySpriteSheet = new Array()

		for (let i = 0; i < ennemieSprite.length; i++) {
			this.ennemySpriteSheet.push({sprite:ennemieSprite[i], data:ennemySpriteSheetData[i], states:ennemySpriteSheetData[i].states, items:ennemySpriteSheetData[i].items})
		}
	}


	//#endregion
}

export default Game;
