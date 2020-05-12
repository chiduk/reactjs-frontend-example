import React, { Component } from "react";
import "./js/components/ProfilePage.css";
import ProfileSocial from "./ProfileSocial.js";
import ProfileOrderStatus from "./ProfileOrderStatus.js";
import ProfilePersonalInfo from "./ProfilePersonalInfo.js";
import ProfileShippingInfo from "./ProfileShippingInfo.js";
import ProfilePaymentInfo from "./ProfilePaymentInfo.js";
import AddAddressView from "./AddAddressView";
import {connect} from "react-redux";
import {getUniqueId} from "./util/Constants";

class ProfilePageBottom extends Component{
    constructor(props) {
        super(props)
        this.leftTapClick = this.leftTapClick.bind(this)
        this.socialId = React.createRef()
        this.state = {
            isSocialHidden: true,
            isOrderHidden: true,
            isPersonalInfoHidden: true,
            isShippingInfoHidden: true,
            isPaymentMethodHidden: true,
            addressEditorView: null,
            isViewSelectedClicked: false,
            isLoadFirstTime: true,
            viewName: "관리 뷰 선택"
        };
        this.toggleAddressEditor = this.toggleAddressEditor.bind(this)
        this.toggleViewSelectButton = this.toggleViewSelectButton.bind(this)
    }

    componentWillMount() {

        document.addEventListener('mousedown', this.handleOutsideClick, false)

    }

    componentWillUnmount() {

        document.removeEventListener('mousedown', this.handleOutsideClick, false)

    }

    componentDidMount() {

        this.socialId.current.click()
        this.setState({
            isLoadFirstTime: false
        })
    }

    handleOutsideClick = (e) =>{

        if (!this.node.contains(e.target) && !this.viewTypeNode.contains(e.target)) {
            this.closeViewOptionButton()
        }

    };

    closeViewOptionButton = () => {
        this.setState({
            isViewSelectedClicked: false
        })
    };

    leftTapClick(id, name) {
        const buttons = document.getElementsByClassName("profileLeftButton")

        for (let i = 0; i < buttons.length; i ++) {
            let element = buttons[i]
            const elementID = element.getAttribute('id')
            // const view = document.getElementById(elementID + "View")
            if (elementID === id) {
                element.style.fontWeight = "bold";
                element.style.color = "#FF0000";
                // view.style.display = ""
            } else {
                element.style.fontWeight = "normal";
                element.style.color = "#282c34";
                // view.style.display = "none"
            }
        }

        if (id === "socialId") {
            this.setState({
                isSocialHidden: false,
                isOrderHidden: true,
                isPersonalInfoHidden: true,
                isShippingInfoHidden: true,
                isPaymentMethodHidden: true
            })
        } else if (id === "orderTapID") {
            this.setState({
                isSocialHidden: true,
                isOrderHidden: false,
                isPersonalInfoHidden: true,
                isShippingInfoHidden: true,
                isPaymentMethodHidden: true
            })
        } else if (id === "personalInfoTapID") {
            this.setState({
                isSocialHidden: true,
                isOrderHidden: true,
                isPersonalInfoHidden: false,
                isShippingInfoHidden: true,
                isPaymentMethodHidden: true
            })
        } else if (id === "shippingInfoID") {
            this.setState({
                isSocialHidden: true,
                isOrderHidden: true,
                isPersonalInfoHidden: true,
                isShippingInfoHidden: false,
                isPaymentMethodHidden: true
            })
        } else if (id === "purchaseID") {
            this.setState({
                isSocialHidden: true,
                isOrderHidden: true,
                isPersonalInfoHidden: true,
                isShippingInfoHidden: true,
                isPaymentMethodHidden: false
            })
        }else if (id === "logoutID"){
            localStorage.removeItem('uniqueId');
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userId');
            localStorage.removeItem('name');
            window.location ='/'
        }
        if (this.state.isLoadFirstTime === false) {
            this.toggleViewSelectButton(name)
        }
    }



    openAddressAddView = () => {

        if (this.state.addressEditorView === null ) {
            //this.setState({addressEditorView : <AddAddressView closeView={this.toggleAddressEditor} content={content}/>})
            //this.setState({addressEditorView : <DaumPostcode/>})

        } else {
            this.setState({addressEditorView : null})
        }

        let self = this;

        new window.daum.Postcode({
            onComplete: function (data) {
                console.log(data)

                self.setState({addressEditorView : <AddAddressView closeView={self.toggleAddressEditor} editInfo={true} content={data}/>})
            }
        }).open()
    };

