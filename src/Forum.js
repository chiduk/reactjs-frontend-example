import React, { Component } from "react";
import "./js/components/Forum.css";
import HashTagSearchAndAddView from "./HashTagSearchAndAddView";
import ForumRight from "./ForumRight.js";
import { withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {
    getHashTags,
    saveHashTag,
    deleteHashTag,
    setViewMode,
    getRecent,
    getByLike,
    getByComment,
    getByRead,
    setFilterHashTag,
    getSuggestedHashTags
} from "./actions/forum";
import {getUniqueId} from "./util/Constants";
import LogInPage from "./LogInPage";
import {setCount} from "./actions/notification";
import {setCartItemCount} from "./actions/cart";
import ProfileImage from "./ProfileImage";

class Forum extends Component {
    constructor(props) {
        super(props)
        this.toggleViewMode = this.toggleViewMode.bind(this)
        this.deleteTag = this.deleteTag.bind(this)
        this.addTagView = this.addTagView.bind(this)
        this.addHashTag = this.addHashTag.bind(this)
        this.forYouTagPressed = this.forYouTagPressed.bind(this)
        this.reloadView = this.reloadView.bind(this)
        this.tagClicked = this.tagClicked.bind(this)
        this.viewTagClicked = this.viewTagClicked.bind(this)
        this.state = {
            isForumLeftViewOn: false,
            isAllViewOn : true,
            isOneTagViewOn: false,
            isViewTagListViewOn: false,
            viewingOneTag: "",
            addedTags: [
                {tagID: 1, tag: "#졸업", count: 100},
                {tagID: 2, tag: "#취업", count: 100},
                {tagID: 3, tag: "#헤어스타일", count: 100},
                {tagID: 4, tag: "#다이어트", count: 100},
                {tagID: 5, tag: "#옷", count: 100},
                {tagID: 6, tag: "#테스트", count: 100},
                {tagID: 7, tag: "#연예인", count: 100},
                {tagID: 8, tag: "#뭘할까?", count: 100},
                {tagID: 9, tag: "#뭘살까?", count: 100}
            ],
            isAddTagViewOn: false,
            addTagView: null,

            forYouTags: [
                {tagId: 1, tag:"#육아", count: 1},
                {tagId: 2, tag:"#엄마", count: 130},
                {tagId: 3, tag:"#생일선물", count: 10},
                {tagId: 4, tag:"#운동", count: 20},
                {tagId: 5, tag:"#요가팬츠", count: 10},
                {tagId: 6, tag:"#피부미용", count: 220},
            ],
        };

        this.props.getHashTags();
        this.props.getSuggestedHashTags()

        this.props.setNotificationCount();
        this.props.setCartItemCount();
    }


    componentWillMount() {
        document.addEventListener('mousedown', this.handleOutsideClick)
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleOutsideClick)
    }

    handleOutsideClick = (e) =>{

        if (!this.forum.contains(e.target) && !this.forumButton.contains(e.target)) {
            this.closeViewOptionButton()
        }

    }

    closeViewOptionButton = () => {
        this.setState({
            isForumLeftViewOn: false
        })
    }


    tagClicked(tag) {

        this.setState({viewingOneTag: tag}, () => {
            this.props.setFilterHashTag(tag)
            this.toggleViewMode('viewOneTagID')
        })

    }

    toggleViewMode(viewModeID) {

        let params = {
            filterHashTag: false,
            uniqueId: getUniqueId()
        }

        if (viewModeID === 'viewAllID') {
            this.setState({isAllViewOn: true, isOneTagViewOn: false, isViewTagListViewOn: false});
            this.setState({viewingOneTag: ""});
            this.props.setViewMode('ALL');

        } else if (viewModeID === 'viewOneTagID') {
            if(getUniqueId() === undefined || getUniqueId() === null){
                if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                    const element = document.getElementById('logInPage');

                    element.classList.toggle('searchViewClose')
                }
                return
            }


            this.setState({isAllViewOn: false, isOneTagViewOn: true, isViewTagListViewOn: false});
            params.filterHashTag = true;
            params.hashTag = this.state.viewingOneTag;
            this.props.setViewMode('ONE_TAG')

        }   else if (viewModeID === 'viewOnlyTagID') {

            if(getUniqueId() === undefined || getUniqueId() === null){
                if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                    const element = document.getElementById('logInPage');

                    element.classList.toggle('searchViewClose')
                }
                return
            }else{
                this.setState({isAllViewOn: false, isOneTagViewOn: false, isViewTagListViewOn: true});
                this.setState({viewingOneTag: ""});
                params.filterHashTag = true;

                this.props.setViewMode('MY_TAGS');

            }

        }

        if(this.props.forumMode === 'RECENT'){
            this.props.getRecent(params)
        }else if(this.props.forumMode === 'BY_LIKE'){
            this.props.getByLike(params)
        }else if(this.props.forumMode === 'BY_COMMENT'){
            this.props.getByComment(params)
        }else if(this.props.forumMode === 'BY_READ'){
            this.props.getByRead(params)
        }

    }

    deleteTag(tag) {

        this.props.deleteHashTag(tag, this.props.forumMode)

    }

    addTagView() {

        if (this.state.isAddTagViewOn) {
            this.setState({addTagView: null})
        } else (
            this.setState({addTagView: <HashTagSearchAndAddView closeSearchView={this.addTagView} addHashTag={(tag) => this.addHashTag(tag)}/>})
        )
        this.setState({isAddTagViewOn: !this.state.isAddTagViewOn})
    }

    addHashTag(tag) {

        this.props.saveHashTag(tag.hashTag, this.props.forumMode)

    }

    forYouTagPressed(tag) {

        this.addHashTag(tag)
    }

    reloadView() {



    }

    viewTagClicked() {

        this.setState({
            isViewSelectedClicked: !this.state.isViewSelectedClicked
        })

    }

    toggleLoginPage = () => {

        const element = document.getElementById('forumLogInPage');

        element.classList.toggle('searchViewClose')
    }

    render() {
        return (
            <div className={"forumBody"}>
                <div ref={forum => this.forum = forum} className={"forumTagToggleButton"} onClick={this.toggleTagViewManager}>관심 테그<img className={`${this.state.isForumLeftViewOn ? "rotateForumTagButton" : ""}`} src={require("./image/triangleRed.png")}/></div>
                <div ref={forum => this.forumButton = forum} className={`forumLeft ${this.state.isForumLeftViewOn ? "growforumLeft" : ""}`}>
                    <div id={"viewAllID"} className={`tagElement ${this.state.isAllViewOn ? 'viewAll' : 'viewAllClicked'}` } onClick={() => this.toggleViewMode("viewAllID")}><a>전체 태그 보기</a></div>
                    <div id={"viewOneTagID"}  className={`tagElement  ${this.state.isOneTagViewOn ? 'viewOnlyTagClicked' : 'viewOneTag'}`}  onClick={() => this.toggleViewMode("viewOneTagID")}>
                        <a>태그 하나만 보기</a>
                        <div><a>#{this.state.viewingOneTag}</a></div>
                    </div>
                    <div id={"viewOnlyTagID"}  className={`tagElement ${this.state.isViewTagListViewOn ? 'viewOnlyTagClicked' : 'viewOnlyTags'}`}  onClick={() => this.toggleViewMode("viewOnlyTagID")}><a>관심 태그만 보기</a></div>

                    <div className={` ${this.state.isViewTagListViewOn ? 'viewTagContents':'tagContainer'}`} id={"tagContainerID"}>
                        {this.props.hashTags.map((i, index) => {

                            return (
                                <div key={index} className={"addedTag"}>
                                    <div className={"tagText"}><a>#{i}</a></div>
                                    <div className={"tagCloseButton"} onClick={() => this.deleteTag(i)}><img src={require('./image/plusButton.png')} /></div>
                                </div>
                            );

                        })}

                        <div className={"addedTag addTagViewButton"} onClick={this.addTagView}>
                            <div className={"tagPlusButton"}><img src={require('./image/plusButton.png')}/></div>
                            <div className={"tagText tagAddText"}><a>관심 태그 추가</a></div>
                        </div>


                        <div className={"addedTag forYouTagText"}>
                            <a>for you</a>
                        </div>

                        {this.props.suggestedHashTags.map((i, index) => {
                            let posting;
                            if (i.count > 1) {
                                posting = <div><a>{i.count} postings</a></div>
                            } else {
                                posting = <div><a>{i.count} posting</a></div>
                            }

                            return (

                                <div key={index} className={"addedTag"}>
                                    <div className={"tagInfoWrap"}>
                                        <div><a>#{i.hashTag}</a></div>
                                        {posting}
                                    </div>

                                    <div className={"tagPlusButton"} onClick={() => this.forYouTagPressed(i)}>
                                        <img src={require('./image/plusButton.png')}/>
                                    </div>
                                </div>

                            );
                        })}
                    </div>
                </div>


                <div className={"forumRight"}>
                    <ForumRight tagClicked={(tag) => this.tagClicked(tag)} addHashTagClicked={(tag) => this.addHashTag(tag)}/>
                </div>
                {this.state.addTagView}
                <div id="forumLogInPage" className="searchViewBackGround" >
                    <div className="searchBarWrapper">
                        <div className="searchCloseButton" ><a onClick={() => this.toggleLoginPage()}>close X</a></div>
                    </div>

                    <LogInPage  toggleLogInView={() => this.toggleLoginPage()} redirectUrl={'/forum'} />
                </div>
            </div>
        );
    }


}

let mapStateToProps = (state) => {
    return {
        hashTags: state.forum.hashTags,
        forumMode: state.forum.forumMode,
        suggestedHashTags: state.forum.suggestedHashTags
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setFilterHashTag: (hashTag) => dispatch(setFilterHashTag(hashTag)),
        getRecent: (params) => dispatch(getRecent(params)),
        getByLike: (params) => dispatch(getByLike(params)),
        getByComment: (params) => dispatch(getByComment(params)),
        getByRead: (params) => dispatch(getByRead(params)),
        getHashTags: () => dispatch(getHashTags()),
        saveHashTag: (hashTag, forumMode) => dispatch(saveHashTag(hashTag, forumMode)),
        deleteHashTag: (hashTag, forumMode) => dispatch(deleteHashTag(hashTag, forumMode)),
        setViewMode: (viewMode) => dispatch(setViewMode(viewMode)),
        getSuggestedHashTags: () => dispatch(getSuggestedHashTags()),
        setNotificationCount: () => dispatch(setCount()),
        setCartItemCount: () => dispatch(setCartItemCount())
    }
}

Forum = connect(mapStateToProps, mapDispatchToProps)(Forum);

export default withRouter(Forum);