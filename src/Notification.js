import React, { Component } from "react";
import "./js/components/Alarm.css";

import {connect} from "react-redux";
import {withRouter} from "react-router";
import {getUniqueId, RestApi, NOTIFICATION_TYPE} from "./util/Constants";
import TextareaAutosize from 'react-autosize-textarea';
import {sendReply} from "./actions/feed";
import {addCommentComment} from './actions/product'
import ProfileImage from "./ProfileImage";
import FeedReply from "./FeedReply";
import ProductReply from "./ProductReply";
import {addMatchRequestComment} from "./actions/manager";
import MatchRequestReply from "./MatchRequestReply";

class Notification extends Component{
    constructor(props) {
        super(props);


        this.replyMessageEdit = this.replyMessageEdit.bind(this)

        this.toggleSentMessageBox = this.toggleSentMessageBox.bind(this)
        this.replyButtonPressed = this.replyButtonPressed.bind(this)
        this.state = {
            feedReplyMessage : '',
            productReplyMessage: '',
            matchRequestReplyMessage: '',
            isReplyBoxOn: false,
        }
        this.checkForReplyMessage = this.checkForReplyMessage.bind(this)

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

    toggleProductReplyBox() {
        console.log('toggle produc reply box')
        const box = document.getElementById(this.props.notification.productComment.commentId)
        box.classList.toggle("replyBoxGrow")
        console.log(box.classList)
        //this.setState({isReplyBoxOn: !this.state.isReplyBoxOn})
    }

    toggleFeedReplyBox = () => {
        const box = document.getElementById(this.props.notification.feedComment.commentId)
        box.classList.toggle("replyBoxGrow")
        this.setState({isReplyBoxOn: !this.state.isReplyBoxOn})
    }

    toggleSentMessageBox() {
        const sentReplayMessageBox = document.getElementById('sentMessageID'+this.props.index)
        sentReplayMessageBox.classList.toggle('sendMessagePressed')
    }

    replyButtonPressed(id) {

        const element = document.getElementById(id);
        element.classList.toggle('replyBoxOpen')

        console.log(element.classList)
    }

    productCommentSendPressed() {


        this.refs[this.props.notification.productComment.commentId].value = '';

        this.replyButtonPressed(this.props.notification.productComment.commentId)



        if (this.state.productReplyMessage.trim() === "") {

        } else  {
            let lastCommentCommentId = null;

            let filteredArr = this.props.productReplies.filter( x => x.commentId === this.props.notification.productComment.commentId);

            if(filteredArr.length > 0){
                if(filteredArr[0].replies.length > 0){
                    lastCommentCommentId = filteredArr[0].replies[filteredArr[0].replies.length - 1].commentCommentId;
                }
            }

           let params = {
               productId: this.props.notification.productId,
               feedId: this.props.notification.feedId,
               uniqueId: getUniqueId(),
               lastCommentCommentId: lastCommentCommentId,
               commentId: this.props.notification.productComment.commentId,
               comment: this.state.productReplyMessage.trim()
           }

            this.props.addProductCommentComment(params);

            this.setState({productReplyMessage: ''})
        }

    }

    feedCommentSendPressed = () => {


        this.refs['feed'+this.props.notification.feedComment.commentId].value = ''
        this.replyButtonPressed(this.props.notification.feedComment.commentId)

        if (this.state.feedReplyMessage.trim() === "") {


        } else  {


            let lastCommentCommentId = null;

            let filteredArr = this.props.feedReplies.filter(x => x.commentFeedId === this.props.notification.feedComment.commentId)

            if(filteredArr.length > 0){
                if(filteredArr[0].replies.length > 0){
                    lastCommentCommentId = filteredArr[0].replies[filteredArr[0].replies.length - 1].commentCommentFeedId;
                }


            }



            let params = {
                feedId: this.props.notification.feedId,
                commentFeedId: this.props.notification.feedComment.commentId,
                uniqueId: getUniqueId(),
                lastCommentCommentFeedId: lastCommentCommentId,
                comment: this.state.feedReplyMessage.trim()
            }

            this.props.addFeedCommentComment(params);

            this.setState({feedReplyMessage: ''})

        }
    };

    matchRequestCommentPressed = () => {

        this.refs[this.props.notification.threadId].value = '';
        this.replyButtonPressed(this.props.notification.threadId);

        if(this.state.matchRequestReplyMessage.trim() === ''){

        }else{

            let lastCommentId = null;

            let filteredArr = this.props.matchRequestReplies.filter(x => x.threadId === this.props.notification.threadId)

            if(filteredArr.length > 0){
                if(filteredArr[0].replies.length > 0){
                    lastCommentId = filteredArr[0].replies[filteredArr[0].replies.length - 1].commentId;
                }


            }


            let params = {
                reviewerId: getUniqueId(),
                threadId: this.props.notification.threadId,
                matchRequestId: this.props.notification.matchRequestId,
                notificationId: this.props.notification.notificationId,
                comment: this.state.matchRequestReplyMessage.trim(),
                lastCommentId : lastCommentId

            };

            this.props.addMatchRequestComment(params)
        }
    }

    checkForReplyMessage() {

        if (this.props.notification.reply !== "" ) {
            this.toggleSentMessageBox()
        }

    }

    componentDidMount() {

        // this.checkForReplyMessage()

    }

    feedImageClick = () => {


        let path = '/InfluencerFeedDetail'



        this.props.history.push({
            pathname: path,
            search: '?fid=' + this.props.notification.feedId,
            state: {
                //productId: this.props.notification.product.productId
                feedId: this.props.notification.feedId
            }
        })

    }

    productImageClick = () => {



        if(this.props.notification.notificationType === NOTIFICATION_TYPE.MATCH_REQUEST_SENT){
            localStorage.setItem('forwardProductId', this.props.notification.product.productId)

            window.open('/product')

        }else if(this.props.notification.notificationType === NOTIFICATION_TYPE.MATCH_REQUEST){
            localStorage.setItem('forwardProductId', this.props.notification.product.productId)

            window.open('/product')

        }else if(this.props.notification.notificationType === NOTIFICATION_TYPE.MATCH_REQUEST_CONFIRM){
            localStorage.setItem('forwardProductId', this.props.notification.product.productId)

            window.open('/product')
        }else if(this.props.notification.notificationType === NOTIFICATION_TYPE.MATCH_REQUEST_CANCEL){

            if(Object.keys(this.props.notification.requester).length === 0){
                this.props.history.push({
                    pathname: '/manager',
                    state: {
                        page: 'matchRequest'
                    }
                })
            }else{
                this.props.history.push({
                    pathname: '/manager',
                    state: {
                        page: 'matchRequestConfirm'
                    }
                })
            }


        }else{
            let path = '/ProductDetailView';

            this.props.history.push({
                pathname: path,
                state: {
                    productId: this.props.notification.productId,
                    feedId: this.props.notification.feedId
                }
            })

        }

    }

    profileClick = (uniqueId) => {
        console.log(uniqueId)

        this.props.history.push({
            pathname: '/UserProfile',
            search: '?uid=' + uniqueId,
            state: {

                uniqueId: uniqueId
            }
        })
    }




    renderFeedNotification = () => {


        return(
            <div className={"messageWrapper"}>
                <div className={"profileImage"} onClick={() => this.profileClick(this.props.notification.reviewer.uniqueId)}><ProfileImage uniqueId={this.props.notification.reviewer.uniqueId}/></div>

                <div className={"messageContentImage smallScreenProductImg"} onClick={() => this.feedImageClick()}>
                    <img src={(this.props.notification.feedImages.length > 0) ? RestApi.feedImage + this.props.notification.feedImages[0] : 'placeholder'}/>
                </div>

                <div className={"messageText"}>
                    <div className={"messageContainer"}>
                        <a className={"userName"} onClick={() => this.profileClick(this.props.notification.reviewer.uniqueId)} >{this.props.notification.reviewer.userId}</a>
                        <a id={'comment' + this.props.notification.feedComment.commentId} >{this.props.notification.feedComment.comment}</a>

                    </div>

                    <div className="replyButton" onClick={() => this.replyButtonPressed(this.props.notification.feedComment.commentId)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>


                    <div id={this.props.notification.feedComment.commentId} className="replyInputContainer">
                        <div className="commentUserProfileImg"><ProfileImage uniqueId={getUniqueId()}/></div>
                        <div className="commentBoxContainer">
                            <TextareaAutosize
                                ref={'feed'+this.props.notification.feedComment.commentId}
                                className="replyInputBox"
                                rows={1}
                                onChange={e => this.setState({ feedReplyMessage: e.target.value })}
                            />
                            <div className="commentSendButton" onClick={() => this.feedCommentSendPressed(this.props.notification.feedComment.commentId)}><a>Send</a></div>
                        </div>
                    </div>

                    <FeedReply key={this.props.notification.feedComment.commentId} id={"FeedReply" + this.props.notification.feedComment.commentId} commentFeedId={this.props.notification.feedComment.commentId} feedId={this.props.notification.feedId} />




                </div>

                <div className={"messageContentImage"} onClick={() => this.feedImageClick()}>
                    <img src={(this.props.notification.feedImages.length > 0) ? RestApi.feedImage + this.props.notification.feedImages[0] : 'placeholder'}/>
                </div>
            </div>
        )
    };

    renderProductNotification = () => {
        return(
            <div className={"messageWrapper"}>
                <div className={"profileImage"} onClick={() => this.profileClick(this.props.notification.reviewer.uniqueId)}><ProfileImage uniqueId={this.props.notification.reviewer.uniqueId}/></div>

                <div className={"messageContentImage smallScreenProductImg"} onClick={() => this.productImageClick()}>
                    <img src={(this.props.notification.productImages.length > 0) ? RestApi.prod + this.props.notification.productImages[0] : 'placeholder'}/>
                </div>

                <div className={"messageText"}>
                    <div className={"messageContainer"}>
                        <a className={"userName"} onClick={() => this.profileClick(this.props.notification.reviewer.uniqueId)} >{this.props.notification.reviewer.userId}</a>
                        <a id={'comment' + this.props.notification.productComment.commentId} >{this.props.notification.productComment.comment}</a>

                    </div>

                    <div className="replyButton" onClick={() => this.replyButtonPressed(this.props.notification.productComment.commentId)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>


                    <div id={this.props.notification.productComment.commentId} className="replyInputContainer">
                        <div className="commentUserProfileImg"><ProfileImage uniqueId={getUniqueId()}/></div>
                        <div className="commentBoxContainer">
                            <TextareaAutosize
                                ref={this.props.notification.productComment.commentId}
                                className="replyInputBox"
                                rows={1}
                                onChange={e => this.setState({ productReplyMessage: e.target.value })}
                            />
                            <div className="commentSendButton" onClick={() => this.productCommentSendPressed(this.props.notification.productComment.commentId)}><a>Send</a></div>
                        </div>
                    </div>

                    <ProductReply key={this.props.notification.productComment.commentId} id={"ProductReply" + this.props.notification.productComment.commentId} commentId={this.props.notification.productComment.commentId} feedId={this.props.notification.productId} />




                </div>

                <div className={"messageContentImage"} onClick={() => this.productImageClick()}>
                    <img src={(this.props.notification.productImages.length > 0) ? RestApi.prod + this.props.notification.productImages[0] : 'placeholder'}/>
                </div>
            </div>

        )
    };

    renderMatchRequest = () => {
        return (
            <div className={"messageWrapper"}>
                {this.renderRequesterProfileImage()}
                <div className={"messageText"}>
                    <div className={"messageContainer"}>

                        {this.renderMatchRequestMessage()}
                    </div>

                    <div className="replyButton" onClick={() => this.replyButtonPressed(this.props.notification.threadId)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>


                    <div id={this.props.notification.threadId} className="replyInputContainer">
                        <div className="commentUserProfileImg" onClick={() => this.renderRequesterProfileImage(getUniqueId()) }><ProfileImage uniqueId={getUniqueId()}/></div>
                        <div className="commentBoxContainer">
                            <TextareaAutosize
                                ref={this.props.notification.threadId}
                                className="replyInputBox"
                                rows={1}
                                onChange={e => this.setState({ matchRequestReplyMessage: e.target.value })}
                            />
                            <div className="commentSendButton" onClick={() => this.matchRequestCommentPressed(this.props.notification.threadId)}><a>Send</a></div>
                        </div>
                    </div>



                    <MatchRequestReply matchRequestId={this.props.matchRequestId} threadId={this.props.notification.threadId} notificationId={this.props.notification.notificationId}/>




                </div>

                <div className={"messageContentImage"} onClick={() => this.productImageClick()}>
                    <img src={(this.props.notification.product.images.length > 0) ? RestApi.prod + this.props.notification.product.images[0] : 'placeholder'}/>
                </div>
            </div>
        )
    };

    renderMatchRequestSent = () => {
        return (
            <div className={"messageWrapper"}>
                <div className={"profileImage"} onClick={() => this.profileClick(getUniqueId()) }><ProfileImage uniqueId={getUniqueId()}/></div>



                <div className={"messageText"}>
                    <div className={"messageContainer"}>
                        {this.renderMatchRequestMessage()}
                    </div>

                    <div className="replyButton" onClick={() => this.replyButtonPressed(this.props.notification.threadId)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>


                    <div id={this.props.notification.threadId} className="replyInputContainer">
                        <div className="commentUserProfileImg"><ProfileImage uniqueId={getUniqueId()}/></div>
                        <div className="commentBoxContainer">
                            <TextareaAutosize
                                ref={this.props.notification.threadId}
                                className="replyInputBox"
                                rows={1}
                                onChange={e => this.setState({ matchRequestReplyMessage: e.target.value })}
                            />
                            <div className="commentSendButton" onClick={() => this.matchRequestCommentPressed(this.props.notification.threadId)}><a>Send</a></div>
                        </div>
                    </div>

                    {/*<ProductReply key={this.props.notification.productComment.commentId} id={"ProductReply" + this.props.notification.productComment.commentId} commentId={this.props.notification.productComment.commentId} feedId={this.props.notification.productId} />*/}
                    <MatchRequestReply matchRequestId={this.props.matchRequestId} threadId={this.props.notification.threadId} notificationId={this.props.notification.notificationId}/>



                </div>

                <div className={"messageContentImage"} onClick={() => this.productImageClick()}>
                    <img src={(this.props.notification.product.images.length > 0) ? RestApi.prod + this.props.notification.product.images[0] : 'placeholder'}/>
                </div>
            </div>
        )
    }

    renderMatchRequestMessage = () => {
        let message = ''

        if( this.props.notification.notificationType === NOTIFICATION_TYPE.MATCH_REQUEST) {
            message = <p><a className={"userName"} onClick={() => this.profileClick(this.props.notification.requester.uniqueId)} >{this.props.notification.requester.userId}</a> 님이 <strong>{this.props.notification.product.title}</strong> 매칭 요청을 보냈습니다.</p>
        }else if(this.props.notification.notificationType === NOTIFICATION_TYPE.MATCH_REQUEST_SENT){
            message = <p><strong>{this.props.notification.product.title}</strong> 상품 매칭 요청을 보냈습니다.</p>
        }else if (this.props.notification.notificationType === NOTIFICATION_TYPE.MATCH_REQUEST_CONFIRM){

            if(Object.keys(this.props.notification.requester).length === 0){
                message = <p><strong>{this.props.notification.product.title}</strong> 상품이 매칭 되었습니다.</p>
            }else{
                message = <p><strong onClick={() => this.profileClick(this.props.notification.requester.uniqueId)}>{this.props.notification.requester.userId}</strong>님이 요청한 <strong>{this.props.notification.product.title}</strong> 상품이 매칭 되었습니다.</p>
            }


        }else if (this.props.notification.notificationType === NOTIFICATION_TYPE.MATCH_REQUEST_CANCEL){

            if(Object.keys(this.props.notification.requester).length === 0){
                message = <p><strong>{this.props.notification.product.title}</strong> 상품매칭이 취소 되었습니다.</p>
            }else{
                message = <p><strong onClick={() => this.profileClick(this.props.notification.requester.uniqueId)}>{this.props.notification.requester.userId}</strong>님이 요청한 <strong>{this.props.notification.product.title}</strong> 상품매칭이 취소 되었습니다.</p>
            }


        }

        return message;
    };

    renderRequesterProfileImage = () => {
        let profileIamge = '';

        if(Object.keys(this.props.notification.requester).length === 0){
            profileIamge = <div className={"profileImage"} onClick={() => this.profileClick(getUniqueId())}><ProfileImage uniqueId={getUniqueId()}/></div>

        }else{
            profileIamge = <div className={"profileImage"} onClick={() => this.profileClick(this.props.notification.requester.uniqueId)}><ProfileImage uniqueId={this.props.notification.requester.uniqueId}/></div>

        }

        return profileIamge
    }

    render() {



        let notification;

        if(this.props.notification.notificationType === NOTIFICATION_TYPE.FEED_COMMENT){
            notification = this.renderFeedNotification()
        }else if(this.props.notification.notificationType === NOTIFICATION_TYPE.PRODUCT_COMMENT) {
            notification = this.renderProductNotification()
        }else if( this.props.notification.notificationType === NOTIFICATION_TYPE.MATCH_REQUEST) {
            notification = this.renderMatchRequest()
        }else if(this.props.notification.notificationType === NOTIFICATION_TYPE.MATCH_REQUEST_SENT){
            notification = this.renderMatchRequestSent()
        }else if( this.props.notification.notificationType === NOTIFICATION_TYPE.MATCH_REQUEST_CONFIRM) {
            notification = this.renderMatchRequest()
        }else if(this.props.notification.notificationType === NOTIFICATION_TYPE.MATCH_REQUEST_CANCEL){
            notification = this.renderMatchRequest()
        }



        return (

            <div>
                {notification}
            </div>



        );
    }
}


let mapStateToProps = (state) => {

   // console.log(state.notification.notifications)

    return{
        feedReplies: state.stella.replies,
        productReplies: state.product.replies,
        notifications: state.notification.notifications,
        matchRequestReplies: state.manager.matchRequestReplies

    }
};

let mapDispatchToProps = (dispatch) => {
    return{
        addFeedCommentComment: (params) => dispatch(sendReply(params)),
        addProductCommentComment: (params) => dispatch(addCommentComment(params)),
        addMatchRequestComment: (params) => dispatch(addMatchRequestComment(params))
    }
};

Notification = connect(mapStateToProps, mapDispatchToProps)(Notification);

export default withRouter(Notification)
