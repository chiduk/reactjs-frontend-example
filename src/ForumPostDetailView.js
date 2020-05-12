import React, { Component } from "react";
import "./js/components/ForumDetail.css";
import "./js/components/Forum.css";
import "./js/components/Comment.css";
import ForumCommentList from "./ForumCommentList"
import TextareaAutosize from 'react-autosize-textarea';
import {follow, unfollow, isFollowing, getMyInfo} from "./actions/user";
import {like, unlike, isLiked, commentAdd, read} from "./actions/forum"
import {connect} from "react-redux";
import {getUniqueId, RestApi, utcToLocal} from "./util/Constants";
import ProfileImage from "./ProfileImage";

class ForumPostDetailView extends Component {
    constructor(props) {
        super(props)
        this.commentBox = React.createRef();
        this.likePressed = this.likePressed.bind(this);
        this.toggleReportBox = this.toggleReportBox.bind(this);
        this.reportClick = this.reportClick.bind(this);
        this.commentEdit = this.commentEdit.bind(this);
        this.commentPressed = this.commentPressed.bind(this);
        this.forumCommentSendPressed = this.forumCommentSendPressed.bind(this);
        this.state = {
            commentMessage: "",
            isLiked: false
        };

        this.props.isLiked(this.props.forum.forumId);
        this.props.isFollowing(this.props.forum.uniqueId);

        this.props.read({uniqueId: getUniqueId(), forumId: this.props.forum.forumId})

        this.props.getMyInfo()
    }


    followPressed(id) {



        const element = document.getElementsByClassName('forumFollowButton');
        element[0].style.visibility = "hidden"
    }

    likePressed() {

        if(this.props.feeds !== undefined){


            let forumSelected = this.props.feeds.filter( x => x.forumId === this.props.forum.forumId);

            if(forumSelected.length > 0){
                let isLiked = forumSelected[0].isLiked;

                console.log('is liked: ', isLiked)

                if(isLiked){
                    this.props.unlike(this.props.forum.forumId)
                }else{
                    this.props.like(this.props.forum.forumId)
                }
            }
        }

        const element = document.getElementById('forumDetailLikeID');
        element.style.animation = "";

        this.setState({isLiked : !this.state.isLiked}, () => {
            element.style.animation = "bounce 0.3s 1";
        });

    }

    commentPressed() {

    }

    toggleReportBox() {

        const element = document.getElementById("forumReportBoxID")
        element.classList.toggle('reportHeight')

    }

    componentDidMount() {
        if (this.props.isCommentClicked === true) {
            this.commentBox.current.focus()
        }
    }

    reportClick() {

    }

    commentEdit(event) {

        this.setState({commentMessage: event.target.value})

    }

    forumCommentSendPressed() {

        if(this.state.commentMessage.length > 0){
            let lastCommentForumId = null

            if(this.props.comments.length > 0){
                lastCommentForumId = this.props.comments[this.props.comments.length - 1].commentForumId
            }

            let params = {
                uniqueId: getUniqueId(),
                forumId: this.props.forumId,
                comment: this.state.commentMessage,
                lastCommentForumId: lastCommentForumId
            };

            this.props.addComment(params);

            this.setState({commentMessage:""})
        }

    }

