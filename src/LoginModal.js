import React, { Component } from "react";
import './js/components/Home.css'
import LogInPage from "./LogInPage";

class LoginModal extends Component{

    toggleView = (id) => {
        const element = document.getElementById(id)

        element.classList.toggle('searchViewClose')
    }

    render() {
        return (
            <div>
                <div id="logInPage" className="searchViewBackGround" ref={this.logInRef}>
                    <div className="searchBarWrapper">
                        <div className="searchCloseButton" ><a onClick={() => this.toggleView("logInPage")}>close X</a></div>
                    </div>

                    <LogInPage  toggleLogInView={() => this.toggleView("logInPage")} redirectUrl={'/'} action={this.state.logInAction}/>
                </div>
            </div>
        );
    }
}