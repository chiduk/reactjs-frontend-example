import React, {Component} from "react";
import fetch from "cross-fetch";
import {getUniqueId, queryString, RestApi} from "./util/Constants";
import AlertMessage from "./AlertMessage";
import {getEmail, getPassword} from "./actions/user";
import {connect} from "react-redux";
import LogInPage from "./LogInPage";

class LoftLoginInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lostWhat: this.props.location.state.whatDidYouLose,
            firstName: '',
            userName: '',
            alertMessage: null,
        }

        this.handleLastName = this.handleLastName.bind(this)
        this.handleFirstName = this.handleFirstName.bind(this)
        this.handleUserName = this.handleUserName.bind(this)
        this.handleRequest = this.handleRequest.bind(this)
        this.handleEmail = this.handleEmail.bind(this)
        this.deleteAlertMessage = this.deleteAlertMessage.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {


        if(prevState.lostWhat !== this.props.location.state.whatDidYouLose){
            this.setState({lostWhat: this.props.location.state.whatDidYouLose})
        }

    }


    handleLastName(event) {
        this.setState({lastName: event.target.value})
    }

    handleFirstName(event) {



        let name = event.target.value;

        let result = /\s/.test(name);

        if(result){
            alert("이름은 공백없이 입력해 주세요.")
        }else{
            this.setState({firstName: event.target.value})
        }


    }

    handleUserName(event) {

        let regex = /^[a-zA-Z0-9_-]*$/;
        let userId = event.target.value;
        if(regex.test( event.target.value)){
            this.checkUserId(userId)
            this.setState({userName: event.target.value})
        }else{
            this.setState({userName: ''})
            alert('UserID는 영문으로 입력해 주십시요')
        }

    }

    checkUserId = (userId) => {
        fetch(RestApi.login.checkUserId + '?' + queryString({userId: userId}))
            .then(res => {
                return res.json()
            })
            .then(json => {
                let isTaken = json.isTaken;

                this.setState({isUserIdTaken: isTaken})
            })

    }


    handleEmail(event) {
        this.setState({ emailAddress: event.target.value})
        //this.isEmailValid(event)
    }

    deleteAlertMessage(statusCode) {

        this.setState({alertMessage: null})



        if(statusCode === 200){
            window.location = '/'
        }

    }

    closeLogInPage = () => {

        if(getUniqueId() === undefined || getUniqueId() === null){
            window.location = '/';
        }else{
            const element = document.getElementById('logInPage')

            element.classList.toggle('searchViewClose')

        }

    }

    handleRequest() {

        if(this.state.lostWhat === 'email'){
            if( this.state.firstName.trim().length === 0 || this.state.userName.trim().length === 0){
                return
            }

            let params = {
                name: this.state.firstName.trim(),
                userId: this.state.userName.trim()
            }

            this.props.getEmail(params, (result) => {
                if(result.status === 200){
                    let e = ["가입하신 이메일은 " + result.email + " 입니다."];
                    this.setState({alertMessage: <AlertMessage alertTitle={""} messages={e} closeAlert={() => this.deleteAlertMessage(0)}/>})

                }else{
                    let e = ["입력하신 정보와 일치하는 사용자를 찾을 수 없습니다."];
                    this.setState({alertMessage: <AlertMessage alertTitle={""} messages={e} closeAlert={() => this.deleteAlertMessage(0)}/>})

                }
            })
        }else{
            let params = {
                name: this.state.firstName.trim(),
                //lastName: this.state.lastName.trim(),
                userId: this.state.userName.trim(),
                email : this.state.emailAddress
            };


            this.props.getPassword(params, (statusCode) => {
                if(statusCode === 200){
                    let e = ["가입 하신 이메일로 요청하신 정보를 보내 드렸습니다. 이메일을 확인해 보세요."]
                    this.setState({alertMessage: <AlertMessage alertTitle={"이메일이 전송 되었습니다."} messages={e} closeAlert={() => this.deleteAlertMessage(statusCode)}/>})

                }else{
                    let e = ["입력하신 정보와 일치한 사용자를 찾을 수 없습니다."]
                    this.setState({alertMessage: <AlertMessage alertTitle={""} messages={e} closeAlert={() => this.deleteAlertMessage(statusCode)}/>})

                }
            })
        }



    }

    render() {

        let lost;
        let fields;
        if (this.state.lostWhat === "email") {
            fields = <div>
                {/*<div className="signUpInput">*/}
                {/*    <input placeholder={"성"} value={this.state.lastName} onChange={this.handleLastName.bind(this)} type="text"/>*/}
                {/*</div>*/}

                <div className="signUpInput">
                    <input placeholder={"이름"} value={this.state.firstName} onChange={this.handleFirstName.bind(this)} type="text"/>
                </div>

                <div className="signUpInput">
                    <input placeholder={"User Name (in english)"} value={this.state.userName} onChange={this.handleUserName.bind(this)} name="email" type="text"/>
                </div>

                {/*<div className="inputError">*/}
                {/*    {this.state.isUserIdTaken ? <label>찾을 수 없는 아이디 입니다.</label> : null}*/}
                {/*</div>*/}
            </div>
        } else {
            fields = <div>
                {/*<div className="signUpInput">*/}
                {/*    <input placeholder={"성"} value={this.state.lastName} onChange={this.handleLastName.bind(this)} type="text"/>*/}
                {/*</div>*/}

                <div className="signUpInput">
                    <input placeholder={"이름"} value={this.state.firstName} onChange={this.handleFirstName.bind(this)} type="text"/>
                </div>

                <div className="signUpInput">
                    <input placeholder={"User Name (in english)"} value={this.state.userName} onChange={this.handleUserName.bind(this)} name="email" type="text"/>
                </div>

                <div className="signUpInput">
                    <input placeholder={"email"} value={this.state.emailAddress} onChange={this.handleEmail.bind(this)} type="email"/>
                </div>

                {/*<div className="inputError">*/}
                {/*    {this.state.isUserIdTaken ? <label>찾을 수 없는 이메일 입니다.</label> : null}*/}
                {/*</div>*/}
            </div>
        }

        return (
            <div>
                <div className="signUpBody" id="signUpBodyID">



                    {fields}



                    <div className="singUpButton"
                         onClick={() => this.handleRequest()}>
                        <a>요청 하기</a>
                    </div>

                    {this.state.alertMessage}

                </div>

                <div id="logInPage" className="searchViewBackGround">
                    <div className="searchBarWrapper">
                        <div className="searchCloseButton" ><a onClick={() => this.closeLogInPage()}>close X</a></div>
                    </div>

                    <LogInPage  toggleLogInView={() => this.toggleLoginPage()}/>
                </div>
            </div>
        );
    }
}


let mapStateToProps = (state) => {
    return {

    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        getPassword: (params, callback) => dispatch(getPassword(params, callback)),
        getEmail: (params, callback) => dispatch(getEmail(params, callback))
    }
};

LoftLoginInfo = connect(mapStateToProps, mapDispatchToProps)(LoftLoginInfo)

export default LoftLoginInfo;