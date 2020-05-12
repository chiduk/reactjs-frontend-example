import React, { Component }from 'react';
import { connect } from 'react-redux';
import "./js/components/Comment.css";
import TextareaAutosize from 'react-autosize-textarea';

import {getUniqueId, RestApi} from "./util/Constants";
import {commentCommentAdd, getCommentReplies} from "./actions/forum";


class ForumReply extends Component {
    constructor(props){
        super(props)
    }

    componentDidMount() {
        let params = {
            commentForumId: this.props.commentForumId
        }

        this.props.getCommentReplies(params)
    }

    replyButtonPressed = (value) => {

        const element = document.getElementById(value)
        element.classList.toggle('replyBoxOpen')


    }

    sendButtonPressed = (commentCommentFeedId) => {

        const target = commentCommentFeedId;

        const textValue = this.refs[target].value;


        this.refs[target].value = "";

        this.replyButtonPressed(commentCommentFeedId);

        let lastCommentCommentForumId = null;

        if(typeof this.props.replies !== 'undefined') {

            let filteredArr = this.props.replies.filter(x => x.commentForumId === this.props.commentForumId);

            if (filteredArr.length > 0) {

                lastCommentCommentForumId = filteredArr[0].replies[filteredArr[0].replies.length - 1].commentCommentForumId;
            }


        }

        if(typeof textValue !== 'undefined' && textValue.length > 0){
            let params = {
                forumId: this.props.forumId,
                commentForumId: this.props.commentForumId,
                uniqueId: getUniqueId(),
                lastCommentCommentForumId: lastCommentCommentForumId,
                comment: textValue.trim()
            }

            this.props.commentCommentAdd(params)
        }

    }

    render() {
        let rows = [];
        let commentForumId = this.props.commentForumId;

        if(typeof this.props.replies !== 'undefined'){

            let filteredArr = this.props.replies.filter(x => x.commentForumId === commentForumId);

            if(filteredArr.length <= 0){

                return rows;
            }

            filteredArr[0].replies.forEach(reply => {

                const cell =
                    <div className="commentContainer replyContainer" key={reply.commentCommentForumId}>
                        <div className="commentUserImg replyProfile"><img src={RestApi.profile + reply.user.uniqueId + '.png'}/></div>

                        <div className="messageContainer">
                            <div className="commentUserName">
                                <a className="commentUserNameText">{reply.user.userId}</a><a>  {reply.comment}</a>
                            </div>


                            {/*<div className="replyButton" onClick={() => this.replyButtonPressed(reply.commentCommentForumId)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>*/}


                            <div id={reply.commentCommentForumId} className="replyInputContainer">
                                <div className="commentUserProfileImg"><img src={RestApi.profile + getUniqueId() + '.png'}/></div>
                                <div className="commentBoxContainer">
                                    <TextareaAutosize
                                        ref={ reply.commentCommentForumId}
                                        className="replyInputBox"
                                        rows={1}
                                        onChange={e => this.setState({ textBoxValue: e.target.value })}
                                    />
                                    <div className="commentSendButton" onClick={() => this.sendButtonPressed(reply.commentCommentForumId)}><a>Send</a></div>
                                </div>
                            </div>
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
        getCommentReplies: (params) => dispatch(getCommentReplies(params)),
        commentCommentAdd: (params) => dispatch(commentCommentAdd(params))
    }
};

let mapStateToProps = (state) => {
    return {
        replies: state.forum.replies
    }
};

ForumReply = connect(mapStateToProps, mapDispatchToProps)(ForumReply);

export default ForumReply;