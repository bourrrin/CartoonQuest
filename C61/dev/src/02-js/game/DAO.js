//======================================================== En-tete ========================================================
// @fileName:       DAO.js -> projetsynthese\C61\dev\frontend\src\02-js\game\DAO.js
// @context:        Class qui simule les donnees de la base de donnee et connect a la bd                   
// @author:         Luca Reymann
// @teamMembers:    Chloé Boucher, Amélia Desgagné et Luca Reymann
// @lastUpdated:    2022-05-25
// @sources:        
// 
// @explanation:    
// 
//============================================================================================================================
import { userId } from "../../01-pages/login";
import Login from "../../01-pages/login";
import Item from "./item";
import ITEM_SPRITESHEET from "../../04-assets/game/items/item_tiledImage.png"


//PAS TERMINÉE
class DAO {

	constructor() {
		let url = "mongodb://localhost:3000/db";
		//this.dataBase = db.db("db");
		//this.createDataBase(url);

	}

	insertIntoCollection(collection, object, find = {}) {
		try {
			this.db.collection(collection).find(find).insertOne(object);
		} catch (error) {
			console.log(error);
		}
	}

	/*
	* Récupère toutes les informations de la partie déjà commencée par le joueur
	*/
	getCurrentGame() {
		//Récupérer dans la bd...
		let game = {
			id: 1,
			level: 1,
			gold: 10, 
			hp: 50,
			items: [this.itemMocking[0], this.itemMocking[1]],
			theme: this.themeMocking.adventureTime
		}
		return game;
	}

	replaceIntoCollection(collection, object, find = {}) {
		try {
			this.db.collection(collection).find(find).replaceOne(object);
		} catch (error) {
			console.log(error);
		}
	}

	getNewTheme() {
		return this.themeMocking[Math.floor(Math.random() * this.themeMocking.length)]
	}

