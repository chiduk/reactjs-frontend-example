import React, { Component } from "react";
import "./js/components/Home.css";
import {getUniqueId, RestApi, getDateString, HOME_FEED_VIEW_MODE, HOME_FEED_TAG_VIEW_MODE} from "./util/Constants";
import { withRouter} from "react-router-dom";
import {follow, unfollow, isFollowing} from "./actions/user";
import {deleteFeed} from "./actions/feed";
import {getJointPurchase, getJointPurchaseFollowing, getFeeds, getFeedsFollowing} from './actions/home'
import {connect} from "react-redux";
import ProfileImage from "./ProfileImage";
import YesOrNoAlert from "./YesOrNoAlert";
import AlertMessage from "./AlertMessage";
import uuidv1 from 'uuid'

class HomeMarketFeed extends Component {
    constructor(props) {
        super(props);

        this.renderHashTags = this.renderHashTags.bind(this);
        this.renderFollowButton = this.renderFollowButton.bind(this);
        this.feedClicked = this.feedClicked.bind(this)
        this.state = {
            isFollowing: false,
            alertMessage: null,
            profileImageSource : this.props.feedData.user.uniqueId
        }
        this.profileImageSource = this.props.feedData.user.uniqueId
        this.getBeginTimeText = this.getBeginTimeText.bind(this)
        this.profileClicked = this.profileClicked.bind(this)
        this.followClicked = this.followClicked.bind(this)

        this.uuid = uuidv1()

    }

    componentDidMount() {

        this.props.isFollowing(this.props.feedData.uniqueId)
    }

    renderHashTags(hashTags) {
            let tagRow = []


            hashTags.forEach((ht) => {

                const tag = <div key={ht} className="cardHashTagDiv">
                    <a>#{ht}</a>
                </div>
                tagRow.push(tag)
            });


            return tagRow;
    }

