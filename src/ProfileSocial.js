import React, { Component } from "react";
import "./js/components/ProfilePage.css";

import ProfileSocialPage from "./ProfileSocialPage.js";
import ProfileSavedPage from "./ProfileSavedPage.js";
import ProfileForumPage from "./ProfileForumPage.js";
import ProfileProductReview from "./ProfileProductReview.js";
import {getSaved, getFeed} from "./actions/user";
import {connect} from "react-redux";
import {getUniqueId, PROFILE_SOCIAL_VIEW_MODE} from "./util/Constants";
import {setProfileSocialViewMode} from "./actions/feed";


class ProfileSocial extends  Component {
    constructor(props) {
        super(props)
        this.tapClicked = this.tapClicked.bind(this)
        this.state = {
            brickPosition: {
                left: "0px"
            },
            brickWidth: "0px",
            socialFeedViewMode: "판매중 피드만 보기",
        }
        this.socialRef = React.createRef()
        this.likePressed = this.likePressed.bind(this)
        this.filterClicked = this.filterClicked.bind(this)
        this.optionClicked = this.optionClicked.bind(this)
    }


    componentDidMount() {
        this.socialRef.current.click()
        // console.log('SCROLL TO SAVED', this.props.scrollToSaved);
        //
        // if(this.props.scrollToSaved){
        //     this.tapClicked("bottomFan");
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {


        if(prevProps.scrollToSaved !== this.props.scrollToSaved){
           if(this.props.scrollToSaved){
               this.tapClicked("bottomFan")
           }

        }
    }


    closeMenu = () => {
        let allElems = document.querySelectorAll('[id^="profileProductReviewReplyBox"]');
        allElems.forEach(elem => {

            if(elem.style.visibility === 'visible'){
                elem.classList.toggle('replyBoxOpen');
                elem.style.visibility = 'hidden'
            }

        });

        let elements = document.querySelectorAll('[id^="optionBox"]');
        elements.forEach(element => {
            element.style.visibility = 'hidden'
        })

        let jpElems = document.querySelectorAll('[id^="jpOptionBox"]');
        jpElems.forEach(element => {
            element.style.visibility = 'hidden'
        })


    }

    tapClicked(id) {

        this.closeMenu()

        if(id === "bottomSocial"){

            let params = {
                uniqueId: this.props.uniqueId,
                viewMode : PROFILE_SOCIAL_VIEW_MODE.VIEW_FOR_SALE
            }

            this.props.getFeed(params)
        }else if(id === "bottomFan"){

            console.log(this.props.uniqueId)

            this.props.getSaved({uniqueId: this.props.uniqueId})
        }

        const taps = document.getElementsByClassName("socialTapButton")
        for (var i = 0; i < taps.length; i++) {
            const element = taps[i]
            const elementID = element.getAttribute('id')
            const view = document.getElementById(elementID + "View")
            if (elementID === id) {
                element.style.color = "#FF0000";
                element.style.fontWeight = "bold";
                view.style.visibility = ""

            } else {
                element.style.color = "#282c34";
                element.style.fontWeight = "normal";
                view.style.visibility = "hidden"
            }
        }

        const line = document.getElementById('profileSocialLineID')
        const lineOffset = line.offsetLeft

        const buttonElement = document.getElementById(id)
        const buttonWidth = buttonElement.offsetWidth

        const elementLeftCoordinate = buttonElement.offsetLeft


        const coordinate = {
            left: elementLeftCoordinate - lineOffset,
            width: buttonWidth
        }

        this.setState({brickPosition: coordinate})

        this.setView(id)
    }



    likePressed(index) {
        const element = document.getElementById("profileSocialForumLike" + index);
        element.style.animation = "";
        void element.offsetWidth;
        element.style.animation = "bounce 0.3s 1";
    }

    filterClicked() {
        console.log("filter clicked")

        const element = document.getElementById('filterButtonID')
        element.classList.toggle('filterClicked')

        const optionContainer = document.getElementById('filterOptionID')
        optionContainer.classList.toggle('filterOptionOpen')
    }

    optionClicked(type) {

        if (type === "selling") {
            this.setState({socialFeedViewMode: "판매중 피드만 보기"})
            this.props.setProfileSocialVewMode(PROFILE_SOCIAL_VIEW_MODE.VIEW_FOR_SALE)
            let params = {
                uniqueId: this.props.uniqueId,
                viewMode: PROFILE_SOCIAL_VIEW_MODE.VIEW_FOR_SALE
            };

            this.props.getFeed(params)

        } else {
            this.setState({socialFeedViewMode: "전체 피드 보기"})
            this.props.setProfileSocialVewMode(PROFILE_SOCIAL_VIEW_MODE.VIEW_ALL)
            let params = {
                uniqueId: this.props.uniqueId,
                viewMode: PROFILE_SOCIAL_VIEW_MODE.VIEW_ALL
            };

            this.props.getFeed(params)
        }
        this.filterClicked()
    }


    setView =(id)=> {

        this.setState({
            isSocialOn: false,
            isForumOn: false,
            isReviewOn: false,
            isSaveOn: false,
        })

        if (id === "bottomSocial") {

            this.setState({
                isSocialOn: true,
            })

        } else if (id === "bottomForum") {
            this.setState({
                isForumOn: true,
            })

        } else if (id === "bottomReview") {
            this.setState({
                isReviewOn: true,
            })

        } else if (id === "bottomFan") {
            this.setState({
                isSaveOn: true,
            })

        }

    }

    render() {

        return (
            <div className={"socialTapView"}>
                <div className={"socialTapBar"}>
                    <div className={"socialTapButton"} id={"bottomSocial"} onClick={() => this.tapClicked("bottomSocial")} ref={this.socialRef}><a>Social</a></div>
                    <div className={"socialTapButton"} id={"bottomForum"} onClick={() => this.tapClicked("bottomForum")}><a>Forum</a></div>
                    <div className={"socialTapButton"} id={"bottomReview"} onClick={() => this.tapClicked("bottomReview")}><a>Review</a></div>
                    <div className={"socialTapButton"} id={"bottomFan"} onClick={() => this.tapClicked("bottomFan")}><a>Saved</a></div>
                </div>

                <div className={"profileTapLineWrapper"}>
                    <div className={"profileSocialLine"} id={"profileSocialLineID"}/>
                    <div className={"tapBrick"} style={this.state.brickPosition}/>
                </div>

                <div className={"socialPage"} id={"bottomSocialView"} style={{display: `${this.state.isSocialOn ? "block" : "none"}`}}>
                    <div className={"profileFeedFilter"} id={"filterButtonID"} onClick={this.filterClicked}>
                        <a>filter</a>
                        <img src={require("./image/triangleRed.png")}/>
                        <a className={"filterOptionStatus"}>{this.state.socialFeedViewMode}</a>
                    </div>
                    <div className={"filterOption"} id={"filterOptionID"}>
                        <div className={"filterOptionButton"} onClick={() => this.optionClicked("selling")}><a>판매중 피드만 보기</a></div>
                        <div className={"filterOptionButton"} onClick={() => this.optionClicked("all")}><a>전체 피드 보기</a></div>
                    </div>
                    <ProfileSocialPage uniqueId={this.props.uniqueId}/>
                </div>

                <div className={"socialPage"} id={"bottomForumView"} style={{display: `${this.state.isForumOn ? "block" : "none"}`}}>
                    <ProfileForumPage uniqueId={this.props.uniqueId} likePressedProp={(index) => this.likePressed(index)}/>
                </div>

                <div className={"socialPage"} id={"bottomReviewView"} style={{display: `${this.state.isReviewOn ? "block" : "none"}`}}>
                    <ProfileProductReview uniqueId={this.props.uniqueId}/>
                </div>

                <div className={"socialPage"} id={"bottomFanView"} style={{display: `${this.state.isSaveOn ? "block" : "none"}`}}>

                    <ProfileSavedPage uniqueId={this.props.uniqueId}/>
                </div>

            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        getFeed: (params) => dispatch(getFeed(params)),
        getSaved: (params) => dispatch(getSaved(params)),
        setProfileSocialVewMode: (viewMode) => dispatch(setProfileSocialViewMode(viewMode))
    }
};

let mapStateToProps = (state) => {
    return {
        scrollToSaved: state.user.scrollToSaved
    }
}

ProfileSocial = connect(mapStateToProps, mapDispatchToProps)(ProfileSocial);

export default ProfileSocial;