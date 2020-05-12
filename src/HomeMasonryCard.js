import React, { Component } from 'react' ;
import "./js/components/MasonryCard.css";

import CommentButton from "./image/homeSocialComment.png";

import { withRouter} from "react-router-dom";
import {
    getUniqueId,
    RestApi,
    HOME_FEED_VIEW_MODE,
    HOME_FEED_TAG_VIEW_MODE,
    PROFILE_SOCIAL_VIEW_MODE, profileImagePlaceholder
} from "./util/Constants";
import {isLiked, isSaved, like, unlike, save, unsave, getJointPurchase, getJointPurchaseFollowing, getFeeds, getFeedsFollowing} from './actions/home'
import {follow, unfollow, isFollowing, getFeed} from "./actions/user";
import {connect} from "react-redux";
import LogInPage from "./LogInPage";
import ProfileImage from "./ProfileImage";
import {report, unpin, pin, deleteFeed} from "./actions/feed";
import FeedReportView from "./FeedReportView";
import YesOrNoAlert from "./YesOrNoAlert";
import AlertMessage from "./AlertMessage";
import uuidv1 from 'uuid/v1';
import {getMyInfo} from "./actions/user";


class HomeMasonryCard extends Component {
    constructor(props) {
        super(props)

        this.handleFollowButtonClick = this.handleFollowButtonClick.bind(this)
        this.handleFeedClick = this.handleFeedClick.bind(this)

        this.state = {
            isFollowing: false,
            reportView: null,
            alertMessage: null,
            isPlaying: false,
            profileImageSource : this.props.feed.uniqueId
        }

        this.uuid = uuidv1()



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
        window.addEventListener("scroll", this.setPlay, false)
    }

