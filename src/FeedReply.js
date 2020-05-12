import React, { Component }from 'react';
import { connect } from 'react-redux';
import "./js/components/Comment.css";
import TextareaAutosize from 'react-autosize-textarea';
import { withRouter} from "react-router-dom";
import {getUniqueId, RestApi} from "./util/Constants";
import {getReplies, sendReply} from "./actions/feed";
import ProfileImage from "./ProfileImage";

class FeedReply extends Component{
    constructor(props){
        super(props)

    }


    componentDidMount() {
        let params = {
            commentFeedId: this.props.commentFeedId
        }
        this.props.getReplies(params)
    }

    replyButtonPressed = (value) => {

        console.log(value)
        const element = document.getElementById(value)
        element.classList.toggle('replyBoxOpen')


    }

    sendButtonPressed = (commentCommentFeedId) => {

        const target = commentCommentFeedId;

        const textValue = this.refs[target].value;


        this.refs[target].value = ""

        this.replyButtonPressed(commentCommentFeedId)

        let lastCommentCommentFeedId = null;





        if(typeof this.props.replies !== 'undefined') {

            let filteredArr = this.props.replies.filter(x => x.commentFeedId === this.props.commentFeedId);
     
            if (filteredArr.length > 0) {

                lastCommentCommentFeedId = filteredArr[0].replies[filteredArr[0].replies.length - 1].commentCommentFeedId;
            }


        }

        if(typeof textValue !== 'undefined' && textValue.length > 0){
            let params = {
                feedId: this.props.feedId,
                commentFeedId: this.props.commentFeedId,
                uniqueId: getUniqueId(),
                lastCommentCommentFeedId: lastCommentCommentFeedId,
                comment: textValue.trim()
            }

           this.props.sendReply(params)
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
    };

    render() {

        let rows = [];
        let commentFeedId = this.props.commentFeedId;

        if(typeof this.props.replies !== 'undefined'){

            let filteredArr = this.props.replies.filter(x => x.commentFeedId === commentFeedId);

            if(filteredArr.length <= 0){

                return rows;
            }

            filteredArr[0].replies.forEach(reply => {

                const cell =
                    <div className="commentContainer replyContainer" key={reply.commentCommentFeedId}>
                        <div className="commentUserImg replyProfile" onClick={() => this.profileClick(reply.user.uniqueId)}><ProfileImage  uniqueId={reply.user.uniqueId}/></div>

                        <div className="messageContainer">
                            <div className="commentUserName">
                                <a className="commentUserNameText" onClick={() => this.profileClick(reply.user.uniqueId)}>{reply.user.userId}</a><a>  {reply.comment}</a>
                            </div>


                            {/*<div className="replyButton" onClick={() => this.replyButtonPressed(reply.commentCommentFeedId)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>*/}


                            <div id={reply.commentCommentFeedId} className="replyInputContainer">
                                <div className="commentUserProfileImg"><ProfileImage uniqueId={getUniqueId()}/></div>
                                <div className="commentBoxContainer">
                                    <TextareaAutosize
                                        ref={ reply.commentCommentFeedId}
                                        className="replyInputBox"
                                        rows={1}
                                        onChange={e => this.setState({ textBoxValue: e.target.value })}
                                    />
                                    <div className="commentSendButton" onClick={() => this.sendButtonPressed(reply.commentCommentFeedId)}><a>Send</a></div>
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
        getReplies: (params) => dispatch(getReplies(params)),
        sendReply: (params) => dispatch(sendReply(params))
    }
}

let mapStateToProps = (state) => {

    let newArray = [];

    if(typeof state.stella.replies !== 'undefined'){

        state.stella.replies.forEach(elem => {

            newArray.push(elem)
        })
    }


    return {replies: newArray}
}

FeedReply = connect(mapStateToProps, mapDispatchToProps)(FeedReply);

export default withRouter(FeedReply);