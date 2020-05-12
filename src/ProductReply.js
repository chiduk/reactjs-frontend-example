import React, { Component }from 'react';
import { connect } from 'react-redux';
import "./js/components/Comment.css";
import TextareaAutosize from 'react-autosize-textarea';

import {getUniqueId, RestApi} from "./util/Constants";
import {getCommentComment, addCommentComment} from "./actions/product";
import {withRouter} from "react-router";
import ProfileImage from "./ProfileImage";


class ProductReply extends Component {
    constructor(props){
        super(props)
    }

    componentDidMount() {
        let params = {
            commentId: this.props.commentId
        }

        this.props.getCommentComment(params)
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

    sendButtonPressed = (commentCommentId) => {

        const target = commentCommentId;

        const textValue = this.refs[target].value;


        this.refs[target].value = "";

        this.replyButtonPressed(commentCommentId);

        let lastCommentCommentId = null;

        if(typeof this.props.replies !== 'undefined') {

            let filteredArr = this.props.replies.filter(x => x.commentId === this.props.commentId);

            if (filteredArr.length > 0) {

                lastCommentCommentId = filteredArr[0].replies[filteredArr[0].replies.length - 1].commentCommentId;
            }
        }

        if(typeof textValue !== 'undefined' && textValue.length > 0){
            let params = {
                forumId: this.props.forumId,
                commentId: this.props.commentId,
                uniqueId: getUniqueId(),
                lastCommentCommentId: lastCommentCommentId,
                comment: textValue.trim()
            }

            this.props.addCommentComment(params)
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
        let commentId = this.props.commentId;

        if(typeof this.props.replies !== 'undefined'){


            let filteredArr = this.props.replies.filter(x => x.commentId === commentId);


            if(filteredArr.length <= 0){

                return rows;
            }



            filteredArr[0].replies.forEach(reply => {

                const cell =
                    <div className="commentContainer replyContainer" key={reply.commentCommentId}>
                        <div className="commentUserImg replyProfile" onClick={() => this.profileClick(reply.user.uniqueId)}><ProfileImage uniqueId={reply.user.uniqueId}/></div>

                        <div className="messageContainer">
                            <div className="commentUserName">
                                <a className="commentUserNameText" onClick={() => this.profileClick(reply.user.uniqueId)}>{reply.user.userId}</a><a>  {reply.comment}</a>
                            </div>


                            {/*<div className="replyButton" onClick={() => this.replyButtonPressed(reply.commentCommentId)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>*/}


                            <div id={reply.commentCommentId} className="replyInputContainer">
                                <div className="commentUserProfileImg"><ProfileImage uniqueId={getUniqueId()}/></div>
                                <div className="commentBoxContainer">
                                    <TextareaAutosize
                                        ref={ reply.commentCommentId}
                                        className="replyInputBox"
                                        rows={1}
                                        onChange={e => this.setState({ textBoxValue: e.target.value })}
                                    />
                                    <div className="commentSendButton" onClick={() => this.sendButtonPressed(reply.commentCommentId)}><a>Send</a></div>
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
        getCommentComment: (params) => dispatch(getCommentComment(params)),
        addCommentComment: (params) => dispatch(addCommentComment(params))
    }
};

let mapStateToProps = (state) => {

    return {
        replies: state.product.replies
    }
};

ProductReply = connect(mapStateToProps, mapDispatchToProps)(ProductReply);

export default withRouter(ProductReply);