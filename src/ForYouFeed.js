import React, { Component } from 'react' ;
import "./js/components/MasonryCard.css";
import "./js/components/ForYouFeed.css";
import filledHeartIcon from './image/socialLikeIconRed.png'
import emptyHeartIcon from "./image/homeSocialHeartIcon.png";
import CommentButton from "./image/homeSocialComment.png";
import SaveButton from "./image/homeSocialSave.png";
import { withRouter} from "react-router-dom";
import {getUniqueId, RestApi} from "./util/Constants";
import {isLiked, isSaved, like, unlike, save, unsave} from './actions/home'
import {follow, unfollow, isFollowing} from "./actions/user";
import {connect} from "react-redux";
import LogInPage from "./LogInPage";

class ForYouFeed extends Component{
    constructor(props) {
        super(props)

        this.handleFollowButtonClick = this.handleFollowButtonClick.bind(this)
        this.handleFeedClick = this.handleFeedClick.bind(this)

        this.state = {
            isFollowing: false
        }



    }

    componentDidMount() {
        let uniqueId = getUniqueId();


        if(uniqueId !== null && uniqueId !== undefined && this.props.feed !== undefined){

            let params = {
                uniqueId: uniqueId,
                feedId: this.props.feed.feedId
            }

            this.props.isLiked(params);
            this.props.isSaved(params);
        }

        this.props.isFollowing(this.props.feed.uniqueId)
    }

    renderFollowButton() {

        if(this.props.feed.uniqueId !== getUniqueId()){
            let followingArray = this.props.isFollowingArray;

            if(followingArray !== undefined){
                let filteredArray = followingArray.filter(x => x.followeeId === this.props.feed.uniqueId)

                if(filteredArray.length > 0){
                    let isFollowing = filteredArray[0].isFollowing;

                    if (isFollowing) {

                        return <div className="followButton" id={this.props.feed.feedId + 'followButton'} onClick={this.handleFollowButtonClick}><a></a></div>;
                    } else {

                        return <div className="followButton" id={this.props.feed.feedId + 'followButton'} onClick={this.handleFollowButtonClick}><a>follow</a></div>;
                    }

                }else{

                    return <div className="followButton" id={this.props.feed.feedId + 'followButton'} onClick={this.handleFollowButtonClick}><a>follow</a></div>;
                }

            }else{

                return <div className="followButton" id={this.props.feed.feedId + 'followButton'} onClick={this.handleFollowButtonClick}><a>follow</a></div>;

            }
        }

    }

    renderLikeButton = () => {
        let feeds = this.props.feeds.filter(x => x.feedId === this.props.feed.feedId)

        let image = emptyHeartIcon

        if(feeds.length > 0){
            let feed = feeds[0]

            if(feed.isLiked){
                image = filledHeartIcon
            }else{
                image = emptyHeartIcon
            }
        }

        return image


    }

