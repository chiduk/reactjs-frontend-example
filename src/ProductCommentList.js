import React, { Component }from 'react';
import "./js/components/Comment.css";
import TextareaAutosize from 'react-autosize-textarea';
import {getUniqueId, RestApi} from "./util/Constants";
import ProductReply from "./ProductReply"
import {connect} from "react-redux";
import {addCommentComment, getComment, getCommentComment} from "./actions/product";
import {withRouter} from "react-router";

class ProductCommentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments:[],
            loadReplies: true,
            replies:[]
        };

        let params = {
            productId: this.props.productId
        }

        this.props.getComment(params)
    }

    componentDidMount() {
        // window.onpopstate = (e) => {
        //     alert('POP!!')
        // }
    }


    replyButtonPressed = (value) => {

        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }

        console.log(value)
        const element = document.getElementById(value)
        element.classList.toggle('replyBoxOpen')
    }

    sendButtonPressed = (commentId) => {

        //console.log(id);

        console.log('comment comment add');

        const target = commentId;

        const textValue = this.refs[target].value;

        console.log(textValue)

        this.refs[target].value = ""

        this.replyButtonPressed(commentId)

        let lastCommentCommentId = null;

        if(this.props.replies.length > 0){

            let filteredArr = this.props.replies.filter(x => x.commentId === commentId)

            if(filteredArr.length > 0){
                if ( filteredArr[0].replies.length > 0){
                    lastCommentCommentId = filteredArr[0].replies[filteredArr[0].replies.length - 1].commentCommentId;

                    console.log('Last Comment Comment Feed Id', lastCommentCommentId);
                }
            }

        }



        if(typeof textValue !== 'undefined' && textValue.length > 0){

            let params = {
                productId: this.props.productId,
                commentId: commentId,
                uniqueId: getUniqueId(),
                lastCommentCommentId: lastCommentCommentId,
                comment: textValue.trim()
            };

            this.props.addCommentComment(params)
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

        if(typeof this.props.comments !== 'undefined'){
            let comments = this.props.comments;



            let index = 0;
            comments.forEach((comment) => {
                const cell =
                    <div className="commentContainer" key={comment.commentId}>
                        <div className="commentUserImg"><img onClick={() => this.profileClick(comment.user.uniqueId)} src={RestApi.profile + comment.user.uniqueId + '.png'} style={firstUserProfileImgStyle}/></div>

                        <div className="messageContainer">
                            <div className="commentUserName">
                                <a className="commentUserNameText" onClick={() => this.profileClick(comment.user.uniqueId)}>{comment.user.userId}</a><a> {comment.comment}</a>
                            </div>


                            <div className="replyButton" onClick={() => this.replyButtonPressed(comment.commentId)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>


                            <div id={comment.commentId} className="replyInputContainer">
                                <div className="commentUserProfileImg"><img src={RestApi.profile + getUniqueId() + '.png'}/></div>
                                <div className="commentBoxContainer">
                                    <TextareaAutosize
                                        ref={comment.commentId}
                                        className="replyInputBox"
                                        rows={1}
                                        onChange={e => this.setState({ textBoxValue: e.target.value })}
                                    />
                                    <div className="commentSendButton" onClick={() => this.sendButtonPressed(comment.commentId)}><a>Send</a></div>
                                </div>
                            </div>
                            <ProductReply key={index} id={"FeedReply" + comment.commentId} commentId={comment.commentId} productId={this.props.productId} />
                        </div>
                    </div>

                rows.push(cell)
                index++
            })
        }

        return rows;
    }
}


let mapDispatchToProps = (dispatch) => {
    return {
        getCommentComment: (params) => dispatch(getCommentComment(params)),
        getComment: (params) => dispatch(getComment(params)),
        addCommentComment: (params) => dispatch(addCommentComment(params))
    }
};

let mapStateToProps = (state) => {

    return {
        replies: state.product.replies,
        comments: state.product.comments
    }
}

ProductCommentList = connect(mapStateToProps, mapDispatchToProps)(ProductCommentList);

export default withRouter(ProductCommentList);