    handleFollowButton = () => {

        if(this.props.feedData.uniqueId !== getUniqueId()) {
            let followingArray = this.props.isFollowingArray;



            if (followingArray !== undefined) {
                let filteredArray = followingArray.filter(x => x.followeeId === this.props.feedData.uniqueId)

                let element = document.getElementById(this.props.feedData.uniqueId + 'followButtonHomeMarket')



                if (filteredArray.length > 0) {
                    let isFollowing = filteredArray[0].isFollowing;

                    if (isFollowing) {

                        this.props.unfollow(this.props.feedData.uniqueId)
                        element.style.animation = "";
                    } else {

                        this.props.follow(this.props.feedData.uniqueId)
                        element.style.animation = "bounce 0.3s 1";
                    }

                }else{
                    if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                        this.toggleLoginPage()
                    }
                }
            }else{
                if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                    this.toggleLoginPage()
                }
            }
        }
    }

    renderFollowButton() {

        if(this.props.feedData.uniqueId !== getUniqueId()){

            let followingArray = this.props.isFollowingArray;

            if(followingArray !== undefined){
                let filteredArray = followingArray.filter(x => x.followeeId === this.props.feedData.uniqueId)

                if(filteredArray.length > 0){
                    let isFollowing = filteredArray[0].isFollowing;

                    if (isFollowing) {

                        return <div className="followButton" id={this.props.feedData.uniqueId + 'followButtonHomeMarket'} onClick={this.handleFollowButton}><a className="profileName"/></div>;
                    } else {

                        return <div className="followButton" id={this.props.feedData.uniqueId + 'followButtonHomeMarket'} onClick={this.handleFollowButton}><a className="profileName">follow</a></div>;
                    }

                }else{

                    return <div className="followButton" id={this.props.feedData.uniqueId + 'followButtonHomeMarket'} onClick={this.handleFollowButton}><a className="profileName">follow</a></div>;
                }

            }else{

                return <div className="followButton" id={this.props.feedData.uniqueId + 'followButtonHomeMarket'} onClick={this.handleFollowButton}><a className="profileName">follow</a></div>;
            }

        }


    }

    feedClicked(from) {

        let path = '/InfluencerFeedDetail';

        this.props.history.push({
            pathname: path,
            search: '?fid=' + this.props.feedData.feedId,
            state: {
                feedId: this.props.feedData.feedId
            }
        })



    }

    profileClicked(uniqueId) {


        let path = '/UserProfile'

        this.props.history.push({
            pathname: path,
            search: '?uid=' + uniqueId,
            state: {
                uniqueId: uniqueId

            }
        })

    }

    followClicked(userID) {

        let element = document.getElementById(userID + "followButtonHomeMarket")
        element.style.animation = ""

        void element.offsetWidth;

        element.style.animation = "bounce 0.3s 1";

        element.addEventListener('animationend', () => {
            // Do anything here like remove the node when animation completes or something else!
            element.style.animation = ""

            this.setState({
                isFollowing: !this.state.isFollowing
            })
        });

    }



    getBeginTimeText(when, number) {
        let year =[];
        let month = [];
        let date = [];
        let hour = [];
        let minute = [];

        String(number).split("").forEach((i, index) => {
            if (index < 4) {
                year.push(i)
            }

            if (index > 3 && index < 6) {
                month.push(i)
            }

            if (index > 5 && index < 8) {
                date.push(i)
            }

            if (index > 7 && index < 10) {
                hour.push(i)
            }

            if (index > 9 && index < 12) {
                minute.push(i)
            }
        })

        let monthText = `${Number(month.join('')) < 10 ? month[1] : month.join('')}`
        let dayText = `${Number(date.join('')) < 10 ? date[1] : date.join('')}`

        let timeText;
        if (Number(hour.join('')) > 12) {
            timeText = `오후 ${(Number(hour.join('')) - 12)}`
        } else if (Number(hour.join('')) < 12) {
            if ( Number(hour.join('')) < 10 ) {
                timeText = `오전 ${hour[1]}`
            } else {
                timeText = `오전 ${hour.join('')}`
            }
        } else if (Number(hour.join('')) === 12) {
            timeText = `오후 ${hour.join('')}`
        } else if (Number(hour.join('')) === 0) {
            timeText = "오전 12"
        }

        let text;
        if (when === "begin") {
            text = `${year.join('')}. ${monthText}. ${dayText}. ${timeText}시`
        } if (when === "end") {
            text = `${monthText}. ${dayText}. ${timeText}시`
        }
        return (
            text
        );
    }

    renderProductCoverImage = (products) => {

        if(products.length > 0){
            let productId = products[0]._id

            let selProduct = this.props.feedData.productImages.filter(x => x.productId === productId);

            if(selProduct.length > 0){


                return RestApi.prod + selProduct[0].image;
            }else{
                return 'placeholder'
            }

        }else{
            return 'placeholder'
        }


    };

    toggleLoginPage = () => {
        const element = document.getElementById('logInPage');

        element.classList.toggle('searchViewClose')
    }

    renderFeedCoverImage = () => {

        if(this.props.feedData.images.length > 0){
            let extension = this.props.feedData.images[0].split('.')[1]

            if(extension === 'mp4'){
                return (
                    <video className="shareImage" controls={false} width="320" height="240" ><source src={RestApi.feedImage + this.props.feedData.images[0] } type="video/mp4"/> </video>
                )

            }else{
                return (
                    <img className="shareImage" src={this.props.feedData.images.length ? RestApi.feedImage + '/' + this.props.feedData.images[0] : 'placeholder'}/>
                )
            }
        }
    };

    handleOptionClick = (feedId) => {

        this.props.closeMenu()
        const element = document.getElementById("jpOptionBox" + feedId);
        element.classList.toggle('optionBoxGrow');
        element.style.visibility = 'visible';
    };

    renderMenu = (feedOwnerUniqueId) => {

        if(feedOwnerUniqueId === getUniqueId()){
            return(
                <div>
                    <div className={"optionButton"} onClick={() => this.editFeed(this.props.feedData.feedId)}>수정</div>
                    <div className={"optionButton"} onClick={() => this.showDeleteAlertMessage(this.props.feedData.feedId)}>삭제</div>

                </div>


            )
        }else{
            return(
                <div>
                    <div className={"optionButton"} onClick={() => this.optionButtonClick("report", this.props.feedData.feedId)}>신고</div>

                </div>


            )
        }
    };

    editFeed = (feedId) => {

        this.handleOptionClick(feedId)

        this.props.history.push({
            pathname: '/fe',
            state: {
                feedId: feedId
            }
        })
    };

    deleteFeed = (feedId) => {

        console.log('delete feed', feedId)

        let params = {
            feedId: feedId,
            uniqueId: getUniqueId()
        }

        this.props.deleteFeed(params, () => {
            this.setState({alertMessage: <AlertMessage messages={["삭제 되었습니다."]} closeAlert={this.closeAlertView}/>})

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
        }, () => {
            this.setState({alertMessage: <AlertMessage messages={["삭제에 실패 하였습니다. 다시 시도해주세요."]} closeAlert={this.closeAlertView}/>})
        });
    };

    closeAlertView = () => {
        this.setState({alertMessage: null})
    };

    showDeleteAlertMessage = (feedId) => {

        this.setState({alertMessage: <YesOrNoAlert  alertTitle={""}
                                                    messages={["해당 피드를 삭제 하시겠습니까? 삭제후 복원이 불가능 합니다."]}
                                                    yes={() => this.deleteFeed(feedId)}
                                                    no={this.closeAlertView} />})

        this.handleOptionClick(feedId)
    }

    iframeInserter = (iframe) => {


        return{
            __html: this.props.feedData.description.substring(iframe.start, iframe.end + 9)
        }
    }


    renderDescription = () => {

        let iframes = []

        let iframeIndex = this.props.feedData.description.indexOf('<iframe');
        let closingIframeIndex = this.props.feedData.description.indexOf('</iframe');


        if(iframeIndex > -1){
            let obj = {
                start: iframeIndex,
                end: 0
            }

            iframes.push(obj)
        }


        while(iframeIndex > -1){

            iframeIndex = this.props.feedData.description.indexOf('<iframe', iframeIndex + 1);


            let obj = {
                start: iframeIndex,
                end: 0
            }

            if(iframeIndex !== -1){
                iframes.push(obj)
            }


        }



        let index = 0;
        if(closingIframeIndex > -1){
            iframes[index].end = closingIframeIndex;
            index++;
        }

        while(closingIframeIndex > -1){
            closingIframeIndex = this.props.feedData.description.indexOf('</iframe', closingIframeIndex + 1)

            if(closingIframeIndex !== -1){
                iframes[index].end = closingIframeIndex

            }

            index++;
        }

        let rows = []

        for(let index = 0; index < iframes.length; index++){

            let desc = '';

            if(index > 0){
                if(iframes[index].start > 0){
                    desc = <p>{this.props.feedData.description.substring(iframes[index -1].end + 10, iframes[index].start - 1)}</p>
                    rows.push(desc)
                }
            }else{
                if(iframes[index].start > 0){
                    desc = <p>{this.props.feedData.description.substring(0, iframes[index].start - 1)}</p>
                    rows.push(desc)
                }

            }

            let htmlString = this.iframeInserter(iframes[index])

            let row = <div dangerouslySetInnerHTML={htmlString}/>

            rows.push(row)
        }


        if(rows.length === 0){
            return(
                <p>{this.props.feedData.description}</p>
            )

        }else{
            return(
                <div>{rows[0]}</div>
            )

        }

    };

    onProfileImageError = () => {
        this.setState({profileImageSource: 'profileImagePlaceholder'})

        this.profileImageSource = 'profileImagePlaceholder'
    }

    render() {

        let currentTime = new Date(new Date().toUTCString()).getTime();

        let beginNumber = new Date(this.props.feedData.startDate).getTime();
        let endNumber = new Date(this.props.feedData.endDate).getTime();

        let saleStatusText;
        let saleStatusNumber;

        if (currentTime < beginNumber && currentTime < endNumber) {
            saleStatusText = "판매 예정"
            saleStatusNumber = 0
        } else if (currentTime > beginNumber && currentTime < endNumber) {
            saleStatusText = "현재 판매중"
            saleStatusNumber = 1
        } else if (currentTime > endNumber && currentTime > beginNumber) {
            saleStatusText = "판매 완료"
            saleStatusNumber = 2
        }

        let beginTimeNumber = getDateString(this.props.feedData.startDate);
        let endTimeNumber = getDateString(this.props.feedData.endDate);

        let beginTimeText = `${this.getBeginTimeText("begin", beginTimeNumber)}`
        let endTimeText = `${this.getBeginTimeText("end", endTimeNumber)}`

        let currency = "₩";


        if(this.props.feedData.products.length > 0){
            if (this.props.feedData.products[0].currency === "KRW") {
                currency = "₩"
            }

        }

        if (this.props.feedData.currency === "KRW") {
            currency = "₩"
        }

        if (saleStatusNumber === 1 || saleStatusNumber === 0) {

        }

        let followButton = this.renderFollowButton();

        return(

            <div className="card" key={this.props.feedData.productId}>
                <div className="profileContainer">
                    <div className="profileInfo" onClick={() => this.profileClicked(this.props.feedData.user.uniqueId)}>
                        {/*<ProfileImage className="profileImg" uniqueId={this.props.feedData.user.uniqueId} />*/}
                        <img className={"profileImg"} src={RestApi.profile + this.props.feedData.user.uniqueId + '.png'} onError={this.onProfileImageError}/>

                        <a className="profileName">{this.props.feedData.user.userId}</a>
                    </div>
                    {followButton}
                </div>
                <div onClick={this.feedClicked}>
                    {this.renderFeedCoverImage()}

                </div>
                <div className="cardContentContainer" >
                    <div className="cardTitle" onClick={() => this.feedClicked()}>
                        <a>{this.props.feedData.title}</a>
                    </div>
                    <div className="cardTime" style={{color: `${saleStatusNumber === 1 ? "red" : "grey"}`}} onClick={() => this.feedClicked()}>
                        <div>{saleStatusText}</div>

                        <div className={"cardTimeLine"}>
                            <div>{beginTimeText}</div>
                            <div className={"curlyLine"}>~</div>
                            <div>{endTimeText}</div>
                        </div>
                    </div>

                    <div className="cardMessage" onClick={() => this.feedClicked()}>
                        {this.renderDescription()}
                    </div>


                    <div className="cardHashTagContainer" onClick={() => this.feedClicked()}>
                        {this.renderHashTags(this.props.feedData.hashTags)}

                    </div>


                    <div className={'masonryCard'}>
                        <div className={"reportBoxRight"}>
                            <div className={"reportBox"} id={"jpOptionBox" + this.props.feedData.feedId}>
                                {this.renderMenu(this.props.feedData.user.uniqueId)}
                            </div>
                        </div>
                    </div>
                    <div className={"lineSeparator"}/>
                    <div className="cardProductContainer" onClick={() => this.feedClicked()}>
                        <div className="cardProductImg"><img src={this.renderProductCoverImage(this.props.feedData .products)}/></div>
                        <div className="productInfo">
                            <div className="cardProductName"><a>{(this.props.feedData.products.length > 0) ? this.props.feedData.products[0].title : ''}</a></div>
                            <div className="cardPriceContainer">
                                <div className={"cardDiscount"}>{(this.props.feedData.products.length > 0) ? this.props.feedData.products[0].discountRate : '0'}% off,</div>
                                <div>{currency}{(this.props.feedData.products.length > 0) ? (parseInt(this.props.feedData.products[0].price) * ( 1 - parseInt(this.props.feedData.products[0].discountRate) / 100)).toLocaleString() : ''}</div>
                            </div>
                        </div>
                    </div>

                </div>
                {this.state.alertMessage}
            </div>

        );
    }
}


let mapDispatchToProps = (dispatch) => {
    return {
        isFollowing: (followeeId) => dispatch(isFollowing(followeeId)),
        follow: (followeeId) => dispatch(follow(followeeId)),
        unfollow: (followeeId) => dispatch((unfollow(followeeId))),
        deleteFeed: (params, onSuccess, onFail) => dispatch(deleteFeed(params, onSuccess, onFail)),
        getJointPurchase: () => dispatch(getJointPurchase()),
        getJointPurchaseFollowing: () => dispatch(getJointPurchaseFollowing()),
        getFeeds: (hashTags) => dispatch(getFeeds(hashTags)),
        getFeedsFollowing: (hashTags) => dispatch(getFeedsFollowing(hashTags))
    }
};

let mapStateToProps = (state) => {

    return {
        isFollowingArray: state.stella.isFollowingArray,
        jointPurchase: state.stella.jointPurchase,
        hashTags: state.stella.hashTags,
        viewMode: state.stella.viewMode,
        viewTagMode: state.stella.viewTagMode
    }
};
HomeMarketFeed = connect(mapStateToProps, mapDispatchToProps)(HomeMarketFeed);

export default withRouter(HomeMarketFeed);