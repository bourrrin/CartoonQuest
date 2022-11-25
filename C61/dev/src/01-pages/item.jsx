//======================================================== En-tete ========================================================
// @fileName:       item.jsx -> projetsynthese\C61\dev\frontend\src\01-pages\
// @context:        Page react pour la page item incluant les fonctionnalités de celui-ci                    
// @author:         Luca Reymann et Chloé Boucher
// @teamMembers:    Chloé Boucher, Amélia Desgagné et Luca Reymann
// @lastUpdated:    2022-05-26
// @sources:        
// 
// @explanation:    
// 
//============================================================================================================================
import React, { Component } from "react";
import Item from "../03-components/item";
import DAO from "../02-js/game/DAO";
import Items from "../02-js/game/item";
import ITEM_SPRITESHEET from "../04-assets/game/items/item_tiledImage.png"
import { Link } from "react-router-dom";

export default class ItemShow extends Component {
    itemList = new Array()

    constructor() {
        super()
        DAO.getAllItems().forEach((item) => {
            this.itemList.push(new Items(item[0],item[1],ITEM_SPRITESHEET,item[2],item[3]))
        })
    }
 
    componentDidMount() {
        setTimeout(() => {
            this.setState({});
            
        }, 100);
    }
    
    display_items() {
        let arr = new Array()
        this.itemList.forEach((item) => {
            arr.push(<Item key={"item"+this.generateRandomId()} data={item}></Item>)
        })
        return arr
    }
    
    generateRandomId() {
        return Math.random(100);
    }
    
    render() {
        return (
            <div className="pagewrapper">
                <div className="container__itemShow">
                    <Link to={"/lobby"} state="continueGame" className="itemShow__return text__highlignted--title">RETOUR</Link>
                    <div className="ui container__itemsShow">
                        <h1 className="text__highlignted--title">OBJETS</h1>
                        <div className="itemShow__list">
                            {this.display_items()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
