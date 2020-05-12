import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./js/components/Home.css";

import close from "./image/hashX.png";
import addTagButton from "./image/plusButton.png";

import HomeMarketShare from "./HomeMarketShare.js";
import HomeFeed from "./HomeFeed.js";
import { connect } from 'react-redux'
import {
    getJointPurchase,
    getFeeds,
    getJointPurchaseFollowing,
    getFeedsFollowing,
    setViewMode,
    setViewTagMode
} from './actions/home';
import {setSavedFeedHashTags} from './actions/feed'
import {getHashTagInfluencer, getMyInfo, verifyID} from './actions/user'

import {getUniqueId, queryString, RestApi, HOME_FEED_VIEW_MODE, HOME_FEED_TAG_VIEW_MODE} from "./util/Constants";

import fetch from 'cross-fetch'
import SearchFeedView from "./SearchFeedView.js";
import LogInPage from "./LogInPage.js";
import {getNotificationCount} from "./actions/notification";
import {getCartItemCount} from "./actions/cart";
import naver from "./config/naver";
import {loadNaverScript} from "./App";
import {withRouter} from 'react-router';
import Footer from "./Footer";

class Home extends Component {
    constructor(prop) {

        super(prop);

        this.state = {
            isLoaded: false,
            feeds:{},
            logInAction: '',
            tagArray: [],
            lineBrickPosition: {
                left: "0px",
                width: "0px",
            },

            isGrowTagViewClicked: false,

            isViewAllTags: true,
            viewTaglineBrickPosition: {
                left: "0px",
                width: "0px",
            },
        };


        this.renderHashTag = this.renderHashTag.bind(this);
        this.toggleSearchView = this.toggleSearchView.bind(this)

        this.renderSearchHashTagList = this.renderSearchHashTagList.bind(this)
        this.addHashTag = this.addHashTag.bind(this);

        this.openLogInPage = this.openLogInPage.bind(this);


        this.homeFeedElement = React.createRef()
        this.viewAll = React.createRef();

        this.growHashTagContainerClick = this.growHashTagContainerClick.bind(this)

        this.viewSortButtonClicked = this.viewSortButtonClicked.bind(this)

        this.props.getNotificationCount();
        this.props.getCartItemCount();

        this.viewTagsSetting = this.viewTagsSetting.bind(this)
        this.viewAllTags = React.createRef()

        this.searchFeedViewDivRef = React.createRef();
        this.searchFeedViewRef = React.createRef();

        let self = this;

        loadNaverScript()
            .then(() => {
                self.naverlogin  = new window.naver.LoginWithNaverId({
                    clientId: naver.clientId,
                    callbackUrl: 'https://www.earn-it.co.kr',
                    //callbackUrl: 'http://localhost:3000',
                    isPopup: false,
                    callbackHandle: false,
                    loginButton: {color: "green", type: 3, height: 60}
                });

                self.naverlogin.init();

                let naverLogin = self.naverlogin;

                window.addEventListener('load', function () {
                    self.naverlogin.getLoginStatus(function (status) {
                        if(status){
                            let email = naverLogin.user.getEmail();
                            let name = naverLogin.user.getNickName();
                            let profileImage = naverLogin.user.getProfileImage();
                            let birthday = naverLogin.user.getBirthday();
                            let naverId = naverLogin.user.getId();
                            let age = naverLogin.user.getAge();

                            if( email === undefined || email === null) {
                                alert("이메일은 필수정보입니다. 정보제공을 동의해주세요.");
                                /*사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                                naverLogin.reprompt();
                                return;
                            }

                            let params = {
                                email: email,
                                name: name,
                                profileImage: profileImage,
                                birthday: birthday,
                                naverId: naverId,
                                age: age,
                                type: 'naver'
                            };

                            let isNaverLogin = localStorage.getItem('naverLogin');

                            if(isNaverLogin === '1'){

                                localStorage.removeItem('naverLogin');

                                fetch(RestApi.login.naverLogIn + '?' + queryString({naverId: naverId}))
                                    .then(res => {
                                        return res.json()
                                    })
                                    .then(json => {
                                        let uniqueId = json.uniqueId;

                                        if(json.uniqueId !== null){
                                            localStorage.setItem('uniqueId', json.uniqueId);
                                            localStorage.setItem('userId', json.userId);
                                            localStorage.setItem('loggedIn', 'true');
                                            window.location = '/'
                                        }else{
                                            self.pushToSignUpPage('naver', params)
                                        }
                                    })
                            }


                        }
                    })
                });
            });
    }

    componentDidMount() {

        this.getHashTagList();

        this.props.getJointPurchase();


        this.props.getMyInfo();
        this.setData = this.setData.bind(this)
        this.logInRef = React.createRef()


        this.viewAll.current.click()
        this.viewAllTags.current.click()

        document.body.scrollTop = 0

        this.props.setViewMode(HOME_FEED_VIEW_MODE.ALL);
        this.props.setViewTagMode(HOME_FEED_TAG_VIEW_MODE.ALL);



    }

    componentWillMount() {
        if (this.state.isFromFeedDetailWithHashTag === true) {
            if (this.props.location.state.hashTag.length > 0) {
                window.scrollTo(0,0)
            }
        }
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

    getHashTagList() {

        let params = {
            uniqueId: getUniqueId()
        }

        fetch(RestApi.main.getHashTags + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                let tags = [];

                json.forEach( tag => {
                    tags.push(tag)
                });

                this.setState({tagArray: tags}, () => {
                    this.props.getFeeds();
                    this.props.setSavedFeedHashTags(this.state.tagArray);
                })
            })


    }

    renderHashTag = () => {


        if(typeof this.state.tagArray === 'undefined'){

            return []
        }



        let rows = this.state.tagArray.map((hashTag, index) => {

            return (
                <div className="hashTag" key={hashTag}>
                    <div><p>#{hashTag}</p></div>
                    <div><img className="hashClose" id={index + "close"} src={require("./image/plusButton.png")} onClick={this.deleteHastTag.bind(this, index)}/></div>
                </div>

            );
        });


        return rows;

    }

    deleteHastTag(index) {
        if(getUniqueId() === null || getUniqueId() === undefined){
            this.toggleSearchView('logInPage')
        }else{
            let hashTag = this.state.tagArray[index]

            let params = {
                uniqueId: getUniqueId(),
                hashTag: hashTag
            }

            fetch(RestApi.main.deleteHashTag,  {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
                .then(res => {
                    if(res.status === 200){
                        let tags = Object.assign([], this.state.tagArray);

                        tags.splice(index, 1);
                        this.setState({tagArray : tags});


                        if(this.props.viewMode === HOME_FEED_VIEW_MODE.ALL){

                            this.props.getJointPurchase(0, true);
                            if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL){
                                this.props.getFeeds([], 0, true);
                            }else {
                                this.props.getFeeds(this.state.tagArray, 0, true);
                            }
                        }else if(this.props.viewMode === HOME_FEED_VIEW_MODE.FOLLOWING){

                            this.props.getJointPurchaseFollowing(0, true);

                            if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL){
                                this.props.getFeedsFollowing([], 0, true);
                            }else {
                                this.props.getFeedsFollowing(this.state.tagArray, 0, true);
                            }

                        }

                        let hashTagParams = {
                            uniqueId: getUniqueId()
                        }

                        this.props.getHashTagInfluencers(hashTagParams)

                    }
                })
        }
    }

    addHashTag(tag) {

        if(getUniqueId() === null || getUniqueId() === undefined){
            this.toggleSearchView('logInPage')
        }else{
            let params = {
                uniqueId: getUniqueId(),
                hashTag: tag
            };

            fetch(RestApi.main.addHashTag ,  {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
                .then(res => {
                    if(res.status === 200){
                        let tags = Object.assign([], this.state.tagArray);
                        tags.push(tag)

                        this.setState({tagArray : tags})


                        if(this.props.viewMode === HOME_FEED_VIEW_MODE.ALL){

                            this.props.getJointPurchase(0, true);
                            if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL){
                                this.props.getFeeds([], 0, true);
                            }else {
                                this.props.getFeeds(this.state.tagArray, 0, true);
                            }
                        }else if(this.props.viewMode === HOME_FEED_VIEW_MODE.FOLLOWING){

                            this.props.getJointPurchaseFollowing(0, true);

                            if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL){
                                this.props.getFeedsFollowing([], 0, true);
                            }else {
                                this.props.getFeedsFollowing(this.state.tagArray, 0, true);
                            }

                        }


                        this.props.setSavedFeedHashTags(this.state.tagArray);
                        this.toggleSearchView('searchHashTagViewID')

                        let hashTagParams = {
                            uniqueId: getUniqueId()
                        }

                        this.props.getHashTagInfluencers(hashTagParams)

                    }
                })

        }
    }

    closeMenu = () => {

        let elements = document.querySelectorAll('[id^="optionBox"]');
        elements.forEach(element => {
            element.style.visibility = 'hidden'
        })

        let jpElems = document.querySelectorAll('[id^="jpOptionBox"]');
        jpElems.forEach(element => {
            element.style.visibility = 'hidden'
        })
    }

    toggleSearchView(id) {

        this.closeMenu()

        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }
        }else{

            const element = document.getElementById(id)

            element.classList.toggle('searchViewClose')



            window.setTimeout(() => {

                let elem = document.getElementById('feedSearchBarInputID');
                elem.focus()

            }, 50)




        }
    }

    renderSearchHashTagList(inputValue) {


        let keyword = inputValue.target.value.trim();

        if(keyword.length <= 0){
            this.setState({hashTagSearchResult: []})
            return []
        }

        let params = {
            keyword: keyword
        }

        fetch(RestApi.search.hashTag + '?' + queryString(params))
            .then(res => {
                return res.json()
            })

            .then( json => {

                let hashTags = json

                let rows = [];


                if(json.length <= 0){
                    console.log(keyword)

                    const row = <div className="hashTagSearchResult" key={keyword} onClick={() => this.addHashTag(keyword)}>
                        <div><a>#{keyword}</a></div>
                        <div className="postingCount"><a>0 포스팅</a></div>
                    </div>
                    rows.push(row)
                }else{
                    hashTags.forEach((i) => {
                        const row = <div className="hashTagSearchResult" key={i.hashTag} onClick={() => this.addHashTag(i.hashTag)}>
                            <div><a>#{i.hashTag}</a></div>
                            <div className="postingCount"><a>{i.count} 포스팅</a></div>
                        </div>
                        rows.push(row)
                    })


                }

                this.setState({hashTagSearchResult: rows})
            })


    }

    growHashTagContainerClick() {
        this.setState({
            isGrowTagViewClicked: !this.state.isGrowTagViewClicked
        })
    }




    openLogInPage(feedId, action) {

        //console.log(feedId, action);
        this.setState({logInAction: action})
        this.toggleSearchView("logInPage")
    }

    setData(id) {
        if (this.state.isLoggedIn === true) {
            //console.log(id + "heartButton Pressed")

            const element = document.getElementById('likeButton' + id);
            element.style.animation = "";

            const object = Object.assign([], this.state.feedData);
            object[id].isLiked = !object[id].isLiked;
            this.setState({
                feedId: object
            }, () => {
                element.style.animation = "bounce 0.3s 1";
            })


        } else {

            this.props.openLogInPage()

        }
    }

    viewSortButtonClicked(id) {
        this.closeMenu()
        const taps = document.getElementsByClassName("feedSelectBtn")
        for (var i = 0; i < taps.length; i++) {
            const element = taps[i]
            const elementID = element.getAttribute('id')
            if (elementID === id) {
                element.style.color = "#FF0000";
                element.style.fontWeight = "bold";
            } else {
                element.style.color = "#282c34";
                element.style.fontWeight = "normal";
            }
        }

        const line = document.getElementById('homeFeedTyleSelectLineID')
        const lineOffset = line.offsetLeft

        const buttonElement = document.getElementById(id)
        const buttonWidth = buttonElement.offsetWidth

        const elementLeftCoordinate = buttonElement.offsetLeft


        const coordinate = {
            left: elementLeftCoordinate - lineOffset,
            width: buttonWidth
        }

        this.setState({lineBrickPosition: coordinate})

        if(id === 'viewAllID'){
            this.props.getJointPurchase(0, true);

            this.props.setViewMode(HOME_FEED_VIEW_MODE.ALL)

            if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL){
                this.props.getFeeds();
            }else if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.TAG_ONLY){
                this.props.getFeeds(this.state.tagArray, 0, true);
            }



        }else{
            this.props.getJointPurchaseFollowing(0, true);
            this.props.setViewMode(HOME_FEED_VIEW_MODE.FOLLOWING)

            if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL){
                this.props.getFeedsFollowing([], 0, true);
            }else if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.TAG_ONLY){
                this.props.getFeedsFollowing(this.state.tagArray,0,true);
            }

        }

    }

    viewTagsSetting(id) {
        this.closeMenu();

        if (id === "viewAllTagID") {
            this.setState({
                isViewAllTags: true
            });

            this.props.setViewTagMode(HOME_FEED_TAG_VIEW_MODE.ALL);

            if(this.props.viewMode === HOME_FEED_VIEW_MODE.ALL){
                this.props.getFeeds(undefined, 0, true)
            }else if(this.props.viewMode === HOME_FEED_VIEW_MODE.FOLLOWING){
                this.props.getFeedsFollowing(undefined, 0, true)
            }

        } else {
            this.setState({
                isViewAllTags: false
            });
            this.props.setViewTagMode(HOME_FEED_TAG_VIEW_MODE.TAG_ONLY)


            if(this.props.viewMode === HOME_FEED_VIEW_MODE.ALL){
                this.props.getFeeds(this.state.tagArray, 0, true)
            }else if(this.props.viewMode === HOME_FEED_VIEW_MODE.FOLLOWING){
                console.log(this.props.viewMode, this.props.viewTagMode, this.state.tagArray)

                this.props.getFeedsFollowing(this.state.tagArray, 0, true)
            }


        }

        let line = document.getElementById("viewTagLineID")
        let lineOffset = line.offsetLeft

        const buttonElement = document.getElementById(id)
        const buttonWidth = buttonElement.offsetWidth

        const elementLeftCoordinate = buttonElement.offsetLeft

        const coordinate = {
            left: elementLeftCoordinate - lineOffset,
            width: buttonWidth
        }

        this.setState({viewTaglineBrickPosition: coordinate})

    }


    render() {

        let logInPage =  <div id="logInPage" className="searchViewBackGround" ref={this.logInRef}>
            <div className="searchBarWrapper">
                <div className="searchCloseButton" ><a onClick={() => this.toggleSearchView("logInPage")}>close X</a></div>
            </div>

            <LogInPage  toggleLogInView={() => this.toggleSearchView("logInPage")} redirectUrl={'/'} action={this.state.logInAction}/>
        </div>;

        return (
            <div id={'homePageID'} >
                <div className={"homeContainer"} >
                    <Row className="homeSearchBar">
                        <Col md={4}><input type="password" autoComplete="new-password" onClick={() => this.toggleSearchView('searchFeedViewID')} className="searchBar topMargin" placeholder="Search"/></Col>
                        <Col md={4} className="topMargin">
                            <div className={"feedTypeWrapper"}>

                                <div className={"feedSelectBtnWrapper"}>
                                    <div ref={this.viewAll} className={"feedSelectBtn"} onClick={() => this.viewSortButtonClicked("viewAllID")} id={"viewAllID"}>All</div>
                                    <div className={"feedSelectBtn"} onClick={() => this.viewSortButtonClicked("viewFollowingID")} id={"viewFollowingID"} >following</div>
                                </div>
                                <div className={"homeFeedTyleSelectLine"} id={"homeFeedTyleSelectLineID"}/>
                                <div className={"homeLineBrick"} style={this.state.lineBrickPosition}/>

                            </div>
                        </Col>
                        <Col md={4}/>
                    </Row>



                    <div>
                        <div className={"homeSectionTitle"}>
                            <a>진행중인 캠페인</a>
                        </div>
                    </div>

                    <HomeMarketShare marketFeed={this.props.jointPurchase} logInPage={logInPage}/>

                    <div className={"tagViewToggleContainer"}>
                        <div className={"tagViewToggleButtonWrapper"}>
                            <div ref={this.viewAllTags} className={`tagViewToggleButton ${this.state.isViewAllTags ? "tagViewToggleSelected" : ""}`} onClick={() => this.viewTagsSetting("viewAllTagID")} id={"viewAllTagID"}>
                                모든 태그 보기
                            </div>

                            <div className={`tagViewToggleButton ${this.state.isViewAllTags ? "" : "tagViewToggleSelected"}`} onClick={() => this.viewTagsSetting("viewOnlyTagID")} id={"viewOnlyTagID"}>
                                관심 태그만 보기
                            </div>
                        </div>

                        <div className={"tagViewRedLine"} id={"viewTagLineID"}/>
                        <div className={"tagViewBrick"} style={this.state.viewTaglineBrickPosition}/>
                    </div>

                    <div className={`toggleTagOpacityOrigin ${this.state.isViewAllTags ? "toggleTagWrapperOpacity" : ""}`}>
                        <div className={"hashTagContainerWrapper"}>
                            <div className={`hashTagContainer ${this.state.isGrowTagViewClicked ? "growHashTagContainer" : ""}`} >
                                {
                                    this.renderHashTag()
                                }
                            </div>
                            <div className={"hashTagToggleButton"} onClick={this.growHashTagContainerClick}>
                                {`${this.state.isGrowTagViewClicked ? "" : "View All"}`}
                                <img className={`${this.state.isGrowTagViewClicked ? "rotateGrowTagViewArrow" : ""}`} src={require("./image/triangleRed.png")}/>
                            </div>
                        </div>

                        <div className="addTagButton" onClick={() => this.toggleSearchView('searchHashTagViewID')}>
                            <img src={addTagButton}/>
                            관심태그추가
                        </div>
                    </div>

                    <HomeFeed ref={this.homeFeedElement} hashTagUpdate={this.state.tagArray} feeds={this.props.feeds} openLogInPage={this.openLogInPage} logInPage={logInPage}/>

                </div>

                <div id="searchHashTagViewID" className="searchViewBackGround">
                    <div className="searchBarWrapper">
                        <div className="hashTagSearBarDiv">
                            <input className="searchBar searchHashTagSearchBar"
                                   placeholder="Search"
                                   onChange={this.renderSearchHashTagList}
                            />
                        </div>
                        <div className="searchCloseButton" ><a onClick={() => this.toggleSearchView("searchHashTagViewID")}>close X</a></div>
                    </div>
                    <div className="searchBodyContainer">
                        {this.state.hashTagSearchResult}
                    </div>
                </div>

                <div id="searchFeedViewID" className="searchViewBackGround" ref={this.searchFeedViewDivRef}>
                    <SearchFeedView ref={this.searchFeedViewRef} toggleSearchView={this.toggleSearchView}/>
                </div>

                <Footer/>

                {logInPage}
            </div>



            )



    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        getJointPurchase: (skip, renew) => dispatch(getJointPurchase(skip, renew)),
        getJointPurchaseFollowing: (skip, renew) => dispatch(getJointPurchaseFollowing(skip, renew)),
        getFeeds: (hashTags, skip, renew) => dispatch(getFeeds(hashTags, skip, renew)),
        getFeedsFollowing: (hashTags, skip, renew) => dispatch(getFeedsFollowing(hashTags, skip, renew)),
        getMyInfo: () => dispatch(getMyInfo()),
        getNotificationCount: () => dispatch(getNotificationCount()),
        getCartItemCount: () => dispatch(getCartItemCount()),
        setSavedFeedHashTags: (hashTags) => dispatch(setSavedFeedHashTags(hashTags)),
        setViewMode: (viewMode) => dispatch(setViewMode(viewMode)),
        setViewTagMode: (viewTagMode) => dispatch(setViewTagMode(viewTagMode)),
        getHashTagInfluencers: (params) => dispatch(getHashTagInfluencer(params)),
        verifyID: (params, callback) => dispatch(verifyID(params, callback))
    }
};

let mapStateToProps = (state) => {

    return {
        viewTagMode: state.stella.viewTagMode,
        viewMode: state.stella.viewMode,
        feeds: state.stella.feeds,
        jointPurchase: state.stella.jointPurchase
    }
}

Home = connect(mapStateToProps, mapDispatchToProps)(Home);


export default withRouter(Home);