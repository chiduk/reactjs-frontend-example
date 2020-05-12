import React, {Component} from "react";
import "./js/components/MasonryCard.css";
import "./js/components/FirstFeedStyle.css";

import SaveButton from "./image/homeSocialSave.png";
import {getFollowingCount, getFollowCount, getHashTagInfluencer} from './actions/user'
import {connect} from "react-redux";
import {getUniqueId, getUserId} from "./util/Constants";
import {withRouter} from "react-router";
import ProfileImage from "./ProfileImage";
import HomeHashTagForYouFeed from "./HomeHashTagForYouFeed"

class HomeFirstFeed extends Component {
    constructor(prop) {
        super(prop)
        this.state = {}
        this.props.getFollowingCount(getUniqueId());
        this.props.getFollowCount(getUniqueId());

        let params = {
            uniqueId: getUniqueId()
        }

        this.props.getHashTagInfluencers(params)
    }



    handleProfileClick = () => {
        let path = '/UserProfile';

        this.props.history.push({
            pathname: path,
            search: '?uid=' + getUniqueId(),
            state: {

            }
        })
    };

    handleSaveFeedClick = () => {
        let path = '/Profile';

        this.props.history.push({
            pathname: path,
            search: '?uid=' + getUniqueId(),
            state: {
                scrollToSaved: true
            }
        })
    }

    renderForYou = () => {
        let rows = [];

        this.props.hashTagInfluencers.forEach( (data, index) => {
            let row = <HomeHashTagForYouFeed key={index} data={data}/>
            rows.push(row)
        });

        return rows;
    }

    render() {

        return(
            <div className="firstFeedCardContainer masonryCard">
                <div className="masonryCardStyle firstFeedCardStyleBottomMargin">
                    <div className="firstFeedProfileContainer" onClick={() => this.handleProfileClick()}>
                        <div className="firstFeedUserImg"><ProfileImage uniqueId={getUniqueId()} /></div>
                        <div className="firstFeedUserName"><a>{getUserId()}</a></div>
                    </div>

                    <div className="firstFeedContainer">

                        <div className="firstFeedFollowStat" onClick={() => this.handleSaveFeedClick()}>
                            <div className="firstFeedStatComponentTitle"><a>저장한 피드</a></div>
                            <div className="firstFeedStatNumber"><img src={SaveButton}/></div>
                        </div>

                        <div className="firstFeedFollowStat">
                            <div className="firstFeedStatComponentTitle"><a>팔로워</a></div>
                            <div className="firstFeedStatNumber"><a>{(this.props.followCount !== undefined) ? this.props.followCount : 0}</a></div>
                        </div>

                        <div className="firstFeedFollowStat">
                            <div className="firstFeedStatComponentTitle"><a>팔로잉</a></div>
                            <div className="firstFeedStatNumber"><a>{(this.props.followingCount !== undefined) ? this.props.followingCount : 0}</a></div>
                        </div>
                    </div>
                </div>

                {
                    this.renderForYou()
                }

            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        getHashTagInfluencers: (params) => dispatch(getHashTagInfluencer(params)),
        getFollowCount: (uniqueId) => dispatch(getFollowCount(uniqueId)),
        getFollowingCount : (uniqueId) => dispatch(getFollowingCount(uniqueId))
    }
}

let mapStateToProps = (state) => {

    return {
        hashTagInfluencers: state.user.hashTagInfluencers,
        followCount: state.user.followCount,
        followingCount: state.user.followingCount
    }
}

HomeFirstFeed = connect(mapStateToProps, mapDispatchToProps)(HomeFirstFeed)

export default withRouter(HomeFirstFeed);