    toggleAddressEditor = (content, isForEditInfo) => {
        if (this.state.addressEditorView === null ) {
            this.setState({addressEditorView : <AddAddressView closeView={this.toggleAddressEditor} editInfo={isForEditInfo} content={content}/>})
        } else {
            this.setState({addressEditorView : null})
        }
    };

    toggleViewSelectButton(name) {
        this.setState({
            isViewSelectedClicked: !this.state.isViewSelectedClicked,
            viewName: name
        })
    }

    render() {


        let isOtherUser = false

        if (this.props.uniqueId === getUniqueId()) {


        }else{

            isOtherUser = true
        }

        return (

            <div className={"profileBottom"}>


                <div className={"profileViewSelectButton"} ref={node => this.node = node} onClick={() => this.toggleViewSelectButton("관리 뷰 선택") }> {this.state.viewName} <img className={`profileViewSelectButtonImg ${this.state.isViewSelectedClicked ? "rotateArrowImg" : ""}`} src={require("./image/triangleRed.png")}/></div>

                <div>
                    <div ref={node => this.viewTypeNode = node} className={`profileleftSide ${this.state.isViewSelectedClicked ? "profileleftSideGrow" : ""}`} style={{display: `${isOtherUser ? "none" : "block"}`}}>
                        <div className={"profileLeftButton"} id={"socialId"} onClick={() => this.leftTapClick("socialId", "소셜")} ref={this.socialId}><a>소셜</a></div>
                        <div className={"profileLeftButton"} id={"orderTapID"} onClick={() => this.leftTapClick("orderTapID", "주문목록")}><a>주문 목록</a></div>
                        <div className={"profileLeftButton"} id={"personalInfoTapID"} onClick={() => this.leftTapClick("personalInfoTapID", "개인 정보 관리")}><a>개인 정보 관리</a></div>
                        <div className={"profileLeftButton"} id={"shippingInfoID"} onClick={() => this.leftTapClick("shippingInfoID", "배송지 관리")}><a>배송지 관리</a></div>
                        {/*<div className={"profileLeftButton"} id={"purchaseID"} onClick={() => this.leftTapClick("purchaseID", "결제 수단 관리")}><a>결제 수단 관리</a></div>*/}
                        <div className={"profileLeftButton"} id={"logoutID"} onClick={() => this.leftTapClick("logoutID", "로그아웃")}><a>로그아웃</a></div>
                    </div>
                </div>


                <div className={`profileRightSide ${isOtherUser ? "forOtherUserProfile" : ""}`} >
                    <div className={`rightView ${isOtherUser ? "profileFullWidth" : ""} `} id={"socialIdView"} style={ this.state.isSocialHidden ? {display: 'none'} : {display: 'block'} }>
                        <ProfileSocial uniqueId={this.props.uniqueId}/>
                    </div>
                    <div className={`rightView`} id={"orderTapIDView"} style={ this.state.isOrderHidden ? {display: 'none'} : {display: 'block'} }>
                        <ProfileOrderStatus/>
                    </div>
                    <div className={"rightView"} id={"personalInfoTapIDView"} style={ this.state.isPersonalInfoHidden ? {display: 'none'} : {display: 'block'} }>
                        <ProfilePersonalInfo/>
                    </div>
                    <div className={"rightView"} id={"shippingInfoIDView"} style={ this.state.isShippingInfoHidden ? {display: 'none'} : {display: 'block'} }>
                        <ProfileShippingInfo toggleAddressEditor={this.toggleAddressEditor} openAddressAddView={(content) => this.openAddressAddView(content)}/>
                    </div>
                    <div className={"rightView"} id={"purchaseIDView"} style={ this.state.isPaymentMethodHidden ? {display: 'none'} : {display: 'block'} }>
                        <ProfilePaymentInfo/>
                    </div>
                </div>
                {this.state.addressEditorView}
            </div>
        );
    }

}

let mapStateToProps = (state) => {
    return{

    }
};

ProfilePageBottom = connect(mapStateToProps, undefined)(ProfilePageBottom);

export default ProfilePageBottom;