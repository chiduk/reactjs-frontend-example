import React, {Component} from 'react';
import "./js/components/Alarm.css";
import TextareaAutosize from 'react-autosize-textarea';
import { withRouter} from "react-router-dom";
import {getUniqueId, RestApi} from "./util/Constants";
import ProductReply from "./ProductReply";
import {connect} from "react-redux";
import {addCommentComment} from "./actions/product";
import ProfileImage from "./ProfileImage";

class AlarmMessage extends  Component {
    constructor(props) {
        super(props);
        this.toggleReplyBox = this.toggleReplyBox.bind(this)
        this.replyMessageEdit = this.replyMessageEdit.bind(this)
        this.sendPressed = this.sendPressed.bind(this)
        this.toggleSentMessageBox = this.toggleSentMessageBox.bind(this)
        this.replyButtonPressed = this.replyButtonPressed.bind(this)
        this.state = {
            replyMessage : this.props.content.reply,
            isReplyBoxOn: false,
        }
        this.checkForReplyMessage = this.checkForReplyMessage.bind(this)

        this.contentImageClick = this.contentImageClick.bind(this)



    }

    replyMessageEdit(event) {
        console.log(event.target.value)
        let value;
        if (this.state.replyMessage === "" ) {
            value =  event.target.value.replace('\n', '')
        } else {
            value = event.target.value.replace('\n\n\n', '\n\n')
        }
        this.setState({replyMessage: value})
    }

    toggleReplyBox() {
        const box = document.getElementById('replayBoxID'+this.props.index)
        box.classList.toggle("replyBoxGrow")
        this.setState({isReplyBoxOn: !this.state.isReplyBoxOn})
    }

    toggleSentMessageBox() {
        const sentReplayMessageBox = document.getElementById('sentMessageID'+this.props.index)
        sentReplayMessageBox.classList.toggle('sendMessagePressed')
    }

    replyButtonPressed(id) {

        let allElems = document.querySelectorAll('[id^="profileProductReviewReplyBox"]');
        allElems.forEach(elem => {

            console.log(elem.style.visibility)

            if(id !== elem.id){
                console.log(id, elem.id)

                if(elem.style.visibility === 'visible'){
                    elem.classList.toggle('replyBoxOpen');
                    elem.style.visibility = 'hidden'
                }

            }

        });


        let element = document.getElementById(id);
        element.classList.toggle('replyBoxOpen')
        element.style.visibility = 'visible'

    }

    sendPressed() {
        if (this.props.content.reply === "") {
            this.toggleReplyBox()

        } else  {
            this.toggleReplyBox()
            this.toggleSentMessageBox()
        }

    }

    checkForReplyMessage() {

        if (this.props.content.reply !== "" ) {
            this.toggleSentMessageBox()
        }

    }

    componentDidMount() {

       // this.checkForReplyMessage()

    }

    contentImageClick() {

        let path = '/ProductDetailView'



        this.props.history.push({
            pathname: path,
            state: {
                productId: this.props.content.product.productId,
                feedId: this.props.content.feedId
            }
        })

    }

    profileClick() {

    }



    sendButtonPressed = (commentId) => {




        let target = commentId;

        let textValue = this.refs[target].value;



        this.refs[target].value = "";

        this.replyButtonPressed(commentId);

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

    render() {

        console.log(this.props.content.productImage)

        return (



            <div className={"messageWrapper"}>
                <div className={"profileImage"} onClick={this.profileClick}><ProfileImage uniqueId={this.props.content.user.uniqueId}/></div>

                <div className={"messageContentImage smallScreenProductImg"} onClick={this.contentImageClick}>
                    {/*<img src={this.props.content.productImage}/>*/}
                </div>

                <div className={"messageText"}>
                    <div className={"messageContainer"}>
                        <a className={"userName"} onClick={this.profileClick} >{this.props.content.user.userId}</a>
                        <a>{this.props.content.comment}</a>
                    </div>

                    <div className="replyButton" onClick={() => this.replyButtonPressed('profileProductReviewReplyBox' + this.props.content.commentId)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>


                    <div id={'profileProductReviewReplyBox'+this.props.content.commentId} style={{"visibility" : "hidden"}} className="replyInputContainer">
                        <div className="commentUserProfileImg"><ProfileImage uniqueId={getUniqueId()} /></div>
                        <div className="commentBoxContainer">
                            <TextareaAutosize
                                ref={this.props.content.commentId}
                                className="replyInputBox"

                                rows={1}
                                onChange={e => this.setState({ textBoxValue: e.target.value })}
                            />
                            <div className="commentSendButton" onClick={() => this.sendButtonPressed(this.props.content.commentId)}><a>Send</a></div>
                        </div>
                    </div>
                    <ProductReply key={this.props.content.commentId} id={"FeedReply" + this.props.content.commentId} commentId={this.props.content.commentId} productId={this.props.content.product.productId} />




                </div>

                <div className={"messageContentImage"} onClick={this.contentImageClick}>
                    <img src={(this.props.content.images.length > 0) ? RestApi.prod + this.props.content.images[0] : 'placeholder'}/>
                </div>
            </div>





        );
    }
}

let mapStateToProps = (state) => {
    return {
        replies: state.product.replies
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        addCommentComment: (params) => dispatch(addCommentComment(params))
    }
};

AlarmMessage = connect(mapStateToProps, mapDispatchToProps)(AlarmMessage);

export default withRouter(AlarmMessage) ;