import React, {Component} from "react";
import "./js/components/MasonryCard.css";
import "./js/components/FirstFeedStyle.css";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import ProfileImage from "./ProfileImage";
import {follow, isFollowing, unfollow} from "./actions/user";



class HomeHashTagForYouFeed extends Component {

    constructor(props){
        super(props)
    }

    renderFollow = (followeeId) => {



        let isFollowing = this.props.isFollowingArray.filter(x => x.followeeId === followeeId)

        if(isFollowing.length > 0){
            if(isFollowing[0].isFollowing){
                return ''
            }else{
                return 'follow'
            }
        }else{
            return 'follow'
        }
    };

    followClick = (followeeId) => {
        let isFollowing = this.props.isFollowingArray.filter(x => x.followeeId === followeeId)

        if(isFollowing.length > 0) {
            if (isFollowing[0].isFollowing) {
                this.props.unfollow(followeeId)
            } else {
                this.props.follow(followeeId)
            }
        }
    };

    renderProfile = () => {



        let rows = []
        this.props.data.influencers.forEach((influencer, index) => {




            let row = <div key={index} className="forYouInfluencerContainer" onClick={() => this.profileClick(influencer.uniqueId)}>

                <div className="influencerInfoContainer">
                    <ProfileImage uniqueId={influencer.uniqueId} />
                </div>

                <div className="influencerName">
                    <a>{influencer.userId}</a>
                </div>

                <div className="followButton" onClick={() => this.followClick(influencer.uniqueId)}>
                    <a>{this.renderFollow(influencer.uniqueId)}</a>
                </div>

            </div>


            rows.push(row)
        })

        return rows;
    }

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



        return (
            <div>
                <div className="masonryCardStyle firstFeedCardStyleBottomMargin">
                    <div className="firstFeedContainer">
                        <div className="forYouHashContainer">
                            <div><a>for you</a></div>
                            <div className="forYouHashTag"><a>#{this.props.data.hashTag}</a></div>
                        </div>


                        {this.renderProfile()}

                    </div>
                </div>


            </div>

        )
    }
}

let mapStateToProps = (state) => {
    return {
        isFollowingArray: state.stella.isFollowingArray,
        hashTagInfluencers: state.user.hashTagInfluencers
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        isFollowing: (followeeId) => dispatch(isFollowing(followeeId)),
        follow: (followeeId) => dispatch(follow(followeeId)),
        unfollow: (followeeId) => dispatch((unfollow(followeeId))),
    }
};

HomeHashTagForYouFeed = connect(mapStateToProps, mapDispatchToProps)(HomeHashTagForYouFeed);

export default withRouter(HomeHashTagForYouFeed)