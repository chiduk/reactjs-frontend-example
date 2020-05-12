import React, { Component } from "react";
import "./js/components/ProfilePage.css";
import "./js/components/SignUp.css";
import AvatarEditor from 'react-avatar-editor'
import ProfileImage from "./ProfileImage";
import {getUniqueId, queryString, RestApi, APPLICATION_STATUS} from "./util/Constants";
import fetch from "cross-fetch";
import {connect} from "react-redux";
import {getUserInfo, isInfluencerApplied, updateUserInfo, isSellerApplied, verifyBank} from "./actions/user";
import AlertMessage from "./AlertMessage";
import YesOrNoAlert from "./YesOrNoAlert.js";

import {exReadFile, exCreateImage, exRotate} from "./EXIFImageLoader";



let bankList = [
    {
        "code": "1",
        "name": "한국은행"
    },
    {
        "code": "2",
        "name": "산업은행"
    },
    {
        "code": "3",
        "name": "기업은행"
    },
    {
        "code": "4",
        "name": "국민은행"
    },
    {
        "code": "7",
        "name": "수협은행"
    },
    {
        "code": "8",
        "name": "수출입은행"
    },
    {
        "code": "11",
        "name": "농협은행"
    },
    {
        "code": "12",
        "name": "지역농․축협"
    },
    {
        "code": "20",
        "name": "우리은행"
    },
    {
        "code": "23",
        "name": "SC제일은행"
    },
    {
        "code": "27",
        "name": "한국씨티은행"
    },
    {
        "code": "31",
        "name": "대구은행"
    },
    {
        "code": "32",
        "name": "부산은행"
    },
    {
        "code": "34",
        "name": "광주은행"
    },
    {
        "code": "35",
        "name": "제주은행"
    },
    {
        "code": "37",
        "name": "전북은행"
    },
    {
        "code": "39",
        "name": "경남은행"
    },
    {
        "code": "41",
        "name": "우리카드"
    },
    {
        "code": "44",
        "name": "외환카드"
    },
    {
        "code": "45",
        "name": "새마을금고중앙회"
    },
    {
        "code": "48",
        "name": "신협"
    },
    {
        "code": "50",
        "name": "저축은행"
    },
    {
        "code": "52",
        "name": "모건스탠리은행"
    },
    {
        "code": "54",
        "name": "HSBC은행"
    },
    {
        "code": "55",
        "name": "도이치은행"
    },
    {
        "code": "57",
        "name": "제이피모간체이스은행"
    },
    {
        "code": "58",
        "name": "미즈호은행"
    },
    {
        "code": "59",
        "name": "엠유에프지은행"
    },
    {
        "code": "60",
        "name": "BOA은행"
    },
    {
        "code": "61",
        "name": "비엔피파리바은행"
    },
    {
        "code": "62",
        "name": "중국공상은행"
    },
    {
        "code": "63",
        "name": "중국은행"
    },
    {
        "code": "64",
        "name": "산림조합중앙회"
    },
    {
        "code": "65",
        "name": "대화은행"
    },
    {
        "code": "66",
        "name": "교통은행"
    },
    {
        "code": "67",
        "name": "중국건설은행"
    },
    {
        "code": "71",
        "name": "우체국"
    },
    {
        "code": "76",
        "name": "신용보증기금"
    },
    {
        "code": "77",
        "name": "기술보증기금"
    },
    {
        "code": "81",
        "name": "KEB하나은행"
    },
    {
        "code": "88",
        "name": "신한은행"
    },
    {
        "code": "89",
        "name": "케이뱅크"
    },
    {
        "code": "90",
        "name": "카카오뱅크"
    },
    {
        "code": "101",
        "name": "한국신용정보원"
    },
    {
        "code": "102",
        "name": "대신저축은행"
    },
    {
        "code": "103",
        "name": "에스비아이저축은행"
    },
    {
        "code": "104",
        "name": "에이치케이저축은행"
    },
    {
        "code": "105",
        "name": "웰컴저축은행"
    },
    {
        "code": "106",
        "name": "신한저축은행"
    },
    {
        "code": "209",
        "name": "유안타증권"
    },
    {
        "code": "218",
        "name": "KB증권"
    },
    {
        "code": "221",
        "name": "상상인증권"
    },
    {
        "code": "222",
        "name": "한양증권"
    },
    {
        "code": "223",
        "name": "리딩투자증권"
    },
    {
        "code": "224",
        "name": "BNK투자증권"
    },
    {
        "code": "225",
        "name": "IBK투자증권"
    },
    {
        "code": "227",
        "name": "KTB투자증권"
    },
    {
        "code": "238",
        "name": "미래에셋대우"
    },
    {
        "code": "240",
        "name": "삼성증권"
    },
    {
        "code": "243",
        "name": "한국투자증권"
    },
    {
        "code": "247",
        "name": "NH투자증권"
    },
    {
        "code": "261",
        "name": "교보증권"
    },
    {
        "code": "262",
        "name": "하이투자증권"
    },
    {
        "code": "263",
        "name": "현대차증권"
    },
    {
        "code": "264",
        "name": "키움증권"
    },
    {
        "code": "265",
        "name": "이베스트투자증권"
    },
    {
        "code": "266",
        "name": "SK증권"
    },
    {
        "code": "267",
        "name": "대신증권"
    },
    {
        "code": "269",
        "name": "한화투자증권"
    },
    {
        "code": "270",
        "name": "하나금융투자"
    },
    {
        "code": "278",
        "name": "신한금융투자"
    },
    {
        "code": "279",
        "name": "DB금융투자"
    },
    {
        "code": "280",
        "name": "유진투자증권"
    },
    {
        "code": "287",
        "name": "메리츠종합금융증권"
    },
    {
        "code": "288",
        "name": "바로투자증권"
    },
    {
        "code": "290",
        "name": "부국증권"
    },
    {
        "code": "291",
        "name": "신영증권"
    },
    {
        "code": "292",
        "name": "케이프투자증권"
    },
    {
        "code": "293",
        "name": "한국증권금융"
    },
    {
        "code": "294",
        "name": "한국포스증권"
    },
    {
        "code": "295",
        "name": "우리종합금융"
    },
    {
        "code": "299",
        "name": "아주캐피탈"
    },
    {
        "code": "361",
        "name": "BC카드"
    },
    {
        "code": "364",
        "name": "광주카드"
    },
    {
        "code": "365",
        "name": "삼성카드"
    },
    {
        "code": "366",
        "name": "신한카드"
    },
    {
        "code": "367",
        "name": "현대카드"
    },
    {
        "code": "368",
        "name": "롯데카드"
    },
    {
        "code": "369",
        "name": "수협카드"
    },
    {
        "code": "370",
        "name": "씨티카드"
    },
    {
        "code": "371",
        "name": "NH카드"
    },
    {
        "code": "372",
        "name": "전북카드"
    },
    {
        "code": "373",
        "name": "제주카드"
    },
    {
        "code": "374",
        "name": "하나SK카드"
    },
    {
        "code": "381",
        "name": "KB국민카드"
    },
    {
        "code": "431",
        "name": "미래에셋생명"
    },
    {
        "code": "432",
        "name": "한화생명"
    },
    {
        "code": "433",
        "name": "교보라이프플래닛생명"
    },
    {
        "code": "434",
        "name": "푸본현대생명"
    },
    {
        "code": "435",
        "name": "라이나생명"
    },
    {
        "code": "436",
        "name": "교보생명"
    },
    {
        "code": "437",
        "name": "에이비엘생명"
    },
    {
        "code": "438",
        "name": "신한생명"
    },
    {
        "code": "439",
        "name": "KB생명보험"
    },
    {
        "code": "440",
        "name": "농협생명"
    },
    {
        "code": "441",
        "name": "삼성화재"
    },
    {
        "code": "442",
        "name": "현대해상"
    },
    {
        "code": "443",
        "name": "DB손해보험"
    },
    {
        "code": "444",
        "name": "KB손해보험"
    },
    {
        "code": "445",
        "name": "롯데손해보험"
    },
    {
        "code": "446",
        "name": "오렌지라이프생명보험"
    },
    {
        "code": "447",
        "name": "악사손해보험"
    },
    {
        "code": "448",
        "name": "메리츠화재"
    },
    {
        "code": "449",
        "name": "농협손해보험"
    },
    {
        "code": "450",
        "name": "푸르덴셜생명보험"
    },
    {
        "code": "452",
        "name": "삼성생명"
    },
    {
        "code": "453",
        "name": "흥국생명"
    },
    {
        "code": "454",
        "name": "한화손해보험"
    },
    {
        "code": "455",
        "name": "AIA생명보험"
    },
    {
        "code": "456",
        "name": "DGB생명보험"
    },
    {
        "code": "457",
        "name": "DB생명보험"
    },
    {
        "code": "458",
        "name": "KDB생명보험"
    }
]


