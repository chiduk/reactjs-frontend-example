import React, {Component} from "react";
import "./js/components/MarketShare.css";

import filledHeartIcon from './image/socialLikeIconRed.png'
import emptyHeartIcon from "./image/homeSocialHeartIcon.png";
import CommentButton from "./image/homeSocialComment.png";

import {withRouter} from "react-router";
import {connect} from "react-redux";

import {isFollowing, follow, unfollow} from './actions/user'
import {isLiked, like, unlike, turnOffAlarm, turnOnAlarm} from "./actions/home";

import {RestApi, getDateString, getUniqueId, profileImagePlaceholder} from "./util/Constants";
import LogInPage from "./LogInPage";
import ProfileImage from "./ProfileImage";


class JointPurchaseFeed extends Component{
    constructor(props){
        super(props)



    }

    componentDidMount() {
        let feed = this.props.feed;


        let params = {
            uniqueId: getUniqueId(),
            feedId: feed.feedId,
            jointPurchase: true
        }
        this.props.isLiked(params)

        this.props.isFollowing(this.props.feed.user.uniqueId)
    }

    profileClicked(uniqueId) {

        // let object = Object.assign([], this.state.marketShareFeed)
        // let i = object[index]
        let path = '/UserProfile'

        // this.context.router.history.push(path)

        this.props.history.push({
            pathname: path,
            search: '?uid=' + uniqueId,
            state: {
                uniqueId: uniqueId
            }
        })
    }