    render() {

        let isLiked = false;
        let forum;

        if(this.props.feeds !== undefined){

            let selForums = this.props.feeds.filter(x => x.forumId === this.props.forum.forumId)

            if(selForums.length > 0){
                forum = selForums[0]
            }

            let forumSelected = this.props.feeds.filter( x => x.forumId === this.props.forum.forumId);

            if(forumSelected.length > 0){
                isLiked = forumSelected[0].isLiked;
            }
        }else{
            forum = this.props.forum
        }

        let isFollowing = false;

        if(this.props.isFollowingArray !== undefined){
            let isFollowingSelected = this.props.isFollowingArray.filter( x => x.followeeId === forum.uniqueId)

            if(isFollowingSelected.length > 0){
                isFollowing = isFollowingSelected[0].isFollowing;
            }
        }

        let follow;
        if (forum.user.isInfluencer) {
            follow = <div className={"forumFollowButton"} onClick={() => this.followPressed(forum.uniqueId)}><a>{(isFollowing) ? 'follow' : ''}</a></div>
        }

        let likeButton;
        if (isLiked) {
            likeButton = require('./image/socialLikeIconRed.png')
        } else {
            likeButton = require("./image/homeSocialHeartIcon.png")
        }

        let editButton;


        if (forum.uniqueId === getUniqueId()) {
            editButton = <div onClick={() => this.editPost(forum.forumId)}><a>수정</a></div>

        }



        return (
            <div className={"forumDetailBody"}>
                <div className={"forumDetailBackGround"} onClick={this.props.closeView}/>
                <div className={"forumDetailContainer"}>
                    <div className={"forumCloseButton"} onClick={ this.props.closeView}><a>close X</a></div>
                    <div className={"forumDetailView"}>
                        <div className={"forumUserProfileContainer"}>
                            <div className={"forumDetailUserImage"}><ProfileImage uniqueId={forum.uniqueId}/></div>
                            <div className={"forumUserName"}><a>{forum.user.userId}</a></div>
                            {follow}
                        </div>
                        <div className={"forumContentWrapper"}>
                            <div className={"forumTitle"}><a>{forum.title}</a></div>
                            <div className={"forumDetailText"}><a>{forum.article}</a></div>
                            <div className={"forumDetailDate"}><a>{utcToLocal(forum.date)}</a></div>
                            <div className={"hashTagWrapper"}>
                                {
                                    forum.hashTags.map((i, index) => {
                                        return(
                                            <div className={"forumPostTag"} key={index} id={index}><a>#{i}</a></div>
                                        );
                                    })
                                }
                            </div>

                            <div className={"socialIconWrapper"}>
                                <div className={"forumSocialIcon"} ><img id={"forumDetailLikeID"} onClick={this.likePressed} src={likeButton}/><a className={"forumSocialIconText"}>{forum.numOfLikes}</a></div>
                                <div className={"forumSocialIcon"}><img src={require("./image/homeSocialComment.png")} /><a className={"forumSocialIconText"}>{forum.numOfComments}</a></div>
                                {/*<div className={"threeDots"}><img src={require("./image/threeDots.png")} onClick={() => this.toggleReportBox(forum.forumId)}/></div>*/}
                            </div>

                            <div className={"reportBoxRight"}>
                                <div className={"reportBox"} id={"forumReportBoxID"} onClick={() => this.reportClick(forum.forumId, this.props.index)}>
                                    <div><a>신고</a></div>
                                    {editButton}
                                </div>
                            </div>

                            <div className={"forumCommentBoxContainer"}>
                                <div className={"forumWriterImage"}><ProfileImage uniqueId={getUniqueId()} /></div>
                                <div className={"forumCommentBoxWrap"}>

                                    <TextareaAutosize
                                        ref={this.commentBox}
                                        className={"forumCommentInputBox"}
                                        rows={1}
                                        placeholder={"write comment"}
                                        onChange={(event) => this.commentEdit(event)}
                                        value={this.state.commentMessage}
                                    />
                                    <div className={"forumCommentSendButton"} onClick={() => this.forumCommentSendPressed()}><a>Send</a></div>
                                </div>
                            </div>

                            <ForumCommentList firstUserImgSize={40} secondUserImageSize={32} forumId={forum.forumId}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = (state) => {

    return {
        feeds: state.forum.forums,
        isFollowingArray: state.stella.isFollowingArray,
        comments: state.forum.comments,
        myInfo: state.stella.myInfo
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        read: (params) => dispatch(read(params)),
        like: (forumId) => dispatch(like(forumId)),
        unlike: (forumId) => dispatch(unlike(forumId)),
        isLiked: (forumId) => dispatch(isLiked(forumId)),
        follow: (followeeId) => dispatch(follow(followeeId)),
        unfollow: (followeeId) => dispatch(unfollow(followeeId)),
        isFollowing: (followeeId) => dispatch(isFollowing(followeeId)),
        addComment: (params) => dispatch(commentAdd(params)),
        getMyInfo: () => dispatch(getMyInfo())

    }
}

ForumPostDetailView = connect(mapStateToProps, mapDispatchToProps)(ForumPostDetailView);


export default ForumPostDetailView;