    componentWillUnmount() {
        this.props.getMyInfo()
        window.removeEventListener("scroll", this.setPlay, false)
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

    renderLikeButton = (feed) => {


        if(feed.isLiked){

            return require('./image/socialLikeIconRed.png')
        }else{

            return require("./image/homeSocialHeartIcon.png")
        }

    };

    handleFollowButtonClick() {
        if(getUniqueId() === undefined || getUniqueId() === null){

            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){

                //console.log("what?")

                const element = document.getElementById('loginPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }


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
            const tag =  <div className={"masonryFeedHashTag"} key={index}>#{hashTag} </div>;

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
        const element = document.getElementById('loginPage');

        element.classList.toggle('searchViewClose')
    }

    handleLikeClick = () => {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('loginPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }

        let params = {
            uniqueId: getUniqueId()

        }

        let clickedFeed = this.props.feeds.filter(x => x.feedId === this.props.feed.feedId);

        if(clickedFeed.length <= 0){
            clickedFeed = this.props.jointPurchase.filter(x => x.feedId === this.props.feed.feedId);

            if(clickedFeed.length > 0){
                params.jointPurchase = true
            }
        }

        if(clickedFeed.length > 0){
            let feed = clickedFeed[0]

            params.feedId = feed.feedId

            let element = document.getElementById(feed.feedId + 'homeMasonryLikeButton' + this.uuid);
            element.style.animation = "";


            if(feed.isLiked){
                this.props.unlike(params);
                element.style.animation = '';
                element.style.animation = "bounce 0.3s 1";
            }else{
                this.props.like(params);
                void element.offsetWidth;

                element.style.animation = "bounce 0.3s 1";

            }


            element.addEventListener('animationend', () => {
                // Do anything here like remove the node when animation completes or something else!
                element.style.animation = ""


            });
        }else{
            let feed = this.props.feed;

            params.feedId = feed.feedId;

            let element = document.getElementById(feed.feedId + 'homeMasonryLikeButton' + this.uuid);
            element.style.animation = "";


            if(feed.isLiked){
                this.props.unlike(params);
                element.style.animation = '';
                element.style.animation = "bounce 0.3s 1";
            }else{
                this.props.like(params);
                void element.offsetWidth;

                element.style.animation = "bounce 0.3s 1";

            }


            element.addEventListener('animationend', () => {
                // Do anything here like remove the node when animation completes or something else!
                element.style.animation = ""


            });
        }
    }

    renderSaveButton = (feed) => {
        // let feeds = this.props.feeds.filter(x => x.feedId === this.props.feed.feedId)
        //
        // if(feeds.length === 0){
        //     feeds = this.props.jointPurchase.filter(x => x.feedId === this.props.feed.feedId)
        // }
        //
        // if(feeds.length > 0){
        //     let feed = feeds[0]
        //
        //
        //
        //     if(feed.isSaved){
        //         return require('./image/saveFilled.png')
        //     }else{
        //         return require("./image/homeSocialSave.png")
        //     }
        // }else{
        //     if(this.props.feed.isSaved){
        //         return require('./image/saveFilled.png')
        //     }else{
        //         return require("./image/homeSocialSave.png")
        //     }
        // }


        if(feed.isSaved){
            return require('./image/saveFilled.png')
        }else{
            return require("./image/homeSocialSave.png")
        }
    }

    handleSaveClick = () => {
        this.closeMenu()

        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('loginPage')

                element.classList.toggle('searchViewClose')
            }
            return
        }

        let feeds = this.props.feeds.filter(x => x.feedId === this.props.feed.feedId);

        if(feeds.length <= 0){
            feeds = this.props.jointPurchase.filter(x => x.feedId === this.props.feed.feedId)
        }

        if(feeds.length > 0){
            let feed = feeds[0]

            let element = document.getElementById(feed.feedId + 'homeMasonrySaveButton' + this.uuid);
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

                element.style.animation = ""

            });
        }else{
            let feed = this.props.feed;

            let element = document.getElementById(feed.feedId + 'homeMasonrySaveButton' + this.uuid);
            element.style.animation = "";


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

                element.style.animation = ""

            });
        }
    }

    handleCommentClick = () => {
        this.closeMenu()

        this.props.history.push({
            pathname: '/InfluencerFeedDetail',
            search: '?fid=' + this.props.feed.feedId + '&scb=1',
            state: {
                feedId: this.props.feed.feedId,
                scrollToCommentBox: true,
                isPromotion: true

            }
        })
    }

    handleProfileClick = (uniqueId) => {
        this.closeMenu()

        this.props.history.push({
            pathname: '/UserProfile',
            search: '?uid=' + uniqueId,
            state: {
                uniqueId: uniqueId
            }
        })
    };



    optionButtonClick = (what, id) => {

        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('loginPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }

        let clickedFeed = this.props.feeds.filter(x => x.feedId === this.props.feed.feedId)

        if(clickedFeed.length > 0){
            this.setState({reportView: <FeedReportView feed={this.props.feed} closeView={() => this.closeReportView()}/>})
        }

        this.handleOptionClick(id)
    };


    closeReportView = () => {
        this.setState({reportView: null})
    }

    pinClick = (feedId) => {


        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('loginPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }

        let clickedFeed = this.props.feeds.filter(x => x.feedId === this.props.feed.feedId)


        if(clickedFeed.length > 0){
            let feed = clickedFeed[0]

            if(feed.isPinned){
                let params = {
                    uniqueId: getUniqueId(),
                    feedId: this.props.feed.feedId
                }

                this.props.unpin(params);
            }else{
                let params = {
                    uniqueId: getUniqueId(),
                    feedId: this.props.feed.feedId
                }

                this.props.pin(params);
            }
        }

        if(this.props.viewMode === HOME_FEED_VIEW_MODE.ALL){
            this.props.getJointPurchase();

            if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL ){
                this.props.getFeeds()
            }else{
                this.props.getFeeds(this.props.hashTags)
            }

        }else{
            this.props.getJointPurchaseFollowing();

            if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL ){
                this.props.getFeedsFollowing()
            }else{
                this.props.getFeedsFollowing(this.props.hashTags)
            }


        }

        this.handleOptionClick(feedId)

    };

    deleteFeed = (feedId) => {


        let params = {
            feedId: feedId,
            uniqueId: getUniqueId()
        };

        this.props.deleteFeed(params, () => {

            //this.setState({alertMessage: <AlertMessage messages={["삭제 되었습니다."]} closeAlert={this.closeAlertView}/>})

            this.closeAlertView()

            console.log(this.props.location)

            if(this.props.location.pathname === '/Profile'){
                if(this.props.profileSocialViewMode === PROFILE_SOCIAL_VIEW_MODE.VIEW_FOR_SALE){
                    let params = {
                        uniqueId: getUniqueId(),
                        viewMode: PROFILE_SOCIAL_VIEW_MODE.VIEW_FOR_SALE
                    };

                    this.props.getUserFeeds(params)
                }else if(this.props.profileSocialViewMode === PROFILE_SOCIAL_VIEW_MODE.VIEW_ALL){
                    let params = {
                        uniqueId: getUniqueId(),
                        viewMode: PROFILE_SOCIAL_VIEW_MODE.VIEW_ALL
                    };

                    this.props.getUserFeeds(params)
                }
            }else{
                if(this.props.viewMode === HOME_FEED_VIEW_MODE.ALL){

                    if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL ){
                        this.props.getFeeds([], 0, true)
                    }else{
                        this.props.getFeeds(this.props.hashTags, 0, true)
                    }

                }else{

                    if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL ){
                        this.props.getFeedsFollowing([], 0, true)
                    }else{
                        this.props.getFeedsFollowing(this.props.hashTags,  0, true)
                    }
                }


                // if(this.props.viewMode === HOME_FEED_VIEW_MODE.ALL){
                //     this.props.getJointPurchase();
                //
                //     if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL ){
                //         this.props.getFeeds()
                //     }else{
                //         this.props.getFeeds(this.props.hashTags)
                //     }
                //
                // }else{
                //     this.props.getJointPurchaseFollowing();
                //
                //     if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL ){
                //         this.props.getFeedsFollowing()
                //     }else{
                //         this.props.getFeedsFollowing(this.props.hashTags)
                //     }
                // }
            }

        }, () => {
            this.setState({alertMessage: <AlertMessage messages={["삭제에 실패 하였습니다. 다시 시도해주세요."]} closeAlert={this.closeAlertView}/>})
        })
    };

    showDeleteAlertMessage = (feedId) => {
        this.setState({alertMessage: <YesOrNoAlert  alertTitle={""}
                                                    messages={["해당 피드를 삭제 하시겠습니까? 삭제후 복원이 불가능 합니다."]}
                                                    yes={() => this.deleteFeed(feedId)}
                                                    no={this.closeAlertView} />})

        this.handleOptionClick(feedId)
    };

    closeAlertView = () => {
        this.setState({alertMessage: null})
    }

    editFeed = (feedId) => {


        this.handleOptionClick(feedId)

        this.props.history.push({
            pathname: '/fe',
            state: {
                feedId: feedId
            }
        })

    };

    renderMenu = (feedOwnerUniqueId) => {
        let pinTop;
        let pinImage;
        let clickedFeed = this.props.feeds.filter(x => x.feedId === this.props.feed.feedId)

        if(clickedFeed.length <= 0){
            clickedFeed = this.props.jointPurchase.filter(x => x.feedId === this.props.feed.feedId)
        }




        if(clickedFeed.length > 0){
            let feed = clickedFeed[0]
            if(feed.isPinned){
                pinImage = <img src={require("./image/pinFilled.png")}/>
            }else{
                pinImage = <img src={require("./image/pinEmpty.png")}/>
            }
        }

        if (this.props.myInfo.isAdmin) {
            pinTop = <div className={"optionButton"} onClick={() => this.pinClick( this.props.feed.feedId)}>
                상단 고정 {pinImage}
            </div>
        }


        if(feedOwnerUniqueId === getUniqueId() || this.props.myInfo.isAdmin){
            return(
                <div>
                    <div className={"optionButton"} onClick={() => this.editFeed(this.props.feed.feedId)}>수정</div>
                    <div className={"optionButtonLine"}></div>
                    <div className={"optionButton"} onClick={() => this.showDeleteAlertMessage(this.props.feed.feedId)}>삭제</div>
                    <div className={"optionButtonLine"}></div>
                    {pinTop}
                </div>
            )
        }else{
            return(
                <div>
                    <div className={"optionButton"} onClick={() => this.optionButtonClick("report", this.props.feed.feedId)}>신고</div>
                    <div className={"optionButtonLine"}></div>
                    {pinTop}
                </div>


            )
        }
    };

    handleOptionClick = (id) => {

        this.closeMenu();

        let element = document.getElementById("optionBox" + id + this.uuid);
        element.classList.toggle('optionBoxGrow')
        element.style.visibility = 'visible';

    };

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

        let rows = []

        for(let index = 0; index < iframes.length; index++){



            let desc = ''

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

    setPlay = () => {



        //let feed = this.state.feed

        let filteredArray = this.props.feeds.filter(x => x.feedId === this.props.feed.feedId);

        if(filteredArray.length <= 0){
            filteredArray = this.props.jointPurchase.filter(x => x.feedId === this.props.feed.feedId);
        }

        let feed = [];

        if(filteredArray.length > 0){
            feed = filteredArray[0]
        }else{
            feed = this.props.feed
        }

        if (feed.images.length > 0) {
            if(feed.images[0].endsWith('.mp4')){

                let pageBottom = window.innerHeight;

                let element = this[`${feed.feedId}`]

                let elementTop = element.getBoundingClientRect().y
                let elementBottom = elementTop + element.getBoundingClientRect().height



                if (pageBottom > elementTop + 50 &&  elementBottom - 100 > 0 ) {
                    element.play()
                } else {
                    element.pause()
                }

            }


        }

    }

    render() {


        //let feed = this.state.feed


        if(typeof this.props.feed === 'undefined'){
            return []
        }

        let filteredArray = this.props.feeds.filter(x => x.feedId === this.props.feed.feedId);


        if(filteredArray.length <= 0){
            filteredArray = this.props.jointPurchase.filter(x => x.feedId === this.props.feed.feedId);

        }

        let feed = [];

        if(filteredArray.length > 0){
            feed = filteredArray[0]


        }else{
            feed = this.props.feed


        }


        let feedImage;
        if (feed.images.length > 0) {
            if(feed.images[0].endsWith('.mp4')){
                feedImage = <video controls={true} width="320" height="240" muted loop playsInline={true}
                                   ref={(ref) => this[`${feed.feedId}`] = ref}
                >
                    <source src={RestApi.feedImage + this.props.feed.images[0]} type="video/mp4"/>
                </video>
            }else{
                feedImage = <img id={feed.feedId + "content"} src={RestApi.feedImage + feed.images[0]}/>
            }
        } else {
            feedImage = <img id={feed.feedId + "content"} src={'placeholder'}/>
        }


        return(
            <div className="masonryCard masonryCardStyle" key={feed.feedId} id={feed.feedId} >
                <div className="feedProfileContainer" >
                    <div className="feedProfileImage" onClick={() => this.handleProfileClick(feed.uniqueId)}>
                        <img className={"profileImg"} src={RestApi.profile + feed.user.uniqueId + '.png'} onError={(e)=>{e.target.onerror = null; e.target.src = profileImagePlaceholder}} />
                    </div>
                    <div className="feedUserName" onClick={() => this.handleProfileClick(feed.uniqueId)}>
                        <a>{feed.user.userId}</a>
                    </div>
                    {this.renderFollowButton()}
                </div>
                <div
                    className="feedImage"
                    onClick={this.handleFeedClick}>
                    {feedImage}
                </div>
                <div className="contentContainer">
                    <div className="feedTitle" onClick={this.handleFeedClick}><h5>{feed.title}</h5></div>
                    <div className="feedMessage" onClick={this.handleFeedClick}>{this.renderDescription()}</div>
                    <div className="feedHashTagContainer" onClick={() => this.closeMenu()}>
                        {this.renderHashTag()}
                    </div>
                    <div className="socialFunctionContainer">
                        <div className="socialButton" onClick={this.handleLikeClick}><img id={feed.feedId + 'homeMasonryLikeButton' + this.uuid} src={this.renderLikeButton(feed)}/><a>{feed.likeCount}</a></div>
                        <div className="socialButton commentButton" onClick={this.handleCommentClick}><img src={CommentButton}/><a>{feed.commentCount}</a></div>
                        <div className="socialButton feedSaveButton " onClick={this.handleSaveClick}><img id={feed.feedId + 'homeMasonrySaveButton' + this.uuid} src={this.renderSaveButton(feed)}/></div>
                        <div className="feedOptionButton"
                             id={"homeFeedReportBox" + feed.feedId}
                             onClick={() => this.handleOptionClick(feed.feedId)}
                        >
                            <img id={feed.feedId + 'optionButton'}
                                 src={require("./image/threeDots.png")}
                            />
                        </div>
                    </div>

                    <div className={"reportBoxRight"}>
                        <div className={"reportBox"} id={"optionBox" + feed.feedId + this.uuid}>
                            {this.renderMenu(feed.user.uniqueId)}
                        </div>
                    </div>

                </div>


                {this.state.reportView}
                {this.state.alertMessage}

                <div id="loginPage" className="searchViewBackGround" ref={this.logInRef}>
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
        unsave: (params) => dispatch(unsave(params)),
        pin: (params) => dispatch(pin(params)),
        report: (params, callback) => dispatch(report(params, callback)),
        unpin: (params) => dispatch(unpin(params)),
        getJointPurchase: (skip, renew) => dispatch(getJointPurchase(skip, renew)),
        getJointPurchaseFollowing: (skip, renew) => dispatch(getJointPurchaseFollowing(skip, renew)),
        getFeeds: (hashTags, skip, renew) => dispatch(getFeeds(hashTags, skip, renew)),
        getFeedsFollowing: (hashTags, skip, renew) => dispatch(getFeedsFollowing(hashTags, skip, renew)),
        deleteFeed: (params, onSuccess, onFail) => dispatch(deleteFeed(params, onSuccess, onFail)),
        getUserFeeds: (params) => dispatch(getFeed(params)),
        getMyInfo: () => dispatch(getMyInfo())
    }
};

let mapStateToProps = (state) => {

    return {
        profileSocialViewMode: state.feed.profileSocialViewMode,
        jointPurchase: state.stella.jointPurchase,
        feeds: state.stella.feeds,
        isFollowingArray: state.stella.isFollowingArray,
        hashTags: state.stella.hashTags,
        viewMode: state.stella.viewMode,
        viewTagMode: state.stella.viewTagMode,
        myInfo: state.stella.myInfo,
    }
};


HomeMasonryCard = connect(mapStateToProps, mapDispatchToProps)(HomeMasonryCard);

export default withRouter(HomeMasonryCard);


