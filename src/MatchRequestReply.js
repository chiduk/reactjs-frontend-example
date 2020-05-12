import React, { Component }from 'react';
import { connect } from 'react-redux';
import "./js/components/Comment.css";
import TextareaAutosize from 'react-autosize-textarea';

import {getUniqueId, RestApi} from "./util/Constants";

import {withRouter} from "react-router";
import ProfileImage from "./ProfileImage";
import {getMatchRequestComment, addMatchRequestComment} from "./actions/manager";

class MatchRequestReply extends Component {
    constructor(props){
        super(props)
    }

    componentDidMount() {
        let params = {
            threadId: this.props.threadId
        }

        this.props.getComments(params)
    }

    replyButtonPressed = (value) => {

        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }

        const element = document.getElementById(value)
        element.classList.toggle('replyBoxOpen')


    }

    sendButtonPressed = (commentId) => {

        const target = commentId;

        const textValue = this.refs[target].value;


        this.refs[target].value = "";

        this.replyButtonPressed(commentId);

        let lastCommentId = null;

        if(typeof this.props.replies !== 'undefined') {

            let filteredArr = this.props.replies.filter(x => x.threadId === this.props.threadId);

            if (filteredArr.length > 0) {

                lastCommentId = filteredArr[0].replies[filteredArr[0].replies.length - 1].commentId;
            }
        }

        if(typeof textValue !== 'undefined' && textValue.length > 0){
            let params = {
                threadId: this.props.threadId,
                matchRequestId: this.props.matchRequestId,
                commentId: this.props.commentId,
                notificationId: this.props.notificationId,
                reviewerId: getUniqueId(),
                lastCommentId: lastCommentId,
                comment: textValue.trim()
            }

            this.props.addComment(params)
        }

    }

    profileClick = (uniqueId) => {
        let path = '/UserProfile';


        this.props.history.push({
            pathname: path,
            search: '?uid=' + uniqueId,
            state: {
                uniqueId: uniqueId
            }
        })
    }

    render() {
        let rows = [];


        if(typeof this.props.replies !== 'undefined'){


            let filteredArr = this.props.replies.filter(x => x.threadId === this.props.threadId);


            if(filteredArr.length <= 0){

                return rows;
            }



            filteredArr[0].replies.forEach(reply => {

                const cell =
                    <div className="commentContainer replyContainer" key={reply.commentId}>
                        <div className="commentUserImg replyProfile" onClick={() => this.profileClick(reply.user.uniqueId)}><ProfileImage uniqueId={reply.user.uniqueId}/></div>

                        <div className="messageContainer">
                            <div className="commentUserName">
                                <a className="commentUserNameText" onClick={() => this.profileClick(reply.user.uniqueId)}>{reply.user.userId}</a><a>  {reply.comment}</a>
                            </div>


                            {/*<div className="replyButton" onClick={() => this.replyButtonPressed(reply.commentId)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>*/}


                            <div id={reply.commentId} className="replyInputContainer">
                                <div className="commentUserProfileImg"><ProfileImage uniqueId={getUniqueId()}/></div>
                                <div className="commentBoxContainer">
                                    <TextareaAutosize
                                        ref={ reply.commentId}
                                        className="replyInputBox"
                                        rows={1}
                                        onChange={e => this.setState({ textBoxValue: e.target.value })}
                                    />
                                    <div className="commentSendButton" onClick={() => this.sendButtonPressed(reply.commentId)}><a>Send</a></div>
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

let mapStateToProps = (state) => {

    return{
        replies: state.manager.matchRequestReplies
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        getComments: (params) => dispatch(getMatchRequestComment(params)),
        addComment: (params) => dispatch(addMatchRequestComment(params))
    }
};

MatchRequestReply = connect(mapStateToProps, mapDispatchToProps)(MatchRequestReply)

export default withRouter(MatchRequestReply)