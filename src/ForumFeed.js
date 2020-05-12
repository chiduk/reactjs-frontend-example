import React, { Component } from "react";
import {connect} from "react-redux";
import {like, unlike, isLiked, deleteForum} from "./actions/forum";
import {getUniqueId, RestApi, utcToLocal, isObjectEmpty} from "./util/Constants";
import ForumPostDetailView from "./ForumPostDetailView";
import {withRouter} from "react-router";
import ProfileImage from "./ProfileImage";
import ForumEditView from "./ForumEditView";
import ForumReportView from "./ForumReportView";
import {getMyInfo} from "./actions/user";
import YesOrNoAlert from "./YesOrNoAlert";

class ForumFeed extends Component {

    constructor(props){
        super(props);

        this.state = {
            viewMoreForumPost: null ,
            forumEditView:null,
            forumReportView: null,
            alertMessage: null
        };

        this.props.isLiked(this.props.feed.forumId);
        this.props.getMyInfo();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if( !isObjectEmpty(prevProps)){

            let prevStateForum = prevProps.forums.filter(x => x.forumId === this.props.feed.forumId)
            let newStateForum = this.props.forums.filter(x => x.forumId === this.props.feed.forumId);

            if(prevStateForum.length > 0 && newStateForum.length > 0){
                if(prevStateForum[0].isLiked !== newStateForum[0].isLiked){
                    this.props.isLiked(this.props.feed.forumId)
                }
            }
        }
    }

    toggleReportBox = (id) => {

        const element = document.getElementById(id)
        element.classList.toggle('reportHeight')
    }

    reportClick = (forumId) => {
        this.toggleReportBox(forumId+'reportBoxID')
    }

    editPost = (forum) => {

        if(this.state.forumEditView === null){
            this.setState({
                forumEditView: <ForumEditView forum={forum} closeView={() => this.closeEditForumView()}/>
            })
        }else{
            this.setState({
                forumEditView: null
            })
        }

        this.toggleReportBox(forum.forumId+'reportBoxID')

    }

    deletePost = (forum) => {
        let self = this
        if(this.state.alertMessage === null){
            this.setState({alertMessage: <YesOrNoAlert alertTitle={"삭제"}
                                                       messages={["삭제 후 복원 할 수 없습니다. 삭제 하시겠습니까?"]}
                                                       yes={() => {
                                                           let params = {
                                                               forumId: forum.forumId,
                                                               uniqueId: getUniqueId()
                                                           }

                                                           self.props.deleteForum(params);
                                                           self.setState({alertMessage: null})
                                                       } }
                                                       no={() => {
                                                            self.setState({alertMessage: null})
                                                       } }
                                                />})
        }

        this.toggleReportBox(forum.forumId+'reportBoxID')
    };

    reportPost = (forum) => {
        if(this.state.forumReportView === null){
            this.setState({
                forumReportView: <ForumReportView forum={forum} closeView={() => this.closeReportForumView()}/>
            })
        }else{
            this.setState({
                forumReportView: null
            })
        }

        this.toggleReportBox(forum.forumId+'reportBoxID')
    }

    closeEditForumView = () => {

        this.setState({forumEditView: null})
    }

    closeReportForumView = () => {
        console.log('close report view')

        this.setState({forumReportView: null})
    }

