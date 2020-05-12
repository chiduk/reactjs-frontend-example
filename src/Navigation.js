import React, { Component }  from 'react';
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import stellaLogo from "./image/stellaLogo.svg";

import "./js/components/CustomNav.css";

import HoverImage from "react-hover-image";
import pencil from "./image/pencil.png";
import pencilRed from "./image/pencilRed.png";
import alarm from "./image/alarm.png";
import alarmRed from "./image/alarmRed.png";
import userIcon from "./image/userIcon.png";
import userIconRed from "./image/userIconRed.png";
import basket from "./image/basket.png";
import basketRed from "./image/basketRed.png";
import briefCase from "./image/briefCase.png";
import briefCaseRed from "./image/briefCaseRed.png";
import {getUniqueId, getUserId} from "./util/Constants";
import {connect} from "react-redux";
import {logOut} from "./util/Constants";
import {getMyInfo} from "./actions/user";
import * as is from 'is_js';

class Navigation extends Component {
    constructor(props) {
        super(props)

        this.hamburgClicked = this.hamburgClicked.bind(this)
        this.logout = this.logout.bind(this)
        this.state = {
            userName: (getUserId() === null) ? '' : getUserId(),
            alarmCount: 0,
            basketCount: 0,
        };

        this.logIn = this.logIn.bind(this)

    }

    componentWillMount() {

        this.props.getMyInfo();

    }

    hamburgClicked() {
        this.props.toggleNav()

    }

    logout() {

        logOut();
        window.location ='/'


    }

    renderNotificationCount = () => {
        if(this.props.notificationCount === 0 || this.props.notificationCount === '0'){

            return []
        }else{
            if(is.ie()){
                return(
                    <div className={"navCountNumForIE"}>{this.props.notificationCount}</div>
                )
            }else{
                return(
                    <div className={"navCountNum"}>{this.props.notificationCount}</div>
                )
            }
        }
    };

    renderCartItemCount = () => {

        if(this.props.cartItemCount === 0 || this.props.cartItemCount === '0'){
            return []
        }else{


            if(is.ie()){
                return(
                    <div className={"navCountNumForIE"}>{this.props.cartItemCount}</div>
                )
            }else{
                return(
                    <div className={"navCountNum"}>{this.props.cartItemCount}</div>
                )
            }


        }


    }

    logIn() {
        const element = document.getElementById('logInPage')

        element.classList.toggle('searchViewClose')
    }

    render() {

        let userName;
        if (this.state.userName !== "") {
            userName = <div className={"homeLogInButton"}>
                <div>Hi, {this.state.userName}</div>
                <div className={"logOut"} onClick={this.logout}>log out</div>
            </div>
        } else {
            userName = <div className={"homeLogInButton"} onClick={this.logIn}>
                <div className={"logInButton"}><a>Log In</a></div>
            </div>
        }

        let writeNewPostNavButton;
        let managementNavButton;
        let alarmButton;
        if (this.props.myInfo.isAdmin || this.props.myInfo.isInfluencer || this.props.myInfo.isSeller) {
            alarmButton = <Nav.Item>
                <Nav.Link eventKey={2} componentClass={Link} href="/alarm" to="/alarm">
                    <div className={"navItemWrapper"}>

                        <HoverImage
                            src={alarm}
                            hoverSrc={alarmRed}
                            className="d-inline-block align-top leftBarItem"
                            alt="alarm"
                        />
                        {this.renderNotificationCount()}

                    </div>

                </Nav.Link>
            </Nav.Item>


            writeNewPostNavButton = <Nav.Item>
                <Nav.Link eventKey={1} componentClass={Link} href="/writenewpost" to="/writenewpost"><HoverImage
                    src={pencil}
                    hoverSrc={pencilRed}
                    className="d-inline-block align-content-center leftBarItem"
                    alt="pencil"
                /></Nav.Link>
            </Nav.Item>

            managementNavButton = <Nav.Item>
                <Nav.Link eventKey={3} componentClass={Link} href="/manager" to="/manager" >
                    <HoverImage
                        src={briefCase}
                        hoverSrc={briefCaseRed}
                        className="d-inline-block align-top leftBarItem"
                        alt="userIcon"
                    />
                </Nav.Link>
            </Nav.Item>
        }

        let myProfileAddress = '/UserProfile?uid=' + getUniqueId()

        return (

        <div>
            <Navbar bg="white">
                <NavbarBrand href="/">
                    <img
                        src={require("./image/earnitLogo.png")}
                        // width="120"
                        // height="40"
                        className="d-inline-block align-top navLogoImage"
                        alt="stellaLogo"
                        // style={{objectFit: "scale-down"}}
                    />
                </NavbarBrand>

                <Nav className="mr-auto navItemWrapper">
                    <Nav.Item>
                        <Nav.Link eventKey={1} componentClass={Link} href="/" to="/" >Feed</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={2} componentClass={Link} href="/forum" to="/forum">Forum</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={3} componentClass={Link} href="/marketShare" to="/marketShare" >캠페인</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Nav className="justify-content-end navItemWrapper">
                    <Nav.Item>
                        <Nav.Link>

                            <div className={"logInInfoWrapper"}>
                                {userName}
                            </div>
                        </Nav.Link>
                    </Nav.Item>

                    {writeNewPostNavButton}

                    {alarmButton}

                    <Nav.Item>
                        <Nav.Link eventKey={3} componentClass={Link} href={myProfileAddress} to="/UserProfile" >
                            <HoverImage
                                src={userIcon}
                                hoverSrc={userIconRed}
                                className="d-inline-block align-top leftBarItem"
                                alt="userIcon"
                            />
                        </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Nav.Link eventKey={3} componentClass={Link} href="/basket" to="/basket" >
                            <div className={"navItemWrapper"}>

                                <HoverImage
                                    src={basket}
                                    hoverSrc={basketRed}
                                    className="d-inline-block align-top leftBarItem"
                                    alt="userIcon"
                                />
                                {this.renderCartItemCount()}

                            </div>


                        </Nav.Link>
                    </Nav.Item>
                    {managementNavButton}
                </Nav>

                <Nav className={"justify-content-end navHamburg"}>
                    <Nav.Item onClick={this.hamburgClicked}><img src={require("./image/hamburg.png")}/></Nav.Item>
                </Nav>

            </Navbar>
        </div>


        );
    }

}

let mapStateToProps = (state) => {

    return {
        notificationCount: state.notification.count,
        cartItemCount: state.cart.count,
        myInfo: state.stella.myInfo
    }
};

let mapDispatchToProps = (dispatch) => {
    return {

        getMyInfo: ()=> dispatch(getMyInfo())

    }
}

Navigation = connect(mapStateToProps, mapDispatchToProps)(Navigation)

export default Navigation;