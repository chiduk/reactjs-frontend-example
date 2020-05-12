import React, { Component } from "react";
import "./js/components/ProfilePage.css";
import ProfilePageBottom from "./ProfilePageBottom.js"
import {getUniqueId, RestApi} from "./util/Constants";
import {setProfileUniqueId, getUserInfo, getFollowCount, getFollowingCount, getReviewCount, getForumCount, isFollowing, follow, unfollow} from "./actions/user";
import {connect} from "react-redux";
import LogInPage from "./LogInPage";
import {withRouter} from "react-router";
import ProfileImage from "./ProfileImage";

class UserProfile extends Component{
    constructor(props) {
        super(props)
        this.state = {
            profileName: "",
            followerCount:"",
            followingCount: "",
            reviewCount: "",
            forumCount: "",
            isPopViewOn: false,
        }

        this.toggleMouseEvent = this.toggleMouseEvent.bind(this);


        console.log(this.props)

        let params = new URLSearchParams(this.props.location.search);

        let uniqueId = params.get('uid');




        // if(this.props.location.state === undefined){
        //     uniqueId = localStorage.getItem('forwardUniqueId');
        //     localStorage.removeItem('forwardUniqueId');
        //
        //     console.log('forward uniqueId', uniqueId)
        // }else{
        //
        //     uniqueId = this.props.location.state.uniqueId;
        //
        //     console.log('user uniqueId', uniqueId)
        // }

        this.uniqueId = uniqueId;





        this.props.getUserInfo(uniqueId);
        this.props.getFollowCount(uniqueId);
        this.props.getFollowingCount(uniqueId);
        this.props.getReviewCount(uniqueId);
        this.props.getForumCount(uniqueId);
        this.props.isFollowing(uniqueId)
    }



    componentDidMount() {
        document.body.scrollTop = 0;
        window.scrollTo(0,0);

        let daumPostCodeScript = document.createElement('script');
        daumPostCodeScript.type = 'text/javascript';
        daumPostCodeScript.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        daumPostCodeScript.characterSet = "utf-8"
        document.head.appendChild(daumPostCodeScript);

        daumPostCodeScript.onload = function () {

        }




        if(this.uniqueId === 'null' || this.uniqueId === null) {


            this.toggleSearchView("logInPage")


            if (getUniqueId() === undefined || getUniqueId() === null) {



            }
        }



    }


    toggleMouseEvent() {

        this.setState({isPopViewOn: !this.state.isPopViewOn}, () => {

            const element = document.getElementById('profileBody')
            const classList = element.classList

        })
    }

    toggleSearchView = (id) => {

        const element = document.getElementById(id)

        element.classList.toggle('searchViewClose')

    };

    renderFollowButton = () => {
        if(this.uniqueId === getUniqueId()){
            return ''
        }



        let isFollowing = this.props.isFollowingArray.filter(x => x.followeeId === this.uniqueId)

        if(isFollowing.length > 0){
            if(isFollowing[0].isFollowing){
                return 'following'
            }else{
                return 'follow'
            }
        }else{
            return 'follow'
        }
    };

    handleFollowClick = () => {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }

        let element = document.getElementById('followButtonID');
        element.style.animation = "bounce 0.3s 1";

        element.addEventListener('animationend', () => {
            // Do anything here like remove the node when animation completes or something else!
            element.style.animation = ""


        });

        let isFollowing = this.props.isFollowingArray.filter(x => x.followeeId === this.uniqueId)

        if(isFollowing.length > 0){
            if(isFollowing[0].isFollowing){
                this.props.unfollow(this.uniqueId)
            }else{
                this.props.follow(this.uniqueId)
            }
        }else{
            this.props.follow(this.uniqueId)
        }
    }

    closeLogInPage = () => {

        if(getUniqueId() === undefined || getUniqueId() === null){
            window.location = '/';
        }else{
            const element = document.getElementById('logInPage')

            element.classList.toggle('searchViewClose')

        }

    }

    render() {

        return (
            <div className={`${ this.state.isPopViewOn ? 'preventMouseEvent' : '' }`}>
                <div className={"profilePageBody"} id={"profileBody"}>
                    <div className={"profileHeader"}>
                        <div className={"profileTopInfo"}>
                            <div className={"profileImage"}><ProfileImage uniqueId={this.uniqueId}/></div>
                            <div className={"profileName"}><a>{this.props.userInfo.userId}</a></div>

                            <div className={"followButton"} id={'followButtonID'} onClick={() => this.handleFollowClick()}><a>{this.renderFollowButton()}</a></div>
                        </div>
                        <div className={"profileTopInfo"}>
                            <div className={"profileCount"}>
                                <div><a>팔로잉</a></div>
                                <div><a>{this.props.followingCount}</a></div>
                            </div>
                            <div className={"profileCount countRight"}>
                                <div><a>제품 후기</a></div>
                                <div className={"countRightText"}><a>{this.props.reviewCount}</a></div>
                            </div>
                        </div>

                        <div className={"profileTopInfo"}>
                            <div className={"profileCount"}>
                                <div><a>팔로워</a></div>
                                <div><a>{this.props.followCount}</a></div>
                            </div>
                            <div className={"profileCount countRight"}>
                                <div><a>포럼글</a></div>
                                <div className={"countRightText"}><a>{this.props.forumCount}</a></div>
                            </div>
                        </div>
                    </div>

                </div>

                <ProfilePageBottom uniqueId={this.uniqueId} mouseActivityToggle={this.toggleMouseEvent}/>

                <div id="logInPage" className="searchViewBackGround" ref={this.logInRef}>
                    <div className="searchBarWrapper">
                        <div className="searchCloseButton" ><a onClick={() => this.closeLogInPage()}>close X</a></div>
                    </div>

                    <LogInPage  toggleLogInView={() => this.toggleSearchView("logInPage")} redirectUrl={'/'} action={this.state.logInAction}/>
                </div>
            </div>

        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return{
        setProfileUniqueId: (uniqueId) => dispatch(setProfileUniqueId(uniqueId)),
        getUserInfo: (uniqueId) => dispatch(getUserInfo(uniqueId)),
        getReviewCount: (uniqueId) => dispatch(getReviewCount(uniqueId)),
        getForumCount: (uniqueId) => dispatch(getForumCount(uniqueId)),
        getFollowCount: (uniqueId) => dispatch(getFollowCount(uniqueId)),
        getFollowingCount: (uniqueId) => dispatch(getFollowingCount(uniqueId)),
        isFollowing: (followeeId) => dispatch(isFollowing(followeeId)),
        follow:(followeeId) => dispatch(follow(followeeId)),
        unfollow: (followeeId) => dispatch(unfollow(followeeId))
    }
};

let mapStateToProps = (state) => {

    return {
        isFollowingArray : state.stella.isFollowingArray,

        userInfo: state.user.info,
        followCount: state.user.followCount,
        followingCount: state.user.followingCount,
        reviewCount: state.user.reviewCount,
        forumCount: state.user.forumCount
    }
};

UserProfile = connect(mapStateToProps, mapDispatchToProps)(UserProfile)

export default withRouter(UserProfile);