import React, { Component }from 'react';
import "./js/components/Comment.css";
import TextareaAutosize from 'react-autosize-textarea';
import { withRouter} from "react-router-dom";
import {getUniqueId, RestApi} from "./util/Constants";
import FeedReply from "./FeedReply";
import { sendReply, getComments} from "./actions/feed";
import {connect} from "react-redux";
import ProfileImage from "./ProfileImage";

class FeedCommentList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comments:[],
            loadReplies: true,
            replies:[]
        }

        this.getComments()
    }

    componentDidMount() {
        // window.onpopstate = (e) => {
        //     alert('POP!!')
        // }
    }

    getComments = () => {


        let params = {
            uniqueId: getUniqueId(),
            feedId: this.props.feedId,
            skip: 0
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

    sendButtonPressed = (commentFeedId) => {



        const target = commentFeedId;

        const textValue = this.refs[target].value;



        this.refs[target].value = ""

        this.replyButtonPressed(commentFeedId)

        let lastCommentCommentFeedId = null;

        if(this.props.replies.length > 0){

            let filteredArr = this.props.replies.filter(x => x.commentFeedId === commentFeedId)

            if(filteredArr.length > 0){
                if ( filteredArr[0].replies.length > 0){
                    lastCommentCommentFeedId = filteredArr[0].replies[filteredArr[0].replies.length - 1].commentCommentFeedId;

                }
            }

        }



        if(typeof textValue !== 'undefined' && textValue.length > 0){



            let params = {
                feedId: this.props.feedId,
                commentFeedId: commentFeedId,
                uniqueId: getUniqueId(),
                lastCommentCommentFeedId: lastCommentCommentFeedId,
                comment: textValue.trim()
            }

            this.props.sendReply(params)


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

    render() {


        let rows = [];

        const firstUserProfileImgStyle = {
            width: this.props.firstUserImgSize + "px",
            height: this.props.firstUserImgSize + "px"
        }

        //<img  src={RestApi.profile +  + '.png'} style={firstUserProfileImgStyle}/>

        if(typeof this.props.comments !== 'undefined'){
            let comments = this.props.comments;

            comments.forEach((comment) => {
                const cell =
                    <div className="commentContainer" key={comment.commentFeedId}>
                        <div className="commentUserImg" onClick={ () => this.profileClick(comment.user.uniqueId)}><ProfileImage uniqueId={comment.user.uniqueId}/></div>

                        <div className="messageContainer">
                            <div className="commentUserName">
                                <a className="commentUserNameText" onClick={() => this.profileClick(comment.user.uniqueId)}>{comment.user.userId}</a><a> {comment.comment}</a>
                            </div>


                            <div className="replyButton" onClick={() => this.replyButtonPressed(comment.commentFeedId)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>


                            <div id={comment.commentFeedId} className="replyInputContainer">
                                <div className="commentUserProfileImg"><img src={RestApi.profile + getUniqueId() + '.png'}/></div>
                                <div className="commentBoxContainer">
                                    <TextareaAutosize
                                        ref={comment.commentFeedId}
                                        className="replyInputBox"
                                        rows={1}
                                        onChange={e => this.setState({ textBoxValue: e.target.value })}
                                    />
                                    <div className="commentSendButton" onClick={() => this.sendButtonPressed(comment.commentFeedId)}><a>Send</a></div>
                                </div>
                            </div>
                            <FeedReply key={comment.commentFeedId} id={"FeedReply" + comment.commentFeedId} commentFeedId={comment.commentFeedId} feedId={this.props.feedId} />


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
        sendReply: (params) => dispatch(sendReply(params)),

        getComments: (params) => dispatch(getComments(params))
    }
}

let mapStateToProps = (state) => {

    let newArray = [];

    if(typeof state.stella.replies !== 'undefined'){

        state.stella.replies.forEach(elem => {

            newArray.push(elem)
        })
    }


    return {
        replies: newArray,
        comments: state.feed.comments

    }
}

FeedCommentList = connect(mapStateToProps, mapDispatchToProps)(FeedCommentList);

export default withRouter(FeedCommentList);