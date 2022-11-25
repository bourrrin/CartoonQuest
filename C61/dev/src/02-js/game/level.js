//======================================================== En-tete ========================================================
// @fileName:       game.js -> projetsynthese\C61\dev\frontend\src\02-js\game\game.js
// @context:        Classe s'occupant des niveau du jeu             
// @author:         Luca Reymann
// @teamMembers:    Chloé Boucher, Amélia Desgagné et Luca Reymann
// @lastUpdated:    2022-05-25
// @sources:        
// 
// @explanation:    
// 
//============================================================================================================================
import Room from "./room";

class Level {
	roomPosIndex = {
		"start":[],
		"exit":[],
		"boutique":[],
		"boss":[],
		"common":[],
	}

	constructor(levelNumber) {
		this.levelNumber = levelNumber;
		this.roomCount = parseInt(Math.log(levelNumber) * 5 + 10)
		this.setEnnemyCountRange()
		this.rooms = this.generateLevel();
	}

	setEnnemyCountRange() {
		const max = parseInt(Math.log(this.levelNumber) * 2 + 2)
		const min = parseInt(max/1.6)
		this.ennemyCountRange = [min, max];
		// this.ennemyCountRange = [0,0];
	}

	getLevelSize() {
		let lvlSize =  this.roomCount/2+ 5
		return parseInt(lvlSize)
	}

	/**
     * Génère une matrice 2D contenant des objets Room
     * @return {Array}
    **/
	generateLevel() {
		const lvlSize = this.getLevelSize()
		let rooms = new Array(lvlSize);
		let possibleRoomIds = new Array();
		this.setKeyCount()
		let keys = this.keys

		for (let i = 0; i < rooms.length; i++) {
			rooms[i] = new Array(lvlSize).fill(0);
			possibleRoomIds.push(i + 1);
		}

		possibleRoomIds.shift();
		const startRoomPos = this.getStartRoomPosition(lvlSize)
		rooms[startRoomPos[0]][startRoomPos[1]] = new Room(0, "start", 0,2);
		this.roomPosIndex["start"].push([rooms[startRoomPos[0]][startRoomPos[1]],[startRoomPos[0],startRoomPos[1]]])

		for (let j = 0; j < this.roomCount - 1; j++) { //Reste à gérer la possibilité que des salles se trouvent en bordure de la matrice...
			let roomPossibilities = new Array();

			for(let k = 1; k < lvlSize - 1; k++) {
				for(let l = 1; l < lvlSize - 1; l++) {
					if (rooms[k][l] == 0 && (rooms[k + 1][l] != 0 || rooms[k][l + 1] != 0 || rooms[k - 1][l] != 0 || rooms[k][l - 1] != 0))
						roomPossibilities.push([k, l]);
				}
			}
			
			let newRoom = roomPossibilities[Math.floor(Math.random() * roomPossibilities.length)];
			if (j == lvlSize - 2) {
				rooms[newRoom[0]][newRoom[1]] = new Room(j, "exit", 0);
			} else if (j == Math.floor(lvlSize / 1.5)) {
				rooms[newRoom[0]][newRoom[1]] = new Room(j, "boutique", 0, 3);
			} else if (j == lvlSize - 3 && this.levelNumber % 5 == 0) {
				rooms[newRoom[0]][newRoom[1]] = new Room(j, "boss", 1);
			} else {
				rooms[newRoom[0]][newRoom[1]] = new Room(j, "common", this.randomIntFromInterval(this.ennemyCountRange[0], this.ennemyCountRange[1]));
				if (keys > 0) {
					rooms[newRoom[0]][newRoom[1]].setKeys(true)
					keys -= 1
				}
				rooms[newRoom[0]][newRoom[1]].setEnnemiesStrenght(this.levelNumber)
			}

			this.roomPosIndex[rooms[newRoom[0]][newRoom[1]].type].push([rooms[newRoom[0]][newRoom[1]], newRoom])
			
		}
		return rooms;
	}

	//#region LEVEL LOGIC 
	hasRoom(pos) {
		return (typeof this.rooms[pos[0]][pos[1]] == 'object')
	}


	//#endregion

	//#region ROOMS DATA 

	setKeyCount() {
		this.keys = parseInt(this.roomCount/2.8)
	}

	getRoomData(pos) {
		return [this.rooms[pos[0]][pos[1]], pos]
	}



	//#endregion
	
	//#region UTILS 
	/**
     * Génère un nombre aléatoire dans un interval donné
     * @return {Int}
    **/
	randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	
	nextRoomPos(x,y) {
		let obj = {
			top: false,
			bottom: false,
			left: false,
			right: false,
		}

		if (this.hasRoom([x, y + 1])) {
			obj.top = true
		}if (this.hasRoom([x, y - 1])) {
			obj.bottom = true
		}if (this.hasRoom([x + 1, y])) {
			obj.left = true
		}if (this.hasRoom([x - 1, y])) {
			obj.right = true
		}

		return obj
	}

	/**
     * Retourne la position de la salle initiale du niveau
     * @return {Array}
    **/
	getStartRoomPosition(lvlSize) {
		let x = Math.floor(lvlSize / 2);
		let y = Math.floor(lvlSize / 2);
		return [x, y];
	}
	
	//#endregion

}

export default Level;
