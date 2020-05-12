import React, { Component } from "react";
import "./js/components/ProfilePage.css";
import ProfilePageBottom from "./ProfilePageBottom.js"
import {getUniqueId, RestApi} from "./util/Constants";
import {setProfileUniqueId, getMyInfo, getFollowCount, getFollowingCount, getReviewCount, getForumCount, scrollToSaved} from "./actions/user";
import {connect} from "react-redux";
import LogInPage from "./LogInPage";
import ProfileImage from "./ProfileImage";
import {setCount} from "./actions/notification";
import {setCartItemCount} from "./actions/cart";

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            profileName: "",
            followerCount:"",
            followingCount: "",
            reviewCount: "",
            forumCount: "",
            isPopViewOn: false,
            instaLink: '',
            youtubeLink: "",
            blogLink: "",
        }

        this.toggleMouseEvent = this.toggleMouseEvent.bind(this);
        this.linkClicked = this.linkClicked.bind(this)
        this.props.setNotificationCount();
        this.props.setCartItemCount();
    }

    componentDidMount() {
        document.body.scrollTop = 0

        let daumPostCodeScript = document.createElement('script');
        daumPostCodeScript.id = 'daumPostCodeScriptID';
        daumPostCodeScript.type = 'text/javascript';
        daumPostCodeScript.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        daumPostCodeScript.characterSet = "utf-8"
        document.head.appendChild(daumPostCodeScript);

        daumPostCodeScript.onload = function () {

        }



        if(getUniqueId() === undefined || getUniqueId() === null){
            this.toggleSearchView("logInPage")
        }else{
            //this.props.setProfileUniqueId(getUniqueId())




            if(this.props.location.state !== undefined){
                if(this.props.location.state.scrollToSaved){
                    this.props.scrollToSaved(true)
                }else{
                    this.props.scrollToSaved(false)
                }
            }else{
                this.props.scrollToSaved(false)
            }


            this.props.getUserInfo(getUniqueId());
            this.props.getFollowCount(getUniqueId());
            this.props.getFollowingCount(getUniqueId());
            this.props.getReviewCount(getUniqueId());
            this.props.getForumCount(getUniqueId());
        }


    }




    toggleMouseEvent() {
        //console.log("disable mouse")
        this.setState({isPopViewOn: !this.state.isPopViewOn}, () => {
            //console.log(this.state.isPopViewOn)
            const element = document.getElementById('profileBody')
            const classList = element.classList
            //console.log(classList)
        })
    }

    toggleSearchView = (id) => {

        const element = document.getElementById(id)

        element.classList.toggle('searchViewClose')

    }

    closeLogInPage = () => {

        if(getUniqueId() === undefined || getUniqueId() === null){
            window.location = '/';
        }else{
            const element = document.getElementById('logInPage')

            element.classList.toggle('searchViewClose')

        }

    }

    linkClicked(url) {
        window.open(url, "", "width=750, height=700;");
    }

    render() {
        let instaLink;
        if (this.props.userInfo.instagram !== null) {
            instaLink = <div className={"socialURL"} onClick={() => this.linkClicked(this.state.instaLink)}>
                Instagram: <a href={this.props.userInfo.instagram}>{this.props.userInfo.instagram}</a>
            </div>;

        }


        let youtubeLink;
        if (this.props.userInfo.youtube !== null) {
            youtubeLink = <div className={"socialURL"} onClick={() => this.linkClicked(this.state.youtubeLink)}>
                Youtube: <a href={this.props.userInfo.youtube}>{this.props.userInfo.youtube}</a>
            </div>;
        }

        let blogLink;
        if (this.props.userInfo.blog !== null) {
            blogLink = <div className={"socialURL"} onClick={() => this.linkClicked(this.state.blogLink)}>
                Blog: <a href={this.props.userInfo.blog}>{this.props.userInfo.blog}</a>
            </div>;
        }


        return (
            <div className={`${ this.state.isPopViewOn ? 'preventMouseEvent' : '' }`}>
                <div className={"profilePageBody"} id={"profileBody"}>
                    <div className={"profileHeader"}>
                        <div className={"profileTopInfo"}>
                            <div className={"profileImage"}><ProfileImage uniqueId={getUniqueId()}/></div>
                            <div className={"profileName"}><a>{this.props.userInfo.userId}</a></div>

                        </div>

                        <div className={"profileTopInfo"}>
                            <div className={"profileCount"}>
                                <div><a>팔로잉</a></div>
                                <div><a>{this.props.followingCount}</a></div>
                            </div>

                            <div className={"profileCount"}>
                                <div><a>팔로워</a></div>
                                <div><a>{this.props.followCount}</a></div>
                            </div>

                            <div className={"profileCount"}>
                                <div><a>포럼글</a></div>
                                <div className={"countRightText"}><a>{this.props.forumCount}</a></div>
                            </div>

                            <div className={"profileCount"}>
                                <div><a>제품 후기</a></div>
                                <div className={"countRightText"}><a>{this.props.reviewCount}</a></div>
                            </div>
                        </div>

                        {instaLink}
                        {youtubeLink}
                        {blogLink}

                    </div>

                </div>

                <ProfilePageBottom mouseActivityToggle={this.toggleMouseEvent} uniqueId={getUniqueId()} />

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
        getUserInfo: () => dispatch(getMyInfo()),
        getReviewCount: (uniqueId) => dispatch(getReviewCount(uniqueId)),
        getForumCount: (uniqueId) => dispatch(getForumCount(uniqueId)),
        getFollowCount: (uniqueId) => dispatch(getFollowCount(uniqueId)),
        getFollowingCount: (uniqueId) => dispatch(getFollowingCount(uniqueId)),
        scrollToSaved: (scroll) => dispatch(scrollToSaved(scroll)),
        setNotificationCount: () => dispatch(setCount()),
        setCartItemCount: () => dispatch(setCartItemCount())
    }
};

let mapStateToProps = (state) => {

    return {

        userInfo: state.stella.myInfo,
        followCount: state.user.followCount,
        followingCount: state.user.followingCount,
        reviewCount: state.user.reviewCount,
        forumCount: state.user.forumCount
    }
};

Profile = connect(mapStateToProps, mapDispatchToProps)(Profile)

export default Profile;