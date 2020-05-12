import React, { createRef, Component } from 'react';
import { withRouter} from "react-router-dom";

import "./js/components/ProductDetail.css";
import "./js/components/FeedDetail.css";

import CommentButton from "./image/homeSocialComment.png";
import fetch from 'cross-fetch'
import {FEED_TYPE, getUniqueId, queryString, RestApi} from "./util/Constants";
import TextareaAutosize from 'react-autosize-textarea';
import ProductCommentList from "./ProductCommentList";
import {connect} from "react-redux";
import {addComment} from "./actions/product";
import LogInPage from "./LogInPage";

import AlertMessage from "./AlertMessage";
import YesOrNoAlert from "./YesOrNoAlert.js"
import {getSuggestedFeed} from "./actions/feed";

import ForYouFeed from "./ForYouFeed";

import ProfileImage from "./ProfileImage";
import {buyNow, hasPurchased} from "./actions/cart";
import Footer from "./Footer";

class ProductDetailView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: {title: 'No options available'},
            isFeedLiked: false,
            isFeedSaved: false,
            isFollowingFeedOwner: false,
            selectedOptionWithCount: null,
            orderCount: 1,

            productPrice: 0,
            hoverBasket: false,
            isProductDetailImageViewOpen: false,
            isProductFormLoaded: false
        };


        this.optionButtonPressed = this.optionButtonPressed.bind(this)
        this.optionSelected = this.optionSelected.bind(this)
        this.openProductImage = this.openProductImage.bind(this)
        this.productDescriptionViewMorePressed = this.productDescriptionViewMorePressed.bind(this)
        this.orderCountInput = this.orderCountInput.bind(this)

        this.hoverBasket = this.hoverBasket.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.moveToBasket = this.moveToBasket.bind(this)
        this.changeCount = this.changeCount.bind(this)


        console.log(this.props);

        if(this.props.location.state === undefined){



            this.feedId = localStorage.getItem('forwardFeedId')
            localStorage.removeItem('forwardFeedId')

            let params = new URLSearchParams(this.props.location.search);

            let feedId = params.get('fid');
            let feedType = params.get('ft');

            let refresh = params.get('r');
            console.log(feedId, feedType, refresh);

            this.feedId = feedId;

            if(feedType === 'jp'){
                this.feedType = FEED_TYPE.JOINT_PURCHASE;
            }else{
                this.feedType = FEED_TYPE.PROMOTION;
            }

            this.refresh = false;

            this.getDetail()
        }else{

            let params = {
                feedId: this.props.location.state.feedId,
                uniqueId: getUniqueId()
            };

            this.feedId = this.props.location.state.feedId;
            this.feedType = this.props.location.state.feedType;
            this.scrollToCommentBox = this.props.location.state.scrollToCommentBox;

            this.refresh = true

            this.props.getSuggestedFeed(params);

            this.getDetail()
        }


        this.productFormRef = createRef()


    }

    componentDidMount = () => {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.scrollToCommentBox){
            document.getElementById('productCommentBoxID').scrollIntoView()
            this.scrollToCommentBox = false
        }


        if(this.productFormRef.current !== null){
            console.log(this.props.location.search.r)
            if(this.refresh){

                this.productFormRef.current.submit()

            }else{


            }
        }

        console.log(this.productFormRef)

    }

    getDetail = () => {

        let params = {
            feedId: this.feedId
        };


        fetch(RestApi.product.getDetail + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {


                if(Object.keys(json.feed).length === 0) {
                    alert('존재하지 않는 피드 입니다.');
                    window.history.back();
                    return;
                }

                this.setState({detail: json, productPrice: json.product.price}, () => {
                    this.optionSelected()
                    this.getLikeCount();
                    this.getCommentCount();
                    this.isFeedLiked();
                    this.isFeedSaved();
                    this.isFollowingFeedOwner()

                    let parameters = {
                        uniqueId: getUniqueId(),
                        productId: json.product.productId
                    };

                    this.props.hasPurchased(parameters)
                })
            })
    };

    isFollowingFeedOwner = () => {
        let params = {
            uniqueId: getUniqueId(),
            followeeId: this.state.detail.user.uniqueId
        }

        fetch(RestApi.user.isFollowing + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                this.setState({isFollowingFeedOwner: json.isFollowing})
            })
    };

    isFeedLiked = () => {
        let params = {
            feedId: this.feedId,
            uniqueId: getUniqueId()
        }

        fetch(RestApi.feed.isLiked + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                this.setState({isFeedLiked: json.isLiked})
            })
    };

    isFeedSaved = () => {
        let params = {
            feedId: this.feedId,
            uniqueId: getUniqueId()
        }

        fetch(RestApi.feed.isSaved + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                this.setState({isFeedSaved: json.isSaved})
            })
    };

    renderLikeButton = () => {

        if(this.state.isFeedLiked){

            return require('./image/socialLikeIconRed.png')
        }else{
            return require("./image/homeSocialHeartIcon.png")
        }
    };

    renderSaveButton = () => {
        if(this.state.isFeedSaved){
            return require('./image/saveFilled.png')
        }else{
            return require("./image/homeSocialSave.png")
        }
    }

    handleLikeClick = () => {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }
        }


        let element = document.getElementById('likeButtonID');

        let params = {
            feedId: this.feedId,
            uniqueId: getUniqueId()
        }

        if(this.state.isFeedLiked){
            void element.offsetWidth;

            element.style.animation = "bounce 0.3s 1";

            fetch(RestApi.feed.unlike,  {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
                .then(res => {
                    if(res.status === 200){
                        this.setState({isFeedLiked: false})
                    }

                    return res.json()
                })
                .then(json => {
                    this.setState({likeCount: json.count})
                });


        }else{
            void element.offsetWidth;

            element.style.animation = "bounce 0.3s 1";

            fetch(RestApi.feed.like,  {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
                .then(res => {
                    if(res.status === 200){
                        this.setState({isFeedLiked: true})
                    }

                    return res.json()
                })
                .then(json => {
                    this.setState({likeCount: json.count})
                });

        }

        element.addEventListener('animationend', () => {
            // Do anything here like remove the node when animation completes or something else!
            element.style.animation = ""


        });
    };

    handleSaveClick = () => {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }
        }



        let element = document.getElementById('saveButtonID');

        let params = {
            feedId: this.feedId,
            uniqueId: getUniqueId()
        }


        if(this.state.isFeedSaved){
            void element.offsetWidth;

            element.style.animation = "bounce 0.3s 1";

            fetch(RestApi.feed.unsave, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            } )
                .then(res => {
                    if(res.status === 200){
                        this.setState({isFeedSaved: false})
                    }
                })

        }else{
            void element.offsetWidth;

            element.style.animation = "bounce 0.3s 1";

            fetch(RestApi.feed.save, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            } )
                .then(res => {
                    if(res.status === 200){
                        this.setState({isFeedSaved: true})
                    }
                })

        }

        element.addEventListener('animationend', () => {
            // Do anything here like remove the node when animation completes or something else!
            element.style.animation = ""


        });
    };



    getLikeCount = () => {
        let feedId = this.feedId

        let params = {
            feedId: feedId
        }

        fetch(RestApi.feed.getLikeCount + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                this.setState({likeCount:json.count})
            })
    }

    getCommentCount = () => {
        let feedId = this.feedId

        let params = {
            feedId: feedId
        }

        fetch(RestApi.feed.getCommentCount + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                this.setState({commentCount:json.count})
            })
    }

    optionButtonPressed() {

        const optionButton = document.getElementById("optionButtonToggle")
        optionButton.classList.toggle('optionOpen')
    }

    optionSelected(optionId) {

        if(typeof optionId === 'undefined'){
            if(typeof this.state.detail !== 'undefined'){

                if(this.state.detail.options.length > 0){
                    this.setState({selectedOption: this.state.detail.options[0]})
                }else{
                    this.setState({selectedOption: {title: '추가 옵션이 없습니다.'}})
                }

            }else{
                this.setState({selectedOption: {title: '추가 옵션이 없습니다.'}})
            }
        }else{
            if(typeof this.state.detail !== 'undefined'){
                let filteredArr = this.state.detail.options.filter(x => x._id === optionId)

                if(filteredArr.length > 0){
                    let selOption = filteredArr[0];

                    //this.state.detail.product.price

                    this.setState({
                        selectedOption: selOption,
                        selectedOptionWithCount: selOption,
                        productPrice: parseInt(this.state.detail.product.price) + parseInt(selOption.priceAddition)
                    })
                }
            }else{
                this.setState({selectedOption: {title: '추가 옵션이 없습니다.'}})
            }

            this.optionButtonPressed();
        }


    }

    hoverBasket(val) {
        this.setState({hoverBasket: val})
    }

    orderCountInput (e) {
        this.setState({
            orderCount: e.target.value
        })
    }

    closeAlert() {
        this.setState({
            alertMessage: ""
        })
    }

    moveToBasket() {
        this.closeAlert()

        let path = "/Basket";

        this.props.history.push({
            pathname: path,
            state: {

            }
        })

    }

    addToCart = (isBuynow) => {
        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }

        let element;
        if (!isBuynow) {
            element = document.getElementById("basketButtonID")
        } else {
            element = document.getElementById("buyNowButtonID")
        }

        element.style.animation = ""

        void element.offsetWidth

        element.style.animation = "buttonPressedDown 0.3s 1"


        let params = {
            uniqueId: getUniqueId(),
            productId: this.state.detail.product.productId,
            optionId: this.state.selectedOption._id,
            orderQuantity: this.state.orderCount,
            purchaseType: this.feedType,
            influencerUniqueId: this.state.detail.user.uniqueId
        }

        if (this.state.detail.options.length > 0 && this.state.selectedOptionWithCount === null ) {
            this.setState({
                alertMessage: <AlertMessage messages={["옵션을 선택해 주세요"]} closeAlert={this.closeAlert}/>
            })
        } else {

            if (!isBuynow) {

                fetch(RestApi.cart.add, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(params)
                })


                    .then(res => {
                        if(res.status === 200){


                            this.setState({
                                alertMessage: <YesOrNoAlert
                                    alertTitle={"성공적으로 장바구니에 담았습니다."}
                                    messages={["장바구니로 이동 하시겠습니까?"]}
                                    yes={this.moveToBasket}
                                    no={this.closeAlert}
                                />
                            })
                    }else{
                        alert('장바구니에 담는 중 오류가 발생하였습니다. 다시 시도해 주세요.')
                        }
                    })

            } else {




                this.props.buyNow(params, (data) => {
                    let path = "/Order";

                    let item = {
                        cartId: data.cartId,
                        option: this.state.selectedOption,
                        product: this.state.detail.product,
                        productImages: this.state.detail.product.images,
                        orderQuantity: this.state.orderCount,
                        seller: data.seller.seller
                    }

                    this.props.history.push({
                        pathname: path,
                        state: {
                            orderList: [item]
                        }
                    })
                });


            }
        }
    }



    handleFeedClick() {
        this.props.history.push({
            pathname: '/InfluencerFeedDetail',
            search: '?fid=' + this.state.detail.feed.feedId,
            state: {
                feedId: this.state.detail.feed.feedId
            }
        })
    }

    renderHashTag() {
        //console.log(this.state.detail)


        let rows = [];

        this.state.detail.feed.hashTags.forEach((hashTag) => {

            const tag = <div key={hashTag} className="cardHashTagDiv">
                <a>#{hashTag}</a>
            </div>;

            rows.push(tag)
        });


        return rows;
    }

    renderFollowButton() {

        if(!this.state.isFollowingFeedOwner){

            if(this.state.detail.user.uniqueId !== getUniqueId()){
                return <div className="followButton" id={'followButtonID'} onClick={this.handleFollowButtonClick}><a>follow</a></div>;
            }

        }else{

        }


    }

    handleFollowButtonClick = () => {
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
        let params = {
            uniqueId: getUniqueId(),
            followeeId:  this.state.detail.user.uniqueId
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
                    this.setState({isFollowingFeedOwner: true})
                }
            })
    }


    productDescriptionViewMorePressed() {
        const button = document.getElementById('viewMoreButtonID')
        button.classList.toggle('hideViewMoreButton')
    }

    openProductImage() {

        this.setState({

            isProductDetailImageViewOpen: !this.state.isProductDetailImageViewOpen

        })

    }

    commentBoxUpdate = (e) => {
        if(getUniqueId() === undefined || getUniqueId() === null){

            return
        }

        if(!this.props.purchased){
            window.confirm('제품 후기는 제품 구매 후 작성 가능합니다.');



            this.setState({commentMessage: ''});


        }else{
            let comment = e.target.value;

            this.setState({commentMessage: comment})
        }


    }

    commentBoxClick = () => {
        console.log('click')

        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }

            return
        }

        if(!this.props.purchased){
            window.confirm('제품 후기는 제품 구매 후 작성 가능합니다.');

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


        if(this.state.commentMessage === undefined){
            return;
        }

        let params = {
            uniqueId: getUniqueId(),
            productId: this.state.detail.product.productId,
            comment: this.state.commentMessage.trim(),
            feedId: this.feedId
        }

        this.props.addComment(params)
        this.setState({commentMessage: ""})

    };

    renderProductImage = () => {
        let imageContainer = []

        if(typeof this.state.detail !== 'undefined'){



            this.state.detail.product.images.forEach(filename => {


                let image =  <div key={filename} className="productImage">
                    <img src={RestApi.prod + filename}/>
                </div>;

                imageContainer.push(image)
            })
        }

        return imageContainer
    }

    renderOption = () => {
        let options = [];

        if(typeof this.state.detail !== 'undefined'){
            this.state.detail.options.forEach(option => {
                let optionPrice = Number(option.priceAddition)
                let tag = <div key={option._id} className="optionListItem" onClick={() => this.optionSelected(option._id)}>
                    <div>{option.title}</div>
                    <div>+ ₩{optionPrice.toLocaleString()}</div>
                </div>

                options.push(tag)
            })
        }

        return options
    }

    profileClick = () => {
        let path = '/UserProfile';


        this.props.history.push({
            pathname: path,
            search: '?uid=' + this.state.detail.user.uniqueId,
            state: {
                uniqueId: this.state.detail.user.uniqueId
            }
        })
    };

    toggleLoginPage = () => {
        const element = document.getElementById('logInPage');

        element.classList.toggle('searchViewClose')
    };

    renderForYouFeeds = () => {
        let rows = []

        this.props.forYouFeeds.forEach((feed, index) => {
            const row = <ForYouFeed key={feed.feedId} feed={feed}
                                         onClickHeart={() => this.handleHeartClicked(feed.feedId)}
                                         onClickComment={() => this.handleCommentClicked(feed.feedId)}
                                         onClickSave={() => this.handleSaveClicked(feed.feedId)}
            />;
            rows.push(row);
        })

        return rows
    }

    
    changeCount(arrow) {
        let count = this.state.orderCount

        if (arrow === "up") {


            count += 1
            this.setState({
                orderCount: count
            })

        } else {

            count -= 1
            if (count < 1) {
                return
            } else {
                this.setState({
                    orderCount: count
                })

            }

        }
    }
    
    renderProductDetailImage = () => {
        let rows = []
        this.state.detail.product.descriptionImages.forEach((image, index) => {


            let row =  <div key={index} className="productDescriptionImage">
                <img src={RestApi.prodDesc + image}/>
            </div>;
            rows.push(row)
        })

        return rows;
    }

    renderViewMore = () => {
        if(this.state.detail.product.descriptionImages.length > 1) {
            // return (
            //     {/*<div id="viewMoreButtonID" className="viewImageMoreButton" onClick={this.openProductImage}>*/}
            //     {/*    <div><a>더 보기</a></div>*/}
            //     {/*    <div><img src={require("./image/arrowDown.png")}/></div>*/}
            //     {/*</div>*/}
            //
            //
            // )

            return (

                <div id="viewMoreButtonID" className="viewImageMoreButton" >
                    <div><a>더 보기</a></div>
                    <div><img src={require("./image/arrowDown.png")}/></div>
                </div>
            )
        }
    }

    moveScroll = () => {

        let slider = document.querySelector('.productImageScrollWrapper');

        if(slider === null){

            slider = document.querySelector('.productSingleImageScrollWrapper');
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
        });
        slider.addEventListener('mouseup', () => {


            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', (e) => {


            if(!isDown) {
                return;
            }
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast


            slider.scrollLeft = scrollLeft - walk;

        });

    }

    moveForYouScroll = () => {
        const slider = document.querySelector('.forYouCardWrapper');

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
        });
        slider.addEventListener('mouseup', () => {


            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', (e) => {


            if(!isDown) {
                return;
            }
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast


            slider.scrollLeft = scrollLeft - walk;

        });
    }

    renderFeedCoverImage = () => {
        if(this.state.detail.feed.image.length > 0 ){
            if(this.state.detail.feed.image[0].endsWith('.mp4')){
                return(
                    <video controls={false} width="320" height="240" muted autoPlay>
                        <source src={RestApi.feedImage + this.state.detail.feed.image[0]} type="video/mp4"/>
                    </video>
                )
            }else{
                return(
                    <img src={(this.state.detail.feed.image.length > 0) ? RestApi.feedImage + this.state.detail.feed.image[0] : 'placeholder'}/>
                )
            }
        }

        //
    }

    centerProductImages = () => {
        if(this.state.detail.product.images.length < 3) {
            return(
                <div className={"productSingleImageScrollWrapper"} onMouseDown={this.moveScroll} onMouseLeave={this.moveScroll} onMouseUp={this.moveScroll} onMouseMove={this.moveScroll}>
                    {this.renderProductImage()}
                </div>

            )
        } else {
            return (
                <div className={"productImageScrollWrapper"} onMouseDown={this.moveScroll} onMouseLeave={this.moveScroll} onMouseUp={this.moveScroll} onMouseMove={this.moveScroll}>
                    {this.renderProductImage()}
                </div>
            )
        }



    }

    iframeInserter = (iframe) => {


        return{
            __html: this.state.detail.feed.description.substring(iframe.start, iframe.end + 9)
        }
    }


    renderDescription = () => {
        let iframes = []

        let iframeIndex = this.state.detail.feed.description.indexOf('<iframe');
        let closingIframeIndex = this.state.detail.feed.description.indexOf('</iframe');


        if(iframeIndex > -1){
            let obj = {
                start: iframeIndex,
                end: 0
            }

            iframes.push(obj)
        }


        while(iframeIndex > -1){

            iframeIndex = this.state.detail.feed.description.indexOf('<iframe', iframeIndex + 1);


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
            closingIframeIndex = this.state.detail.feed.description.indexOf('</iframe', closingIframeIndex + 1)

            if(closingIframeIndex !== -1){
                iframes[index].end = closingIframeIndex

            }

            index++;
        }

        let rows = [];

        for(let index = 0; index < iframes.length; index++){

            let desc = ''

            if(index > 0){
                if(iframes[index].start > 0){
                    desc = <p>{this.state.detail.feed.description.substring(iframes[index -1].end + 10, iframes[index].start - 1)}</p>
                }
            }else{
                if(iframes[index].start > 0){
                    desc = <p>{this.state.detail.feed.description.substring(0, iframes[index].start - 1)}</p>
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




        return(
            <div>{rows}</div>
        )

    };


    getFeedType = () => {
        if(this.feedType === FEED_TYPE.JOINT_PURCHASE){
            return 'jp'
        }else{
            return 'pm'
        }
    };

    render() {

        if(typeof this.state.detail === 'undefined'){
            return []
        }



        let optionInput = <div className={"orderCountInput"}>
            <div>
                <input type={"number"} placeholder={1} value={this.state.orderCount} onChange={(e) => this.orderCountInput(e)}/>개
            </div>
            <div className={"upDownWrapper"}>
                <div className={"orderCount up"} onClick={() => this.changeCount("up")}><img src={require("./image/arrowDown.png")}/></div>
                <div className={"orderCount down"} onClick={() => this.changeCount("down")}><img src={require("./image/arrowDown.png")}/></div>
            </div>
        </div>;

        let currentOption;
        if (this.state.selectedOptionWithCount !== null) {
            currentOption = <div className={"optionWithOrderNumber"}>
                <div>{this.state.selectedOptionWithCount.title}</div>
                {optionInput}
            </div>
        }


        let orderCountInputForZeroOptionProduct;
        if (this.state.detail.options.length === 0) {
            orderCountInputForZeroOptionProduct = <div className={"optionWithOrderNumber"}>
                <div>주문 수량</div>
                {optionInput}
            </div>
        }

        return (
            <div className="productDetailBody" >

                {
                    this.centerProductImages()
                }


                <div className="feedDetailBody">

                </div>
                <div className="productInfoWrapper">
                    <div className="productName"><h3>{this.state.detail.product.title}</h3></div>
                    <div className="productName productSecondTitle"><p>{this.state.detail.product.subtitle}</p></div>
                    <div className="priceInfo"><p>{this.state.detail.product.currency} {(parseInt(this.state.productPrice) * (1 - parseInt(this.state.detail.product.discountRate) / 100)).toLocaleString()}</p></div>
                    <div className="options"><p>{this.state.detail.options.length} options</p></div>
                    <div className="optionButton" onClick={() => this.optionButtonPressed()}>
                        <div className="optionButtonText"><p>{this.state.selectedOption.title}</p></div>
                        <div className="optionButtonImage"><img src={require("./image/arrowDown.png")}/></div>
                    </div>

                    <div id="optionButtonToggle" className="purchaseOptionWrapper">

                        {this.renderOption()}

                    </div>

                    <div>
                        {currentOption}
                        {orderCountInputForZeroOptionProduct}
                    </div>

                    <div className="addToBagButton" onClick={() => this.addToCart(false)} id={"basketButtonID"}>
                        <div className="buttonContainer" onMouseOver={() => this.hoverBasket(true)} onMouseOut={() => this.hoverBasket(false)}>

                            <img
                                src={
                                    `${
                                        this.state.hoverBasket ? 
                                            require("./image/basketWhite.png") : 
                                            require("./image/basket.png")
                                    }`
                                }
                            />

                            <p>ADD TO BAG</p>

                        </div>
                    </div>

                    <div className="addToBagButton buyNow" onClick={() => this.addToCart(true)} id={"buyNowButtonID"}>
                            <div className={"buyNowText"}>바로결제</div>
                    </div>
                </div>

                {/*<div className="masonryCard masonryCardStyle centerInfluencerCard" id={1} >*/}
                <div className="centerInfluencerCard myShadowStyle" id={1} >
                    <div className="feedProfileContainer" >
                        <div className="feedProfileImage" onClick={() => this.profileClick()}>
                            <ProfileImage uniqueId={this.state.detail.user.uniqueId} />
                        </div>
                        <div className="feedUserName" onClick={() => this.profileClick()}>
                            <a>{this.state.detail.user.userId}</a>
                        </div>
                        {this.renderFollowButton()}

                    </div>
                    <div className="feedImage" onClick={() => this.handleFeedClick()}>{this.renderFeedCoverImage()}</div>
                    <div className="contentContainer">
                        <div className="feedTitle" onClick={() => this.handleFeedClick()}><h5>{this.state.detail.feed.title}</h5></div>
                        <div className="feedMessage" onClick={() => this.handleFeedClick()}>{this.renderDescription()}</div>
                        <div className="feedHashTagContainer">
                            <div className="hashTag" onClick={() => this.handleFeedClick()} >
                                {this.renderHashTag()}
                            </div>

                        </div>
                        <div className="socialFunctionContainer">
                            <div className="socialButton"><img id={'likeButtonID'} onClick={() => this.handleLikeClick()} src={this.renderLikeButton()}/><a>{this.state.likeCount}</a></div>
                            <div className="socialButton commentButton"><img src={CommentButton}/><a>{this.state.commentCount}</a></div>
                            <div className="feedSaveButton socialButton"><img id={'saveButtonID'} onClick={() => this.handleSaveClick()} src={this.renderSaveButton()}/></div>
                        </div>
                    </div>
                </div>




                <div id="productImageWrapper" className={`productDetailPageDescriptionImageWrapper ${this.state.isProductDetailImageViewOpen ? "openProductImage" : ""}`} onClick={this.openProductImage}>
                    {this.renderProductDetailImage()}
                </div>

                <div id="viewMoreButtonID" className="viewImageMoreButton" onClick={() => this.openProductImage()}>
                    <div className={`viewMoreButtonImage ${this.state.isProductDetailImageViewOpen ? "rotateViewMoreButton" : ""}`}><img src={require("./image/arrowDown.png")}/></div>
                    <div><a>{`${this.state.isProductDetailImageViewOpen ? "줄이기" : "더 보기"}`}</a></div>
                </div>


                <div className="commentWrapper">
                    <div className={"commentProfileImg"}>
                        <ProfileImage uniqueId={getUniqueId()} />
                    </div>
                    <div id={"productCommentBoxID"} className={"commentBox"}>
                        <TextareaAutosize
                            className={"commentBoxInput"}
                            onChange={(e) => this.commentBoxUpdate(e)}
                            onClick={() => this.commentBoxClick()}
                            value={this.state.commentMessage}
                            placeholder={"제품 후기를 작성해 주세요"}
                        />
                        <div className={"postComment"} onClick={this.postClicked}>post</div>
                    </div>
                </div>

                <ProductCommentList productId={this.state.detail.product.productId}/>

                <div style={{display: `${this.props.forYouFeeds.length === 0 ? "none" : "block"}`}}>
                    <div className="forYouWrapper"><a>for you</a></div>

                    <div className="outerScrollWrap">
                        <div className={"forYouCardWrapper"}>
                            {this.renderForYouFeeds()}
                        </div>
                    </div>
                </div>

                <Footer/>

                {this.state.alertMessage}

                <div id="logInPage" className="searchViewBackGround" ref={this.logInRef}>
                    <div className="searchBarWrapper">
                        <div className="searchCloseButton" ><a onClick={() => this.toggleLoginPage()}>close X</a></div>
                    </div>

                    <LogInPage  toggleLogInView={() => this.toggleLoginPage()} redirectUrl={'/ProductDetailView'}/>
                </div>

                <form name='productForm' method='get' ref={this.productFormRef} >
                    <input type='hidden' name={'fid'} value={this.feedId}/>
                    <input type='hidden' name={'ft'} value={this.getFeedType()}/>
                    <input type='hidden' name={'r'} value={'0'}/>
                    <div style={{display: 'none'}}>
                        <input id={"productFormSubmitID"} type={"submit"}/>
                    </div>
                </form>
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        forYouFeeds: state.feed.forYouFeeds,
        purchased: state.cart.hasPurchased
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        addComment: (params) => dispatch(addComment(params)),
        getSuggestedFeed: (params) => dispatch(getSuggestedFeed(params)),
        buyNow: (params, callback) => dispatch(buyNow(params, callback)),
        hasPurchased: (params) => dispatch(hasPurchased(params))
    }
};



ProductDetailView = connect(mapStateToProps, mapDispatchToProps)(ProductDetailView);

export default withRouter(ProductDetailView);