class ProfilePersonalInfo extends  Component {
    constructor(props) {
        super(props)
        this.state = {
            lastName: "",
            firstName: "",
            emailAddress: "",
            isValidEmail: false,
            userName: "",
            passWordFirst: "",
            passWordConfirm: "",
            profileImage: <ProfileImage uniqueId={getUniqueId()}/>,
            editingImage: "",
            phoneNumber: "",
            agree1: false,
            agreePrivateInfo: false,
            agreeEmail: false,
            agreeSMS: false,
            agreeAll: false,
            alertMessage: '',
            influencerRequest: "",
            sellerRequest: "",

            instagramLink: "",
            youtubeLink: "",
            blogLink: "",
            citizenNumber: "",
            influencerBankName: '',
            influencerBankNameInfo: "",
            influencerBankHolderInfo: "",
            influencerBankInfo: "",
            influencerBankCode: "",
            influencerBankVerified: false,


            companyName: "",
            businessRegistration: "",
            businessAddress: "",
            shippingAddress: "",
            sellerBankName:'',

            sellerBankNameInfo: "",
            sellerBankHolderInfo: "",
            sellerBankInfo: "",
            sellerBankCode: "",
            sellerBankVerified: false,

            zoom: 1,
            rotate: 0,
            imageEditor: null,

            profileImageBase64: '',
            isUserIdTaken: false,
            isEmailTaken: false,

            applyForInfluencer : false,
            applyForSeller: false,

            updatePassword: '0',

            isInfluencerApplicationPending: false,
            isSellerApplicationPending: false,
            influencerCellPhoneNumber: '',
            sellerCellPhoneNumber:'',


            niceBankVerifyBody: ''

        }

        this.requestClick = this.requestClick.bind(this)
        this.updateInfo = this.updateInfo.bind(this)
        this.handleProfileImageSelect = this.handleProfileImageSelect.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.fileUpLoader = React.createRef()

        this.handleFileUpload = this.handleFileUpload.bind(this)
        this.updateZoom = this.updateZoom.bind(this)
        this.saveImage = this.saveImage.bind(this)
        this.rotate = this.rotate.bind(this)
        this.editor = React.createRef()

        this.props.getUserInfo(this.props.uniqueId)
        this.bankSelected = this.bankSelected.bind(this)

        this.verifyBank = this.verifyBank.bind(this)

        this.closeAlertMessage = this.closeAlertMessage.bind(this)

        this.resultCodeRef = React.createRef();
        this.accountNoRef = React.createRef();
        this.messageRef = React.createRef();

    }

