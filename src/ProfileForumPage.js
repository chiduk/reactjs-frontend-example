import React, { Component } from "react";
import ForumPostDetailView from "./ForumPostDetailView";
import "./js/components/ProfilePage.css";
import {getForum} from './actions/user';
import {withRouter} from "react-router";
import {like, unlike, isLiked} from "./actions/forum";
import {connect} from "react-redux";
import {RestApi, utcToLocal} from "./util/Constants";

class ProfileForumPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            postList: [],
        }

        this.likePressed = this.likePressed.bind(this)
        this.likeCountPressed = this.likeCountPressed.bind(this)
        this.commentPressed = this.commentPressed.bind(this)
        this.toggleReportBox = this.toggleReportBox.bind(this)
        this.editPost = this.editPost.bind(this)
        this.userPicClicked = this.userPicClicked.bind(this)


    }

    componentDidMount() {
        let uniqueId = this.props.uniqueId
        //console.log('forum mount', uniqueId)
        this.props.getForum(uniqueId)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //console.log(prevProps,prevState)
    }


    viewForumDetail(feed, index, isCommentClicked) {
        //console.log(feed)

        if (this.state.viewMoreForumPost === null ) {
            this.setState({viewMoreForumPost: <ForumPostDetailView
                    forumId={feed.forumId}
                    likePressed={() => this.props.like(feed.forumId)}
                    isCommentClicked={isCommentClicked}
                    closeView={() => this.viewForumDetail(feed)}
                    forum={feed}
                    index={feed.forumId}
                    />
                }
            )
        } else {
            this.setState({viewMoreForumPost: null})
        }
    }

    toggleReportBox(index) {

        const element = document.getElementById("reportBoxID" + index)
        element.classList.toggle('reportHeight')
    }

    reportClick(id, index) {
        this.toggleReportBox(index)
    }

    likeCountPressed(feedID) {

    }

    commentPressed(feedID) {

    }

    editPost(postID) {

        //console.log(postID)

    }

    userPicClicked(userID) {
        //console.log("user pic is pressed" + userID)
        let path = '/UserProfile'
        this.props.history.push({
            pathname: path,
            search: '?uid=' + userID,
            state: {
                uniqueId: userID,
                // title: this.props.feedData.title,
                // profileImage: require('./image/profilePicture.png'),
                // profileUserName: this.props.feedData.userName,
                // message: this.props.feedData.message
            }
        })

    }

    tagClicked(tag) {

        // this.props.tagClicked(tag)

    }

    likePressed(forum) {


        const element = document.getElementById("profileSocialForumLike" + forum.forumId);



        if(forum.isLiked){
            this.props.unlike(forum.forumId)
            element.style.animation = "";

        }else{
            this.props.like(forum.forumId)
            element.style.animation = "bounce 0.3s 1";
        }
        // const object = Object.assign([], this.state.postList);
        // object[index].isLiked = !object[index].isLiked;
        //
        // //console.log("profileSocialForumLike" + index)
        //
        // // const element = document.getElementById("profileSocialForumLike" + index);
        // // element.style.animation = "";
        //
        // this.setState({postList : object}, () => {
        //     // element.style.animation = "bounce 0.3s 1";
        //     // this.props.likePressed(index)
        // });
        //
        // this.props.likePressedProp(index)
    }

    render() {

        return(
            <div className={"postingWrapper"}>

                {this.props.forums.map((i, index) => {

                    let likeButton;
                    if (i.isLiked === true) {
                        likeButton = require('./image/socialLikeIconRed.png')
                    } else {
                        likeButton = require("./image/homeSocialHeartIcon.png")
                    }



                    let editButton;
                    if (i.uniqueId === this.props.uniqueId) {
                        editButton = <div onClick={() => this.editPost(i.postID)}><a>수정</a></div>
                    }

                    return (
                        <div className={"postItem"}>
                            <div className={"postUserImage"} onClick={() => this.userPicClicked(i.userID)}><img src={RestApi.profile + this.props.uniqueId + '.png'} /></div>
                            <div className={"postContentWrapper"}>
                                <div className={"forumContent"} onClick={() => this.viewForumDetail(i, index, false)}>
                                    <div className={"postTitle"}><a>{i.title}</a></div>
                                    <div className={"postMessage"}><a>{i.article}</a></div>
                                </div>

                                <div className={"postDate"}><a>{utcToLocal(i.date)}</a></div>
                                <div className={"postHashTagContainer"}>
                                    {i.hashTags.map((i, index) => {
                                        return (
                                            <div className={"forumPostTag"} id={index} >
                                                <a onClick={() => this.tagClicked(i)}>#{i}</a>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={"socialIconWrapper"}>
                                    <div className={"forumSocialIcon"}><img id={"profileSocialForumLike" + i.forumId} onClick={()=> this.likePressed(i)} src={likeButton} /><a className={"forumSocialIconText"}>{i.numOfLikes}</a></div>
                                    <div className={"forumSocialIcon"}><img src={require("./image/homeSocialComment.png")} onClick={() => this.viewForumDetail(i, index, true)}/><a className={"forumSocialIconText"}>{i.numOfComments}</a></div>
                                    {/*<div className={"threeDots"}><img src={require("./image/threeDots.png")} onClick={() => this.toggleReportBox(i)}/></div>*/}
                                </div>

                                <div className={"reportBoxRight"}>
                                    <div className={"reportBox"} id={"reportBoxID" + index} onClick={() => this.reportClick(i.forumId, index)}>
                                        <div><a>신고</a></div>
                                        {editButton}
                                    </div>
                                </div>

                            </div>

                        </div>
                    );
                })}

                {this.state.viewMoreForumPost}

            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        getForum: (uniqueId) => dispatch(getForum(uniqueId)),
        isLiked: (forumId) => dispatch(isLiked(forumId)),
        like: (forumId) => dispatch(like(forumId)),
        unlike: (forumId) => dispatch(unlike(forumId))
    }
};

let mapStateToProps = (state) => {
    return {

        forums: state.forum.forums

    }
}

ProfileForumPage = connect(mapStateToProps, mapDispatchToProps)(ProfileForumPage);

export default withRouter(ProfileForumPage);