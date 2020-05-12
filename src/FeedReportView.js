import React, { Component } from "react";
import "./js/components/ForumDetail.css";
import "./js/components/Forum.css";
import TextareaAutosize from 'react-autosize-textarea';
import {getUniqueId, HOME_FEED_TAG_VIEW_MODE, HOME_FEED_VIEW_MODE} from "./util/Constants";
import {connect} from 'react-redux'
import {report} from "./actions/feed";
import ProfileImage from "./ProfileImage";
import {getJointPurchase, getJointPurchaseFollowing,getFeeds,getFeedsFollowing} from "./actions/home";


class FeedReportView extends Component{
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
            feedId: this.props.feed.feedId,
            uniqueId: getUniqueId(),
            report: this.state.report
        }

        this.props.report(params, () => {


            alert('신고 완료 되었습니다. 신고하신 글은 피드에서 제외 됩니다.')

        })

        if(this.props.viewMode === HOME_FEED_VIEW_MODE.ALL){
            this.props.getJointPurchase();

            if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL ){
                this.props.getFeeds()
            }else{
                this.props.getFeeds(this.props.hashTags)
            }

        }else{
            this.props.getJointPurchaseFollowing();

            if(this.props.viewTagMode === HOME_FEED_TAG_VIEW_MODE.ALL ){
                this.props.getFeedsFollowing()
            }else{
                this.props.getFeedsFollowing(this.props.hashTags)
            }


        }

        this.props.closeView()

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
        feeds: state.stella.feeds,
        jointPurchase: state.stella.jointPurchase,
        viewMode: state.stella.viewMode
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        report: (params, callback) => dispatch(report(params, callback)),
        getJointPurchase: () => dispatch(getJointPurchase()),
        getJointPurchaseFollowing: () => dispatch(getJointPurchaseFollowing()),
        getFeeds: (hashTags) => dispatch(getFeeds(hashTags)),
        getFeedsFollowing: (hashTags) => dispatch(getFeedsFollowing(hashTags))
    }
};

FeedReportView = connect(mapStateToProps, mapDispatchToProps)(FeedReportView)

export default FeedReportView;