	getAllItems() {
		//TEMPLATE
		//              [
		// Name         	"", 
		// Description		[], 
		// Sprite pos   	[],
		// Stat upgrade 	[{ type: "", value: [] }]
		//              ],
		
		const itemList = [
			[
				"Etoile",
				["Augmente la cadence de 15%"],
				[1,0],
				[{ type: "cadence", value: [1.15,"%"] }]
			],
			[
				"Fiole Suspecte",
				["Donne l'alteration: Peur"],
				[2,0],
				[{ type: "effet", value: "peur" }]
			],
			[
				"Super Melon",
				["Augmente les degats de 3"],
				[3,0],
				[{ type: "degat", value: [3,""] }]
			],
			[
				"Tarte",
				["Augmente les degats de 15%"],
				[5,2],
				[{type: "degat", value:[1.15,"%"]}]
			],
			[
				"Diamants",
				["Augmente la vitesse de 20%", "Augmente la cadence de 20%", "Diminue les degats de 40%"],
				[5,0],
				[{ type: "speed", value: [1.2,"%"]},{type: "cadence", value:[0.5,"%"]},{type:"degat", value:[0.6,"%"]}]
			],
			[
				"Bomb",
				["Augmente les degats de 80%","Augmente la taille de 20%", "Definie la cadence a 1/s"],
				[6,0],
				[{ type: "cadence", value: [60,"="]},{type:"degat", value:[1.8,"%"]},{ type: "size", value: [1.2,"%"] }]
			],
			[
				"Oeuforie",
				["Donne l'ateration: Confusion"],
				[7,0],
				[{ type: "effet", value: "confusion" }]
			],
			[
				"Burrito",
				["Augmente la taille de 25%"],
				[8,0],
				[{ type: "size", value: [1.25,"%"] }]
			],
			[
				"Banana",
				["Donne l'alteration: Paralysie"],
				[9,0],
				[{ type: "effet", value: "paralysie" }]
			],
			[
				"Milkshake",
				["Augmente la taille de 20%", "Augmente la vitesse de 20%","Diminue la degat de 10%"],
				[0,1],
				[{ type: "speed", value: [1.2,"%"] },{ type:"size", value:[1.2,"%"]},{ type:"degat", value:[0.9,"%"]}]
			],
			[
				"Donut",
				["Augmente la cadence 40%", "Diminue la taille de 30%"],
				[1,1],
				[{ type: "cadence", value: [0.4,"%"] }, { type: "size", value: [1.3,"%"] }]
			],
			[
				"Pomme",
				["Donne l'alteration: Feu","Augmente la cadence de 15%"],
				[2,1],
				[{ type: "effet", value: "feu"}, { type: "cadence", value: [1.15,"%"] }]
			],
			[
				"Hot Dog",
				["Augmente les degats de 5","Diminue la cadence de 80%"],
				[3,1],
				[{ type: "degat", value: [5,"="] }, { type: "cadence", value: [1.8,"%"] }]
			],
			[
				"Pizza",
				["Diminue la vitesse de 25%", "Augmente la taille de 25%", "Donne l'alteration: peur"],
				[4,1],
				[{ type: "speed", value: [0.75,"%"] },{ type: "size", value: [1.25, "%"] },{ type: "effet", value: "peur" }]
			],
			[
				"Muffin",
				["Donne l'ateration: Feu", "Augmente la vitesse de deplacement de 10%" ],
				[5,1],
				[{ type: "effet", value: "feu" }, { type: "deplacement", value: [1.1,"%"] }]
			],
			[
				"Beeeeee",
				["Augmente la vitesse de 20%", "Augmente la vitesse de deplacement de 20%"],
				[6,1],
				[{ type: "speed", value: [1.15, "%"] }, { type: "deplacement", value: [1.15,"%"] }]
			],
			[
				"Gumm",
				["Donne l'ateration: Paralysie", "Defini la cadence a 3/s"],
				[7,1],
				[{ type: "effet", value: "paralysie" }, { type: "cadence", value: [20,"="] }]
			],
			[
				"Jam",
				["Augmente les degats de 20%", "Donne l'alteration: Gele"],
				[8,1],
				[{ type: "degat", value: [1.2,"%"] }, { type: "effet", value: "gele" }]
			],
			[
				"Nuage",
				["Augmente la vitesse de 10%", "Augmente la cadence de 10%", "Augmente la taille de 10%"],
				[9,1],
				[{ type: "speed", value: [1.1,"%"] }, { type: "cadence", value: [0.9, "%"] }, { type: "size", value: [1.1,"%"] }]
			],
			[
				"Micro Processeur",
				["Augmente les degats de 40%", "Donne l'alteration: Feu"],
				[0,2],
				[{ type: "degat", value: [1.4,"%"] }, { type: "effet", value: "feu" }]
			],
			[
				"BABY !",
				["Defini la cadence a 10/s", "Diminue la taille de 80%", "Diminue les degats de 50%"],
				[1,2],
				[{ type: "cadence", value: [6,"="] }, { type: "size", value: [0.2,"%"] }, { type: "degat", value: [0.5,"%"] }]
			],
			[
				"Delivery Package",
				["Augmente vitesse de 20%", "Diminue la cadence de 20%"],
				[2,2],
				[{ type: "speed", value: [1.2,"%"] }, { type: "cadence", value: [1.2,"%"] }]
			],
			[
				"Manette",
				["Diminue les degats de 20%", "Donne l'alteration: Gele"],
				[3,2],
				[{ type: "degat", value: [0.8,"%"] }, { type: "effet", value: "gele" }]
			],
			[
				"Sel",
				["Definie les degats a 1", "Definie la cadence de 20/s"],
				[4,2],
				[{ type: "degat", value: [1,"="] }, { type: "cadence", value: [3, "="] }]
			],
			[
				"Liasse de billets",
				["Augmente le loot de gold de 80%"],
				[4,0],
				[{ type: "gold", value: [1.8,"%"] }]
			],
			[
				"Pomme de crystal",
				["Augmente le loot de coeur de 50%", "Augmente le loot de gold de 50%"],
				[6,2],
				[{ type: "coeur", value: [1.5,"%"] },{ type: "gold", value: [1.5,"%"] }]
			],
			[
				"Pancake",
				["Defini les degats a 10", "Defini la cadence de 1/s", "Diminue la vitesse de deplacement de 30%"],
				[7,2],
				[{ type: "degat", value: [10,"="] }, { type: "cadence", value: [60,"="] }, { type: "deplacement", value: [0.7,"%"] }]
			],
			[
				"Burger",
				["Augmente la vitesse de 20%", "Augmente la taille de 40%", "Diminue la vitesse de deplacement de 15%"],
				[8,2],
				[{ type: "speed", value: [1.2,"%"] }, { type: "size", value: [1.4,"%"] },{ type: "deplacement", value: [0.85,"%"] }]
			],
			[
				"Moew jus",
				["Augmente le loot de coeur de 50%"],
				[9,2],
				[{ type: "coeur", value: [1.5,"%"] }]
			]
		]

		return itemList
	}