    likeButtonPressed = () => {

        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('forumLogInPage');

                element.classList.toggle('searchViewClose')
            }
            return
        }

        if(this.props.forums !== undefined){
            let selectedForum = this.props.forums.filter(x => x.forumId === this.props.feed.forumId)


            if(selectedForum.length > 0){

                let element = document.getElementById('forumFeedLikeID' + selectedForum[0].forumId);
                let isLiked = selectedForum[0].isLiked;

                if(isLiked){
                    this.props.unlike(selectedForum[0].forumId);
                    element.style.animation = "";
                }else{
                    this.props.like(selectedForum[0].forumId);
                    element.style.animation = "bounce 0.3s 1";
                }
            }
        }
    };

    profileClick = (uniqueId) => {
        let path = '/UserProfile';


        this.props.history.push({
            pathname: path,
            search: '?uid=' + uniqueId,
            state: {
                uniqueId: uniqueId

            }
        })
    };

    renderFeed = () => {
        let feed = this.props.feed;



        if(this.props.forums !== undefined){

            let selectedForum = this.props.forums.filter(x => x.forumId === this.props.feed.forumId);
            if(selectedForum.length > 0){
                feed = selectedForum[0];
            }
        }

        let likeButton;
        if (feed.isLiked) {
            likeButton = require('./image/socialLikeIconRed.png')
        } else {
            likeButton = require("./image/homeSocialHeartIcon.png")
        }

        let editButton;
        let deleteButton;

        if(feed.uniqueId === getUniqueId() ){
            editButton = <div onClick={() => this.editPost(feed)}><a>수정</a></div>;

        }

        if(feed.uniqueId === getUniqueId() || this.props.myInfo.isAdmin){

            deleteButton = <div onClick={() => this.deletePost(feed)}><a>삭제</a></div>
        }

        return (
            <div className={"postItem"}>
                <div className={"postUserImage"} onClick={() => this.profileClick(feed.uniqueId)}><ProfileImage uniqueId={feed.uniqueId }/></div>
                <div className={"postContentWrapper"}>
                    <div className={"forumContent"} onClick={() => this.viewForumDetail(feed, false)}>
                        <div className={"postTitle"}><a>{feed.title}</a></div>
                        <div className={"postMessage"}><a>{feed.article}</a></div>
                    </div>

                    <div className={"postDate"}><a>{utcToLocal(feed.date)}</a></div>
                    <div className={"postHashTagContainer"}>
                        {feed.hashTags.map((i, index) => {
                            return (
                                <div className={"forumPostTag"} key={index} id={index} >
                                    <a onClick={() => this.props.tagClicked(i)}>#{i}</a>
                                    <img src={require('./image/plusButton.png')} onClick={() => this.props.tagClicked(i)}/>
                                </div>
                            );
                        })}
                    </div>
                    <div className={"socialIconWrapper"}>
                        <div className={"forumSocialIcon"} ><img id={"forumFeedLikeID" + feed.forumId}  onClick={()=> this.likeButtonPressed()} src={likeButton} /><a className={"forumSocialIconText"}>{feed.numOfLikes}</a></div>
                        <div className={"forumSocialIcon"}><img src={require("./image/homeSocialComment.png")} onClick={() => this.viewForumDetail(feed, true)}/><a className={"forumSocialIconText"}>{feed.numOfComments}</a></div>
                        <div className={"threeDots"}><img src={require("./image/threeDots.png")} onClick={() => this.toggleReportBox(feed.forumId+'reportBoxID')}/></div>
                    </div>

                    <div className={"reportBoxRight"}>
                        <div className={"reportBox"} id={feed.forumId+'reportBoxID'} >
                            <div onClick={() => this.reportPost(feed)}><a>신고</a></div>
                            {editButton}
                            {deleteButton}
                        </div>
                    </div>

                </div>

            </div>
        );

    }

    viewForumDetail = (feed, isCommentClicked) => {

        if(getUniqueId() === undefined || getUniqueId() === null){

            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('forumLogInPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }


        if (this.state.viewMoreForumPost === null || this.state.viewMoreForumPost === undefined ) {
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



    render() {

        return (
            <div>
                {this.renderFeed()}
                {this.state.viewMoreForumPost}
                {this.state.forumEditView}
                {this.state.forumReportView}
                {this.state.alertMessage}
            </div>
        )
    }

}

let mapStateToProps = (state) => {
    return {
        forums: state.forum.forums,
        myInfo: state.stella.myInfo
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        like: (forumId) => dispatch(like(forumId)),
        unlike: (forumId) => dispatch(unlike(forumId)),
        isLiked: (forumId) => dispatch(isLiked(forumId)),
        getMyInfo: () => dispatch(getMyInfo()),
        deleteForum: (params) => dispatch(deleteForum(params))
    }
};

ForumFeed = connect(mapStateToProps, mapDispatchToProps)(ForumFeed)

export default withRouter(ForumFeed)