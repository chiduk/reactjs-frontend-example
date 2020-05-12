import React, { Component } from 'react';
import "./js/components/LogInPage.css";
import { withRouter} from "react-router-dom";
import { facebookLogIn, googleLogIn, kakaoLogIn, naverLogIn } from "./actions/login";

import {connect} from "react-redux";

import naver from "./config/naver";
import kakao from "./config/kakao";
import facebook from "./config/facebook";
import fetch from "cross-fetch"
import {queryString, RestApi} from "./util/Constants";
import {verifyID} from "./actions/user";

function loadKakaoScript() {
    return new Promise((resolve, reject) => {
        let kakaoScript = document.createElement('script');
        kakaoScript.type = 'text/javascript';
        kakaoScript.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';

        kakaoScript.characterSet = 'utf-8';
        document.head.appendChild(kakaoScript)

        kakaoScript.addEventListener('load', () => {
            resolve();
        });

        kakaoScript.addEventListener('error', () => {
            reject();
        });
    })
}

class LogInPage extends Component {


    constructor(props) {
        super(props);
        this.faceBookLogin = this.faceBookLogin.bind(this)
        this.googlePlusLogIn = this.googlePlusLogIn.bind(this)
        this.naverLogIn = this.naverLogIn.bind(this)
        this.kakaoLogIn = this.kakaoLogIn.bind(this)
        this.logInButtonPressed = this.logInButtonPressed.bind(this)
        this.signUpPressed = this.signUpPressed.bind(this)
        this.lostEmailPressed = this.lostEmailPressed.bind(this)
        this.lostPassWordPressed = this.lostPassWordPressed.bind(this)
        this.pushToLostLogInPage = this.pushToLostLogInPage.bind(this)

        this.state = {
            email: "",
            passWord: "",
            naverLoginClicked: false
        };

        this.insertFacebookSDK();
        this.insertGoogleSDK();

        window.fbAsyncInit = function () {
            window.FB.init({
                appId      : facebook.appId,
                cookie     : true,  // enable cookies to allow the server to access the session
                xfbml      : true,  // parse social plugins on this page
                version    : facebook.version // The Graph API version to use for the call
            })
        };
    }

