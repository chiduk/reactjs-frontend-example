import React, {Component} from "react";
import "./js/components/HomeFeed.css";
import fetch from 'cross-fetch'

import Masonry from 'react-masonry-component';
import HomeMasonryCard from "./HomeMasonryCard.js";
import HomeFirstFeed from "./HomeFirstFeed.js"
import {getUniqueId, HOME_FEED_TAG_VIEW_MODE, HOME_FEED_VIEW_MODE} from "./util/Constants";
import { like, unlike, save, unsave, getFeeds, getFeedsFollowing} from "./actions/home";
import {connect} from "react-redux";
import Home from "./Home";
import LogInPage from "./LogInPage";


let isThereMoreFeeds = true

class HomeFeed extends Component {
    constructor(props) {
        super(props)
        this.state = { feeds: []}

        this.loadMore = true

    }

    componentDidMount() {
        let docHeightTrigger = window.document.body.clientHeight - 2000;
        let self = this;
        window.onscroll = function() {

            let wrappedElement = document.getElementById('homePageID');

            if(wrappedElement === null){
                return
            }

            if(self.isBottom(wrappedElement)){

                if(self.loadMore){
                    self.loadMore = false;

                    if(this.props.viewMode === HOME_FEED_VIEW_MODE.ALL){

                        if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL ){
                            this.props.getFeeds([], this.props.feeds.length, false)
                        }else{
                            this.props.getFeeds(this.props.hashTags,  this.props.feeds.length, false)
                        }

                    }else{

                        if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL ){
                            this.props.getFeedsFollowing([],  this.props.feeds.length, false)
                        }else{
                            this.props.getFeedsFollowing(this.props.hashTags,  this.props.feeds.length, false)
                        }
                    }
                }
            }

        }.bind(this);

        document.getElementById('promotionFeedOuterArea').onclick = function (e) {


            if(e.target === document.getElementById('promotionFeedOuterArea')){

                self.closeMenu()
            }else{

            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', function () {
            
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.feeds !== this.props.feeds){
            this.loadMore = true
        }
    }

    isBottom = (el) => {
        // console.log(el.getBoundingClientRect().bottom - 100);
        // console.log(window.innerHeight);

        return (el.getBoundingClientRect().bottom - 100) <= window.innerHeight;
    };


    loadMoreFeed = () => {
        if (isThereMoreFeeds === false) {

        } else {
            console.log("trigger load more.")
            /*  if there is no more feed "isThereMoreFeeds = false" */
        }
    }

    handleHeartClicked(feedId) {

        let loggedIn = (localStorage.getItem('loggedIn') === 'true');

        let params = {
            uniqueId: getUniqueId(),
            feedId: feedId
        }

        if(loggedIn){
            let selFeeds = this.props.feeds.filter(x => x.feedId === feedId);

            if(selFeeds[0].isLiked !== undefined){

                if(selFeeds[0].isLiked){
                    this.props.unlike(params)
                }else{
                    this.props.like(params)
                }
            }


        }else{

            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                this.toggleLoginPage()
            }

        }

    }

    handleCommentClicked(feedId) {


        let loggedIn = (localStorage.getItem('loggedIn') === 'true');

        if(loggedIn){

        }else{
            //if session logged out or not logged in
            //this.props.openLogInPage(feedId, 'comment')
        }

    }

    handleSaveClicked(feedId) {

        let loggedIn = (localStorage.getItem('loggedIn') === 'true');

        let params = {
            uniqueId: getUniqueId(),
            feedId: feedId
        }

        if(loggedIn){
            let selFeeds = this.props.feeds.filter(x => x.feedId === feedId);

            if(selFeeds[0].isSaved !== undefined){

                if(selFeeds[0].isSaved){
                    //console.log('unsave');
                    this.props.unsave(params)
                }else{
                    //console.log('save');
                    this.props.save(params)
                }
            }


        }else{

            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                this.toggleLoginPage()
            }

        }

    }

    toggleLoginPage = () => {
        const element = document.getElementById('logInPage');

        element.classList.toggle('searchViewClose')
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
    };



    render() {

        const masonryOptions = {
            // transitionDuration: 0,
            gutter: 32,
            columnWidth: '.grid-sizer',
            itemSelector: '.masonryCard',
            percentPosition: true,
        };

        let rows = []

        if(this.props.feeds !== undefined){

            this.props.feeds.forEach(feed => {

                const row = <HomeMasonryCard id={'promotionFeedArea'} className={"promotionFeed"} key={feed.feedId} feed={feed}
                                             onClickHeart={() => this.handleHeartClicked(feed.feedId)}
                                             onClickComment={() => this.handleCommentClicked(feed.feedId)}
                                             onClickSave={() => this.handleSaveClicked(feed.feedId)}
                                             closeMenu={() => this.closeMenu()}

                />;
                rows.push(row);

            })
        }


        return(

            <div >

                <Masonry id={"promotionFeedOuterArea"} className={'my-gallery-class'}
                         options = {masonryOptions}
                >
                    <div className="grid-sizer"/>
                    <HomeFirstFeed/>
                    {rows}

                </Masonry>

                <div id="logInPage" className="searchViewBackGround" ref={this.logInRef}>
                    <div className="searchBarWrapper">
                        <div className="searchCloseButton" ><a onClick={() => this.toggleLoginPage()}>close X</a></div>
                    </div>

                    <LogInPage  toggleLogInView={() => this.toggleLoginPage()} redirectUrl={'/'} action={this.state.logInAction}/>
                </div>
            </div>

        );
    }


}

let mapDispatchToProps = (dispatch) => {
    return {
        like: (params) => dispatch(like(params)),
        unlike: (params) => dispatch(unlike(params)),
        save: (params) => dispatch(save(params)),
        unsave: (params) => dispatch(unsave(params)),
        getFeeds: (hashTags, skip) => dispatch(getFeeds(hashTags, skip)),
        getFeedsFollowing: (hashTags, skip) => dispatch(getFeedsFollowing(hashTags, skip))
    }
}

let mapStateToProps = (state) => {

    return {
        viewMode: state.stella.viewMode,
        viewTagMode: state.stella.viewTagMode,
        hashTags: state.stella.hashTags,
        feeds: state.stella.feeds
    }
}

HomeFeed = connect(mapStateToProps, mapDispatchToProps)(HomeFeed);


export default HomeFeed;