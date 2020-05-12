import React, { Component }from 'react';
import "./js/components/Comment.css";
import TextareaAutosize from 'react-autosize-textarea';

const commentArray = [
    {   commentID: 1,
        userID: 1,
        userProfileImage: require('./image/profilePicture.png'),
        userName: "seoYoonJung",
        comment: "았싸 1빠따.",
        reply : [
            {   commentID: "r1",
                userID: 1,
                userProfileImage: require('./image/profilePicture.png'),
                userName: "seoYoonJung",
                comment: "았싸 1빠따.았싸 2빠따. 아노라민 골드 보다는 이게 좋은거 같아요. 어제도 이거 먹고 자고 일어나니 괘찮더라 고요. 얼굴 화색이 좀 달라 졌어요. 꾸준히 먹어"
            },
            {   commentID: "r2",
                userID: 1,
                userProfileImage: require('./image/profilePicture.png'),
                userName: "seoYoonJung",
                comment: "았싸 1빠따."
            },
            {   commentID: "r3",
                userID: 1,
                userProfileImage: require('./image/profilePicture.png'),
                userName: "seoYoonJung",
                comment: "았싸 1빠따."
            }
        ]
    },
    {   commentID: 2,
        userID: 2,
        userProfileImage: require('./image/profilePicture.png'),
        userName: "summerly",
        comment: "았싸 2빠따. 아노라민 골드 보다는 이게 좋은거 같아요. 어제도 이거 먹고 자고 일어나니 괘찮더라 고요. 얼굴 화색이 좀 달라 졌어요. 꾸준히 먹어",
        reply : [
            {   commentID: "r4",
                userID: 1,
                userProfileImage: require('./image/profilePicture.png'),
                userName: "seoYoonJung",
                comment: "았싸 1빠따."
            }
        ]
    },
    {   commentID: 3,
        userID: 3,
        userProfileImage: require('./image/profilePicture.png'),
        userName: "fally",
        comment: "았싸 3빠따. 아노라민 골드 보다는 이게 좋은거 같아요. 어제도 이거 먹고 자고 일어나니 괘찮더라 고요. 얼굴 화색이 좀 달라 졌어요. 꾸준히 먹어",
        reply : []
    },
    {   commentID: 4,
        userID: 4,
        userProfileImage: require('./image/profilePicture.png'),
        userName: "winterly",
        comment: "았싸 4빠따. 아노라민 골드 보다는 이게 좋은거 같아요. 어제도 이거 먹고 자고 일어나니 괘찮더라 고요. 얼굴 화색이 좀 달라 졌어요. 꾸준히 먹어. 아노라민 골드 보다는 이게 좋은거 같아요. 어제도 이거 먹고 자고 일어나니 괘찮더라 고요. 얼굴 화색이 좀 달라 졌어요. 꾸준히 먹어",
        reply : []
    },
    {   commentID: 5,
        userID: 5,
        userProfileImage: require('./image/profilePicture.png'),
        userName: "srpingly",
        comment: "아노라민 골드 보다는 이게 좋은거 같아요. 어제도 이거 먹고 자고 일어나니 괘찮더라 고요. 얼굴 화색이 좀 달라 졌어요. 꾸준히 먹어",
        reply : []
    },
    {   commentID: 6,
        userID: 6,
        userProfileImage: require('./image/profilePicture.png'),
        userName: "ohyeahhhh",
        comment: "아노라민 골드 보다는 이게 좋은거 같아요. 어제도 이거 먹고 자고 일어나니 괘찮더라 고요. 얼굴 화색이 좀 달라 졌어요. 꾸준히 먹어",
        reply : []
    }
]

class CommentList extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.replyButtonPressed = this.replyButtonPressed.bind(this)
        this.sendButtonPressed = this.sendButtonPressed.bind(this)
        this.renderReplys = this.renderReplys.bind(this)
    }

    replyButtonPressed(value) {

        //console.log(value)
        const element = document.getElementById(value)
        element.classList.toggle('replyBoxOpen')
    }

    sendButtonPressed(id) {

        //console.log(id)

        const target = id

        const textValue = this.refs[target].value

        //console.log(textValue)

        this.refs[target].value = ""

        this.replyButtonPressed(id)

    }

    renderReplys(replies) {

        const count = replies.length

        //console.log("reply count is" + count)

        const secondUserProfileImgStyle = {
            width: this.props.secondUserImageSize + "px",
            height: this.props.secondUserImageSize + "px"
        }

        if ((count) > 0) {

            var rows = []
            replies.forEach((i) => {
                const cell =
                    <div className="commentContainer replyContainer">
                        <div className="commentUserImg replyProfile"><img src={i.userProfileImage} style={secondUserProfileImgStyle}/></div>

                        <div className="messageContainer">
                            <div className="commentUserName">
                                <a className="commentUserNameText">{i.userName}</a><a>  {i.comment}</a>
                            </div>


                            <div className="replyButton" onClick={() => this.replyButtonPressed("replyBox" + i.commentID)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>


                            <div id={"replyBox" + i.commentID} className="replyInputContainer">
                                <div className="commentUserProfileImg"><img src={require('./image/chimansong.jpg')}/></div>
                                <div className="commentBoxContainer">
                                    <TextareaAutosize
                                        ref={"replyBox" + i.commentID}
                                        className="replyInputBox"
                                        rows={1}
                                        onChange={(e) => this.setState({ textBoxValue: e.target.value })}
                                    />
                                    <div className="commentSendButton" onClick={() => this.sendButtonPressed("replyBox" + i.commentID)}><a>Send</a></div>
                                </div>
                            </div>
                        </div>

                    </div>
                rows.push(cell)
            })
            return rows;
        } else {
            return ;
        }

    }


    render() {

        const textBoxStyle = {
            borderRadius: '10px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: '#FF0000',
            marginTop: '8px',
            minHeight: '40px',
            width: '100%'
        }

        var rows = []

        const firstUserProfileImgStyle = {
            width: this.props.firstUserImgSize + "px",
            height: this.props.firstUserImgSize + "px"
        }



        commentArray.forEach((i) => {
            const cell =
            <div className="commentContainer">
                <div className="commentUserImg"><img src={i.userProfileImage} style={firstUserProfileImgStyle}/></div>

                <div className="messageContainer">
                    <div className="commentUserName">
                        <a className="commentUserNameText">{i.userName}</a><a>  {i.comment}</a>
                    </div>


                    <div className="replyButton" onClick={() => this.replyButtonPressed("commentBox" + i.commentID)}><img src={require("./image/homeSocialComment.png")}/><a className="replyButtonText">reply</a></div>


                    <div id={"commentBox" + i.commentID} className="replyInputContainer">
                        <div className="commentUserProfileImg"><img src={require('./image/chimansong.jpg')}/></div>
                        <div className="commentBoxContainer">
                            <TextareaAutosize
                                ref={"commentBox" + i.commentID}
                                className="replyInputBox"
                                rows={1}
                                onChange={(e) => this.setState({ textBoxValue: e.target.value })}
                            />
                            <div className="commentSendButton" onClick={() => this.sendButtonPressed("commentBox" + i.commentID)}><a>Send</a></div>
                        </div>
                    </div>

                    {this.renderReplys(i.reply)}
                </div>

            </div>

            rows.push(cell)
        })

        return rows;
    }
}

export default CommentList;