    followClicked(followeeId) {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }
            return
        }


        let element = document.getElementById( followeeId + "followButton")
        element.style.animation = ""

        void element.offsetWidth;
        element.style.animation = "bounce 0.3s 1";

        element.addEventListener('animationend', () => {


        });

        let followingArray = this.props.isFollowingArray;

        if(followingArray !== undefined){
            let filteredArray = followingArray.filter(x => x.followeeId === this.props.feed.uniqueId)

            if(filteredArray.length > 0){
                let isFollowing = filteredArray[0].isFollowing;



                if (isFollowing) {
                    this.props.unfollow(followeeId)

                } else {

                    this.props.follow(followeeId)
                }

            }else{

                this.props.follow(followeeId)
            }

        }
    }

    feedClicked(feedId) {
        // let object = Object.assign([], this.state.marketShareFeed)
        // let i = object[index]
        let path = '/InfluencerFeedDetail'

        // this.context.router.history.push(path)
        this.props.history.push({
            pathname: path,
            search: '?fid=' + this.props.feed.feedId,
            state: {
                feedId: this.props.feed.feedId,
                isJP: true

            }
        })

    }

    handleCommentClicked() {

        /* if not log in pop up login page */

        let path = '/InfluencerFeedDetail'

        // this.context.router.history.push(path)
        this.props.history.push({
            pathname: path,
            search: '?fid=' + this.props.feed.feedId + '&scb=1',
            state: {
                feedId: this.props.feed.feedId,
                scrollToCommentBox: true,
                isJP: true

            }
        })
    }

    handleAlarmClicked(feedId) {

        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }
            return
        }

        let element = document.getElementById(feedId + "alarmButton")
        element.style.animation = ""

        void element.offsetWidth;

        element.style.animation = "bounce 0.3s 1";

        element.addEventListener('animationend', () => {
            // Do anything here like remove the node when animation completes or something else!
            element.style.animation = ""
        });

        let params = {
            uniqueId: getUniqueId(),
            feedId: this.props.feed.feedId

        }

        let feeds = this.props.jointPurchase.filter( x => x.feedId === feedId);

        if(feeds.length > 0){
            let feed = feeds[0]

            if(feed.isAlarmOn){
                this.props.turnOffAlarm(params)
            }else{
                this.props.turnOnAlarm(params)
            }
        }




    }

    handleHeartClicked(feedId) {

        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }
            return
        }

        let element = document.getElementById(feedId + "likeButton")
        element.style.animation = ""

        void element.offsetWidth;

        element.style.animation = "bounce 0.3s 1";

        element.addEventListener('animationend', () => {
            element.style.animation = ""
        });

        let params = {
            feedId: feedId,
            uniqueId: getUniqueId(),
            jointPurchase: true
        }

        if(this.props.feed.isLiked){
            this.props.unlike(params)
        }else{
            this.props.like(params)
        }

    }


    getBeginTimeText(when, number) {
        let year =[]
        let month = []
        let date = []
        let hour = []
        let minute = []

        String(number).split("").forEach((i, index) => {
            if (index < 4) {
                year.push(i)
            }

            if (index > 3 && index < 6) {
                month.push(i)
            }

            if (index > 5 && index < 8) {
                date.push(i)
            }

            if (index > 7 && index < 10) {
                hour.push(i)
            }

            if (index > 9 && index < 12) {
                minute.push(i)
            }
        })

        let monthText = `${Number(month.join('')) < 10 ? month[1] : month.join('')}`
        let dayText = `${Number(date.join('')) < 10 ? date[1] : date.join('')}`

        let timeText;
        if (Number(hour.join('')) > 12) {
            timeText = `오후 ${(Number(hour.join('')) - 12)}시`
        } else if (Number(hour.join('')) < 12) {
            if ( Number(hour.join('')) < 10 ) {
                timeText = `오전 ${hour[1]}시`
            } else {
                timeText = `오전 ${hour.join('')}시`
            }
        } else if (Number(hour.join('')) === 12) {
            timeText = `오후 ${hour.join('')}시`
        } else if (Number(hour.join('')) === 0) {
            timeText = `오전 12시`
        }

        let text;
        if (when === "begin") {
            text = `${year.join('')}. ${monthText}. ${dayText}. ${timeText}`
        } if (when === "end") {
            text = `${monthText}. ${dayText}. ${timeText}`
        }
        return (
            text
        );
    }

    renderProductImage = (feed) => {
        let images = feed.productImages.filter((x => x.productId === feed.products[0]._id));



        if(images.length > 0){
            return RestApi.prod + images[0].image
        }
    }

    renderFollowButton = (followeeId) => {

        if(followeeId !== getUniqueId()){
            let followingArray = this.props.isFollowingArray;

            if(followingArray !== undefined){
                let filteredArray = followingArray.filter(x => x.followeeId === this.props.feed.uniqueId)

                if(filteredArray.length > 0){
                    let isFollowing = filteredArray[0].isFollowing;

                    if (isFollowing) {


                    } else {

                        return <div className="followButton" id={this.props.feed.user.uniqueId + 'followButton'} onClick={() => this.followClicked(this.props.feed.user.uniqueId)}><a>follow</a></div>;
                    }

                }else{

                    return <div className="followButton" id={this.props.feed.user.uniqueId + 'followButton'} onClick={() => this.followClicked(this.props.feed.user.uniqueId)}><a>follow</a></div>;
                }

            }else{

                return <div className="followButton" id={this.props.feed.user.uniqueId + 'followButton'} onClick={() => this.followClicked(this.props.feed.user.uniqueId)}><a>follow</a></div>;

            }
        }
    }

    toggleLoginPage = () => {
        const element = document.getElementById('logInPage');

        element.classList.toggle('searchViewClose')
    }

    renderCoverImage = () => {
        if(this.props.feed.images.length > 0){
            if(this.props.feed.images[0].endsWith('.mp4')){
                return (
                    <video controls={false} width="320" height="240" ><source src={RestApi.feedImage + this.props.feed.images[0]} type="video/mp4"/> </video>
                )
            }else{
                return(
                    <img src={RestApi.feedImage + this.props.feed.images[0]}/>
                )
            }
        }


    }

    render() {

        //console.log('RENDER', this.props.feed);

        let product = this.props.feed.products.length > 0 ? this.props.feed.products[0] : {};

        let currency;
        if (product.currency === "KRW") {
            currency = "₩"
        }

        let hearButton;
        if (this.props.feed.isLiked) {
            hearButton = require('./image/socialLikeIconRed.png')
        } else {
            hearButton = require("./image/homeSocialHeartIcon.png")
        }

        let saveButton;
        let date = new Date()
        let currentTime = Number(date.getFullYear() + `${(date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)}` + `${(date.getDate()) < 10 ? "0" + (date.getDate()) : (date.getDate())}` + `${(date.getHours()) < 10 ? "0" + (date.getHours()) : (date.getHours())}` + `${(date.getMinutes()) < 10 ? "0" + (date.getMinutes()) : (date.getMinutes())}`)

        let saleStatusText;
        let saleStatusNumber;

        let currTime = new Date().getTime()
        let startTime = new Date(this.props.feed.startDate).getTime();
        let endTime = new Date(this.props.feed.endDate).getTime();

        if (currTime < startTime && currTime < endTime) {
            saleStatusText = "판매 예정";
            saleStatusNumber = 0
        } else if (currTime > startTime && currTime < endTime) {
            saleStatusText = "현재 판매중";
            saleStatusNumber = 1
        } else if (currTime > endTime && currTime > startTime) {
            saleStatusText = "판매 완료";
            saleStatusNumber = 2
        }

        let beginNumber = getDateString(this.props.feed.startDate);
        let endNumber = getDateString(this.props.feed.endDate);

        let beginTimeText = `${this.getBeginTimeText("begin", beginNumber)}`
        let endTimeText = `${this.getBeginTimeText("end", endNumber)}`



        if (this.props.feed.isAlarmOn) {
            saveButton = require('./image/alarmFilled.png')
        } else {
            saveButton = require('./image/alarm.png')
        }

        let shouldRender = false;
        if (this.props.feedType === "viewAllID") {
            if (saleStatusNumber < 3) {
                shouldRender = true
            }
        } else if (this.props.feedType === "viewSellingID") {
            if (saleStatusNumber === 1) {
                shouldRender = true
            }
        } else if (this.props.feedType === "viewSoldID") {
            if (saleStatusNumber === 2) {
                shouldRender = true
            }
        } else if (this.props.feedType === "viewWillSellID") {
            if (saleStatusNumber === 0) {
                shouldRender = true
            }
        }

        let alarmCount;
        if (this.props.feed.alarmCount > 0) {
            alarmCount = <div className={"alarmCount"}>{this.props.feed.alarmCount}명 공구 알람 신청</div>
        }

        if(true){

            return(
                <div className={"masonryCard marketFeedStyle"} >
                    <div className={"profile"}>
                        <div className={"userInfo"} onClick={() => this.profileClicked(this.props.feed.user.uniqueId)}>
                            <img className={"profileImg"} src={RestApi.profile + this.props.feed.user.uniqueId + '.png'} onError={(e)=>{e.target.onerror = null; e.target.src = profileImagePlaceholder}} />

                            {this.props.feed.user.userId}
                        </div>
                        {
                            this.renderFollowButton(this.props.feed.user.uniqueId)
                        }
                    </div>
                    <div onClick={() => this.feedClicked(this.props.feed.feedId)}>

                        <div className={"marketFeedImg"}>
                            {this.renderCoverImage()}
                        </div>
                        <div className={"marketTitle"}>
                            {this.props.feed.title}
                        </div>
                        <div className={"marketFeedTime"}>
                            <div className={"periodText"} style={{color: `${saleStatusNumber === 1 ? "red" : "grey"}`}}>
                                {saleStatusText}
                            </div>

                            <div className={"timeLineText"} style={{color: `${saleStatusNumber === 1 ? "red" : "grey"}`}}>
                                {/*{i.feedTimeLine}*/}
                                <div>{beginTimeText}</div>
                                <div className={"curlyLine"}>~</div>
                                <div>{endTimeText}</div>
                            </div>

                            {alarmCount}
                        </div>
                        <div className={"marketFeedMessage"}>
                            {this.props.feed.description}
                        </div>


                        {/*<div className="cardProductContainer" onClick={() => this.feedClicked()}>*/}
                        {/*    <div className="cardProductImg"><img src={this.renderProductImage(this.props.feed)}/></div>*/}
                        {/*    <div className="productInfo">*/}
                        {/*        <div className="cardProductName"><a>{product.title}</a></div>*/}
                        {/*        <div className="cardPriceContainer">*/}
                        {/*            <div className={"cardDiscount"}>{product.discountRate}% off,</div>*/}
                        {/*            <div>{currency}{product.price.toLocaleString()}</div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <div className={"shareMarektProductlineSeparator"}/>
                        <div className={"marketFeedProduct"}>
                            <div className={"marketFeedProductImg"}>
                                <img src={this.renderProductImage(this.props.feed)}/>
                            </div>


                            <div className={"marketProductInfo"}>
                                <div className={"marketProductTitle"}>{product.title}</div>
                                <div className={"marketProductPrice"}>
                                    <div className={"marketFeedDiscountRate"}>{product.discountRate}% off</div>
                                    <div>{currency}{product.price.toLocaleString()} </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className={"marketSocialWrapper"}>
                        <div className={"marketSocial"} onClick={() => this.handleHeartClicked(this.props.feed.feedId)}>
                            <img id={this.props.feed.feedId + "likeButton"} src={(this.props.feed.isLiked) ? filledHeartIcon : emptyHeartIcon}/>
                            <div className={"socialCount"}>{this.props.feed.likeCount}</div>
                        </div>
                        <div className={"marketSocial"} onClick={() => this.handleCommentClicked(this.props.feed.feedId)}>
                            <img src={CommentButton}/>
                            <div className={"socialCount"}>{this.props.feed.commentCount}</div>
                        </div>
                        <div className={"marketSocial marketAlarmButton"} style={{display: `${saleStatusNumber === 2 || saleStatusNumber === 0 ? "block" : "none"}`}} onClick={() => this.handleAlarmClicked(this.props.feed.feedId)}>
                            <img id={this.props.feed.feedId + "alarmButton"} src={saveButton}/>
                        </div>
                    </div>

                    <div id="logInPage" className="searchViewBackGround" ref={this.logInRef}>
                        <div className="searchBarWrapper">
                            <div className="searchCloseButton" ><a onClick={() => this.toggleLoginPage()}>close X</a></div>
                        </div>

                        <LogInPage  toggleLogInView={() => this.toggleLoginPage()} redirectUrl={'/'} />
                    </div>
                </div>
            )
        }

    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        isFollowing: (followeeId) => dispatch(isFollowing(followeeId)),
        follow: (followeeId) => dispatch(follow(followeeId)),
        unfollow: (followeeId) => dispatch(unfollow(followeeId)),
        like: (params) => dispatch(like(params)),
        unlike: (params) => dispatch(unlike(params)),
        isLiked: (params) => dispatch(isLiked(params)),
        turnOnAlarm: (params) => dispatch(turnOnAlarm(params)),
        turnOffAlarm: (params) => dispatch(turnOffAlarm(params))
    }
};

let mapStateToProps = (state) => {
    //console.log(state.stella)

    return {
        jointPurchase: state.stella.jointPurchase,
        isFollowingArray : state.stella.isFollowingArray
    }
}

JointPurchaseFeed = connect(mapStateToProps, mapDispatchToProps)(JointPurchaseFeed)

export default withRouter(JointPurchaseFeed)