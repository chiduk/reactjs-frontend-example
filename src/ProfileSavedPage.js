import React, { Component } from "react";
import HomeMasonryCard from "./HomeMasonryCard.js";
import Masonry from "react-masonry-component";

import "./js/components/Home.css";
import "./js/components/HomeFeed.css";
import "./js/components/ProfilePage.css";
import {connect} from "react-redux";

import { getSaved} from "./actions/user";
import {getUniqueId} from "./util/Constants";
import { like, unlike, save, unsave} from "./actions/home";

class ProfileSavedPage extends Component {
    constructor(props) {
        super(props);

        let params = {
            uniqueId: this.props.uniqueId
        }

        //this.props.getSaved(params)
    }

    componentDidMount() {
        let self = this;
        document.getElementById('profileSavedFeedOuterArea').onclick = function (e) {


            if(e.target === document.getElementById('profileSavedFeedOuterArea')){

                self.closeMenu()
            }else{

            }
        }
    }

    handleHeartClicked = (feedId) => {

        console.log(feedId)

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
                    console.log('unlike')
                    this.props.unlike(params)
                }else{
                    console.log('like')
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
                    console.log('unsave');
                    this.props.unsave(params)
                }else{
                    console.log('save');
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
                id={'profileSavedFeedArea'}
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
            <div className={"profileSocialPageView"} id={'profileSavedFeedOuterArea'}>
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
        getSaved: (params) => dispatch(getSaved(params)),
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

ProfileSavedPage = connect(mapStateToProps, mapDispatchToProps)(ProfileSavedPage)

export default ProfileSavedPage;