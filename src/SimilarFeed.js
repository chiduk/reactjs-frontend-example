import React, { Component } from 'react' ;
import './js/components/SimilarFeed.css';
import LogInPage from "./LogInPage";
import ProfileImage from "./ProfileImage";
import {FEED_TYPE, getDateString, getBeginTimeText, RestApi} from "./util/Constants";
import {withRouter} from "react-router";

class SimilarFeed extends Component{

    constructor(props) {
        super(props);

    }

    handleProfileClick = () => {
        console.log(this.props.history)

        this.props.history.push({
            pathname: '/UserProfile',
            search: '?uid=' + this.props.feed.user.uniqueId,
            state: {
                uniqueId: this.props.feed.user.uniqueId
            }
        })
    };

    handleFeedClick = () => {


        this.props.history.push({
            pathname: '/InfluencerFeedDetail',
            search: '?fid=' + this.props.feed.feedId,
            state: {
                feedId: this.props.feed.feedId
            }
        })
    };

    renderFeedCoverImage = () => {
        if(this.props.feed.images.length > 0 ){
            if(this.props.feed.images[0].endsWith('.mp4')){
                return(
                    <video className={"shareImage"} controls={false} width="320" height="240" ><source src={RestApi.feedImage + this.props.feed.images[0]} type="video/mp4"/> </video>
                )
            }else{
                return(
                    <img className={"shareImage"} src={ RestApi.feedImage + this.props.feed.images[0]}/>
                )
            }
        }
    };

    renderProductCoverImage = () => {



        if(this.props.product.images.length > 0){
            if(this.props.product.images[0].endsWith('.mp4')){
                return(
                    <video controls={false} width="320" height="240" ><source src={RestApi.prod + this.props.product.images[0]} type="video/mp4"/> </video>
                )
            }else{


                return (
                    <img src={ RestApi.prod + this.props.product.images[0]}/>
                )
            }
        }
    };

    renderHashTags = () => {
        let tagRow = []


        this.props.feed.hashTags.forEach((ht, index) => {

            const tag = <div key={index} className="forYouFeedCardHashTagDiv">
                <a>#{ht}</a>
            </div>;
            tagRow.push(tag)
        });


        return tagRow
    };

    renderMenu = () => {

    };

    handleOptionClick = () => {

    };

    iframeInserter = (iframe) => {
        return{
            __html: this.props.feed.description.substring(iframe.start, iframe.end + 9)
        }
    }

    renderDescription = () => {

        let iframes = []

        let iframeIndex = this.props.feed.description.indexOf('<iframe');
        let closingIframeIndex = this.props.feed.description.indexOf('</iframe');


        if(iframeIndex > -1){
            let obj = {
                start: iframeIndex,
                end: 0
            }

            iframes.push(obj)
        }


        while(iframeIndex > -1){

            iframeIndex = this.props.feed.description.indexOf('<iframe', iframeIndex + 1);


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
            closingIframeIndex = this.props.feed.description.indexOf('</iframe', closingIframeIndex + 1)

            if(closingIframeIndex !== -1){
                iframes[index].end = closingIframeIndex

            }

            index++;
        }

        let rows = []

        for(let index = 0; index < iframes.length; index++){



            let desc = ''

            if(index > 0){
                if(iframes[index].start > 0){

                    let description = this.props.feed.description.substring(iframes[index -1].end + 10, iframes[index].start - 1)

                    if(description.length > 42){
                        let shortenedDesc = ''

                        for(let i = 0; i < 42; i++){
                            if(i < 38){
                                shortenedDesc += description[i]

                                console.log(shortenedDesc)
                            }else{
                                shortenedDesc += '...';

                                break;
                            }
                        }

                        description = shortenedDesc
                    }

                    desc = <p>{description}</p>
                    rows.push(desc)
                }
            }else{
                if(iframes[index].start > 0){
                    let description = this.props.feed.description.substring(0, iframes[index].start - 1)

                    if(description.length > 42){
                        let shortenedDesc = ''

                        for(let i = 0; i < 42; i++){
                            if(i < 38){

                                shortenedDesc += description[i]

                                console.log(shortenedDesc)
                            }else{
                                shortenedDesc += '...';

                                break;
                            }
                        }

                        description = shortenedDesc
                    }

                    desc = <p>{description}</p>
                    rows.push(desc)
                }

            }

            let htmlString = this.iframeInserter(iframes[index])

            let row = <div dangerouslySetInnerHTML={htmlString}/>

            rows.push(row)
        }



        if(rows.length === 0){
            let description = this.props.feed.description

            if(description.length > 42){
                let shortenedDesc = '';

                for(let i = 0; i < 42; i++){
                    if(i < 38){

                        shortenedDesc += description[i]


                    }else{
                        shortenedDesc += '...';

                        break;
                    }
                }

                description = shortenedDesc
            }


            return(
                <p>{description}</p>
            )

        }else{
            return(
                <div>{rows[0]}</div>
            )

        }



    };

