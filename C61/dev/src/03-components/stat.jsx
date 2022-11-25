import React, { Component } from "react";

export default class Stat extends Component {
    state = {
        name :this.props.data["name"],
        value:this.props.data["value"]
    };

    render() {
        return (
            <div className="stat text__highlignted--simple" id={this.state.name}>
                                <h3 className=" stat__name">{this.state.name}:</h3>
                                <h3 className="stat__value">{this.state.value}</h3>
                            </div>
        );
    }
}