    handleFollowButtonClick() {
        if(this.props.feed.uniqueId !== getUniqueId()){
            let followingArray = this.props.isFollowingArray;

            if (followingArray !== undefined) {
                let filteredArray = followingArray.filter(x => x.followeeId === this.props.feed.uniqueId)
                let element = document.getElementById(this.props.feed.feedId + 'followButton')



                if (filteredArray.length > 0) {
                    let isFollowing = filteredArray[0].isFollowing;

                    if (isFollowing) {

                        this.props.unfollow(this.props.feed.uniqueId)
                        element.style.animation = "";
                        element.style.animation = "bounce 0.3s 1";

                    } else {

                        this.props.follow(this.props.feed.uniqueId)
                        void element.offsetWidth;

                        element.style.animation = "bounce 0.3s 1";
                    }


                    element.addEventListener('animationend', () => {
                        // Do anything here like remove the node when animation completes or something else!
                        element.style.animation = ""


                    });
                }
            }else {
                if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                    this.toggleLoginPage()
                }
            }
        }
    }

    renderHashTag() {
        let rows = []

        this.props.feed.hashTags.forEach((hashTag, index) => {
            const tag =  <a key={index}>#{hashTag} </a>;

            rows.push(tag)
        })


        return rows;
    }


    handleFeedClick() {
        let path = '/InfluencerFeedDetail'

        this.props.history.push({
            pathname: path,
            search: '?fid=' + this.props.feed.feedId,
            state: {
                feedId: this.props.feed.feedId

            }
        })
    }

    toggleLoginPage = () => {
        const element = document.getElementById('logInPage');

        element.classList.toggle('searchViewClose')
    }

    handleLikeClick = () => {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }
            return
        }

        let clickedFeed = this.props.feeds.filter(x => x.feedId === this.props.feed.feedId)
        if(clickedFeed.length > 0){
            let feed = clickedFeed[0]

            let params = {
                uniqueId: getUniqueId(),
                feedId: feed.feedId
            }

            let element = document.getElementById(feed.feedId + 'homeMasonryLikeButton');
            element.style.animation = ""


            if(feed.isLiked){
                this.props.unlike(params)
                element.style.animation = '';
                element.style.animation = "bounce 0.3s 1";
            }else{
                this.props.like(params)
                void element.offsetWidth;

                element.style.animation = "bounce 0.3s 1";

            }


            element.addEventListener('animationend', () => {
                // Do anything here like remove the node when animation completes or something else!
                element.style.animation = ""


            });
        }
    }

    renderSaveButton = () => {
        let feeds = this.props.feeds.filter(x => x.feedId === this.props.feed.feedId)
        let saveImageRequire = require("./image/homeSocialSave.png");

        if(feeds.length > 0){
            let feed = feeds[0]



            if(feed.isSaved){
                saveImageRequire = require('./image/saveFilled.png')
            }else{
                saveImageRequire = require("./image/homeSocialSave.png")
            }


        }

        return saveImageRequire;
    }

    handleSaveClick = () => {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }

        let feeds = this.props.feeds.filter(x => x.feedId === this.props.feed.feedId)
        if(feeds.length > 0){
            let feed = feeds[0]

            let element = document.getElementById(feed.feedId + 'homeMasonrySaveButton');
            element.style.animation = ""


            let params = {
                feedId: feed.feedId,
                uniqueId: getUniqueId()
            }

            if(feed.isSaved){
                this.props.unsave(params)
                element.style.animation = '';
                element.style.animation = "bounce 0.3s 1";
            }else{
                this.props.save(params)
                void element.offsetWidth;

                element.style.animation = "bounce 0.3s 1";
            }

            element.addEventListener('animationend', () => {
                // Do anything here like remove the node when animation completes or something else!
                element.style.animation = ""


            });
        }
    }

    handleCommentClick = () => {
        this.props.history.push({
            pathname: '/InfluencerFeedDetail',
            search: '?fid=' + this.props.feed.feedId + '&scb=1',
            state: {
                feedId: this.props.feed.feedId,
                scrollToCommentBox: true

            }
        })
    }

    handleProfileClick = () => {
        this.props.history.push({
            pathname: '/UserProfile',
            search: '?uid=' + this.props.feed.uniqueId,
            state: {
                uniqueId: this.props.feed.uniqueId
            }
        })
    };

    renderFeedCoverImage = () => {
        //<img src={this.props.feed.images.length > 0 ? RestApi.feedImage + this.props.feed.images[0] : 'placeholder'}/>

        if(this.props.feed.images.length > 0 ){


            if(this.props.feed.images[0].endsWith('.mp4')){
                return(
                    <video controls={false} width="320" height="240" ><source src={RestApi.feedImage + this.props.feed.images[0]} type="video/mp4"/> </video>
                )
            }else{
                return(
                    <img src={(this.props.feed.images.length > 0) ? RestApi.feedImage + this.props.feed.images[0] : 'placeholder'}/>
                )
            }
        }
    };


    iframeInserter = (iframe) => {
        return{
            __html: this.props.feed.description.substring(iframe.start, iframe.end + 9)
        }
    }

    renderDescription = () => {

        let iframes = []

        let iframeIndex = this.props.feed.description.indexOf('<iframe');
        let closingIframeIndex = this.props.feed.description.indexOf('</iframe');


        if(iframeIndex > -1){
            let obj = {
                start: iframeIndex,
                end: 0
            }

            iframes.push(obj)
        }


        while(iframeIndex > -1){

            iframeIndex = this.props.feed.description.indexOf('<iframe', iframeIndex + 1);


            let obj = {
                start: iframeIndex,
                end: 0
            }

            if(iframeIndex !== -1){
                iframes.push(obj)
            }

        }

        let index = 0;
        if(closingIframeIndex > -1){
            iframes[index].end = closingIframeIndex;
            index++;
        }

        while(closingIframeIndex > -1){
            closingIframeIndex = this.props.feed.description.indexOf('</iframe', closingIframeIndex + 1)

            if(closingIframeIndex !== -1){
                iframes[index].end = closingIframeIndex
            }

            index++;
        }

        let rows = [];

        for(let index = 0; index < iframes.length; index++){

            let desc = '';

            if(index > 0){
                if(iframes[index].start > 0){
                    desc = <p>{this.props.feed.description.substring(iframes[index -1].end + 10, iframes[index].start - 1)}</p>
                    rows.push(desc)
                }
            }else{
                if(iframes[index].start > 0){
                    desc = <p>{this.props.feed.description.substring(0, iframes[index].start - 1)}</p>
                    rows.push(desc)
                }

            }

            let htmlString = this.iframeInserter(iframes[index])

            let row = <div dangerouslySetInnerHTML={htmlString}/>

            rows.push(row)
        }


        if(rows.length === 0){
            return(
                <p>{this.props.feed.description}</p>
            )

        }else{
            return(
                <div>{rows[0]}</div>
            )

        }



    };

    render() {



        if(typeof this.props.feed === 'undefined'){
            return []
        }



        return(



            <div >
                <div className="forYouFeedCard">
                    <div className="feedProfileContainer" onClick={() => this.handleProfileClick()}>
                        <div className="feedProfileImage">
                            <img src={RestApi.profile + this.props.feed.uniqueId + '.png'}/>
                        </div>
                        <div className="feedUserName">
                            <a>{this.props.feed.user.userId}</a>
                        </div>
                        {this.renderFollowButton()}
                    </div>
                    <div className="feedImage productDetailForYouImage">{this.renderFeedCoverImage()}</div>
                    <div className="contentContainer">
                        <div className="feedTitle" onClick={this.handleFeedClick}><h5>{this.props.feed.title}</h5></div>
                        <div className="feedMessage" onClick={this.handleFeedClick}>{this.renderDescription()}</div>
                        <div className="feedHashTagContainer">
                            {this.renderHashTag()}
                        </div>
                        <div className="socialFunctionContainer">
                            <div className="socialButton" onClick={this.handleLikeClick}><img id={this.props.feed.feedId + 'homeMasonryLikeButton'} src={this.renderLikeButton()}/><a>{this.props.feed.likeCount}</a></div>
                            <div className="socialButton commentButton" onClick={this.handleCommentClick}><img src={CommentButton}/><a>{this.props.feed.commentCount}</a></div>
                            <div className="feedSaveButton socialButton" onClick={this.handleSaveClick}><img id={this.props.feed.feedId + 'homeMasonrySaveButton'} src={this.renderSaveButton()}/></div>
                        </div>
                    </div>
                </div>





                <div id="logInPage" className="searchViewBackGround" ref={this.logInRef}>
                    <div className="searchBarWrapper">
                        <div className="searchCloseButton" ><a onClick={() => this.toggleLoginPage()}>close X</a></div>
                    </div>

                    <LogInPage  toggleLogInView={() => this.toggleLoginPage()} redirectUrl={'/'}/>
                </div>
            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        isLiked: (params) => dispatch(isLiked(params)),
        isSaved: (params) => dispatch(isSaved(params)),
        isFollowing: (followeeId) => dispatch(isFollowing(followeeId)),
        follow: (followeeId) => dispatch(follow(followeeId)),
        unfollow: (followeeId) => dispatch(unfollow(followeeId)),
        like: (params) => dispatch(like(params)),
        unlike: (params) => dispatch(unlike(params)),
        save: (params) => dispatch(save(params)),
        unsave: (params) => dispatch(unsave(params))
    }
};

let mapStateToProps = (state) => {
    //console.log(state.stella.feeds)
    return {
        feeds: state.stella.feeds,
        isFollowingArray: state.stella.isFollowingArray
    }
};

ForYouFeed = connect(mapStateToProps, mapDispatchToProps)(ForYouFeed)

export default withRouter(ForYouFeed)