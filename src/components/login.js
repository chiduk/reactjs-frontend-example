import React from 'react';
import { connect } from 'react-redux';
import { facebookLogIn, googleLogIn, kakaoLogIn, naverLogIn , emailLogin, signUp } from '../actions/login'
import facebook from '../config/facebook'
import naver from "../config/naver";
import kakao from "../config/kakao";



class LogIn extends React.Component{
    constructor(props){


        // eslint-disable-next-line
        (function(d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        //Google sign in sdk
        (function() {
            let e = document.createElement("script");
            e.type = "text/javascript";
            e.async = true;
            e.src = "https://apis.google.com/js/client:platform.js?onload=gPOnLoad";
            let t = document.getElementsByTagName("script")[0];
            t.parentNode.insertBefore(e, t)
        })();

        //Kakao sdk


        super(props)
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.state = {
            email: '',
            password: ''
        }
    }



    componentDidMount() {
        this.naverSDKInsert();
        this.kakaoSDKInsert();


        window.fbAsyncInit = function () {
            window.FB.init({
                appId      : facebook.appId,
                cookie     : true,  // enable cookies to allow the server to access the session

                xfbml      : true,  // parse social plugins on this page
                version    : facebook.version // The Graph API version to use for the call
            })
        }




    }

    render() {
        return(

            <div>
                <button type="button"
                        onClick={ this.props.google }>
                    Google
                </button>

                <button type="button"
                        onClick={ this.props.facebook }>
                    Facebook
                </button>
                <div id="kakao-login-btn"/>
                <div id="naverIdLogin"/>
                <br/>
                <div>
                    <input type='email' onChange={this.handleEmailChange}/>
                </div>
                <div>
                    <input type='password' onChange={this.handlePasswordChange}/>
                </div>
                <div>
                    <button type='button' onClick={this.handleLogIn}>Log in</button>
                    <button type='button' onClick={this.handleSignUp}>Sign up</button>
                </div>
                <h1>UniqueId: {this.props.logIn.uniqueId} Name: {this.props.logIn.name}</h1>
            </div>


        )
    }

    handleEmailChange(event){
        console.log(event.target.value)
        this.setState({email:event.target.value})
    }

    handlePasswordChange(event){
        this.setState({password: event.target.value})
    }

    handleLogIn(){
        this.props.email(this.state)
    }

    handleSignUp(){
        this.props.signUp(this.state)

    }

    async naverSDKInsert(){
        let e = document.createElement("script");
        e.type = "text/javascript";
        e.async = true;
        e.src = "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js";
        let t = document.getElementsByTagName("script")[0];
        t.parentNode.insertBefore(e, t)
        console.log('naver sdk insert')
    }

    async kakaoSDKInsert(){
        let e = document.createElement("script");
        e.type = "text/javascript";
        e.async = true;
        e.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
        let t = document.getElementsByTagName("script")[0];
        t.parentNode.insertBefore(e, t)
    }
}

let mapDispatchToProps = (dispatch) => {
    return {

        facebook: () => dispatch(facebookLogIn()),
        google: () => dispatch(googleLogIn()),
        kakao: () => dispatch(kakaoLogIn()),
        naver: () => dispatch(naverLogIn()),
        email: (state) => dispatch(emailLogin(state)),
        signUp: (state)=> dispatch(signUp(state))
    }
}

let mapStateToProps = (state) => {
    console.log('STATE');
    console.log(state);
    return {
       logIn: state.logIn
    }
}

LogIn = connect(mapStateToProps, mapDispatchToProps)(LogIn);

export default LogIn;