    profileClicked = (uniqueId) => {
        this.props.history.push({
            pathname: '/UserProfile',
            search: '?uid=' + uniqueId,
            state: {
                uniqueId: uniqueId
            }
        })
    };

    render() {

        let jointPurchaseSection = []

        if(this.props.feed.feedType === FEED_TYPE.JOINT_PURCHASE){
            let currentTime = new Date(new Date().toUTCString()).getTime();

            let beginNumber = new Date(this.props.feed.startDate).getTime();
            let endNumber = new Date(this.props.feed.endDate).getTime();

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

            let beginTimeNumber = getDateString(this.props.feed.startDate);
            let endTimeNumber = getDateString(this.props.feed.endDate);

            let beginTimeText = `${getBeginTimeText("begin", beginTimeNumber)}`
            let endTimeText = `${getBeginTimeText("end", endTimeNumber)}`

            jointPurchaseSection = <div className="cardTime" style={{color: `${saleStatusNumber === 1 ? "red" : "grey"}`}} onClick={() => this.handleFeedClick()}>
                <div>{saleStatusText}</div>

                <div className={"cardTimeLine"}>
                    <div>{beginTimeText}</div>
                    <div className={"curlyLine"}>~</div>
                    <div>{endTimeText}</div>
                </div>
            </div>

        }

        let currency = "₩";

        if(this.props.product.currency === 'KRW'){
            currency = "₩";
        }

        let productPrice = parseInt(this.props.product.price) * ( 1 - parseInt(this.props.product.discountRate ) / 100);

        return(
            <div >
                <div className="similarFeedCard" key={this.props.product.productId}>
                    <div className="similarFeedCardProfileContainer">
                        <div className="similarFeedCardProfileInfo" onClick={() => this.profileClicked(this.props.feed.user.uniqueId)}>
                            <ProfileImage className="similarFeedCardProfileImg" uniqueId={this.props.feed.user.uniqueId} />
                            <a className="similarFeedCardProfileName">{this.props.feed.user.userId}</a>
                        </div>
                        {/*{followButton}*/}
                    </div>
                    <div onClick={this.handleFeedClick}>
                        {this.renderFeedCoverImage()}

                    </div>
                    <div className="similarFeedCardContentContainer" >
                        <div className="similarFeedCardTitle" onClick={() => this.handleFeedClick()}>
                            <a>{this.props.feed.title}</a>
                        </div>
                        {jointPurchaseSection}
                        <div className="similarFeedCardMessage" onClick={() => this.handleFeedClick()}>
                            {/*number of word limit with script*/}
                            {this.renderDescription()}
                        </div>

                        <div className="similarFeedCardHashTagContainer" onClick={() => this.handleFeedClick()}>
                            {this.renderHashTags()}

                        </div>

                        <div className={"feedProductLineSeparator"}/>

                        <div className="similarFeedCardProductContainer" onClick={() => this.handleFeedClick()}>
                            <div className="similarFeedCardProductImg">{this.renderProductCoverImage()}</div>
                            <div className="similarFeedCardProductInfo">
                                <div className="similarFeedCardProductName"><a>{this.props.product.title}</a></div>
                                <div className="similarFeedCardPriceContainer">
                                    <div className={"similarFeedCardDiscount"}>{this.props.product.discountRate}% off,</div>
                                    <div>{currency}{productPrice}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>



                <div id="logInPage" className="searchViewBackGround" ref={this.logInRef}>
                    <div className="searchBarWrapper">
                        <div className="searchCloseButton" ><a onClick={() => this.toggleLoginPage()}>close X</a></div>
                    </div>

                    <LogInPage  toggleLogInView={() => this.toggleLoginPage()} redirectUrl={'/'}/>
                </div>
            </div>
        )
    }
}

export default withRouter(SimilarFeed);