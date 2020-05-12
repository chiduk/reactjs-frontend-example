import React, { Component } from "react";
import "./js/components/ForumDetail.css";
import "./js/components/Forum.css";
import TextareaAutosize from 'react-autosize-textarea';
import HashTagSearchAndAddView from "./HashTagSearchAndAddView.js";
import {getUniqueId} from "./util/Constants";
import {connect} from 'react-redux'
import {edit, getByComment, getByLike, getByRead, getRecent} from "./actions/forum";
import ProfileImage from "./ProfileImage";


class ForumEditView extends Component {

    constructor(props){
        super(props);
        this.state = {
            title: this.props.forum.title,
            article: this.props.forum.article,
            hashTags: this.props.forum.hashTags,
            addTagView: null,
            isModified: false
        }
    }

    editTitle = (event) => {
        this.setState({isModified: true, title:event.target.value})
    };

    editText = (event) => {
        this.setState({isModified: true, article: event.target.value})
    };

    deleteTag = (hashTag) => {



        let index = this.state.hashTags.indexOf(hashTag);

        console.log(index, hashTag)

        if( index !== -1){
            this.state.hashTags.splice(index, 1)

            this.setState({isModified: true, hashTags: this.state.hashTags})
        }
    };

    edit = () => {
        if(this.state.isModified){
            let params = {
                forumId: this.props.forum.forumId,
                uniqueId: getUniqueId(),
                title: this.state.title,
                article: this.state.article,
                hashTags: JSON.stringify(this.state.hashTags)
            }

            this.props.edit(params, () => {

                if(this.props.forumMode === 'RECENT'){
                    this.props.getRecent(params)
                }else if(this.props.forumMode === 'BY_LIKE'){
                    this.props.getByLike(params)
                }else if(this.props.forumMode === 'BY_COMMENT'){
                    this.props.getByComment(params)
                }else if(this.props.forumMode === 'BY_READ'){
                    this.props.getByRead(params)
                }

                this.props.closeView()

            })
        }


    };


    addTagView = () => {

        if (this.state.addTagView === null) {
            this.setState({addTagView: <HashTagSearchAndAddView closeSearchView={this.addTagView} addHashTag={(tag) => this.addHashTag(tag)}/>})
        } else {
            this.setState({addTagView: null})
        }

    }

    addHashTag(tag) {


        let index = this.state.hashTags.indexOf(tag.hashTag);

        if( index <= -1){
            let newArray = []

            this.state.hashTags.forEach(hashTag => {
                newArray.push(hashTag)
            });

            newArray.push(tag.hashTag);



            this.setState({isModified: true, hashTags: newArray})
        }


    }



    render() {


        return(

            <div className={"forumDetailBody"}>
                <div className={"forumDetailBackGround"} onClick={this.props.closeView}/>
                <div className={"forumDetailContainer"}>
                    <div className={"forumCloseButton"} onClick={this.props.closeView}><a>close X</a></div>
                    <div className={"forumDetailView"}>
                        <div className={"forumUserProfileContainer"}>

                        </div>

                        <div className={"forumContentWrapper"}>

                            <div className={"postWritingBox"}>
                                <div className={"writerProfile"}><ProfileImage uniqueId={getUniqueId()}/></div>
                                <div className={"textBoxWrapper"}>

                                    <div className={"textBox"}>
                                        <TextareaAutosize className={"forumTextBoxStyle forumTitleBox"} value={this.state.title} placeholder={"제목"} onChange={(event) => this.editTitle(event)}/>

                                        <TextareaAutosize className={"forumTextBoxStyle"} value={this.state.article} placeholder={"어떤 이야기를 나누고 싶나요?"} onChange={(event) => this.editText(event)}/>


                                        <div className={"writingPostTagContainer"}>
                                            {this.state.hashTags.map((i, index) => {
                                                return (

                                                    <div key={index} className={"postingHashTag"}>
                                                        <div className={"postingContentTag"}>
                                                            <a>#{i}</a>
                                                        </div>
                                                        <div className={"postingTagDeleteImg"} onClick={() => this.deleteTag(i)}><img src={require('./image/hashX.png')}/></div>
                                                    </div>

                                                );
                                            })}
                                        </div>

                                        <div className={"forumPostTagAdd"} onClick={this.addTagView}>
                                            <div className={"forumTagButtonImage"}><img src={require('./image/plusButton.png')}/></div>
                                            <div className={"forumTagButtonText"}><a>관심 태그 추가</a></div>
                                        </div>

                                    </div>


                                    <div className={"writeForumPostButton"} onClick={() => this.edit()}><a>수정 하기</a></div>
                                    <div className={"forumUserProfileContainer"}>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.addTagView}
            </div>

        )
    }
}

let mapStateToProps = (state) => {
    return {
        forumMode: state.forum.forumMode
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        edit: (params, callback) => dispatch(edit(params, callback)),
        getRecent: (params) => dispatch(getRecent(params)),
        getByLike: (params) => dispatch(getByLike(params)),
        getByComment: (params) => dispatch(getByComment(params)),
        getByRead: (params) => dispatch(getByRead(params))
    }
};

ForumEditView = connect(mapStateToProps, mapDispatchToProps)(ForumEditView)

export default ForumEditView