    componentDidMount() {
        window.addEventListener('message', (event) => {

            if(event.origin === 'https://www.earn-it.co.kr'){

                if(event.data === 'bankVerified'){

                    let accountNo = this.accountNoRef.current.value;

                    if(accountNo === this.state.sellerBankInfo && accountNo === this.state.influencerBankInfo){
                        if(this.resultCodeRef.current.value === '0000'){
                            alert('계좌 인증이 완료되었습니다.');
                            this.setState({influencerBankVerified: true, sellerBankVerified: true})
                        }else{
                            alert('계좌 인증이 실패하였습니다. ' + this.messageRef.current.value);
                            this.setState({influencerBankVerified: false, sellerBankVerified: false})
                        }
                    }else if(accountNo === this.state.sellerBankInfo){
                        if(this.resultCodeRef.current.value === '0000'){
                            alert('판매자 계좌 인증이 완료되었습니다.');
                            this.setState({sellerBankVerified: true})
                        }else{
                            alert('판매자 계좌 인증이 실패하였습니다. ' + this.messageRef.current.value);
                            this.setState({isSellerBankVerified: false})
                        }
                    }else if(accountNo === this.state.influencerBankInfo){
                        if(this.resultCodeRef.current.value === '0000'){
                            alert('인플루언서 계좌 인증이 완료되었습니다.');
                            this.setState({influencerBankVerified: true});
                        }else{
                            alert('인플루언서 계좌 인증이 실패하였습니다. ' + this.messageRef.current.value);
                            this.setState({influencerBankVerified: false});
                        }
                    }else{
                        alert('계좌 인증이 실패하였습니다.');
                        this.setState({influencerBankVerified: false, sellerBankVerified: false})
                    }
                }
            }
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.userInfo !== this.props.userInfo){



            this.setState({
                lastName: this.props.userInfo.lastName,
                firstName: this.props.userInfo.firstName,
                emailAddress: this.props.userInfo.email,

                userName: this.props.userInfo.userId,
                instagramLink: this.props.userInfo.instagram,
                youtubeLink: this.props.userInfo.youtube,
                blogLink: this.props.userInfo.blog,

                isInfluencerApplicationPending: this.props.userInfo.isInfluencerApplied,
                isSellerApplicationPending: this.props.userInfo.isSellerApplied
            })
        }
    }


    requestClick(type) {

        if (type === 1) { //influencer

            if(this.state.isInfluencerApplicationPending){
                let message = '현재 승인 검토 중입니다.';

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

                return
            }


            if (this.state.influencerRequest !== APPLICATION_STATUS.PENDING || this.state.influencerRequest !== APPLICATION_STATUS.APPROVED) {
                if (this.state.influencerRequest !== APPLICATION_STATUS.PENDING) {



                    this.setState({applyForInfluencer: true}, () => {

                    });

                    this.setState({
                        influencerRequest: APPLICATION_STATUS.PENDING
                    })
                } else {
                    this.setState({applyForInfluencer: false});

                    this.setState({
                        influencerRequest: ""
                    })
                }
            }
        } else { //seller
            if(this.state.isSellerApplicationPending){
                let message = '현재 승인 검토 중입니다.';

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

                return
            }

            if (this.state.sellerRequest !== APPLICATION_STATUS.PENDING || this.state.sellerRequest !== APPLICATION_STATUS.APPROVED) {
                if (this.state.sellerRequest !== APPLICATION_STATUS.PENDING) {
                    this.setState({applyForSeller: true});

                    this.setState({
                        sellerRequest: APPLICATION_STATUS.PENDING
                    })
                } else {
                    this.setState({applyForSeller: false});
                    this.setState({
                        sellerRequest: ""
                    })
                }
            }
        }

    }

    updateInfo(e, info) {


        if (info === "instagramLink") {
            this.setState({
                instagramLink: e.target.value
            })
        }

        if (info === "youtubeLink") {
            this.setState({
                youtubeLink: e.target.value
            })
        }

        if (info === "blogLink") {
            this.setState({
                blogLink: e.target.value
            })
        }

        if (info === "citizenNumber") {
            this.setState({
                citizenNumber: e.target.value
            })
        }

        if(info === 'influencerBankName'){
            this.setState({influencerBankName: e.target.value})
        }

        if (info === "influencerBankInfo") {

            let regex = /^[0-9]*$/;
            let accountNumber = e.target.value.trim();
            if(regex.test( e.target.value.trim())){

                this.setState({
                    influencerBankVerified:false,
                    influencerBankInfo: e.target.value
                })
            }else{
                alert('계좌번호는 숫자만 입력해 주십시요')
            }




        }

        if (info === "businessRegistration") {

            let regex = /^[0-9]*$/;

            if(regex.test( e.target.value.trim())){

                this.setState({
                    businessRegistration: e.target.value
                })
            }else{
                alert('사업자 등록 번호는 숫자만 입력해 주십시요')
            }


        }

        if( info === 'influencerCellPhoneNumber'){
            let regex = /^[0-9]*$/;

            if(regex.test( e.target.value.trim())){

                this.setState({
                    influencerCellPhoneNumber: e.target.value
                })
            }else{
                alert('휴대전화 번호는 숫자만 입력해 주십시요')
            }
        }

        //sellerCellPhoneNumber
        if( info === 'sellerCellPhoneNumber'){
            let regex = /^[0-9]*$/;

            if(regex.test( e.target.value.trim())){

                this.setState({
                    sellerCellPhoneNumber: e.target.value
                })
            }else{
                alert('휴대전화 번호는 숫자만 입력해 주십시요')
            }
        }

        if (info === "companyName") {
            this.setState({
                companyName: e.target.value
            })
        }

        if (info === "businessAddress") {
            this.setState({
                businessAddress: e.target.value
            })
        }

        if (info === "shippingAddress") {
            this.setState({
                shippingAddress: e.target.value
            })
        }

        if (info === "sellerBankName") {
            this.setState({
                sellerBankName: e.target.value
            })
        }

        if (info === "sellerBankInfo") {

            let regex = /^[0-9]*$/;
            let accountNumber = e.target.value.trim();
            if(regex.test( e.target.value.trim())){

                this.setState({
                    sellerBankVerified:false,
                    sellerBankInfo: e.target.value
                })
            }else{
                alert('계좌번호는 숫자만 입력해 주십시요')
            }


        }

        if (info === "influencerBankNameInfo") {
            this.setState({
                influencerBankVerified:false,
                influencerBankNameInfo: e.target.value
            })
        }

        if (info === "influencerBankHolderInfo") {
            this.setState({
                influencerBankVerified:false,
                influencerBankHolderInfo: e.target.value
            })
        }

        if (info === "sellerBankNameInfo") {
            this.setState({
                sellerBankVerified:false,
                sellerBankNameInfo: e.target.value
            })
        }

        if (info === "sellerBankHolderInfo") {
            this.setState({
                sellerBankVerified:false,
                sellerBankHolderInfo: e.target.value
            })
        }

        if (info === "sellerBankInfo") {
            this.setState({
                sellerBankInfo: e.target.value
            })
        }


    }

    handleUpdate(e, infoType) {

        if (infoType === "lastName") {
            this.setState({
                lastName: e.target.value
            })
        } else if (infoType === "firstName") {
            this.setState({
                firstName: e.target.value
            })
        } else if (infoType === "userName") {

            if(e.target.value.trim() !== this.props.userInfo.userId){

                let regex = /^[a-zA-Z0-9_-]*$/;
                let userId = e.target.value.trim();
                if(regex.test( e.target.value.trim())){
                    this.checkUserId(userId)
                    this.setState({userName: e.target.value})
                }else{
                    alert('UserID는 영문으로 입력해 주십시요')
                }



            }

            this.setState({
                userName: e.target.value
            })
        } else if (infoType === "emailAddress") {

            if(e.target.value.trim() !== this.props.userInfo.email){

                let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (re.test(e.target.value.trim())) {
                    this.checkEmail(e.target.value.trim())
                    this.setState({ isValidEmail: true })
                    this.setState({
                        emailAddress: e.target.value
                    })
                }else{
                    this.setState({ isValidEmail: false })
                }


            }


        } else if (infoType === "passWordFirst") {
            this.setState({
                passWordFirst: e.target.value
            })
        } else if (infoType === "passWordConfirm") {
            this.setState({
                passWordConfirm: e.target.value
            })
        }

    }


    handleProfileImageSelect() {
        this.fileUpLoader.current.click();
    }


    handleFileUpload(event) {

        const filePath = URL.createObjectURL(event.target.files[0]);

        let fixRotation = require('fix-image-rotation');
        let imageFile = [filePath];
        let myRotationFunction = async function (imageFile) {

            return await fixRotation.fixRotation(imageFile)
        }

        let rotatedImageURL;

        let image = myRotationFunction(imageFile);
        image.then(function (data) {

            const reader = new FileReader();
            reader.readAsDataURL(data[0]);
            reader.onloadend = function() {
                rotatedImageURL = reader.result;

                this.setState({
                    editingImage: rotatedImageURL
                })

            }.bind(this)

        }.bind(this))

    }




    updateZoom(e) {
        this.setState({
            zoom: e.target.value
        })
    }

    saveImage() {

        if (this.editor) {
            // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
            // drawn on another canvas, or added to the DOM.
            const canvas = this.editor.current.getImage().toDataURL()

            // If you want the image resized to the canvas size (also a HTMLCanvasElement)
            const canvasScaled = this.editor.current.getImageScaledToCanvas().toDataURL()

            console.log(canvasScaled)

            let self = this;

            this.setState({
                profileImage: <img src={canvasScaled}/>,
                profileImageBase64: canvasScaled
            }, () => {
                self.updateProfileImage()
            })
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

    // renewImage() {
    //
    //     if (this.editor) {
    //
    //         this.setState({
    //             profileImage: ""
    //         }, () => {
    //             this.setState({
    //                 profileImage: require("./image/userIcon@2x.png")
    //             })
    //         })
    //     }
    //
    // }


    save = () => {


        let params = {
            uniqueId: getUniqueId(),
            // firstName: this.state.firstName,
            // lastName: this.state.lastName,
            userId: this.state.userName,
            email: this.state.emailAddress,
            instagram: this.state.instagramLink,
            youtube: this.state.youtubeLink,
            blog: this.state.blogLink,
            applyForInfluencer: '0',
            applyForSeller: '0',
            influencerApplication:{},
            sellerApplication:{},
        };

        // if(this.state.lastName.length <= 0){
        //     let message = "성을 입력해 주세요.";
        //
        //     this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )
        //
        //     return
        // }

        if(this.state.firstName.length <= 0){
            let message = "이름을 입력해 주세요.";

            this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

            return
        }






        if(this.state.isUserIdTaken){
            let message = "이미 사용중인 UserID 입니다. 다른 UserID를 입력해 주세요."

            this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

            return
        }

        if(this.state.isEmailTaken){
            let message = "이미 사용중인 이메일주소 입니다. 다른 이메일주소를 입력해 주세요.";

            this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

            return
        }


        if(this.state.userName.length <= 0){
            let message = "UserID를 입력해 주세요.";

            this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

            return
        }

        if(!this.state.isValidEmail){

            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(this.state.emailAddress.trim())) {
                let message = "올바른 이메일 주소가 아닙니다."

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

                return

            }


        }

        if(this.state.passWordFirst.length > 0){
            if(this.state.passWordFirst !== this.state.passWordConfirm){
                let message = "새로운 비밀번호가 일치하지 않습니다.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )


                this.setState({updatePassword: '0'})
                return
            }else{

                this.setState({updatePassword: '1'})

            }
        }

        if(this.state.applyForInfluencer){


            if(this.state.citizenNumber.length <= 0) {
                let message = "주민등록번호를 입력해주세요.";

                this.setState({
                    alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>
                })

                return
            }

            if(this.state.influencerCellPhoneNumber.length <= 0) {
                let message = "연락 가능한 휴대전화 번호를 입력해주세요.";

                this.setState({
                    alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>
                })

                return
            }

            if(this.state.influencerBankName.length <= 0){
                let message = "인플루언서 정산용 은행명을 입력해주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

                return
            }

            if(this.state.influencerBankHolderInfo.length <= 0){
                let message = "은행 계좌 소유주명을 입력해주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

                return
            }


            if(this.state.influencerBankInfo.length <= 0){
                let message = "인플루언서 정산용 계좌번호를 입력해주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

                return
            }

            if(!this.state.influencerBankVerified){
                let message = "인플루언서 정산용 계좌를 인증해주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

                return
            }


            params.influencerApplication = {
                personalIDNumber: this.state.citizenNumber,
                bankName: this.state.influencerBankName,
                bankAccountHolder: this.state.influencerBankHolderInfo,
                bankAccountNumber: this.state.influencerBankInfo,
                bankCode: this.state.influencerBankCode,
                cellPhoneNumber: this.state.influencerCellPhoneNumber
            };

            params.applyForInfluencer = '1'
        }

        if(this.state.applyForSeller){


            if(this.state.companyName.length <= 0){

                let message = "상호명을 입력해주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )


                return
            }

            if(this.state.businessRegistration.length <= 0){
                let message = "사업자 등록번호를 입력해주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

                return
            }

            if(this.state.sellerCellPhoneNumber.length <= 0) {
                let message = "연락 가능한 휴대전화 번호를 입력해주세요.";

                this.setState({
                    alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>
                })

                return
            }

            if(this.state.businessAddress.length <= 0){
                let message = "사업지 주소를 입력해주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

                return
            }

            if(this.state.shippingAddress.length <= 0){

                let message = "배송지 주소를 입력해주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )


                return
            }

            if(this.state.sellerBankName.length <= 0){
                let message = "판매자 정산용 은행명을 입력해주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

                return
            }

            if(this.state.sellerBankHolderInfo.length <= 0){
                let message = "은행 계좌 소유주명을 입력해주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

                return
            }



            if(this.state.sellerBankInfo.length <= 0){
                let message = "판매자 정산용 계좌번호를 입력해주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

                return
            }


            if(!this.state.sellerBankVerified){
                let message = "판매자 정산용 계좌를 인증해주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )

                return
            }

            params.sellerApplication = {
                sellerName: this.state.companyName,
                businessRegistrationNumber: this.state.businessRegistration,
                businessAddress: this.state.businessAddress,
                shippingAddress: this.state.shippingAddress,
                bankName: this.state.sellerBankName,
                bankCode: this.state.sellerBankCode,
                bankAccountHolder: this.state.sellerBankHolderInfo,
                bankAccountNumber: this.state.sellerBankInfo,
                cellPhoneNumber: this.state.sellerCellPhoneNumber
            }

            params.applyForSeller = '1'

        }

        this.props.updateUserInfo(params, (result) => {
            console.log(result)

            if(result.influencerApplyResult !== 'OK'){

                let message = "인플루언서 신청에 실패 하였습니다. 다시 시도해 주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )


                return
            }

            if(result.sellerApplyResult !== 'OK'){
                let message = "셀러 신청에 실패 하였습니다. 다시 시도해 주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )


                return
            }

            if(result.passwordUpdateResult !== 'OK'){
                let message = "비밀번호 변경에 실패하였습니다.. 다시 시도해 주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )


                return
            }

            if(result.infoUpdateResult !== 'OK'){

                let message = "개인정보 변경에 실패하였습니다. 다시 시도해 주세요.";

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.alertMessageViewToggle()}/>  } )


                return
            }

            let messages = ["개인정보 변경에 성공하였습니다."]

            if(this.state.applyForInfluencer){
                let message = "인플루언서 신청을 완료하였습니다.";

                messages.push(message)
            }

            if(this.state.applyForSeller){
                let message = "셀러 신청을 완료하였습니다.";

                messages.push(message)
            }



            this.setState({alertMessage: <AlertMessage messages={messages} closeAlert={() => this.alertMessageViewToggle()} onOk={() => {window.location = '/Profile'}}/>  } )


        })




