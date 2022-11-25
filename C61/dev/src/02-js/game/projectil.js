//======================================================== En-tete ========================================================
// @fileName:       game.js -> projetsynthese\C61\dev\frontend\src\02-js\game\game.js
// @context:        Classe s'occupant des projectiles             
// @author:         Luca Reymann
// @teamMembers:    Chloé Boucher, Amélia Desgagné et Luca Reymann
// @lastUpdated:    2022-05-25
// @sources:        
// 
// @explanation:    
// 
//============================================================================================================================

import Movement from "./movement";

export default class Projectil{
    hitbox = {
        top:0,
        left:0,
        right:0,
        bottom:0,
    }
    
    /**
    * Gere les projectil, comportement, modification par items 
    * @param {array} baseStats Objet contenant les infos du projectil - Voir template plus bas
    * @param {array} itemUpgrades List d'upgrade - Optionel
    *     * sprite : {canvas} canvas de la tiledImage des projectil 
    *     * size : {array} Taille [width, height] 
    *     * degat : {int} Degat infligé au autres character
    *     * speed : {int} Vitesse de deplacement
    *     * cadence : {int} Nbr de frame entre chaque tire
    *     * effet : {int} Effet infligé au autres character
    * 
    */
    constructor(baseStats, itemUpgrades = []) {
        this.isDead = false
       
        this.baseStats = baseStats
        this.sprite = baseStats.sprite
        this.itemUpgrades = itemUpgrades
        this.updateStats()
    }

    getConstructor() {
        return [this.baseStats, this.itemUpgrades]
    }

    /**
    * @param {string} direction (up, down, left, right) direction du deplacement
    */
    initMouvement(direction, pos, sceneLimit) {
        this.movement = new Movement(pos, this.updatedStats["size"],this.updatedStats["size"], sceneLimit, this.updatedStats["speed"], direction)
    }

    /**
    * Ajoute les modificateur d'item a la list et update les stats du projectil
    * @param {array} modification {type:string, value:any} modification apporter a la stats[type]
    */
    addItemUpgrade(modification) {
        this.itemUpgrades.push(modification)
        this.updateStats()
    }

    /**
    * Retire les modificateur d'item de la list et update les stats du projectil
    * @param {array} modification {type:string, value:any} modification apporter a la stats[type]
    */
    deleteItemUpgrade(modification) {
        this.itemUpgrades.forEach(upgrade => {
            if (upgrade === modification) {
                this.itemUpgrades.splice(this.itemUpgrades.indexOf(upgrade),1)
            }
        });
        this.updateStats()
    }

    copyStats() {
        this.updatedStats = JSON.parse(JSON.stringify(this.baseStats))
        this.updatedStats.sprite = this.sprite
    }

    /**
    * Update les stats selon la list de modification save en memoire this.itemUpgrades
    */
    updateStats() {
        this.copyStats()
        this.itemUpgrades.forEach(upgrades => {
            upgrades.forEach(update => {
                if (Array.isArray(update.value) && update.type !== "spritePos") {
                    const value = update.value[0]
                    if (update.value[1] === "%") {
                        if (Array.isArray(this.updatedStats[update.type])) {
                            parseInt(this.updatedStats[update.type][0] *= value)
                            parseInt(this.updatedStats[update.type][1] *= value)
                        } else {
                            parseInt(this.updatedStats[update.type] *= value)
                        }
                    } else if (update.value[1] === "=") {
                        if (Array.isArray(this.updatedStats[update.type])) {
                            parseInt(this.updatedStats[update.type][0] = value)
                            parseInt(this.updatedStats[update.type][1] = value)
                        } else {
                            parseInt(this.updatedStats[update.type] = value)
                        }
                    }else {
                        if (Array.isArray(this.updatedStats[update.type])) {
                            parseInt(this.updatedStats[update.type][0] += value)
                            parseInt(this.updatedStats[update.type][1] += value)
                        } else {
                            parseInt(this.updatedStats[update.type] += value)
                        }
                    }
                } else {
                    this.updatedStats[update.type] = update.value
                }
            })
        })

        Object.keys(this.updatedStats).forEach((key) => {
            const stat = this.updatedStats[key]
            if (!Number.isInteger(stat) && typeof stat == "number") {
                this.updatedStats[key] = parseInt(stat)
            }if (Array.isArray(stat)) {
                this.updatedStats[key] = [parseInt(stat[0]),parseInt(stat[1])]
            }
        })
    }
}