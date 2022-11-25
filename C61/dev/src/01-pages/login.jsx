import { Link } from "react-router-dom"
import React, { useState } from "react";
import DAO from "../02-js/game/DAO";

export let userId = 0;

export default function Login(props) {

    const [errors, setErrors] = useState({});

    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    const handleChange = (event) => {
        setValues ({
            ...values, [event.target.name]: event.target.value
        })
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        userId = 67890;

        //Si la connexion est bonne:
        window.location.href = "/lobby";
    };

    return (
        <div className="pageWrapper">
            <div className="container__login">
                <div className="login">
                    <div className="login__logo"></div>
                    <div className="login__form">
                        <form action="" onSubmit={handleFormSubmit} className="form" method="">
                        <div className="form__information">
                            <h3 className="form__information--text">Cartoon Quest</h3>
                        </div>
                            {/* <div className="form__group">
                            <input type="text" className="form__input" placeholder="Username" id="username" name="username" value={values.username} onChange={handleChange} required/>
                            <label htmlFor="username" className="form__label">Username</label>
                        </div>
                        <div className="form__group">
                            <input type="password" className="form__input" placeholder="Password" id="userPassword" name="password" value={values.password} onChange={handleChange} required/>
                            <label htmlFor="userPassword" className="form__label">Password</label>
                        </div> */}
                            <div className="form__submit">
                                <button className="form__submit--btn" onClick={handleFormSubmit}></button>
                            </div>
                        </form>
                        <div className="login__form--help">
                            {/* <div className="login__form--createAccount">
                                <button className="helpButton">Create account</button>
                                <button className="helpButton">Can't sign in?</button>
                            </div> */}
                            <div className="login__form--version">
                                <h3 className="version">V1.0.1</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="banner"></div>
            </div>
            <div className="settings">
                <button className="settings__play buttonMusic"></button>
                <button className="settings__sound buttonMusic"></button>
                <button className="settings__chat buttonMusic" id="chat"></button>
            </div>
        </div>
    );
}
