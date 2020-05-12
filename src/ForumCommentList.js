 import React, { Component }from 'react';
import "./js/components/Comment.css";
import TextareaAutosize from 'react-autosize-textarea';
import {getUniqueId, RestApi} from "./util/Constants";
import ForumReply from "./ForumReply"
import {connect} from "react-redux";
import {commentCommentAdd, getComments} from "./actions/forum";
import ProfileImage from "./ProfileImage";

class ForumCommentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments:[],
            loadReplies: true,
            replies:[]
        };

        this.props.getComments(this.props.forumId)
    }

    componentDidMount() {
        // window.onpopstate = (e) => {
        //     alert('POP!!')
        // }
    }


    replyButtonPressed = (value) => {

        console.log(value)
        const element = document.getElementById(value)
        element.classList.toggle('replyBoxOpen')
    }

    sendButtonPressed = (commentForumId) => {

        //console.log(id);

        console.log('comment comment add');

        const target = commentForumId;

        const textValue = this.refs[target].value;

        console.log(textValue)

        this.refs[target].value = ""

        this.replyButtonPressed(commentForumId)

        let lastCommentCommentFeedId = null;

        if(this.props.replies.length > 0){

            let filteredArr = this.props.replies.filter(x => x.commentForumId === commentForumId)

            if(filteredArr.length > 0){
                if ( filteredArr[0].replies.length > 0){
                    lastCommentCommentFeedId = filteredArr[0].replies[filteredArr[0].replies.length - 1].commentCommentFeedId;

                    console.log('Last Comment Comment Feed Id', lastCommentCommentFeedId);
                }
            }

        }



        if(typeof textValue !== 'undefined' && textValue.length > 0){

            let params = {
                forumId: this.props.forumId,
                commentForumId: commentForumId,
                uniqueId: getUniqueId(),
                lastCommentCommentFeedId: lastCommentCommentFeedId,
                comment: textValue.trim()
            };

            this.props.addCommentComment(params)
        }

    };

    render() {


        let rows = [];

        const firstUserProfileImgStyle = {
            width: this.props.firstUserImgSize + "px",
            height: this.props.firstUserImgSize + "px"
        }

        if(typeof this.props.comments !== 'undefined'){
            let comments = this.props.comments;

            comments.forEach((comment) => {
                const cell =
                    <div className="commentContainer" key={comment.commentForumId}>
                        <div className="commentUserImg"><ProfileImage uniqueId={comment.user.uniqueId} /> </div>

                        <div className="messageContainer">
                            <div className="commentUserName">
                                <a className="commentUserNameText">{comment.user.userId}</a><a> {comment.comment}</a>
                            </div>


                            <div className="replyButton" onClick={() => this.replyButtonPressed(comment.commentForumId)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>


                            <div id={comment.commentForumId} className="replyInputContainer">
                                <div className="commentUserProfileImg"><ProfileImage uniqueId={getUniqueId()}/></div>
                                <div className="commentBoxContainer">
                                    <TextareaAutosize
                                        ref={comment.commentForumId}
                                        className="replyInputBox"
                                        rows={1}
                                        onChange={e => this.setState({ textBoxValue: e.target.value })}
                                    />
                                    <div className="commentSendButton" onClick={() => this.sendButtonPressed(comment.commentForumId)}><a>Send</a></div>
                                </div>
                            </div>
                            <ForumReply key={comment.commentForumId} id={"FeedReply" + comment.commentForumId} commentForumId={comment.commentForumId} forumId={this.props.forumId} />
                        </div>
                    </div>

                rows.push(cell)
            })
        }


        return rows;
    }
}


let mapDispatchToProps = (dispatch) => {
    return {
        addCommentComment: (params) => dispatch(commentCommentAdd(params)),
        getComments: (forumId) => dispatch(getComments(forumId))
    }
}

let mapStateToProps = (state) => {

    return {
        replies: state.forum.replies,
        comments: state.forum.comments
    }
}

ForumCommentList = connect(mapStateToProps, mapDispatchToProps)(ForumCommentList);

export default ForumCommentList;