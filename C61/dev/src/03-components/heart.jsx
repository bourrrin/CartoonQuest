import React, { Component } from "react";

export default class Heart extends Component {
    state = {
        value : this.props.value
    };

    render() {
        let classes = this.getClasses()
        return (
            <div className={classes}></div>
        );
    }

    getClasses(){
        let classe ="heart ";
        if(this.state.value === 0){
            classe += "heart--empty"
        }else if(this.state.value === 1){
            classe += "heart--half"
        }else if(this.state.value === 2){
            classe += "heart--full"
        }
        return classe;
    }
}
