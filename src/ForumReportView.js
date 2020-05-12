import React, { Component } from "react";
import "./js/components/ForumDetail.css";
import "./js/components/Forum.css";
import TextareaAutosize from 'react-autosize-textarea';
import {getUniqueId} from "./util/Constants";
import {connect} from 'react-redux'
import {getByComment, getByLike, getByRead, getRecent, report} from "./actions/forum";
import ProfileImage from "./ProfileImage";


class ForumReportView extends Component{

    constructor(props){
        super(props)

        this.state = {
            report: ''
        }
    }

    report = () => {
        if(this.state.report.length <= 0){
            alert('신고 내용을 적어주세요.')
            return
        }

        let params = {
            forumId: this.props.forum.forumId,
            uniqueId: getUniqueId(),
            report: this.state.report
        }

        this.props.report(params, () => {
            if(this.props.forumMode === 'RECENT'){
                this.props.getRecent(params)
            }else if(this.props.forumMode === 'BY_LIKE'){
                this.props.getByLike(params)
            }else if(this.props.forumMode === 'BY_COMMENT'){
                this.props.getByComment(params)
            }else if(this.props.forumMode === 'BY_READ'){
                this.props.getByRead(params)
            }

            alert('신고 완료 되었습니다. 신고하신 글은 포럼에서 제외 됩니다.')
        })

    }

    editText = (event) => {
        this.setState({report: event.target.value})
    };

    render() {
        return (
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

                                        <TextareaAutosize className={"forumTextBoxStyle"} value={this.state.report} placeholder={"무엇을 신고 하고 싶으세요?"} onChange={(event) => this.editText(event)}/>

                                    </div>


                                    <div className={"writeForumPostButton"} onClick={() => this.report()}><a>신고 하기</a></div>
                                    <div className={"forumUserProfileContainer"}>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        forumMode: state.forum.forumMode
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        report: (params, callback) => dispatch(report(params, callback)),
        getRecent: (params) => dispatch(getRecent(params)),
        getByLike: (params) => dispatch(getByLike(params)),
        getByComment: (params) => dispatch(getByComment(params)),
        getByRead: (params) => dispatch(getByRead(params))
    }
};

ForumReportView = connect(mapStateToProps, mapDispatchToProps)(ForumReportView)

export default ForumReportView