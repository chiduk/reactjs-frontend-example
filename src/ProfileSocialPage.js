import React, { Component } from "react";
import HomeMasonryCard from "./HomeMasonryCard.js";
import Masonry from "react-masonry-component";

import "./js/components/Home.css";
import "./js/components/HomeFeed.css";
import "./js/components/ProfilePage.css";
import {connect} from "react-redux";

import {getFeed} from "./actions/user";
import {getUniqueId, PROFILE_SOCIAL_VIEW_MODE} from "./util/Constants";
import { like, unlike, save, unsave} from "./actions/home";

class ProfileSocialPage extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.uniqueId)
        let params = {
            uniqueId: this.props.uniqueId,
            viewMode: PROFILE_SOCIAL_VIEW_MODE.VIEW_FOR_SALE
        };

        this.props.getFeeds(params)
    }

    componentDidMount() {


        let self = this;
        document.getElementById('profileSocialFeedOuterArea').onclick = function (e) {


            if(e.target === document.getElementById('profileSocialFeedOuterArea')){

                self.closeMenu()
            }else{

            }
        }
    }

    handleHeartClicked = (feedId) => {



        let loggedIn = (localStorage.getItem('loggedIn') === 'true');

        let params = {
            uniqueId: getUniqueId(),
            feedId: feedId
        }

        if(loggedIn){
            let selFeeds = this.props.feeds.filter(x => x.feedId === feedId);


            console.log(selFeeds)

            if(selFeeds[0].isLiked !== undefined){

                if(selFeeds[0].isLiked){
                    this.props.unlike(params)
                }else{
                    this.props.like(params)
                }
            }


        }else{

            this.props.openLogInPage(feedId, 'like')

        }

    }

    handleCommentClicked = (feedId) => {


        let loggedIn = (localStorage.getItem('loggedIn') === 'true');

        if(loggedIn){

        }else{
            //if session logged out or not logged in
            this.props.openLogInPage(feedId, 'comment')
        }

    }

    handleSaveClicked = (feedId) => {

        let loggedIn = (localStorage.getItem('loggedIn') === 'true');

        let params = {
            uniqueId: getUniqueId(),
            feedId: feedId
        }

        if(loggedIn){
            let selFeeds = this.props.feeds.filter(x => x.feedId === feedId);

            if(selFeeds[0].isSaved !== undefined){

                if(selFeeds[0].isSaved){

                    this.props.unsave(params)
                }else{

                    this.props.save(params)
                }
            }


        }else{

            this.props.openLogInPage(feedId, 'like')

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
    };


    render() {

        let rows = [];

        if(this.props.feeds === undefined){
            return rows;
        }

        this.props.feeds.forEach(feed => {
            let row = <HomeMasonryCard
                id={'profileSocialFeedArea'}
                feed={feed}
                onClickHeart={() => this.handleHeartClicked(feed.feedId)}
                onClickComment={() => this.handleCommentClicked(feed.feedId)}
                onClickSave={() => this.handleSaveClicked(feed.feedId)}
            />;

            rows.push(row)
        });

        const masonryOptions = {
            gutter: 32,
            columnWidth: '.grid-sizer',
            itemSelector: '.masonryCard',
            percentPosition: true,
        };

        return(
            <div className={"profileSocialPageView"} id={'profileSocialFeedOuterArea'}>
                <Masonry class={'my-gallery-class'} options = {masonryOptions}>
                    <div className="grid-sizer"/>
                    {rows}
                </Masonry>
            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        getFeeds: (params) => dispatch(getFeed(params)),
        like: (params) => dispatch(like(params)),
        unlike: (params) => dispatch(unlike(params)),
        save: (params) => dispatch(save(params)),
        unsave: (params) => dispatch(unsave(params))
    }
};

let mapStateToProps = (state) => {

    return{
        feeds: state.stella.feeds
    }
};

ProfileSocialPage = connect(mapStateToProps, mapDispatchToProps)(ProfileSocialPage)

export default ProfileSocialPage;