import React, {Component} from "react";
import "./js/components/MarketShare.css";
import Home from "./Home";
import HomeMarketFeed from "./HomeMarketFeed";
import Masonry from "react-masonry-component";
import HomeFirstFeed from "./HomeFirstFeed";
import HomeMasonryCard from "./HomeMasonryCard";
import CommentButton from "./image/homeSocialComment.png";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {
    getJointPurchase,
    getJointPurchaseSelling,
    getJointPurchaseFinished,
    getJointPurchaseWillStart,
    getJointPurchaseAll
} from "./actions/home";
import {isFollowing, follow, unfollow} from './actions/user'

import {RestApi, getDateString, JOINT_PURCHASE_VIEW_ID, getUniqueId, queryString} from "./util/Constants";
import fetch from "cross-fetch";
import JointPurchaseFeed from "./JointPurchaseFeed";
import {setCount} from "./actions/notification";
import {setCartItemCount} from "./actions/cart";


class MarketShare extends Component {
    constructor(props) {
        super(props)

        this.state = {
            lineBrickPosition: {
                left: "0px",
                width: "0px",
            },
            marketShareFeed:[],
            feedType: "viewAllID",
            feedOrderType: "정렬 순서 선택",
            isFeedTypeButtonOpen: false,
        }

        this.viewAll = React.createRef()
        this.viewSortButtonClicked = this.viewSortButtonClicked.bind(this)
        this.typeSelectButtonClicked = this.typeSelectButtonClicked.bind(this)
        this.typeSelected = this.typeSelected.bind(this)


        this.props.getJointPurchaseAll();
        this.props.setNotificationCount();
        this.props.setCartItemCount();

    }

    componentDidMount() {
        this.viewAll.current.click()
        document.body.scrollTop = 0

    }

    like = (feedId) => {

        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }




        let uniqueId = getUniqueId();
        let element = document.getElementById('influencerDetailLikeButton');
        element.style.animation = "bounce 0.3s 1";

        let params = {
            feedId: feedId,
            uniqueId: uniqueId
        }

        fetch(RestApi.feed.like, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                //console.log(res)
                return res.json()
            })
            .then(json => {
                this.setState({likeCount: json.count, isLiked: true})
            })
    };

    unlike = (feedId) => {

        let uniqueId = getUniqueId();
        let element = document.getElementById('influencerDetailLikeButton');
        element.style.animation = "";
        let params = {
            feedId: feedId,
            uniqueId: uniqueId
        }

        fetch(RestApi.feed.unlike, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                //console.log(res)
                return res.json()
            })
            .then(json => {
                this.setState({likeCount: json.count, isLiked: false})
            })
    };

    isLiked = (feedId) => {

        let uniqueId = getUniqueId();

        let params = {
            feedId: feedId,
            uniqueId: uniqueId
        }

        fetch(RestApi.feed.isLiked + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                this.setState({isLiked: json.isLiked})
            })
    };

    viewSortButtonClicked(id) {

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

        this.setState({
            lineBrickPosition: coordinate,
            feedType: id
        })

        if(id === JOINT_PURCHASE_VIEW_ID.VIEW_ALL){
            this.props.getJointPurchaseAll();
        }else if(id === JOINT_PURCHASE_VIEW_ID.VIEW_SELLING){
            this.props.getJointPurchaseSelling();
        }else if( id === JOINT_PURCHASE_VIEW_ID.VIEW_SOLD){
            this.props.getJointPurchaseFinished();
        }else if( id=== JOINT_PURCHASE_VIEW_ID.VIEW_WILL_SELL){
            this.props.getJointPurchaseWillStart();
        }

    }

    typeSelectButtonClicked() {

        this.setState({
            isFeedTypeButtonOpen: !this.state.isFeedTypeButtonOpen
        })
    }

    typeSelected(type) {
        if (type === 1) {
            this.setState({
                feedOrderType: "시간순"
            })

        } else {
            this.setState({
                feedOrderType: "판매량 순"
            })
        }
        this.typeSelectButtonClicked()
    }



    render() {

        if(this.props.jointPurchase === undefined){

            return [];
        }

        const masonryOptions = {
            // transitionDuration: 0,
            gutter: 32,
            columnWidth: '.grid-sizer',
            itemSelector: '.masonryCard',
            percentPosition: true,
        };



        return (
            <div className={"marketShareBody"}>

                <div className={"feedTypeWrapper"}>
                    <div className={"feedSelectBtnWrapper"}>
                        <div ref={this.viewAll} className={"feedSelectBtn"} onClick={() => this.viewSortButtonClicked("viewAllID")} id={"viewAllID"}>전체</div>
                        <div className={"feedSelectBtn"} onClick={() => this.viewSortButtonClicked("viewSellingID")} id={"viewSellingID"} >판매중</div>
                        <div className={"feedSelectBtn"} onClick={() => this.viewSortButtonClicked("viewSoldID")} id={"viewSoldID"}>판매완료</div>
                        <div className={"feedSelectBtn"} onClick={() => this.viewSortButtonClicked("viewWillSellID")} id={"viewWillSellID"}>판매예정</div>
                    </div>
                    <div className={"homeFeedTyleSelectLine"} id={"homeFeedTyleSelectLineID"}/>
                    <div className={"homeLineBrick"} style={this.state.lineBrickPosition}/>
                </div>

                <div className={"feedOrderButtonWrapper"}>
                    <div className={"feedOrderTypeButton"} onClick={this.typeSelectButtonClicked}>{this.state.feedOrderType} <img className={`${this.state.isFeedTypeButtonOpen ? "rotateTriangle" : ""}`} src={require("./image/triangleRed.png")}/></div>
                    <div>
                        <div className={`typeButtonWrapper  ${this.state.isFeedTypeButtonOpen ? "growButtonContainerHeight" : ""}`}>
                            <div className={"typeButton"} onClick={() => this.typeSelected(1)}>시간순</div>
                            <div className={"typeButton"} onClick={() => this.typeSelected(2)}>판매순</div>
                        </div>
                    </div>
                </div>

                <div className={"marketShareFeedBody"}>

                    <Masonry class={'my-gallery-class'}
                             options = {masonryOptions}
                    >
                        <div className="grid-sizer"/>
                        {this.props.jointPurchase.map((i, index) => {
                            //console.log('render');
                            return(
                                <JointPurchaseFeed feed={i} feedType={this.state.feedType}/>
                            )


                        })}

                    </Masonry>
                </div>
            </div>
        );
    }

}

let mapStateToProps = (state) => {


    return {
        jointPurchase: state.stella.jointPurchase,
        isFollowingArray: state.stella.isFollowingArray
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        getJointPurchaseAll: () => dispatch(getJointPurchaseAll()),
        getJointPurchaseSelling: () => dispatch(getJointPurchaseSelling()),
        getJointPurchaseFinished: () => dispatch(getJointPurchaseFinished()),
        getJointPurchaseWillStart: () => dispatch(getJointPurchaseWillStart()),
        isFollowing: (followeeId) => dispatch(isFollowing(followeeId)),
        follow: (followeeId) => dispatch(follow(followeeId)),
        unfollow: (followeeId) => dispatch(unfollow(followeeId)),
        setNotificationCount: () => dispatch(setCount()),
        setCartItemCount: () => dispatch(setCartItemCount())
    }
};

MarketShare = connect(mapStateToProps, mapDispatchToProps)(MarketShare)

export default withRouter(MarketShare);