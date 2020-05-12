import google from '../config/google'
import {queryString, RestApi} from '../util/Constants'
import fetch from 'cross-fetch'
import naver from '../config/naver'
export const FACEBOOK = 'FACEBOOK';
export const GOOGLE = 'GOOGLE';
export const KAKAO = 'KAKAO';
export const NAVER = 'NAVER';
export const EMAIL = 'EMAIL';
export const SIGNUP = 'SIGNUP';


export function facebookLogIn(){


    return function (dispatch) {
        console.log('facebook')
        return new Promise( resolve => {
            window.FB.getLoginStatus( response => {
                resolve(response)
            })
        })
            .then(response => {


                if (response.status === 'connected') {
                    // Logged into your app and Facebook.
                    //window.FB.logout();
                    getFacebookInfo(dispatch)
                } else {
                    // The person is not logged into your app or we are unable to tell.
                    getFacebookInfo(dispatch)

                }
            })

    }
}



function getFacebookInfo(dispatch) {

    return new Promise(resolve => {
        window.FB.login(function (response) {

            resolve(response)
        }, {scope: 'public_profile,email'})
    })
        .then(result => {


            return new Promise(resolve => {

                window.FB.api('/me', {fields:'name,first_name,last_name,id,email'}, function(response) {

                    console.log(response)

                    if(response.error === null || response.error === undefined){
                        resolve(response)
                    }

                })

            })
                .then(response => {
                    let params = {
                        facebookId: response.id,
                        name: response.name,
                        email: response.email,
                        lastName: response.last_name,
                        firstName: response.first_name
                    }

                    fetch(RestApi.login.facebookLogIn + '?' + queryString(params))
                        .then(res => {
                            return res.json()
                        })
                        .then(result => {

                            console.log(result)


                            let uniqueId = result.uniqueId;
                            let userId = result.userId;

                            if(uniqueId !== null) {
                                localStorage.setItem('uniqueId', uniqueId);
                                localStorage.setItem('userId', userId);
                                localStorage.setItem('loggedIn', 'true');
                            }

                            let logIn = {
                                type: 'facebook',
                                facebookId: response.id,
                                email: response.email,
                                firstName: response.first_name,
                                lastName: response.last_name,
                                userId: userId

                            }

                            dispatch(
                                {
                                    type: 'LOGIN',
                                    logIn

                                })

                        })

                });
        })



}

export function googleLogIn(){


    return function(dispatch) {

        return new Promise(resolve => {


            window.gapi.auth.signIn({
                callback: function(authResponse) {
                    resolve(authResponse)
                    //googleSignInCallback( authResponse )
                },
                clientid: google.clientId, //Google client Id
                cookiepolicy: "single_host_origin",
                requestvisibleactions: "http://schema.org/AddAction",
                scope: "https://www.googleapis.com/auth/plus.login email"
            })
        }).then(e => {

            return new Promise(resolve => {
                if (e["status"]["signed_in"]) {
                    window.gapi.client.load("plus", "v1", function() {
                        if (e["access_token"]) {
                            //getUserGoogleProfile( e["access_token"] )
                            resolve(e["access_token"])
                        } else if (e["error"]) {
                            console.log('Import error', 'Error occurred while importing data')
                        }
                    });
                } else {
                    console.log('Oops... Error occurred while importing data')
                }
            })
                .then(accessToken => {
                    let e = window.gapi.client.plus.people.get({
                        userId: "me"
                    });
                    e.execute(function(e) {
                        if (e.error) {
                            console.log(e.message);
                            console.log('Import error - Error occurred while importing data')


                        } else if (e.id) {
                            //Profile data
                            let googleId = e.id;
                            let firstName = e.name.givenName;
                            let lastName = e.name.familyName;
                            let email = (e.emails.length > 0) ? e.emails[0].value : '';

                            console.log( e );
                            console.log(googleId, firstName, lastName);

                            let params = {
                                googleId: googleId

                            }

                            fetch(RestApi.login.googleLogIn + '?' + queryString(params))
                                .then(res => {
                                    return res.json()
                                })
                                .then(json => {
                                    let uniqueId = json.uniqueId;
                                    let userId = json.userId;

                                    if(uniqueId !== null){
                                        localStorage.setItem('uniqueId', uniqueId);
                                        localStorage.setItem('userId', userId);
                                        localStorage.setItem('loggedIn', 'true');
                                    }

                                    dispatch({
                                        type: 'LOGIN',
                                        logIn: {type: 'google', googleId: googleId, userId: userId, firstName: firstName, lastName: lastName, email: email}
                                    })

                                })


                        }
                    });
                })


        })


    }

}

export function kakaoLogIn(){

    return {
        type: KAKAO
    }

}

export function naverLogIn(){



    return {
        type: NAVER
    }

}

export function emailLogin(state) {

    if(state.email.length > 0 && state.password.length > 0){
        fetch(RestApi.user.logIn + '?' + queryString(state))
            .then( res => {
                return res.json()
            })
            .then( result => {
                console.log(result)
            })
    }



}

export function signUp(state) {

    if(state.email.length > 0 && state.password.length > 0){

        fetch(RestApi.user.addNewUser + '?' + queryString(state))
            .then(res => {
                return res.json()
            })
            .then(result => {
                console.log(result)
            })
    }


    return{
        type: SIGNUP
    }
}