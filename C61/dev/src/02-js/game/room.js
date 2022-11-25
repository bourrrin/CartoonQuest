//======================================================== En-tete ========================================================
// @fileName:       game.js -> projetsynthese\C61\dev\frontend\src\02-js\game\game.js
// @context:        Classe s'occupant des salles                 
// @author:         Luca Reymann
// @teamMembers:    Chloé Boucher, Amélia Desgagné et Luca Reymann
// @lastUpdated:    2022-05-25
// @sources:        
// 
// @explanation:    
// 
//============================================================================================================================

class Room {
	/**
	 * Contient les éléments d'une pièce du jeu
	 * @param {string} type type de salle (common, start, exit, boutique)
	 * @param {ennemyCount} int Quantité d'ennemis dans la salle
	 * @param {itemCount} int Quantité d'items dans la salle
	 * @param {boolean} hasBoss Détermine s'il y a un boss dans la salle
	 */
	constructor(id, type='common', ennemyCount=0, itemCount=0, hasBoss=false, hasKey = false) {
		this.id = id;
		this.type = type;
		this.ennemyCount = ennemyCount;
		this.itemCount = itemCount;
		this.hasBoss = hasBoss;
		this.hasKey = hasKey
		this.ennemyDangerLevel = {
			normal: 0,
			fort: 0,
			dangeureux:0,
		}
	}

	setKeys(bool) {
		this.hasKey = bool
	}

	setEnnemiesStrenght(level) {
		const ennemieStrenght = [
			{ normal: 1,   fort: 0,   dangeureux: 0 },
			{ normal: 0.9, fort: 0.1, dangeureux: 0 },
			{ normal: 0.8, fort: 0.1, dangeureux: 0.1 },
			{ normal: 0.7, fort: 0.2, dangeureux: 0.1 },
			{ normal: 0.6, fort: 0.2, dangeureux: 0.2 },
			{ normal: 0.5, fort: 0.3, dangeureux: 0.2 },
			{ normal: 0.4, fort: 0.3, dangeureux: 0.3 },
			{ normal: 0.3, fort: 0.4, dangeureux: 0.3 },
			{ normal: 0.2, fort: 0.4, dangeureux: 0.4 },
			{ normal: 0.1, fort: 0.5, dangeureux: 0.4 },
			{ normal: 0,   fort: 0.5, dangeureux: 0.5 },
			{ normal: 0,   fort: 0,   dangeureux: 1 },
		]

		let i = parseInt(level / 2.8)

		if (i >= ennemieStrenght.length) {
			i = ennemieStrenght.length -1
		}

		let d = parseInt(this.ennemyCount * ennemieStrenght[i].dangeureux )
		let f = parseInt(this.ennemyCount * ennemieStrenght[i].fort )
		let n = parseInt(this.ennemyCount - (d + f))
			
		this.ennemyDangerLevel.normal = n
		this.ennemyDangerLevel.fort = f
		this.ennemyDangerLevel.dangeureux = d
	}
}

export default Room;