	getAdventureTimeEnnemies() {
		let ennemySpriteSheetData = [{
			name:"Sorciere des pommes",
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100, 100],
			spriteSheetMatrix: [10,9,56],
			gap:[0,0],
			timeOut: 8,
			size: [100,100],
			hitSize: [110, 110],
			states:{shoot:"random", movement:"chaotic"},
			items:["Burger","Nuage","Super Melon","Jam","Pancake","Bomb","Nuage","Fiole Suspecte"]
		}, {
			name:"Gunter",
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100,100],
			spriteSheetMatrix: [9,12,8],
			gap:[0,0],
			timeOut: 8,
			size: [100,100],
			hitSize: [100,45],
			states:{shoot:"merryGoRound", movement:"merryGoRound"},
			items:["Manette","Burger","Etoile","Diamants","Nuage","Gumm","BABY !","Sel"]
		}, {
			name:"Ice King",	
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100,100],
			spriteSheetMatrix: [10,6,7],
			gap:[0,0],
			timeOut: 5,
			size: [100,100],
			hitSize: [70,90],
			states:{shoot:"circle", movement:"random"},
			items:["Burrito","Burrito","Oeuforie","Super Melon","Donut","Etoile","Nuage","Milkshake"]
		}, {
			name:"Maraudeur king",
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100,100],
			spriteSheetMatrix: [13,6,9],
			gap:[0,0],
			timeOut: 8,
			size: [100,100],
			hitSize: [90,100],
			states:{shoot:"circle", movement:"fight"},
			items:["Pancake","Manette","Burger","Burger","Micro Processeur","Muffin","Beeeeee","Nuage"]
		}, {
			name:"Zombie candy",
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100, 100],
			spriteSheetMatrix: [9,13,8],
			gap:[0,0],
			timeOut: 7,
			size: [100,100],
			hitSize: [50,55],
			states:{shoot:"sharpY", movement:"horizontal"},
			items:["Delivery Package","Manette","Milkshake","Fiole Suspecte","Burrito","Beeeeee","Delivery Package","Burger"]
		}
		]

		return ennemySpriteSheetData
	}

	getSpongeBobEnnemies() {
		let ennemySpriteSheetData = [{
			name:"Orange fish",
			rowLabel: ["idle", "walk", "death"],
			animatedSpriteSize:[80, 90],
			spriteSheetMatrix: [5, 8, 8],
			gap:[0,0],
			timeOut: 8,
			size: [100,100],
			hitSize: [70,110],
			states:{shoot:"random", movement:"random"},
			items:["Nuage","Nuage","Burrito","Nuage","Burrito","Nuage","Nuage","Burrito"]
		}, {
			name:"JellyFish",
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100,100],
			spriteSheetMatrix: [8,8,5],
			gap:[0,0],
			timeOut: 8,
			size: [100,100],
			hitSize: [120,40],
			states:{shoot:"random", movement:"fight"},
			items:["Oeuforie","Milkshake","Donut","Gumm","Pomme","Nuage","Beeeeee","Muffin"]
		}, {
			name:"phantom",	
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100,100],
			spriteSheetMatrix: [8,8,6],
			gap:[0,0],
			timeOut: 7,
			size: [100,100],
			hitSize: [110,70],
			states:{shoot:"circle", movement:"flight"},
			items:["BABY !","Tarte","Etoile","Micro Processeur","Super Melon","Pancake","Manette","Nuage"]
		},{
			name: "phantom fish",
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100,100],
			spriteSheetMatrix: [8,8,6],
			gap:[0,0],
			timeOut: 7,
			size: [100,100],
			hitSize: [45,70],
			states:{shoot:"circle", movement:"none"},
			items:["Nuage","Milkshake","Milkshake","Donut","Donut","Beeeeee","Beeeeee","Gumm"]
		}, {
			name:"Big guy",	
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100, 100],
			spriteSheetMatrix: [8,8,10],
			gap:[0,0],
			timeOut: 7,
			size: [100,100],
			hitSize: [85,85],
			states:{shoot:"random", movement:"fight"},
			items:["BABY !","Nuage","Burger","Sel","BABY !","Nuage","BABY !","Pancake"]
		}
		]

		return ennemySpriteSheetData
	}

	getPowerPuffGirlsEnnemies() {
		let ennemySpriteSheetData = [{
			name:"Pink Guy",
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100, 100],
			spriteSheetMatrix: [5,8,4],
			gap:[0,0],
			timeOut: 8,
			size: [100,100],
			hitSize: [50,110],
			states:{shoot:"merryGoRound", movement:"merryGoRound"},
			items:["Nuage","Pomme","Muffin","Nuage","Gumm","Nuage","Nuage","Sel"]

		},{
			name:"Purple Guy",
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100,100],
			spriteSheetMatrix: [5,4,5],
			gap:[0,0],
			timeOut: 8,
			size: [100,100],
			hitSize: [50,115],
			states:{shoot:"sharpX", movement:"vertical"},
			items:["Milkshake","Donut","Nuage","Burrito","Hot Dog","Pizza","Manette","Beeeeee"]

		},{
			name:"Orange Guy",
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100,100],
			spriteSheetMatrix: [5,7,5],
			gap:[0,0],
			timeOut: 7,
			size: [100,100],
			hitSize: [80,85],
			states:{shoot:"sharpY", movement:"horizontal"},
			items:["Manette","Burger","Moew jus","Pancake","Sel","Fiole Suspecte","Diamants","Etoile"]

		},{
			name:"Blue Guy",
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100,100],
			spriteSheetMatrix: [5,5,4],
			gap:[0,0],
			timeOut: 8,
			size: [100,100],
			hitSize: [50,105],
			states:{shoot:"circle", movement:"flight"},
			items:["Nuage","Nuage","Nuage","Nuage","Nuage","Nuage","Nuage","Nuage"]

		},{
			name:"Yellow Guy",
			rowLabel: ["idle", "walk","death"],
			animatedSpriteSize:[100, 100],
			spriteSheetMatrix: [4,4,4],
			gap:[0,0],
			timeOut: 8,
			size: [100,100],
			hitSize: [30,75],
			states:{shoot:"random", movement:"fight"},
			items:["Super Melon","Milkshake","Pomme","Super Melon","Diamants","Pizza","Super Melon","Bomb"]

		}
		]

		return ennemySpriteSheetData
	}

	getEnnemiesByTheme(theme) {
		const func = {
			adventureTime: () => {return this.getAdventureTimeEnnemies()},
			powerPuffGirls: () => {return this.getPowerPuffGirlsEnnemies()},
			spongeBob: () => {return this.getSpongeBobEnnemies()},
		}

		return func[theme]()
	}

	getPlayerByTheme(theme) {
		const func = {
			adventureTime: () => {return this.getAdventureTimePlayer()},
			powerPuffGirls: () => {return this.getPowerPuffGirlsPlayer()},
			spongeBob: () => {return this.getSpongeBobPlayer()},
		}

		return func[theme]()
	}

	getAdventureTimePlayer() {
		let ennemySpriteSheetData = {
			rowLabel: ["idle", "walk", "death","hit"],
			animatedSpriteSize:[50, 50],
			spriteSheetMatrix: [12,16,21,11],
			gap:[16,15],
			timeOut: 3,
			size: [100,100],
			hitSize: [50,70]
		}

		return ennemySpriteSheetData
	}

	getPowerPuffGirlsPlayer() {
		let ennemySpriteSheetData = {
			rowLabel: ["idle", "walk", "death","hit"],
			animatedSpriteSize: [100, 100],
			spriteSheetMatrix: [4, 6, 4, 4],
			gap: [0, 0],
			timeOut: 8,
			size: [100,100],
			hitSize: [10,60]
		}

		return ennemySpriteSheetData
	}

	getSpongeBobPlayer() {
		let ennemySpriteSheetData = {
			rowLabel: ["idle", "walk", "death","hit"],
			animatedSpriteSize: [100, 100],
			spriteSheetMatrix: [7, 7, 6, 6],
			gap: [0, 0],
			timeOut: 5,
			size: [100,100],
			hitSize: [65,80]
		}

		return ennemySpriteSheetData
	}


	//Chercher la game quand on continue une partie déjà commencée
	getLastGame() {
		let game = {
			levelNumber: 5, 
			gold: 10,
			hp: 10,
			items: [new Item(this.getAllItems()[0][0], this.getAllItems()[0][1],ITEM_SPRITESHEET , this.getAllItems()[0][2], this.getAllItems()[0][3])],
			theme: "spongeBob",
		};

		return game;
	}

	/**
    * @param {string} playerId id du player pour associer cette partie au bon joueur dans la BD
	* @param {int} levelNumber Numéro du niveau rendu
    * @param {Array} gold gold du joueur
    * @param {string} hp hp du joueur
	* @param {Array} items items que le joueur possède
	* @param {Object} theme contient toutes les informations sur le theme du niveau courant
	* @param {Array} level matrice contenant le niveau courant
	* @param {Date} timestamp date et temps
    */
	saveCurrentGame(isNewGame, levelNumber, gold, hp, items, theme, level) {
		try {
			let db = db.db("db");
  			let game = {
				levelNumber: levelNumber, 
				gold: gold,
				hp: hp,
				items: items,
				theme: theme,
				timestamp: new Date() 
			};
			if (isNewGame) {
				db.collection("game").insertOne(game); //find(userId) RELIER ICI AU USER ID
			} else {
				db.collection("game").replaceOne(game); //find(userId) RELIER ICI AU USER ID
			}

		} catch (error) {
			console.warn(error)
		}
	}

	closeDataBase() {
		this.dataBase.close()
	}
}



export default new DAO;