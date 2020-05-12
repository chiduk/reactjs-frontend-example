import React, { Component } from "react";
import "./js/components/Forum.css";
import TextareaAutosize from 'react-autosize-textarea';
import HashTagSearchAndAddView from "./HashTagSearchAndAddView.js";
import ForumPostDetailView from "./ForumPostDetailView.js";

import AlertMessage from "./AlertMessage";
import {withRouter} from "react-router";
import {getUniqueId, RestApi} from "./util/Constants";
import {connect} from 'react-redux'
import {getRecent, getByLike, getByComment, getByRead, read, add, edit, like, unlike, isLiked, commentAdd, commentEdit, commentDelete, commentCommentAdd, commentCommentEdit, commentCommentDelete} from "./actions/forum";
import ForumFeed from "./ForumFeed";
import LogInPage from "./LogInPage";
import ProfileImage from "./ProfileImage";



class ForumRight extends Component {
    constructor(props) {
        super(props)
        this.state = {
            titleBox:"",
            textBox: "",
            tagAddView: null,
            postTags: [],
            brickPosition: {left: "0px",
                            position: "relative"
            },
            postList: [],
            viewMoreForumPost: null,
            postAlarmMessage: null
        }

        this.editText = this.editText.bind(this)
        this.addTagView = this.addTagView.bind(this)

        this.recentRef = React.createRef()
        this.likeRef = React.createRef()
        this.commentRef = React.createRef()
        this.readRef = React.createRef()

        this.orderButtonClicked = this.orderButtonClicked.bind(this)

        this.likePressed = this.likePressed.bind(this)
        this.likeCountPressed = this.likeCountPressed.bind(this)
        this.commentPressed = this.commentPressed.bind(this)
        this.writePostPressed = this.writePostPressed.bind(this)
        this.toggleReportBox = this.toggleReportBox.bind(this)
        this.editPost = this.editPost.bind(this)

        this.reportClick = this.reportClick.bind(this)
        this.alertMessageViewToggle = this.alertMessageViewToggle.bind(this)
        this.userPicClicked = this.userPicClicked.bind(this)
        this.tagClicked = this.tagClicked.bind(this)
        this.addTag = this.addTag.bind(this)

        let params = {
            uniqueId: getUniqueId(),
            filterHashTag: false
        }

        this.props.getRecent(params)
    }

