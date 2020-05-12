import React, { Component } from 'react';
import "./js/components/SignUp.css";
import { withRouter } from "react-router";
import AlertMessage from "./AlertMessage.js";
import LogInPage from "./LogInPage";
import fetch from 'cross-fetch'
import {isMobile, queryString, RestApi} from "./util/Constants";
import AvatarEditor from "react-avatar-editor";
import {connect} from "react-redux";
import {verifyID} from "./actions/user";
import ServiceUseContract from "./ServiceUseContract";
import ServiceUseContractUserInfoProtection from "./ServiceUseContractUserInfoProtection";

class SignUp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            lastName: "",
            firstName: "",
            fullName: '',
            emailAddress: "",
            isValidEmail: false,
            userName: "",
            passWordFirst: "",
            passWordConfirm: "",
            profileImage: require("./image/userIcon@2x.png"),
            phoneNumber: "",
            agree1: false,
            agreePrivateInfo: false,
            agreeEmail: false,
            agreeSMS: false,
            agreeAll: false,
            alertMessage: null,
            imageArray: [],

            rotate: 0,
            imageEditor: null,
            niceIdVerifyBody: null,

            isIDVerified: false,

            idButtonText: '본인 인증하기'
        }

        this.handleProfileImageSelect = this.handleProfileImageSelect.bind(this)
        this.fileUpLoader = React.createRef()

        this.handleCheckBoxClicked = this.handleCheckBoxClicked.bind(this)
        this.isEmailValid = this.isEmailValid.bind(this)
        this.renderAlertMessage = this.renderAlertMessage.bind(this)
        this.deleteAlertMessage = this.deleteAlertMessage.bind(this)
        this.toggleBlurBackGround = this.toggleBlurBackGround.bind(this)


        this.updateZoom = this.updateZoom.bind(this)
        this.rotate = this.rotate.bind(this)
        this.saveImage = this.saveImage.bind(this)
        this.editor = React.createRef()


        this.nameRef = React.createRef();
        this.birthdateRef = React.createRef();
        this.genderRef = React.createRef();
        this.nationalInfoRef = React.createRef();
        this.mobileNoRef = React.createRef();
        this.mobileCoRef = React.createRef();
    }



    componentDidMount() {
        this.setFields()

        this.setState({niceIdVerifyBody: this.props.niceIdVerifyBody}, () => {
            window.name = 'signup';
            // if(isMobile()){
            //     window.eval(window.fnPopup())
            // }else{
            //     window.eval(window.fnPopup())
            // }
        });

        window.addEventListener('message', (event) => {

            if(event.origin === 'https://www.earn-it.co.kr'){

                if(event.data === 'verified'){
                    alert("본인 인증이 완료되었습니다.");
                }
            }
        })
    }


    setFields = () => {

        if(this.props.location.state === undefined){
            return
        }

        console.log('Log In Params',this.props.location.logInParams);

        let logInParams = this.props.location.logInParams;

        this.logInType = logInParams.type;


        switch (logInParams.type) {
            case 'facebook' :

                this.logInId = logInParams.facebookId

                if(logInParams.email !== undefined){
                    this.setState({emailAddress: logInParams.email});
                    this.checkEmail(logInParams.email);

                    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (re.test(logInParams.email)) {

                        this.setState({ isValidEmail: true })
                    }
                }

                if(logInParams.firstName !== undefined){
                    this.setState( {firstName: logInParams.firstName});
                }

                if(logInParams.lastName !== undefined){
                    this.setState({lastName: logInParams.lastName})
                }


                return;

            case 'google' :

                this.logInId = logInParams.googleId

                if(logInParams.email !== undefined){
                    this.setState({emailAddress: logInParams.email});
                    this.checkEmail(logInParams.email);
                    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (re.test(logInParams.email)) {

                        this.setState({ isValidEmail: true })
                    }
                }

                if(logInParams.firstName !== undefined){
                    this.setState( {firstName: logInParams.firstName});
                }

                if(logInParams.lastName !== undefined){
                    this.setState({lastName: logInParams.lastName})
                }

                return;

            case 'naver':
                if(logInParams.email !== undefined){
                    this.setState({emailAddress: logInParams.email});
                    this.checkEmail(logInParams.email);
                    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (re.test(logInParams.email)) {

                        this.setState({ isValidEmail: true })
                    }
                }
                this.logInId = logInParams.naverId;

                return;

            case 'kakao' :
                this.logInId = logInParams.id;

                return;

            default:
                break;
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

    checkEmail = (email) => {
        fetch(RestApi.login.checkEmail + '?' + queryString({email: email}))
            .then(res => {
                return res.json();
            })
            .then(json => {
                let isTaken = json.isTaken;

                this.setState({isEmailTaken: isTaken})
            })
    }

    handleLastName(event) {
        this.setState({lastName: event.target.value})
    }

    handleName() {
        //this.setState({firstName: event.target.value})

        let name = document.getElementById("signUpNameID").value;

        if(name !== null && name !== undefined){
            if(name.length === 0){
                if(window.confirm("본인인증 후 가입 할 수 있습니다.")){
                    window.eval(window.fnPopup())
                    //this.props.verifyID()
                }
            }
        }else{
            if(window.confirm("본인인증 후 가입 할 수 있습니다.")){
                window.eval(window.fnPopup())
                //this.props.verifyID()
            }
        }

    }

    handleUserName(event) {

        let regex = /^[a-zA-Z0-9_-]*$/;
        let userId = event.target.value;
        if(regex.test( event.target.value)){
            this.checkUserId(userId)
            this.setState({userName: event.target.value})
        }else{
            alert('UserID는 영문으로 입력해 주십시요')
        }

    }

    handleEmail(event) {
        this.setState({ emailAddress: event.target.value})
        this.isEmailValid(event)
    }

    isEmailValid(event) {

        let email = event.target.value;

        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {


            this.checkEmail(email);

            this.setState({ isValidEmail: true })
        }else{
            this.setState({ isValidEmail: false })
        }
    }

    handlePassWordFirst(event) {
        this.setState({passWordFirst: event.target.value})
    }

    handlePassWordSecond(event) {
        this.setState({passWordConfirm: event.target.value})
    }

    handleProfileImageSelect() {
        console.log("profileImage Clicked")
        this.fileUpLoader.current.click();
    }

    handleCheckBoxClicked(id) {

        if (id === "agree1") {

            this.setState({agree1: !this.state.agree1})

        } else if (id === "agreePrivateInfo") {

            this.setState({agreePrivateInfo: !this.state.agreePrivateInfo})

        } else if (id === "agreeEmail") {

            this.setState({agreeEmail: !this.state.agreeEmail})

        } else if (id === "agreeSMS") {

            this.setState({agreeSMS: !this.state.agreeSMS})

        } else if (id === "agreeAll") {

            if (this.state.agreeAll === false ) {
                this.setState({
                    agree1: true,
                    agreePrivateInfo: true,
                    agreeEmail: true,
                    agreeSMS: true,
                    agreeAll: true
                })
            } else {
                this.setState({
                    agree1: false,
                    agreePrivateInfo: false,
                    agreeEmail: false,
                    agreeSMS: false,
                    agreeAll: false
                })
            }
        }
    }

    handleSignUpButtonPressed() {





        if(this.state.isIDVerified !== '1'){
            if(window.confirm('본인인증 후 가입 할 수 있습니다.')){
                // this.props.verifyID()
                window.eval(window.fnPopup())
            }else{

            }

            return
        }


        let message = []

        if(this.state.imageArray.length === 0){
            alert('프로필 사진을 선택해 주세요.')
            return
        }

        let name = document.getElementById("signUpNameID").value;

        if(name !== null && name !== undefined){
            if(name.length === 0){
                if(window.confirm("본인인증 후 가입 할 수 있습니다.")){
                    this.props.verifyID();
                    return;
                } else {
                    this.setState({fullName: name})
                }
            }
        }else{
            if(window.confirm("본인인증 후 가입 할 수 있습니다.")){
                this.props.verifyID()
            }

            return;
        }


        if( this.state.emailAddress === "" || this.state.passWordFirst === "" ||
            this.state.passWordConfirm === "" || this.state.agree1 === false || this.state.agreePrivateInfo === false) {


            // if (this.state.lastName === "") {
            //     message.push("성을 입력 해 주세요")
            // }

            // if (this.state.firstName === "") {
            //     message.push("이름을 입력 해 주세요")
            // }

            if (this.state.emailAddress === "") {
                message.push("이메일을 입력 해 주세요")
            }

            if (this.state.passWordFirst === "") {
                message.push("비밀번호를 입력 해 주세요")
            }

            if (this.state.passWordConfirm === "") {
                message.push("비밀번호가 동일하지 않습니다. 다시 확인 해 주세요")
            }

            if (this.state.agree1 === false) {
                message.push("이용약관에 동의 해 주세요")
            }

            if (this.state.agreePrivateInfo === false) {
                message.push("개인정보 수집 및 이용에 동의 해 주세요")
            }

            this.renderAlertMessage(message)



        } else if (this.state.isValidEmail === false ) {

            message.push("올바른 이메일 주소가 아닙니다. 다시 확인해 주세요")

            this.renderAlertMessage(message)

        } else if (this.state.passWordFirst !== this.state.passWordConfirm) {

            message.push("비밀번호가 동일하지 않습니다. 다시 확인해 주세요")

            this.renderAlertMessage(message)

        } else if (this.state.isUserIdTaken) {
            message.push("이미 사용중인 아이디 입니다.")
            this.renderAlertMessage(message)
        } else if (this.state.isEmailTaken) {
            message.push("이미 사용중인 이메일 주소 입니다.")
            this.renderAlertMessage(message)
        }else {

            let logInParams = {type: 'email'};

            if(this.props.location !== undefined){
                logInParams = this.props.location.logInParams;
            }

            console.log(logInParams);

            let params = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                fullName: this.nameRef.current.value,
                email: this.state.emailAddress,
                password: this.state.passWordFirst,
                userId: this.state.userName,
                facebookId: (logInParams.type === 'facebook') ? logInParams.facebookId : null,
                googleId: (logInParams.type === 'google') ? logInParams.googleId : null,
                naverId: (logInParams.type === 'naver') ? logInParams.naverId : null,
                kakaoId: (logInParams.type === 'kakao') ? logInParams.id : null,
                agreeEULA: this.state.agree1,
                agreePrivacyPolicy: this.state.agreePrivateInfo,
                receiveEmail: this.state.agreeEmail,
                receiveSMS: this.state.agreeSMS,
                birthDate: this.birthdateRef.current.value,
                gender: this.genderRef.current.value,
                nationalInfo: this.nationalInfoRef.current.value,
                mobileNo: this.mobileNoRef.current.value,
                mobileCo: this.mobileCoRef.current.value
            }



            let self = this;

            fetch(RestApi.login.addNewUser + '?' + queryString(params))
                .then(res => {
                    return res.json();
                })
                .then( json => {
                    let uniqueId = json.uniqueId;
                    localStorage.setItem("uniqueId", uniqueId);
                    localStorage.setItem('userId', this.state.userId);
                    localStorage.setItem('loggedIn', 'true');


                    if(this.state.imageArray.length === 0){
                        alert('프로필 사진을 선택해 주세요.')
                    }else{
                        let profilePic = this.state.imageArray[0];



                        let formData = new FormData();

                        formData.append('file[]', profilePic.file, uniqueId + '.png');

                        let imageParams = {
                            isBase64: true,
                            uniqueId: uniqueId,
                            profileImageBase64: this.state.profileImageBase64
                        };


                        fetch(RestApi.login.uploadProfilePic,  {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json, text/plain, */*',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(imageParams)
                        })
                            .then(res => {
                                if(res.status === 200) {


                                    //window.location = self.props.location.redirectUrl
                                    window.location = '/'
                                }else if(res.status === 201){
                                    alert('이미 가입된 이메일 입니다')
                                }else{
                                    alert('회원 가입에 실패 했습니다. 다시 시도해 주세요. Error Code: ' + res.status.toString() )
                                }
                            })
                    }
                })

        }
    }


    toggleBlurBackGround() {
        let bluringPage = document.getElementById('signUpBodyID')
        bluringPage.classList.toggle("blurBackGround")
    }

    renderAlertMessage(e) {
        // this.toggleBlurBackGround()
        this.setState({alertMessage: <AlertMessage alertTitle={"Oops..."} messages={e} closeAlert={this.deleteAlertMessage}/>})
    }

    deleteAlertMessage() {
        console.log("alert closed")
        // this.toggleBlurBackGround()
        this.setState({alertMessage: null})

    }


    handleFileUpload = (event) => {
        const filesSelected = event.target.files

        const images = Object.assign([], this.state.imageArray);
        var alertMessage = []
        if (filesSelected.length > 1) {

            alert("이미지를 1개만 선택해 주세요")


        } else {
            for (let i = 0; i < filesSelected.length; i++ ) {
                const filePath = URL.createObjectURL(event.target.files[i])
                const item = {id:filePath, file:event.target.files[i], content: filePath}
                images.push(item)
                this.setState({editingImage: filePath})
            }
        }

        this.setState({imageArray: images })
    }

    saveImage() {

        if (this.editor) {
            // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
            // drawn on another canvas, or added to the DOM.
            //const canvas = this.editor.current.getImage().toDataURL()



            if(this.state.imageArray.length <= 0){
                return;
            }

            // If you want the image resized to the canvas size (also a HTMLCanvasElement)
            const canvasScaled = this.editor.current.getImageScaledToCanvas().toDataURL()



            this.setState({
                profileImage: canvasScaled,

                profileImageBase64: canvasScaled
            })
        }

    }

    updateZoom(e) {
        this.setState({
            zoom: e.target.value
        })
    }


    rotate(direction) {

        let val = this.state.rotate
        if (direction === "right") {
            val += 90
        } else if (direction === "left") {
            val -= 90
        }
        this.setState({
            rotate: val
        })
    }

    renderNiceIdVerification = () => {

        return {__html: this.props.niceIdVerifyBody}
    };

    verify = () => {
        if(this.state.isIDVerified){
            alert('인증이 완료되었습니다.')
        }else{
            window.eval(window.fnPopup())
        }
    };

    render() {
        let idVerifyText = "본인인증";

        if(this.state.isIDVerified){
            idVerifyText = "인증완료";
        }

        return(
            <div className="signUpBody" id="signUpBodyID">
                <div className="profileImageWrapper" onClick={this.handleProfileImageSelect}>
                    <img src={this.state.profileImage}/>
                </div>

                <div className={"imageEditor"}>
                    <div className={"avatarEditor"}>
                        <AvatarEditor
                            image={this.state.editingImage}
                            width={250}
                            height={250}
                            border={0}
                            borderRadius={250}
                            color={[110, 110, 110, 0.6]} // RGBA
                            scale={ this.state.zoom}
                            rotate={this.state.rotate}
                            ref={this.editor}
                        />
                    </div>

                    <div className={"imageEditorTool"}>
                        <div>Zoom</div>
                        <div className={"zoomslide"}>
                            <input type="range" step="0.01" min="0.5" max="2" name="scale" onChange={(e) => this.updateZoom(e)} value={this.state.zoom}/>
                        </div>
                    </div>
                    <div className={"imageEditorTool"}>
                        <div>회전</div>
                        <div className={"rotateButton"} onClick={() => this.rotate("left")}>왼쪽</div>
                        <div className={"rotateButton"} onClick={() => this.rotate("right")}>오른쪽</div>
                    </div>
                    <div className={"imageSaveWrapper"}>
                        <div className={"saveImage imageSelectButton"} onClick={() => this.handleProfileImageSelect()}>이미지 선택</div>
                        <div className={"saveImage"} onClick={() => this.saveImage()}>이미지 저장</div>
                    </div>

                </div>

                <input type="file" name="profileImage" accept=".jpg,.png" ref={this.fileUpLoader} onChange={(event) => this.handleFileUpload(event)} style={{display: "none"}}/>

                <div className="selectPhoto" onClick={this.handleProfileImageSelect}><a>프로필 사진 선택</a></div>

                {/*<div className="signUpInput">*/}
                {/*    <input placeholder={"성"} value={this.state.lastName} onChange={this.handleLastName.bind(this)} type="text"/>*/}
                {/*</div>*/}


                <div className="signUpNameContainer">
                    <div className="signUpInput" >
                        <input id={"signUpNameID"} placeholder={"이름"} ref={this.nameRef} onClick={() => this.handleName()} type="text" readOnly/>
                    </div>

                    <div className={"idVerificationButton"} onClick={() => { this.verify() }}><p id={"idButtonTextID"}>{idVerifyText}</p></div>
                </div>

                <div className="signUpInput">
                    <input placeholder={"User Name (in english)"} value={this.state.userName} onChange={this.handleUserName.bind(this)} name="email" type="text"/>
                </div>

                <div className="inputError">
                    {this.state.isUserIdTaken ? <label>이미 사용중인 아이디 입니다.</label> : null}
                </div>

                <div className="signUpInput">
                    <input placeholder={"email"} value={this.state.emailAddress} onChange={this.handleEmail.bind(this)} type="email"/>
                </div>

                <div className="inputError">
                    {this.state.isEmailTaken ? <label>이미 사용중인 이메일 주소 입니다.</label> : null}
                </div>

                <div className="signUpInput">
                    <input placeholder={"패스워드"} value={this.state.passWordFirst} onChange={this.handlePassWordFirst.bind(this)} type="password"/>
                </div>

                <div className="signUpInput">
                    <input placeholder={"패스워드 확인"} value={this.state.passWordConfirm} onChange={this.handlePassWordSecond.bind(this)} type="password"/>
                </div>

                <div className="agreementWrapper">
                    <div className="agreement"><input type="checkbox" checked={this.state.agree1} onChange={() => this.handleCheckBoxClicked("agree1")}/><a>이용 약관</a></div>
                    <div className="agreement"><input type="checkbox" checked={this.state.agreePrivateInfo} onChange={() => this.handleCheckBoxClicked("agreePrivateInfo")}/><a>개인정보 수집 및 이용</a></div>
                    <div className="agreement"><input type="checkbox" checked={this.state.agreeEmail} onChange={() => this.handleCheckBoxClicked("agreeEmail")}/><a>이메일 수신 동의</a></div>
                    <div className="agreement"><input type="checkbox" checked={this.state.agreeSMS} onChange={() => this.handleCheckBoxClicked("agreeSMS")}/><a>SMS 수신 동의</a></div>
                    <div className="agreement agreeAll"><input type="checkbox" checked={this.state.agreeAll} onChange={() => this.handleCheckBoxClicked("agreeAll")}/><a>전체 동의</a></div>
                </div>
                <div className="signUpLabel"><a>이용 약관</a></div>
                <div className="agreementTextBox">
                    <ServiceUseContract/>
                </div>

                <div className="signUpLabel"><a>개인정 보호를 위한 이용자 동의 사항</a></div>
                <div className="agreementTextBox">
                    <ServiceUseContractUserInfoProtection/>
                </div>

                <div className="singUpButton"
                     onClick={this.handleSignUpButtonPressed.bind(this)}>
                    <a>가입 하기</a>
                </div>

                {this.state.alertMessage}

                <div dangerouslySetInnerHTML={this.renderNiceIdVerification()}/>
                <input hidden={true} id={"signUpVerifiedID"}/>
                <input hidden={true} ref={this.birthdateRef} id={"signUpBirthDateID"}/>
                <input hidden={true} ref={this.genderRef} id={"signUpGenderID"}/>
                <input hidden={true} ref={this.nationalInfoRef} id={"signUpNationalInfoID"}/>
                <input hidden={true} ref={this.mobileNoRef} id={"signUpMobileNoID"}/>
                <input hidden={true} ref={this.mobileCoRef} id={"signUpMobileCoID"}/>

            </div>
        );
    }
}


let mapDispatchToProps = (dispatch) => {
    return{
        verifyID: (params) => dispatch(verifyID(params))
    }
};

let mapStateToProps = (state) => {

    return {
        niceIdVerifyBody: state.user.niceIdVerifyBody
    }
};

SignUp = connect(mapStateToProps, mapDispatchToProps)(SignUp)

export default withRouter(SignUp);