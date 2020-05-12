import React, { Component } from 'react';
import "./js/components/FeedDetail.css";
import TextareaAutosize from 'react-autosize-textarea';

import CommentButton from "./image/homeSocialComment.png";

import FeedCommentList from "./FeedCommentList.js";
import { withRouter} from "react-router-dom";
import fetch from 'cross-fetch'
import {getUniqueId, queryString, RestApi, getDateString, getBeginTimeText, FEED_ADDITIONAL_CONTENTS_TYPE} from "./util/Constants";
import {connect} from "react-redux";
import {addComment, getSimilarFeed} from "./actions/feed";
import LogInPage from "./LogInPage";
import ProfileImage from "./ProfileImage";
import SimilarFeed from "./SimilarFeed";


class InfluencerFeedDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {likeCount:0,
            commentCount: 0,
            commentMessage:'',
            isFollowing: false,
            isLiked: false,
            isSaved: false,
            feedId: ''
        }



        this.renderFeedContent = this.renderFeedContent.bind(this)


        //this.scrollToCommentBox = this.props.location.state.scrollToCommentBox


        let params = new URLSearchParams(this.props.location.search);

        let feedId = params.get('fid');
        let scrollToCommentBox = params.get('scb');



        this.feedId = feedId;

        this.setState({feedId: feedId});

        if(scrollToCommentBox === null){
            this.scrollToCommentBox = false;
        }else{
            this.scrollToCommentBox = scrollToCommentBox === '1';
        }

        this.getDetail();

        this.commentBoxRef = React.createRef();
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        let params = new URLSearchParams(this.props.location.search);

        let feedId = params.get('fid');

        if(feedId !== this.feedId){
            window.scrollTo(0, 0)
            this.feedId = feedId;
            this.getDetail();

        }
    }


    getDetail = () => {



        fetch(RestApi.feed.getDetail + '?' + queryString({feedId: this.feedId}))
            .then(res => {
                return res.json()
            })
            .then( json => {
                this.setState({detail:json}, () => {
                    let detail = this.state.detail

                    if (detail.startDate !== null && detail.endDate !== null) {
                        this.setSaleStatus(detail.startDate, detail.endDate)
                    }

                    this.setState({likeCount: json.likeCount, commentCount: json.commentCount});
                    this.isFollowing();
                    this.isLiked();
                    this.isSaved();



                    let params = {
                        feedOwnerUniqueId: detail.user.uniqueId,
                        feedId: this.feedId
                    }

                    this.props.getSimilarFeeds(params)

                })

            })
    }

    isFollowing = () => {
        let followeeId = this.state.detail.uniqueId;
        let uniqueId = getUniqueId();

        let params = {
            followeeId: followeeId,
            uniqueId: uniqueId
        };

        fetch(RestApi.user.isFollowing + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                this.setState({isFollowing: json.isFollowing})
            })
    }

    follow = () => {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }
            return
        }


        let followeeId = this.state.detail.uniqueId;
        let uniqueId = getUniqueId();

        let element = document.getElementById('influencerDetailFollowButton');
        element.style.animation = 'bounce 0.3s 1';

        let params = {
            followeeId: followeeId,
            uniqueId: uniqueId
        }

        fetch(RestApi.user.follow, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    this.setState({isFollowing:true})
                }

            })

    }

    unfollow = () => {
        let followeeId = this.state.detail.uniqueId;
        let uniqueId = getUniqueId();


        let element = document.getElementById('influencerDetailFollowButton');
        element.style.animation = '';

        let params = {
            followeeId: followeeId,
            uniqueId: uniqueId
        }

        fetch(RestApi.user.unfollow, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    this.setState({isFollowing: false})
                }
            })
    }


    renderScrollContents = () => {

        if(typeof this.state.detail !== 'undefined'){




            let images = this.state.detail.feedImages;

            let contentCount = images.length

            let rows = [];

            images.forEach((image) => {

                if(image.endsWith('mp4')){
                    let card = <div key={image} className={`feedDetailImage ${contentCount === 1 ? "imageCenterAlignment" : ""}`}>
                        <video webkit-playsInline playsInline muted autoPlay loop width="320" height="240" controls><source src={RestApi.feedImage + image} type="video/mp4"/> </video>
                    </div>

                    rows.push(card)
                }else{
                    let card = <div  key={image} className={`feedDetailImage ${contentCount === 1 ? "imageCenterAlignment" : ""}`}>
                        <img src={RestApi.feedImage + image}/>
                    </div>
                    rows.push(card)
                }


            })





            return rows;

        }

    }

    like = () => {

        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }



        //let feedId = this.props.location.state.feedId;
        let feedId = this.feedId;
        let uniqueId = getUniqueId();
        let element = document.getElementById('influencerDetailLikeButton');
        element.style.animation = "bounce 0.3s 1";

        let params = {
            feedId: feedId,
            uniqueId: uniqueId
        }

        fetch(RestApi.feed.like, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                //console.log(res)
                return res.json()
            })
            .then(json => {
                this.setState({likeCount: json.count, isLiked: true})
            })
    };

    unlike = () => {
        //let feedId = this.props.location.state.feedId;
        let feedId = this.feedId;
        let uniqueId = getUniqueId();
        let element = document.getElementById('influencerDetailLikeButton');
        element.style.animation = "";
        let params = {
            feedId: feedId,
            uniqueId: uniqueId
        }

        fetch(RestApi.feed.unlike, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                //console.log(res)
                return res.json()
            })
            .then(json => {
                this.setState({likeCount: json.count, isLiked: false})
            })
    };

    isLiked = () => {
        //let feedId = this.props.location.state.feedId;
        let feedId = this.feedId;
        let uniqueId = getUniqueId();

        let params = {
            feedId: feedId,
            uniqueId: uniqueId
        }

        fetch(RestApi.feed.isLiked + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                this.setState({isLiked: json.isLiked})
            })
    }

    save = () => {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }


        let element = document.getElementById('saveButtonID');
        element.style.animation = ""

        //let feedId = this.props.location.state.feedId;
        let feedId = this.feedId;
        let uniqueId = getUniqueId();

        let params = {
            feedId: feedId,
            uniqueId: uniqueId
        }

        fetch(RestApi.feed.save, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {

                void element.offsetWidth;

                element.style.animation = "bounce 0.3s 1";

                element.addEventListener('animationend', () => {
                    // Do anything here like remove the node when animation completes or something else!
                    element.style.animation = ""


                });


                if(res.status === 200){
                    this.setState({isSaved: true})
                }
            })
            .catch(err => {
                console.error(err);
            })

    };

    unsave = () => {
        //let feedId = this.props.location.state.feedId;
        let feedId = this.feedId;
        let uniqueId = getUniqueId();

        let element = document.getElementById('saveButtonID');
        element.style.animation = ""

        let params = {
            feedId: feedId,
            uniqueId: uniqueId
        }

        fetch(RestApi.feed.unsave, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                //console.log(res);

                void element.offsetWidth;

                element.style.animation = "bounce 0.3s 1";

                element.addEventListener('animationend', () => {
                    // Do anything here like remove the node when animation completes or something else!
                    element.style.animation = ""


                });

                if(res.status === 200){
                    this.setState({isSaved: false})
                }

            })
            .catch(err => {
                console.error(err);
            })

    }


    isSaved = () => {
        //let feedId = this.props.location.state.feedId;
        let feedId = this.feedId;
        let uniqueId = getUniqueId();

        let params = {
            feedId: feedId,
            uniqueId: uniqueId
        }

        fetch(RestApi.feed.isSaved + '?' + queryString(params))
            .then(res => {

                return res.json()
            })
            .then(json => {
                //console.log('isSaved', params, json)

                this.setState({isSaved: json.isSaved})
            })
            .catch(err => {
                console.error(err);
            })
    }

    commentBoxUpdate = (e) => {

        if(getUniqueId() === undefined || getUniqueId() === null){


            return
        }

        let comment = e.target.value;



        this.setState({commentMessage: comment})
    };

    commentBoxClick = () => {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }
    }

    postClicked = () => {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }

        let comment = '';

        if(this.state.commentMessage === undefined){
            comment = '';
        }else{
            comment = this.state.commentMessage.trim();
        }



        if(comment.length === 0){
            alert('댓글을 작성해 주세요.');
            return

        }

        let params = {
            uniqueId: getUniqueId(),
            //feedId:  this.props.location.state.feedId,
            feedId: this.feedId,
            comment: this.state.commentMessage,
            skip: 0
        }

        this.props.addComment(params);

        this.setState({commentMessage: ""})
    };

    profileClicked = () => {


        let path = '/UserProfile'

        this.props.history.push({
            pathname: path,
            search: '?uid=' + this.state.detail.uniqueId,
            state: {
                uniqueId: this.state.detail.uniqueId
            }
        })

    }


    setSaleStatus = (pramBeginNumber, pramEndNumber) => {

        let startDate = new Date(pramBeginNumber);
        let endDate = new Date(pramEndNumber);

        let saleStatusText;
        let saleStatusNumber;

        let currDate = new Date();
        let currentTime = currDate.getTime();

        let startTime = startDate.getTime();
        let endTime = endDate.getTime();


        if (currentTime < startTime && currentTime < endTime) {
            saleStatusText = "판매 예정";
            saleStatusNumber = 0
        } else if (currentTime > startTime && currentTime < endTime) {
            saleStatusText = "현재 판매중";
            saleStatusNumber = 1
        } else if (currentTime > endTime && currentTime > startTime) {
            saleStatusText = "판매 완료";
            saleStatusNumber = 2
        }


        this.setState({
            saleStatusText: saleStatusText,
            saleStatus: saleStatusNumber,
        })
    }


    commentButtonClick = () => {
        document.getElementById('commentBoxID').scrollIntoView()
    }

    renderPrice = (productId) => {


        if( this.state.detail !== undefined ){
            let detail = this.state.detail;

            let product = detail.products.filter(x => x.productId === productId)

            if(product.length > 0){


                let currency = "₩";
                if (product[0].currency === "KRW") {
                    currency = "₩"
                }

                if(product[0].discountRate !== null){
                    return <div className="feedDetailPriceContainer">{product[0].discountRate}% off, {currency}{(product[0].price * (1 - product[0].discountRate / 100)).toLocaleString()}</div>
                }else{
                    return <div className="feedDetailPriceContainer">{product[0].currency}{product[0].price.toLocaleString()}</div>
                }
            }


        }else{
            return []
        }
    }

    renderProductImage = (productId) => {

        let product = this.state.detail.productImages.filter(x => x.productId === productId);

        if(product.length > 0){

            //console.log(product[0])

            return RestApi.prod + product[0].image
        }else{
            return 'placeholder'
        }
    };


    renderSaveButton = () => {


        if(this.state.isSaved){
            return require("./image/saveFilled.png");
        }else{
            return require("./image/homeSocialSave.png");
        }
    };

    renderAdditionalContents = () => {

        if(this.state.detail !== undefined){
            let rows = [];

            if(this.state.detail.additionalContents !== undefined && this.state.detail.additionalContents !== null){

                this.state.detail.additionalContents.forEach((content, index) => {

                    if(content.type === FEED_ADDITIONAL_CONTENTS_TYPE.IMAGE ){


                        if(content.filename.endsWith('.mp4')){
                            let card = <div key={index} className="feedDetailAdditionalImage">

                                <video controls muted autoPlay>
                                    <source src={RestApi.feedImage + content.filename} type="video/mp4"/>
                                </video>

                            </div>;

                            rows.push(card)
                        }else{
                            let card = <div  key={index} className="feedDetailAdditionalImage">
                                <img src={RestApi.feedImage + content.filename}/>
                            </div>
                            rows.push(card)
                        }
                    }else if(content.type === FEED_ADDITIONAL_CONTENTS_TYPE.SUBTITLE){
                        let row = <h2 key={index} className="feedDetailSubtitle">{content.content}</h2>
                        rows.push(row)
                    }else if(content.type === FEED_ADDITIONAL_CONTENTS_TYPE.DESCRIPTION){
                        let row = <div key={index} className="feedDetailMessage">
                            <p className="feedDetailMessage">
                                {content.content}
                            </p>
                        </div>
                        rows.push(row)
                    }else if(content.type === FEED_ADDITIONAL_CONTENTS_TYPE.URL){
                        let url = content.content
                        let row = {};

                        if(!url.startsWith('http')){

                            if(url.startsWith('<iframe')){




                                let iframeInsert = (iframe) => {
                                    return{
                                        __html: iframe
                                    }
                                }

                                row = <div className={"influencerFeedAdditionalContent"} dangerouslySetInnerHTML={ iframeInsert(url) }/>

                            }else{
                                url = 'http://' + content.content

                                row = <a key={index}  href={url} target="_blank">{content.content}</a>
                            }


                        }else{
                            row = <a key={index}  href={url} target="_blank">{content.content}</a>
                        }




                        rows.push(row)
                    }
                })
            }

            //console.log(rows)
            return rows

        }


    }

    iframeInserter = (iframe) => {

        return{
            __html: this.state.detail.description.substring(iframe.start, iframe.end + 9)
        }
    }


    renderFeedContent = () => {



        if(typeof this.state.detail !== 'undefined'){
            let detail = this.state.detail;

            let timeLine;

            if(detail.startDate !== null && detail.endDate !== null){
                let beginTimeNumber = getDateString(detail.startDate);
                let endTimeNumber = getDateString(detail.endDate);

                let beginTime = getBeginTimeText("begin", beginTimeNumber);
                let endTime = getBeginTimeText('end', endTimeNumber);

                timeLine = <div className={"periodContainer"}>
                    <div className={"periodText"}>{this.state.saleStatusText}</div>
                    <div className={"periodWrapper"}>
                        <div>{beginTime}</div>
                        <div className={"spaceBetween"}>~</div>
                        <div>{endTime}</div>
                    </div>
                </div>
            }

            let likeButtonSrc;

            if(this.state.isLiked){
                likeButtonSrc = require('./image/socialLikeIconRed.png')
            }else{
                likeButtonSrc = require("./image/homeSocialHeartIcon.png")
            }



            let iframes = []

            let iframeIndex = this.state.detail.description.indexOf('<iframe');
            let closingIframeIndex = this.state.detail.description.indexOf('</iframe');


            if(iframeIndex > -1){
                let obj = {
                    start: iframeIndex,
                    end: 0
                }

                iframes.push(obj)
            }


            while(iframeIndex > -1){

                iframeIndex = this.state.detail.description.indexOf('<iframe', iframeIndex + 1);


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
                closingIframeIndex = this.state.detail.description.indexOf('</iframe', closingIframeIndex + 1)

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
                        desc = <p>{this.state.detail.description.substring(iframes[index -1].end + 10, iframes[index].start - 1)}</p>
                    }
                }else{
                    if(iframes[index].start > 0){
                        desc = <p>{this.state.detail.description.substring(0, iframes[index].start - 1)}</p>
                    }

                }

                rows.push(desc)

                let htmlString = this.iframeInserter(iframes[index])

                let style = {
                    'text-align': 'center'
                }

                let row = <div style={style}>
                    <div dangerouslySetInnerHTML={htmlString}/>
                </div>;

                rows.push(row)
            }




            if(rows.length === 0){
                let description = this.state.detail.description;



                let row = <p key={0}>{description}</p>;


                rows.push(row)

            }

            let productLink;
            if (detail.products.length > 0) {
                productLink = <div>
                    <div className={"productLinkTitle"}>상품 링크</div>
                    <div className={"productLinkUnderLine"}/>
                    {
                        detail.products.map((product, index) => {
                            return (
                                <div key={index} className="feedDetailProductContainer" onClick={() => this.pushToProductDetailView(product.productId)}>
                                    <div className="feedDetailProductImage"><img src={this.renderProductImage(product.productId)}/></div>
                                    <div className="feedDetailProductInfo">
                                        <div className="feedDetailProductName">{product.title}</div>
                                        {this.renderPrice(product.productId)}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }

            let content =
                <main>
                    <div className="feedDetailTitle">{this.state.detail.title}</div>
                    <div className="feedDetailSubtitle">{this.state.detail.subtitle}</div>
                    {timeLine}
                    <div className="feedDetailProfileContainer">

                        <div className="feedDetailProfileImage" onClick={this.profileClicked}><ProfileImage uniqueId={this.state.detail.uniqueId} /></div>
                        <div className="feedDetailProfileName" ><a onClick={this.profileClicked}>{this.state.detail.user.userId}</a></div>
                        <div className="feedDetailFollowButton" id={'influencerDetailFollowButton'}>{(this.state.detail.uniqueId !== getUniqueId()) ? (this.state.isFollowing ? '' : <a onClick={this.follow}>follow</a>) : '' }</div>
                    </div>
                    <div className="feedDetailMessage">
                        {/*{this.state.detail.description}*/}
                        {rows}
                    </div>
                    {this.renderAdditionalContents()}

                    {productLink}

                    {this.renderHashTags(detail.hashTags)}
                    <div className="socialFunctionContainer feedDetailSocialContainer">
                        <div className="socialButton feedDetailSocialButton"><img id={'influencerDetailLikeButton'} src={likeButtonSrc} onClick={this.state.isLiked ? this.unlike : this.like}/><a>{this.state.likeCount}</a></div>
                        <div className="socialButton commentButton feedDetailSocialButton"><img onClick={() => this.commentButtonClick()} src={CommentButton}/><a>{(typeof this.props.commentCount === 'undefined') ? this.state.commentCount : this.props.commentCount}</a></div>
                        <div className="feedSaveButton socialButton feedDetailSocialButton"><img src={this.renderSaveButton()} id={'saveButtonID'} onClick={this.state.isSaved? this.unsave : this.save}/></div>
                    </div>
                    <div className="commentWrapper">
                        <div className={"commentProfileImg"}><ProfileImage uniqueId={getUniqueId()}/></div>
                        <div className={"commentBox"} id={"commentBoxID"} ref={this.commentBoxRef}>
                            <TextareaAutosize
                                className={"commentBoxInput"}
                                onClick={() => this.commentBoxClick()}
                                onChange={(e) => this.commentBoxUpdate(e)}
                                value={this.state.commentMessage}
                                placeholder={"댓글을 작성해 주세요"}
                            />
                            <div className={"postComment"} onClick={() => this.postClicked()}>post</div>
                        </div>
                    </div>
                    <FeedCommentList key={detail.feedId} feedId={detail.feedId}/>
                </main>



            return content;
        }

    }

    renderHashTags(tags) {

        let tagRow = []

        tags.forEach((i) => {
            const tag = <div key={i} className="feedDetailHashTag" onClick={() => this.hashTagPressed(i)}><a>#{i}</a></div>
            tagRow.push(tag)
        })

        return (
            <div className="feedDetailHashTagContainer">
                {tagRow}
            </div>
        );

    }

    hashTagPressed(tag) {
        //console.log(tag)
    }

    pushToProductDetailView = (productId) => {

        if (this.state.saleStatusText === "현재 판매중") {

            let path = '/ProductDetailView'

            this.props.history.push({
                pathname: path,
                state: {
                    productId: productId,
                    //feedId: this.props.location.state.feedId,
                    feedId: this.feedId,
                    feedType: this.state.detail.feedType
                }
            })

        } else {
            alert("공구 판매 기간이 아닙니다.")
        }

    };

    toggleLoginPage = () => {
        const element = document.getElementById('logInPage');

        element.classList.toggle('searchViewClose')
    }

    moveScroll = () => {
        let slider = document.querySelector('.feedImageScrollWrapper');

        if(slider === null){
            slider = document.querySelector('.feedSingleImageWrapper');
        }

        let isDown = false;
        let startX;
        let scrollLeft;



        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
            this.setScrollDotToIndex()
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
            this.setScrollDotToIndex()
        });
        slider.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            slider.scrollLeft = scrollLeft - walk;
        });
    };

    setScrollDotToIndex = () => {

        if (this.state.detail.feedImages.length > 1) {

            let elements = document.getElementsByClassName("feedDetailImage")

            let windowWidth = window.innerWidth + 5

            for (var i = 0; i<elements.length; i++) {
                let element = elements[i]

                let elementX = element.getBoundingClientRect().x
                let elementXEnd = elementX + element.offsetWidth

                let dotElement = document.getElementsByClassName("scrollDot")

                if (-5 <= elementX && elementXEnd <= windowWidth) {
                    dotElement[i].classList.add("srollDotFilled")
                } else {
                    dotElement[i].classList.remove("srollDotFilled")
                }
            }

        }

    }

    renderSimilarFeeds = () => {
        let rows = []

        this.props.similarFeeds.forEach((feed, index) => {



            const row = <SimilarFeed key={index} feed={feed.feed} product={feed.product}/>;

            if(feed.feedId !== this.feedId){
                rows.push(row);
            }

        })

        return rows
    };

    renderScrollDots = () => {

        let dots;
        if (this.state.detail.feedImages.length > 1) {
            dots = <div className={"scrollDotWrapper"}>
                {
                    this.state.detail.feedImages.map((i, index) => {
                        let dot;
                        if (index === 0) {
                            dot = <div className={`scrollDot srollDotFilled`}></div>
                        } else {
                            dot = <div className={`scrollDot`}></div>
                        }

                        return dot
                    })
                }
            </div>
        }

        return dots
    }

    onBodyLoad = () => {

        let elem = document.getElementById('commentBoxID');

        if(this.scrollToCommentBox){


            if(elem){
                document.getElementById('commentBoxID').scrollIntoView({block: "end"})
                this.scrollToCommentBox = false
            }


        }

    }

    render() {

        if(this.state.detail === undefined){
            return []
        }


        if(this.state.detail.feedImages.length < 3){

            return (
                <div onLoad={this.onBodyLoad()}>
                    <div className={"feedDetailBody"}>
                        <div className="feedSingleImageWrapper"
                            // ref={node => this.feedDetailImageScrollWrapperRef = node}
                             onMouseDown={this.moveScroll}
                             onMouseLeave={this.moveScroll}
                             onMouseUp={this.moveScroll}
                             onMouseMove={this.moveScroll}
                             onScroll={this.setScrollDotToIndex}
                        >
                            {this.renderScrollContents()}
                        </div>
                        {this.renderScrollDots()}
                        {this.renderFeedContent()}

                    </div>

                    <div style={{display: `${this.props.similarFeeds.length === 0 ? "none" : "block"}`}}>
                        <div className="similarFeedWrapper"><a>for you</a></div>

                        <div className="outerScrollWrap">
                            <div className={"similarCardWrapper"}>
                                {this.renderSimilarFeeds()}
                            </div>
                        </div>
                    </div>

                    <div id="logInPage" className="searchViewBackGround" ref={this.logInRef}>
                        <div className="searchBarWrapper">
                            <div className="searchCloseButton" ><a onClick={() => this.toggleLoginPage()}>close X</a></div>
                        </div>

                        <LogInPage  toggleLogInView={() => this.toggleLoginPage()} redirectUrl={'/InfluencerFeedDetail'} />
                    </div>
                </div>
            );
        }
        else
        {

            return (
                <div>
                    <div className={"feedDetailBody"}>
                        <div className="feedImageScrollWrapper"
                            // ref={node => this.feedDetailImageScrollWrapperRef = node}
                             onMouseDown={this.moveScroll}
                             onMouseLeave={this.moveScroll}
                             onMouseUp={this.moveScroll}
                             onMouseMove={this.moveScroll}
                             onScroll={this.setScrollDotToIndex}
                        >
                            {this.renderScrollContents()}
                        </div>
                        {this.renderScrollDots()}

                        {this.renderFeedContent()}

                    </div>

                    <div style={{display: `${this.props.similarFeeds.length === 0 ? "none" : "block"}`}}>
                        <div className="similarFeedWrapper"><a>for you</a></div>

                        <div className="outerScrollWrap">
                            <div className={"similarCardWrapper"}>
                                {this.renderSimilarFeeds()}
                            </div>
                        </div>
                    </div>

                    <div id="logInPage" className="searchViewBackGround" ref={this.logInRef}>
                        <div className="searchBarWrapper">
                            <div className="searchCloseButton" ><a onClick={() => this.toggleLoginPage()}>close X</a></div>
                        </div>

                        <LogInPage  toggleLogInView={() => this.toggleLoginPage()} redirectUrl={'/InfluencerFeedDetail'} />
                    </div>
                </div>
            );
        }



    }
}

let mapStateToProps = (state) => {



    return {
        commentCount: state.stella.commentCount,
        similarFeeds: state.feed.similarFeeds
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        addComment: (params) => dispatch(addComment(params)),
        getSimilarFeeds: (params) => dispatch(getSimilarFeed(params))
    }
};

InfluencerFeedDetail = connect(mapStateToProps, mapDispatchToProps)(InfluencerFeedDetail);

export default withRouter(InfluencerFeedDetail);