    componentDidMount() {

        loadKakaoScript()
            .then(() => {
                window.Kakao.init(kakao.key)
            });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.logIn !== prevState.logIn){

            let loggedIn = (localStorage.getItem('loggedIn') === 'true')

            if(loggedIn){

            }else{
                this.pushToSignUpPage(this.props.logIn.type, this.props.logIn)
            }
        }
    }

    insertFacebookSDK = () => {
        (function(d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
   }

    insertGoogleSDK = () => {
        //Google sign in sdk
        (function() {
            let e = document.createElement("script");
            e.type = "text/javascript";
            e.async = true;
            e.src = "https://apis.google.com/js/client:platform.js?onload=gPOnLoad";
            let t = document.getElementsByTagName("script")[0];
            t.parentNode.insertBefore(e, t)
        })();
    };

    loginWithKakao = () => {
        let self = this;

        window.Kakao.Auth.login({
            success: function(authObj) {

                window.Kakao.API.request({
                    url:'/v2/user/me',
                    success: function (res) {
                        let kakaoId = res.id;


                        fetch(RestApi.login.kakaoLogIn + '?' + queryString({kakaoId: kakaoId}))
                            .then(result => {
                                return result.json()
                            })
                            .then( json => {
                                let uniqueId = json.uniqueId;
                                let userId = json.userId;
                                if(uniqueId === null || uniqueId === undefined){
                                    self.pushToSignUpPage('kakao', res);
                                }else{
                                    localStorage.setItem('uniqueId', uniqueId);
                                    localStorage.setItem('loggedIn', 'true');
                                    localStorage.setItem('userId', userId);
                                    window.location = '/'
                                }
                            });
                    },
                    fail: function (error) {
                        console.log(error)
                    }
                })
            },
            fail: function(err) {
                alert(JSON.stringify(err));
            }
        })
    };

    faceBookLogin() {
        this.props.facebookLogIn()
    }

    googlePlusLogIn() {
        this.props.googleLogIn()
    }

    naverLogIn() {
        console.log('naver log in');
        localStorage.setItem('naverLogin', '1');
    }

    redirect = () => {
        window.location = '/'
    }

    kakaoLogIn() {
        console.log("kakaoLogIn")
        this.props.kakaoLogIn(this.redirect())
    }

    logInButtonPressed() {
        console.log("logInButtonPressed" + this.state.email + this.state.passWord)
        //this.props.toggleLogInView()

        if(this.state.email.length === 0){
            alert('이메일 주소를 입력해 주세요')
            return
        }

        if(this.state.passWord.length === 0){
            alert('비밀번호를 입력해 주세요')
            return
        }

        let params = {
            email: this.state.email,
            password: this.state.passWord
        }

        fetch(RestApi.login.logIn + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                if(json.status === 200){
                    localStorage.setItem('uniqueId', json.uniqueId);
                    localStorage.setItem('userId', json.userId);
                    localStorage.setItem('loggedIn', 'true');
                    window.location = '/'
                }else if(json.status === 402){//incorrect password
                    alert('잘못된 비밀번호 입니다.')
                } else if(json.status === 401){ //email not exists
                    alert('가입되지 않은 이메일 주소입니다.')
                }
            })
    }

    signUpPressed() {

        this.props.verifyID({}, () => {


            let path = '/SignUp';

            this.props.history.push({
                pathname: path,
                redirectUrl: this.props.redirectUrl
            })
        });


    }

    lostEmailPressed() {
        console.log("lostEmailPressed")

    }

    lostPassWordPressed() {
        console.log("lostPassWordPressed")
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({passWord: event.target.value});
    }

    pushToSignUpPage = (type, logIn) => {

        logIn.type = type;

        let self = this;

        this.props.verifyID({}, () => {


            let path = '/SignUp';

            self.props.history.push({
                pathname: path,
                logInParams: logIn
            })
        });
    }


    pushToLostLogInPage(what) {

        const element = document.getElementById('logInPage')

        element.classList.toggle('searchViewClose')

        let path = '/LoftLoginInfo'


        this.props.history.push({
            pathname: path,
            state: {
                whatDidYouLose: what
            }

        })

    }

    render() {





        return (

            <div className="logInBody">

                <div className="logInPageLogo"><img src={require('./image/stellaLogo.svg')}/></div>

                <div className="logInFunctionContainer">
                    <div className="easyLogInContainer">
                        <div className="easyLogInButton faceBookButton" onClick={this.faceBookLogin}>
                            <div className="easyLogInButtonImage"><img src={require("./image/facebookLogo.png")}/></div>
                            <div className="easyLogInButtonText"><a>Log in with Facebook</a></div>
                        </div>

                        <div className="easyLogInButton googleButton" onClick={this.googlePlusLogIn}>
                            <div className="easyLogInButtonImage"><img src={require("./image/google-plus.svg")}/></div>
                            <div className="easyLogInButtonText"><a>Log in with Google+</a></div>
                        </div>

                        <div id={"naverIdLogin"} className="easyLogInButton naverLogInButton" onClick={() => {this.naverLogIn()}}>
                            <img src={require('./image/naver/naverLoginButton.png')}/>
                        </div>
                        <div id='kakao-login-btn' className='easyLogInButton kakaoLogInButton' onClick={() => {this.loginWithKakao()}}>
                            <img src={require('./image/kakao/kakaoLogInButton.png')}/>
                        </div>
                    </div>


                    <div className="middleLine"/>
                    <div className="emailLogInContainer">
                        <div className="emailLogInElement">
                            <input className="emailLogInInput" placeholder={"email"} type="email" onChange={this.handleEmailChange.bind(this)}/>
                        </div>
                        <div className="emailLogInElement">
                            <input className="emailLogInInput" placeholder={"password"} type="password" value={this.state.passWord} onChange={this.handlePasswordChange.bind(this)}/>
                        </div>
                        <div className="emailLogInElement signUpClick" onClick={this.signUpPressed}>
                            <p>아직 계정이 없으신가요?<br/>신규 회원 가입 클릭</p>
                        </div>
                        <div className="emailLogInElement logInButtonContainer">
                            <div className="logInButton" onClick={this.logInButtonPressed}><a>Log In</a></div>
                            <div className="KeepLoggedIn"><input type="checkbox"/><a>로그인 유지</a></div>
                        </div>

                        <div className="emailLogInElement lostLogInInfo">
                            <div><a className="lostInfoText" onClick={() => this.pushToLostLogInPage("email")}>이메일 주소 분실</a></div>
                            <div className="lostLogInInfoLine"/>
                            <div><a className="lostInfoText" onClick={() => this.pushToLostLogInPage("password")}>패스워드 분실</a></div>
                        </div>
                    </div>
                </div>

            </div>

        );

    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        facebookLogIn: (callback) => dispatch(facebookLogIn(callback)),
        googleLogIn: (callback) => dispatch(googleLogIn(callback)),
        kakaoLogIn: (callback) => dispatch(kakaoLogIn(callback)),
        naverLogIn: (callback) => dispatch(naverLogIn(callback)),
        verifyID: (params, callback) => dispatch(verifyID(params, callback))
    }
}

let mapStateToProps = (state) => {

    return {
        logIn: state.stella.logIn
    }
}

LogInPage = connect(mapStateToProps, mapDispatchToProps)(LogInPage);

export default withRouter(LogInPage);