    editTitle(e) {

        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }
            return
        }

        let value;
        if (this.state.titleBox.length === 0 ) {
            value =  e.target.value.replace('\n', '')
        } else {
            value = e.target.value.replace('\n\n\n', '\n\n')
        }

        this.setState({titleBox: value})

    }

    editText(e) {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }
            return
        }
        let value;
        if (this.state.textBox.length === 0 ) {
            value =  e.target.value.replace('\n', '')
        } else {
            value = e.target.value.replace('\n\n\n', '\n\n')
        }

        this.setState({textBox: value})

    }

    addTagView() {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }
            return
        }

        if (this.state.tagAddView !== null ) {
            this.setState({tagAddView: null})
        } else (
            this.setState({tagAddView: <HashTagSearchAndAddView closeSearchView={this.addTagView} addHashTag={(tag) => this.addHashTag(tag)}/>})
        )
    }

    addHashTag(tag) {

        let object = Object.assign([], this.state.postTags);

        let index = object.indexOf(tag.hashTag)

        if(index === -1){
            object.push(tag.hashTag);
        }

        this.setState({postTags : object})

    }

    deleteTag(index) {

        const object = Object.assign([], this.state.postTags);
        object.splice(index, 1);
        this.setState({postTags : object});

    }

    orderButtonClicked(event) {

        const line = document.getElementById("lineID")

        const parent = document.getElementById('lineParentID')
        const parentLeft = parent.offsetLeft

        const buttons = document.getElementsByClassName('orderButton')
        for (let i = 0; i < buttons.length; i++) {
            let item = buttons[i]
            if (item.getAttribute('id') === event) {
                this.forumMode = event;
                item.style.fontWeight = "bold"
                item.style.color = "#FF0000"

                let params = {
                    filterHashTag: false,
                    uniqueId: getUniqueId()
                }


                if(this.props.viewMode === 'ALL'){

                }else if(this.props.viewMode === 'ONE_TAG'){
                    params.filterHashTag = true;
                    params.hashTag = this.props.filterHashTag
                }else if(this.props.viewMode === 'MY_TAGS'){
                    params.filterHashTag = true;
                }


                if(this.forumMode === 'byRecent'){
                    this.props.getRecent(params)
                }else if(this.forumMode === 'byComment'){
                    this.props.getByComment(params)
                }else if(this.forumMode === 'byLike'){
                    this.props.getByLike(params)
                }else if(this.forumMode === 'byRead'){
                    this.props.getByRead(params)
                }


            } else {
                item.style.fontWeight = "normal"
                item.style.color = "#282c34"
            }
        }

        const element = document.getElementById(event)
        const left = element.offsetLeft
        const width = element.offsetWidth

        const coordinate = {
            left: left - parentLeft,
            width: width,
        }

        this.setState({brickPosition: coordinate})
    }



    componentDidMount() {
        this.recentRef.current.click()

    }

    likePressed(index) {

        const object = Object.assign([], this.state.postList);
        object[index].isLiked = !object[index].isLiked;

        const element = document.getElementById('socialLike' + index);
        element.style.animation = "";

        this.setState({postList : object}, () => {
            element.style.animation = "bounce 0.3s 1";
        });

    }

    likeCountPressed(feedID) {

    }

    commentPressed(feedID) {

    }

     writePostPressed() {

         if(getUniqueId() === undefined || getUniqueId() === null){
             if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                 const element = document.getElementById('logInPage')

                 element.classList.toggle('searchViewClose')
             }
             return
         }

        let alarmMessage = []
        if (this.state.titleBox === "") {
            alarmMessage.push("제목을 입력해 주세요")
        }

        if (this.state.textBox === "") {
            alarmMessage.push("본문 내용을 입력해 주세요")
        }

        if (this.state.postTags.length === 0) {
            alarmMessage.push("태그를 선택해 주세요")
        }

        if (alarmMessage.length === 0) {
            this.setState({
                titleBox: "",
                textBox: "",
                postTags: []
            })

            let params = {
                uniqueId: getUniqueId(),
                title: this.state.titleBox,
                article: this.state.textBox,
                hashTags: this.state.postTags,
                forumMode: this.forumMode,
                viewMode: this.props.viewMode,
                filterHashTag: this.props.filterHashTag
            }

            this.props.add(params)

        } else {
            this.alertMessageViewToggle(alarmMessage)
        }

    }

    alertMessageViewToggle(e) {

        if (this.state.postAlarmMessage === null) {
            this.setState({postAlarmMessage: <AlertMessage alertTitle={"Oops..."} messages={e} closeAlert={this.alertMessageViewToggle}/>})
        } else {
            this.setState({postAlarmMessage: null})
        }
    }

    viewForumDetail(content, index, isCommentClicked) {
        if (this.state.viewMoreForumPost === null ) {
            this.setState({viewMoreForumPost: <ForumPostDetailView
                                                        feedID={content.postID}
                                                        likePressed={() => this.likePressed(index)}
                                                        isCommentClicked={isCommentClicked}
                                                        closeView={() => this.viewForumDetail(content.postID)}
                                                        content={content}
                                                        index={index}
                                                    />
                                }
                        )
        } else {
            this.setState({viewMoreForumPost: null})
        }
    }

    toggleReportBox(index) {

        const element = document.getElementById("reportBoxID" + index)
        element.classList.toggle('reportHeight')
    }

    reportClick(id, index) {
        this.toggleReportBox(index)
    }

    editPost(postID) {

        //console.log(postID)

    }

    userPicClicked(userID) {

        let path = '/UserProfile'
        this.props.history.push({
            pathname: path,
            search: '?uid=' + userID,
            state: {
                id: userID,
                // title: this.props.feedData.title,
                // profileImage: require('./image/profilePicture.png'),
                // profileUserName: this.props.feedData.userName,
                // message: this.props.feedData.message
            }
        })

    }

    tagClicked(tag) {

        this.props.tagClicked(tag)

    }

    addTag(tag) {

        let fakeDataTag = {tagID: 10, tag: tag, count: 100}
        this.props.addHashTagClicked(fakeDataTag)

    }

    renderForums = () => {
        let rows = [];

        this.props.forums.forEach(forum => {
            let row = <ForumFeed key={forum.forumId} feed={forum} tagClicked={this.tagClicked}/>
            rows.push(row)
        });

        return rows;
    };

    toggleLoginPage = () => {
        const element = document.getElementById('logInPage');

        element.classList.toggle('searchViewClose')
    }

    render() {


        return (
            <div>
                <div className={"postWritingBox"}>
                    <div className={"writerProfile"}><ProfileImage uniqueId={getUniqueId()}/></div>
                    <div className={"textBoxWrapper"}>

                        <div className={"textBox"}>
                            <TextareaAutosize className={"forumTextBoxStyle forumTitleBox"} value={this.state.titleBox} placeholder={"제목"} onChange={(event) => this.editTitle(event)}/>

                            <TextareaAutosize className={"forumTextBoxStyle"} value={this.state.textBox} placeholder={"어떤 이야기를 나누고 싶나요?"} onChange={(event) => this.editText(event)}/>


                            <div className={"writingPostTagContainer"}>
                                {this.state.postTags.map((i, index) => {
                                    return (

                                        <div key={index} className={"postingHashTag"}>
                                            <div className={"postingContentTag"}>
                                                <a>#{i}</a>
                                            </div>
                                            <div className={"postingTagDeleteImg"} onClick={() => this.deleteTag(index)}><img src={require('./image/hashX.png')}/></div>
                                        </div>

                                    );
                                })}
                            </div>

                            <div className={"forumPostTagAdd"} onClick={this.addTagView}>
                                <div className={"forumTagButtonImage"}><img src={require('./image/plusButton.png')}/></div>
                                <div className={"forumTagButtonText"}><a>관심 태그 추가</a></div>
                            </div>

                        </div>


                        <div className={"writeForumPostButton"} onClick={this.writePostPressed}><a>작성 하기</a></div>

                    </div>


                </div>
                {this.state.tagAddView}

                <div className={"reOrderWrapper"}>
                    <div className={"reOrderButton"}>
                        <div className={"orderButton"} ref={this.recentRef} id={"byRecent"} onClick={() => this.orderButtonClicked("byRecent")}><a>최신 순</a></div>
                        <div className={"orderButton"} ref={this.likeRef} id={"byLike"} onClick={() => this.orderButtonClicked("byLike")}><a>좋아요 순</a></div>
                        <div className={"orderButton"} ref={this.commentRef} id={"byComment"} onClick={() => this.orderButtonClicked("byComment")}><a>댓글 순</a></div>
                        <div className={"orderButton"} ref={this.readRef} id={"byRead"} onClick={() => this.orderButtonClicked("byRead")}><a>읽음 순</a></div>
                    </div>

                    <div className={"reOrderBottomLineWrapper"} id={"lineParentID"}>
                        <div className={"bottomRedLine"} id={"lineID"}/>
                        <div className={"lineBrick"} id={"lineBrickID"} style={this.state.brickPosition}/>
                    </div>
                </div>

                <div className={"postingWrapper"}>
                    {this.renderForums()}
                </div>

                {this.state.viewMoreForumPost}
                {this.state.postAlarmMessage}
                <div id="logInPage" className="searchViewBackGround" ref={this.logInRef}>
                    <div className="searchBarWrapper">
                        <div className="searchCloseButton" ><a onClick={() => this.toggleLoginPage()}>close X</a></div>
                    </div>

                    <LogInPage  toggleLogInView={() => this.toggleLoginPage()} />
                </div>
            </div>
        );
    }
}

let mapStateToProps = (state) => {

    return {
        forums: state.forum.forums,
        filterHashTag: state.forum.filterHashTag,
        viewMode: state.forum.viewMode
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        getRecent: (params) => dispatch(getRecent(params)),
        getByLike: (params) => dispatch(getByLike(params)),
        getByComment: (params) => dispatch(getByComment(params)),
        getByRead: (params) => dispatch(getByRead(params)),
        read: () => dispatch(read()),
        add: (params) => dispatch(add(params)),
        edit: () => dispatch(edit()),

        like: () => dispatch(like()),
        unlike: () => dispatch(unlike()),
        isLiked: () => dispatch(isLiked()),
        commentEdit: () => dispatch(commentEdit()),
        commentCommentAdd: () => dispatch(commentCommentAdd()),
        commentCommentEdit: () => dispatch(commentCommentEdit()),
        commentCommentDelete: () => dispatch(commentCommentDelete())
    }

}

ForumRight = connect(mapStateToProps, mapDispatchToProps)(ForumRight)

export default withRouter(ForumRight);