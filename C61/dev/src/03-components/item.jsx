import React, { Component } from "react";

export default class Item extends Component {
    state = {
        is_empty: this.props.data.name == undefined,
        name: this.props.data.name,
        description: this.props.data.description,
        url:this.props.data.sprite,
        is_panel_opened: false,
        id: JSON.stringify(Math.random(100))
    };

    componentDidMount() {
        this.displaySprite()
    }

    useEffect(){
        this.displaySprite()
    }

    render() {
        let classes = this.getClasses()
        let styles = this.display_item()

        let item_info_panel = <div></div>
		let item_info_panel_content = <div></div>
		if(this.state.is_panel_opened){
			item_info_panel_content = this.state.description;
			item_info_panel = (
                <div className="item_info_panel">
                    <h3 className="text__highlignted--title">{this.state.name}</h3>
                    {this.state.description.map((desc) => (
                        <p key={Math.random(1000)}> {desc} </p>
                    ))}
                </div>
            )
        }

        let canvas = <div></div>
        if (this.state.url !== undefined) {
            canvas = <canvas className="item_canvas" id={this.state.id} ></canvas>
        }

        return (
            <div 
                className={classes} 
                style={styles}
                onMouseEnter={() => {this.display_item_overlay(true )}}
                onMouseLeave={() => {this.display_item_overlay(false)}}
            >
                {canvas}
                {item_info_panel}
            </div>
        );
    }

    displaySprite() {
        if (this.state.url !== undefined) {
            let canvas = document.getElementById(this.state.id)
            let ctx = canvas.getContext("2d")
            let size = 100
            let magic_numberX = size * Math.max((200 / size) * 1.5, 1) 
            let magic_numberY = size * Math.max((100 / size) * 1.5, 1)
            ctx.width  = magic_numberX
            ctx.height = magic_numberY

            ctx.drawImage(this.state.url,0,10,this.state.url.width,this.state.url.height, 0, 0, ctx.width, ctx.height)
        }
    }

    getClasses(){
        let default_classe ="item_slot";
        if(this.state.is_empty){
            default_classe +=" empty";
        }else{
            default_classe +=" item_used"
        }
        return default_classe;
    }

    display_item(){
        if(!this.state.is_empty){
            return {
                backgroundImage: this.state.url, //a enlever
                backgroundColor: "rgba(0, 0, 0, 0.1)",
            }
        }
    }

    display_item_overlay(arg){
        if(!this.state.is_empty){
            this.setState({is_panel_opened : arg});
        }
    }
}