        this.updateProfileImage()
    }

    alertMessageViewToggle = () => {


        this.setState({alertMessage: ''})
    }

    updateProfileImage = () => {
        if(getUniqueId() === undefined || getUniqueId() === null || this.state.profileImageBase64.length === 0){
            return
        }


        let params = {
            isBase64: true,
            uniqueId: getUniqueId(),
            profileImageBase64: this.state.profileImageBase64
        };

        fetch(RestApi.login.uploadProfilePic,  {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)

        })
            .then(res => {
                if(res.status === 200){
                    this.setState({
                        profileImage: <ProfileImage uniqueId={getUniqueId()} />
                    })
                }
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

    bankSelectGrow(who) {
        if (who === "influencer") {

            this.setState({
                influencerBankClicked: !this.state.influencerBankClicked
            })

        } else {

            this.setState({
                sellerBankClicked: !this.state.sellerBankClicked
            })

        }
    }

    bankSelected(who, index) {

        let object = bankList[index]



        if (who === "influencer") {
            this.setState({
                influencerBankNameInfo: object.name,
                influencerBankName: object.name,
                influencerBankCode: object.code,
            })
        } else {
            this.setState({
                sellerBankNameInfo: object.name,
                sellerBankName: object.name,
                sellerBankCode: object.code,
            })
        }

        this.bankSelectGrow(who)

    }

    closeAlertMessage() {

        this.setState({
            alertMessage: null
        })

    }

    verifyBank(who) {


        let data = new Date()
        if (who === "influencer") {



            let submit = document.getElementById("influencerBankVerificationSubmitID");
            submit.click()

        } else {

            let submit = document.getElementById("sellerBankVerificationSubmitID");
            submit.click()
        }
    }

    submitInfluencerBankVerificationForm = (event) => {
        event.preventDefault()

        let params = {
            strBankCode: this.state.influencerBankCode,
            strAccountNo: this.state.influencerBankInfo,
            USERNM: this.state.influencerBankHolderInfo,
            JUMINNO: this.state.citizenNumber.substring(0,6),
            service: "2",
            svcGbn: "2",
            svc_cls: ""
        };

        this.props.verifyBank(params, () => {

            window.verification();
        })

    };

    submitSellerBankVerificationForm = (event) => {

        event.preventDefault();

        let params = {
            strBankCode: this.state.sellerBankCode,
            strAccountNo: this.state.sellerBankInfo,
            USERNM: this.state.sellerBankHolderInfo,
            JUMINNO: this.state.citizenNumber.substring(0,6),
            service: "2",
            svcGbn: "2",
            svc_cls: ""
        };

        this.props.verifyBank(params, () => {

            window.verification();
        })

    };

    renderNiceBankVerification = () => {

        return {__html: this.props.niceBankVerifyBody}
    };

    checkBankVerification = () => {



        if(this.props.niceBankVerifyBody.length > 0){
            let script = /<script>(.+)<\/script>/gi.exec(this.props.niceBankVerifyBody);


            window.eval(script[1]);
        }
    };


    render() {

        let influenceRequest;
        if (this.state.influencerRequest === APPLICATION_STATUS.PENDING ) {
            influenceRequest = "인플루언서 신청중"
        } else if (this.state.influencerRequest === APPLICATION_STATUS.APPROVED) {
            influenceRequest = "인플루언서 신청 완료"
        } else {
            influenceRequest = "인플루언서 신청"
        }

        let sellerRequest;
        if (this.state.sellerRequest === APPLICATION_STATUS.PENDING) {
            sellerRequest = "셀러 신청중"
        } else if (this.state.sellerRequest === APPLICATION_STATUS.APPROVED) {
            sellerRequest = "셀러 신청 완료"
        } else {
            sellerRequest = "셀러 신청"
        }

        if(this.state.isInfluencerApplicationPending){
            influenceRequest = "인플루언서 신청중"
        }

        if(this.state.isSellerApplicationPending){
            sellerRequest = "셀러 신청중"
        }

        
        
        let influencerVerified;
        let sellerVerified;

        if (this.state.influencerBankVerified) {
            influencerVerified = "인증 완료 되었습니다."
        } else {
            influencerVerified = "계좌 인증"
        }



        if (this.state.sellerBankVerified) {
            sellerVerified = "인증 완료 되었습니다."
        } else {
            sellerVerified = "계좌 인증"
        }

        return (
            <div className="signUpBody">
                <div className="profileImageWrapper" >
                    {this.state.profileImage}
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

                {/*<EXIFImageLoader type="file" name="profileImage" accept={".png,.jpg,.jpeg"} ref={this.fileUpLoader} onChange={(event) => this.handleFileUpload(event)} style={{display: "none"}} />*/}
                <input type="file" name="profileImage" accept={".png,.jpg,.jpeg"} ref={this.fileUpLoader} onChange={(event) => this.handleFileUpload(event)} style={{display: "none"}}/>

                <div className="selectPhoto" onClick={this.handleProfileImageSelect}><a>프로필 사진 선택</a></div>

                {/*<div className="signUpInput">*/}
                {/*    <input placeholder={"성"} value={this.state.lastName} onChange={(event, lastName) => this.handleUpdate(event, "lastName")} type="text"/>*/}
                {/*</div>*/}

                <div className="signUpInput">
                    <input placeholder={"이름"} value={this.state.firstName} type="text" readOnly/>
                </div>

                <div className="signUpInput">
                    <input placeholder={"User Name (in english)"} value={this.state.userName} onChange={(event, userName) => this.handleUpdate(event, "userName")} type="text"/>
                </div>

                <div className="inputError">
                    {this.state.isUserIdTaken ? <label>이미 사용중인 아이디 입니다.</label> : null}
                </div>

                <div className="signUpInput">
                    <input placeholder={"email"} value={this.state.emailAddress} onChange={(event, emailAddress) => this.handleUpdate(event, 'emailAddress')} type="email"/>
                </div>

                <div className="inputError">
                    {this.state.isEmailTaken ? <label>이미 사용중인 이메일 주소 입니다.</label> : null}
                </div>

                <div className="signUpInput">
                    <input placeholder={"새로운 비밀번호 (변경을 원할 경우에만 입력)"} value={this.state.passWordFirst} onChange={(event, passWordFirst) => this.handleUpdate(event, "passWordFirst")} type="password"/>
                </div>

                <div className="signUpInput">
                    <input placeholder={"새로운 비밀번호 확인"} value={this.state.passWordConfirm} onChange={(event, passWordConfirm) => this.handleUpdate(event, "passWordConfirm")} type="password"/>
                </div>

                <div className="signUpInput">
                    <input placeholder={"Instagram Account Link"} value={this.state.instagramLink} onChange={(e, type) => this.updateInfo(e, "instagramLink")} type="URL"/>
                </div>

                <div className="signUpInput">
                    <input placeholder={"Youtube Account Link"} value={this.state.youtubeLink} onChange={(e, type) => this.updateInfo(e, "youtubeLink")} type="text"/>
                </div>

                <div className="signUpInput">
                    <input placeholder={"Blog Link"} value={this.state.blogLink} onChange={(e, type) => this.updateInfo(e, "blogLink")} type="text"/>
                </div>

                <div className={"signUpInput signUpStatusWrapper"}>
                    <div className={"signUpItems"} onClick={()=> this.requestClick(1)}>{influenceRequest}</div>
                    <div className={"signUpItems"} onClick={()=> this.requestClick(2)}>{sellerRequest}</div>
                </div>

                <div className={`influencerInfoWrapper ${this.state.influencerRequest !== "" ? "growInfoWrapper" : ""}`}>

                    <div className="signUpInput">
                        <input type={"number"} placeholder={"주민번호 (원천징수 용, '-' 없이 번호만 입력)"} value={this.state.citizenNumber} onChange={(e, type) => this.updateInfo(e, "citizenNumber")} type="text"/>
                    </div>



                    <div className="signUpInput">
                        <input placeholder={"휴대전화 번호 ('-' 없이 번호만 입력)"} value={this.state.influencerCellPhoneNumber} onChange={(e, type) => this.updateInfo(e, "influencerCellPhoneNumber")} type="text"/>
                    </div>

                    <div className="signUpInput">
                        <input readOnly placeholder={"입금 계좌 은행명 (정산용)"} onClick={() => this.bankSelectGrow("influencer")} value={this.state.influencerBankNameInfo} onChange={(e, type) => this.updateInfo(e, "influencerBankNameInfo")} type="text"/>
                        <div className={`bankSelectWrapper ${this.state.influencerBankClicked ? "bankSelectWrapperGrow" : ""}`}>
                            {/*sellerBankClicked*/}
                            {bankList.map((i, index) => {
                                return (

                                    <div className={"bankSelectButton"} onClick={() => this.bankSelected("influencer", index)}>
                                        {i.name}
                                    </div>

                                );
                            })}
                        </div>
                    </div>
                    <div className="signUpInput">
                        <input placeholder={"입금 계좌 소유 명 (정산용)"} value={this.state.influencerBankHolderInfo} onChange={(e, type) => this.updateInfo(e, "influencerBankHolderInfo")} type="text"/>
                    </div>

                    <div className="signUpInput">
                        <input type={"number"} placeholder={"계좌 번호 (정산용, '-' 없이 번호만 입력)"} value={this.state.influencerBankInfo} onChange={(e, type) => this.updateInfo(e, "influencerBankInfo")} type="text"/>
                    </div>

                    <div className="signUpInput" onClick={() => this.verifyBank("influencer")}>
                        <div className={"verifyBank"}>{influencerVerified}</div>
                    </div>

                </div>


                <div className={`influencerInfoWrapper ${this.state.sellerRequest !== "" ? "growInfoWrapper" : ""}`}>
                    <div className="signUpInput">
                        <input placeholder={"상호명"} value={this.state.companyName} onChange={(e, type) => this.updateInfo(e, "companyName")} type="text"/>
                    </div>

                    <div className="signUpInput">
                        <input type={"number"} placeholder={"사업자 등록증, '-' 없이 번호만 입력)"} value={this.state.businessRegistration} onChange={(e, type) => this.updateInfo(e, "businessRegistration")} type="text"/>
                    </div>
                    <div className="signUpInput">
                        <input placeholder={"휴대전화번호"} value={this.state.sellerCellPhoneNumber} onChange={(e, type) => this.updateInfo(e, "sellerCellPhoneNumber")} type="text"/>
                    </div>
                    <div className="signUpInput">
                        <input placeholder={"사업장 주소"} value={this.state.businessAddress} onChange={(e, type) => this.updateInfo(e, "businessAddress")} type="text"/>
                    </div>
                    <div className="signUpInput">
                        <input placeholder={"배송 발송지 주소"} value={this.state.shippingAddress} onChange={(e, type) => this.updateInfo(e, "shippingAddress")} type="text"/>
                    </div>

                    <div className="signUpInput">
                        <input placeholder={"입금 계좌 은행 명(정산용)"} onClick={() => this.bankSelectGrow("seller")} value={this.state.sellerBankNameInfo} onChange={(e, type) => this.updateInfo(e, "sellerBankNameInfo")} type="text"/>
                        <div className={`bankSelectWrapper ${this.state.sellerBankClicked ? "bankSelectWrapperGrow" : ""}`}>
                            {bankList.map((i, index) => {
                                return (

                                    <div className={"bankSelectButton"} onClick={() => this.bankSelected("seller", index)}>
                                        {i.name}
                                    </div>

                                );
                            })}
                        </div>
                    </div>

                    <div className="signUpInput">
                        <input placeholder={"입금 계좌 소유주 명 (정산용)"} value={this.state.sellerBankHolderInfo} onChange={(e, type) => this.updateInfo(e, "sellerBankHolderInfo")} type="text"/>
                    </div>

                    <div className="signUpInput">
                        <input type={"number"} placeholder={"계좌 번호 (정산용, '-' 없이 번호만 입력)"} value={this.state.sellerBankInfo} onChange={(e, type) => this.updateInfo(e, "sellerBankInfo")} type="text"/>
                    </div>

                    <div className="signUpInput" onClick={() => this.verifyBank("seller")}>
                        <div className={"verifyBank"}>{sellerVerified}</div>
                    </div>
                </div>

                <div className={"infoSaveButton"} onClick={() => this.save()}>저장</div>

                {this.state.alertMessage}

                <form name="influencerBankVerificationForm" onSubmit={this.submitInfluencerBankVerificationForm}>
                    <input type="hidden" name="service" value="2"/>
                    <input type="hidden" name="svcGbn"  value="2"/>
                    <input type="hidden" name="svc_cls" value=""/>
                    <input type="hidden" name="strBankCode" value={this.state.influencerBankCode}/>
                    <input type="hidden" name="strAccountNo" value={this.state.influencerBankInfo}/>
                    <input type="hidden" name="USERNM" value={this.state.influencerBankHolderInfo}/>
                    <div style={{display: 'none'}}>
                        <input id={"influencerBankVerificationSubmitID"} type={"submit"}/>
                    </div>
                </form>

                <form name="sellerBankVerificationForm" onSubmit={this.submitSellerBankVerificationForm} method="POST" action="niceid/bankVerification/request.php">
                    <input type="hidden" name="service" value="2"/>
                    <input type="hidden" name="svcGbn"  value="2"/>
                    <input type="hidden" name="svc_cls" value=""/>
                    <input type="hidden" name="strBankCode" value={this.state.sellerBankCode}/>
                    <input type="hidden" name="strAccountNo" value={this.state.sellerBankInfo}/>
                    <input type="hidden" name="USERNM" value={this.state.sellerBankHolderInfo}/>
                    <div style={{display: 'none'}}>
                        <input id={"sellerBankVerificationSubmitID"} type={"submit"}/>
                    </div>

                </form>

                <div style={{display:'none'}} dangerouslySetInnerHTML={this.renderNiceBankVerification()} onLoad={this.checkBankVerification()}/>
                <input id={'resultCodeID'} ref={this.resultCodeRef} type='hidden'/>
                <input id={'messageID'} ref={this.messageRef} type='hidden'/>
                <input id={'accountNoID'} ref={this.accountNoRef} type='hidden'/>

            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        userInfo: state.stella.myInfo,
        niceBankVerifyBody: state.user.niceBankVerifyBody
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        getUserInfo: (uniqueId) => dispatch(getUserInfo(uniqueId)),
        updateUserInfo: (params,callback) => dispatch(updateUserInfo(params,callback)),
        isInfluencerApplied: (params) => dispatch(isInfluencerApplied(params)),
        isSellerApplied: (params) => dispatch(isSellerApplied(params)),
        verifyBank: (params, callback) => dispatch(verifyBank(params, callback))
    }
};

ProfilePersonalInfo = connect(mapStateToProps, mapDispatchToProps)(ProfilePersonalInfo);

export default ProfilePersonalInfo;