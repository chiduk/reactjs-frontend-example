import React, { Component } from 'react';
import "./js/components/WriteNewPost.css";
import "./js/components/Home.css";
import close from "./image/hashX.png";

import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import Container from "react-bootstrap/Container";
import HashTagSearchAndAddView from "./HashTagSearchAndAddView.js";
import ProductSearchView from "./ProductSearchView.js";
import TextareaAutosize from 'react-autosize-textarea';
import AlertMessage from "./AlertMessage.js";
import Calendar from "./Calendar";
import {
    getUniqueId,
    getUserId,
    queryString,
    RestApi,
    FEED_ADDITIONAL_CONTENTS_TYPE,
    getDateString, utcToLocal
} from "./util/Constants";
import {FEED_TYPE} from './util/Constants'
import fetch from 'cross-fetch'
import moment from "moment";
import LogInPage from "./LogInPage";
import ProfileImage from "./ProfileImage";
import {setCount} from "./actions/notification";
import {connect} from "react-redux";
import {setCartItemCount} from "./actions/cart";

import {exReadFile, exCreateImage, exRotate} from "./EXIFImageLoader";
import {getDetail} from "./actions/feed";


// import {fix-image-rotation} from 'fix-image-rotation';



const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const getItems = count =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k}`,
        content: `item ${k}`,
    }));

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 0,
    margin: `0 ${grid}px 0 0`,

    // change background colour if dragging
    background: isDragging ? 'white' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle,
});


const grid = 8;

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'white' : 'white',
    display: 'flex',
    padding: grid,
    overflow: 'auto',
});




class FeedEditView extends Component {

    constructor(props) {
        super(props)

        this.state = {

            items: [],
            feedType: "",
            feedTypeText: "",
            feedTypeSelectGrow: false,
            isFeedForMassSale: false,
            searchView: null,
            productSearchView: null,

            isAddContentClicked: false,

            imageArray: [],
            title: "",
            subtitle: "",
            paragraph: "",
            addedContents: [],

            hashTagList: [],
            products: [],

            alertMessage: null,

            isCalendarOpen: false,
            beginDate: "",
            endDate: "",
            calendarView: null,

            beginTime: "",
            endTime: "",

            beginAMPM: "AM",
            endAMPM: "PM",

            beginTimeGrow: false,
            endTimeGrow: false,

            isDragDisabled: true
        }

        this.handleImageSelector.bind(this)

        this.fileSelector = React.createRef()

        this.titleInputRef = React.createRef()

        this.handleFileUpload = this.handleFileUpload.bind(this)
        this.deleteImage = this.deleteImage.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)
        this.handleCloseSearchView = this.handleCloseSearchView.bind(this)
        this.addHashTag = this.addHashTag.bind(this)
        this.productSearchViewToggle = this.productSearchViewToggle.bind(this)
        this.addProduct = this.addProduct.bind(this)
        this.editPressed = this.editPressed.bind(this)
        this.alertMessageViewToggle = this.alertMessageViewToggle.bind(this)
        this.growWidthOfAddContentsButton = this.growWidthOfAddContentsButton.bind(this)

        this.addPhoto = this.addPhoto.bind(this)
        this.addContentPhotoRef = React.createRef()

        this.reSelectImage = this.reSelectImage.bind(this)
        this.updateImageRef = React.createRef()

        this.addContentPhoto = this.addContentPhoto.bind(this)

        this.addSubtitle = this.addSubtitle.bind(this)

        this.addParagraph = this.addParagraph.bind(this)

        this.getUserImage = this.getUserImage.bind(this)
        this.props.setNotificationCount();
        this.props.setCartItemCount()

        let params = {
            uniqueId: getUniqueId(),
            feedId:  this.props.location.state.feedId
        }

        this.props.getDetail(params)
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.detail !== this.props.detail){



            let detail = this.props.detail;

            let hashTags = [];

            detail.hashTags.forEach(tag => {
                let obj = {
                    id: tag,
                    hashTag: tag
                }

                hashTags.push(obj)
            })

            if(detail.feedType === FEED_TYPE.JOINT_PURCHASE){
                let startDate = utcToLocal(detail.startDate);
                let endDate = utcToLocal(detail.endDate);


                let beginDate = startDate.split(' ')[0];
                let beginTime = startDate.split(' ')[1];

                let lastDate = endDate.split(' ')[0];
                let lastTime = endDate.split(' ')[1];

                let beginYear = beginDate.split('-')[0];
                let beginMonth = beginDate.split('-')[1];
                let beginDay = beginDate.split('-')[2];

                let beginHour = beginTime.split(':')[0];

                let beginAMPM = 'AM';
                let endAMPM = 'AM';

                if(parseInt(beginHour) === 12){
                    beginAMPM = 'PM';
                    beginHour = 12;
                }else if(parseInt(beginHour) > 12){
                    beginAMPM = 'PM';
                    beginHour = parseInt(beginHour) - 12;
                }else{
                    beginHour = parseInt(beginHour)
                }

                let endYear = lastDate.split('-')[0];
                let endMonth = lastDate.split('-')[1];
                let endDay = lastDate.split('-')[2];

                let endHour = lastTime.split(':')[0];

                if(parseInt(endHour) === 12){
                    endAMPM = 'PM';
                    endHour = 12;
                }else if(parseInt(endHour) > 12){
                    endAMPM = 'PM';
                    endHour = parseInt(endHour) - 12;
                }else {
                    endHour = parseInt(endHour)
                }

                this.setState({
                    beginDate: beginYear + '년 ' + beginMonth + '월 ' + beginDay + '일',
                    endDate: endYear + '년 ' + endMonth + '월 ' + endDay + '일 ',

                    beginTime: beginHour,
                    endTime: endHour,

                    beginAMPM: beginAMPM,
                    endAMPM: endAMPM,

                    startDate: beginDate,
                    lastDate: lastDate
                })
            }



            this.setState({
                items: [],
                feedType: detail.feedType,
                feedTypeText: (detail.feedType === FEED_TYPE.PROMOTION) ? '프로모션 피드' : '공구',
                feedTypeSelectGrow: false,
                isFeedForMassSale: (detail.feedType === FEED_TYPE.JOINT_PURCHASE),
                searchView: null,
                productSearchView: null,

                isAddContentClicked: false,

                imageArray: detail.feedImages,
                title: detail.title,
                subtitle: (detail.subtitle === undefined || detail.subtitle === null) ? '' : detail.subtitle,
                paragraph: detail.description,
                addedContents: detail.additionalContents,

                hashTagList: hashTags,
                products: (detail.products === undefined || detail.products === null) ? [] : detail.products,

                alertMessage: null,

                isCalendarOpen: false,

                calendarView: null,



                beginTimeGrow: false,
                endTimeGrow: false,

                isDragDisabled: true
            })
        }
    }

    handleImageSelector() {

        this.fileSelector.current.click();
    }


    handleFileUpload = (event) => {


        const filesSelected = event.target.files

        let rotatedImageArray = [];

        for (let i = 0; i < filesSelected.length; i++) {
            let image = filesSelected[i]


            let file = URL.createObjectURL(image);


            if(image.type === 'video/mp4'){


                let item = {id: file, file: filesSelected[i], content: file }

                rotatedImageArray.push(item)
            }else{




                let file = URL.createObjectURL(image)


                let item = {id: file, file: filesSelected[i], content: file }

                rotatedImageArray.push(item)


            }


        }


        let newArray = []

        this.state.imageArray.forEach(image => {
            newArray.push(image)
        })

        let concatArray = newArray.concat(rotatedImageArray)

        this.setState({imageArray: concatArray})




    }



    titleInputChange(e) {
        this.setState({title: e.target.value})
    }

    subtitleChange(e) {
        this.setState({subtitle: e.target.value})
    }

    paragraphChange(e) {
        this.setState({paragraph: e.target.value})
    }

    deleteImage(index) {

        const array = Object.assign([], this.state.imageArray)
        array.splice(index, 1)
        this.setState({imageArray: array})

    }

    onDragStart() {

        if (window.navigator.vibrate) {
            window.navigator.vibrate(200);
        }
    }

    onDragEnd(result) {
        if (!result.destination) {
            return;
        }

        const items = reorder (
            this.state.imageArray,
            result.source.index,
            result.destination.index
        );

        this.setState({
            imageArray: items
        });
    }

    handleCloseSearchView() {
        if (this.state.searchView === null ) {
            this.setState({searchView: <HashTagSearchAndAddView closeSearchView={this.handleCloseSearchView} addHashTag={(tag) => this.addHashTag(tag)}/>})
        } else {
            this.setState({searchView: null})
        }
    }

    alertMessageViewToggle(e) {
        if (this.state.alertMessage === null) {
            this.setState({alertMessage: <AlertMessage alertTitle={"Oops..."} messages={e} closeAlert={this.alertMessageViewToggle}/>})
        } else {
            this.setState({alertMessage: null})
        }
    }

    addHashTag(tag) {


        let filteredHashTag = this.state.hashTagList.filter(x => x.hashTag === tag.hashTag);

        if(filteredHashTag.length <= 0){
            const tags = Object.assign([], this.state.hashTagList);
            tags.push(tag)
            this.setState({hashTagList : tags})

        }

    }

    deleteHashTag(index, e) {
        const tags = Object.assign([], this.state.hashTagList);

        tags.splice(index, 1);
        this.setState({hashTagList : tags});

    }

    addProduct(product) {

        let filteredProduct = this.state.products.filter(x => x.productId === product.productId);







        if(filteredProduct.length <= 0){

            const list = Object.assign([], this.state.products);
            list.push(product)
            this.setState({products : list})
            this.setState({alertMessage: <AlertMessage messages={['상품이 추가 되었습니다.']} closeAlert={this.alertMessageViewToggle}/>})
        }else{
            this.setState({alertMessage: <AlertMessage messages={['이미 추가된 상품입니다.']} closeAlert={this.alertMessageViewToggle}/>})
        }

    }

    deleteProduct(index, e) {

        const tags = Object.assign([], this.state.products);
        tags.splice(index, 1);
        this.setState({products : tags});

    }

    productSearchViewToggle() {
        if (this.state.productSearchView === null ) {
            this.setState({productSearchView: <ProductSearchView closeSearchView={this.productSearchViewToggle} productClicked={(p) => this.addProduct(p)}/>})
        } else {
            this.setState({productSearchView: null})
        }
    }

    editPressed() {
        console.log(this.state)

        let element = document.getElementById("writeFeedID")
        element.style.animation = ""
        void element.offsetWidth
        element.style.animation = "buttonPressedDown 0.3s 1 ease-in-out"

        element.addEventListener(("animationend"), () => {
            element.style.animation = ""
        })

        let alertMessage = []

        if (this.state.imageArray.length === 0 ) {
            alertMessage.push("이미지를 1개 이상 선택해 주세요")
        }

        if (this.state.title ===  "") {
            alertMessage.push("제목을 입력해 주세요")
        }

        // if (this.state.subtitle ===  "") {
        //     alertMessage.push("부 제목을 입력해 주세요")
        // }

        if (this.state.paragraph ===  "") {
            alertMessage.push("본문을 입력해 주세요")
        }

        if (this.state.hashTagList.length === 0 ) {
            alertMessage.push("태그를 1개 이상 입력해 주세요")
        }

        if(this.state.feedType === FEED_TYPE.JOINT_PURCHASE){


            if(this.state.beginDate.length <= 0){
                alertMessage.push("공구 시작일을 선택해 주세요")
            }


            if(this.state.endDate.length <= 0){
                alertMessage.push("공구 종료일을 선택해 주세요")
            }

            if(this.state.beginTime.length <= 0){
                alertMessage.push("공구 시작 시간을 선택해 주세요")
            }

            if(this.state.endTime.length <= 0){
                alertMessage.push("공구 종료 시간을 선택해 주세요")
            }


            if (this.state.products.length === 0 ) {

                alertMessage.push("제품을 1개 이상 선택해 주세요")


            }




        }


        console.log(this.state.beginDate, this.state.endDate)

        // if(parseInt(this.state.beginTime) > 12 || parseInt(this.state.beginTime) < 1){
        //     alertMessage.push("공구 시작 시간을 1 ~ 12 사이의 숫자로만 입력해 주세요")
        // }
        //
        // if(parseInt(this.state.endTime) > 12 || parseInt(this.state.endTime) < 1){
        //     alertMessage.push("공구 종료 시간을 1 ~ 12 사이의 숫자로만 입력해 주세요")
        // }


        if (alertMessage.length > 0 ) {

            this.alertMessageViewToggle(alertMessage)

        } else {

            let images = this.state.imageArray;
            let title = this.state.title;
            let subtitle = this.state.subtitle;
            let paragraph = this.state.paragraph;
            let hashTagList = this.state.hashTagList;
            let products = this.state.products;
            let additionalContents = this.state.addedContents;

            console.log(subtitle, hashTagList)

            let prevFeedImages = [];
            let formData = new FormData();

            for(let image of images){
                console.log(image)

                if(typeof image === 'object'){
                    if(image.file.type === 'video/mp4'){
                        formData.append('file[]', image.file, image.file.name)
                    }else{

                        formData.append('file[]', image.file, image.file.name)
                    }
                }else{
                    prevFeedImages.push(image)
                }




            }


            additionalContents.forEach((addition, index) => {

                console.log(addition)

                if(addition.type === FEED_ADDITIONAL_CONTENTS_TYPE.IMAGE){

                    console.log(typeof addition.file)

                    if(addition.file !== undefined){
                        formData.append('file[]', addition.file, addition.id)
                    }else{
                        additionalContents[index].isExistingImage = true;
                    }

                }
            })

            formData.append('feedId', this.props.location.state.feedId);
            formData.append('uniqueId', getUniqueId());
            formData.append('title', title);
            formData.append('subtitle', subtitle);
            formData.append('description', paragraph);
            formData.append('additionalContents', JSON.stringify(additionalContents));
            formData.append('prevFeedImages', JSON.stringify(prevFeedImages));

            let hashTags = [];

            for(let item of hashTagList){
                hashTags.push(item.hashTag)
            }

            formData.append('hashTags', JSON.stringify(hashTags));

            let productIds = []

            for(let product of products){
                productIds.push(product.productId)
            }

            formData.append('products', JSON.stringify(productIds))
            formData.append('feedType', this.state.feedType)


            if(this.state.feedType === FEED_TYPE.JOINT_PURCHASE){



                let startTime = this.state.beginTime;
                let endTime = this.state.endTime;


                if(this.state.beginAMPM === 'PM'){
                    if(parseInt(this.state.beginTime) === 12 ){
                        startTime = 12
                    }else{
                        startTime = parseInt(startTime) + 12
                    }
                }

                if(this.state.endAMPM === 'PM'){
                    if(parseInt(this.state.endTime) === 12){
                        endTime = 12
                    }else{
                        endTime = parseInt(endTime) + 12
                    }
                }

                let startDate = this.state.startDate;
                let endDate = this.state.lastDate;

                if(parseInt(startTime) < 10){
                    startTime = '0' + startTime
                }

                let startDateUTC = new Date(startDate + 'T' + startTime + ':00:00').toISOString();
                let endDateUTC =  new Date(endDate + 'T' + endTime + ':00:00').toISOString();


                formData.append('startDate', startDateUTC);
                formData.append('endDate', endDateUTC);



                fetch(RestApi.main.editJointPurchase, {
                    method: 'POST',
                    body: formData
                })
                    .then(res => {
                        if(res.status === 200) {
                            alert('성공적으로 저장되었습니다.');
                            window.location = '/'
                        }else if(res.status === 600){
                            alert('피드 작성은 인플루언서만 할 수 있습니다.')
                        }else{
                            alert('저장 중 오류가 발생하였습니다. 다시 시도해 주세요.')
                        }
                    })


            }else{

                fetch(RestApi.feed.edit, {
                    method: 'POST',
                    body: formData
                })
                    .then(res => {
                        if(res.status === 200){

                            alert('성공적으로 저장되었습니다.');
                            window.location = '/'
                        }else if(res.status === 600){
                            alert('피드 작성은 인플루언서만 할 수 있습니다.')
                        }else{
                            alert('저장 중 오류가 발생하였습니다. 다시 시도해 주세요.')
                        }

                    })
            }



        }
    }

    growWidthOfAddContentsButton() {
        this.setState({
            isAddContentClicked: !this.state.isAddContentClicked
        })
    }

    addPhoto() {
        this.addContentPhotoRef.current.click();
    }

    addContentPhoto(event) {



        const file = URL.createObjectURL(event.target.files[0])
        const content = {type: FEED_ADDITIONAL_CONTENTS_TYPE.IMAGE, id:file, file: event.target.files[0],
            content: file

        }
        const list = Object.assign([], this.state.addedContents)
        list.push(content)
        this.setState({addedContents : list})


        // const filepath = URL.createObjectURL(event.target.files[0])
        // const content = {id:filepath, file:event.target.files[0], content: filepath}
        // const list = Object.assign([], this.state.addedContents)
        // list.push(content)
        // this.setState({addedContents : list})
        //

        // const file = URL.createObjectURL(event.target.files[0])
        // const content = {file: "image", content: file}
        //
        // const filePath = URL.createObjectURL(event.target.files[0])
        // const item = {id:filePath, file:event.target.files[0], content: filePath}
        //
        //
        //
        // const list = Object.assign([], this.state.addedContents)
        // list.push(item)
        // this.setState({addedContents : list})
    }

    reSelectImage() {
        // console.log("update image clicked")
        this.updateImageRef.current.click();
    }

    updateImage(index, event) {
        const file = URL.createObjectURL(event.target.files[0])
        const content = {type: FEED_ADDITIONAL_CONTENTS_TYPE.IMAGE,
            content: file
            // <div className={"addContents"}><img src={file}/></div>
        };

        const list = Object.assign([], this.state.addedContents);
        list[index] = content;
        this.setState({addedContents : list})
    }

    addSubtitle() {
        const content = {type: FEED_ADDITIONAL_CONTENTS_TYPE.SUBTITLE, content: "",
            // <TextareaAutosize className={"subTitleInput"} placeholder={"부제목"}
            // value={this.state.subtitle} onChange={this.subtitleChange.bind(this)}
            // />
        }
        const list = Object.assign([], this.state.addedContents);
        list.push(content)
        this.setState({addedContents : list})
    }

    addParagraph() {
        const content = {type: FEED_ADDITIONAL_CONTENTS_TYPE.DESCRIPTION, content: ""
            // <TextareaAutosize className="paragraph" placeholder={"문장"}
            // value={this.state.paragraph} onChange={this.paragraphChange.bind(this)}
            // />
        }
        const list = Object.assign([], this.state.addedContents);
        list.push(content)
        this.setState({addedContents : list})

    }

    addURL = () => {
        const content = {type: FEED_ADDITIONAL_CONTENTS_TYPE.URL, content: ""}
        const list = Object.assign([], this.state.addedContents);
        list.push(content);
        this.setState({addedContents : list})
    }

    deleteAddedContents(index, e) {

        const object = Object.assign([], this.state.addedContents);
        object.splice(index, 1);
        this.setState({addedContents : object});

    }

    componentDidMount() {

        if(getUniqueId() === undefined || getUniqueId() === null){
            this.toggleLoginPage()
        }

        this.titleInputRef.current.focus()
    }

    feedTypeSelectClicked = () => {

        this.setState({feedTypeSelectGrow: !this.state.feedTypeSelectGrow}, () => {

        })
    }

    feedTypeButtonClicked(type) {

        if (type === "1") {
            this.setState({
                feedTypeText: "공구",
                feedType: FEED_TYPE.JOINT_PURCHASE,
                isFeedForMassSale: true,
            })

        } else {
            this.setState({
                feedTypeText: "프로모션 피드",
                feedType: FEED_TYPE.PROMOTION,
                isFeedForMassSale: false,
            })
        }

        this.feedTypeSelectClicked()

    }

    setDates(beginDate, beginDateForView, endDate, endDateForView) {

        this.setState({
            beginDate: beginDateForView,
            endDate: endDateForView,
            startDate: beginDate,
            lastDate: endDate


        })

    }

    dateSelectClicked = () => {
        if (this.state.isCalendarOpen === false) {
            this.setState({calendarView: <Calendar setDates={(begin, beginDate, end, endDate) => this.setDates(begin, beginDate, end, endDate)} beginDate={this.state.beginDate} endData={this.state.endDate} closeView={this.dateSelectClicked}/>}, () => {
                this.setState({isCalendarOpen: !this.state.isCalendarOpen})
            })
        } else {
            this.setState({isCalendarOpen: !this.state.isCalendarOpen}, () => {
                // this.setState({calendarView: <Calendar beginDate={this.state.beginDate} endData={this.state.endDate}/>})
            })
        }

    }


    timeSelectClicked(when) {
        if (when === "begin") {
            this.setState({beginTimeGrow: !this.state.beginTimeGrow}, () => {

            })
        } else {
            this.setState({endTimeGrow: !this.state.endTimeGrow}, () => {

            })
        }
    }

    timeSelectButtonClicked(when, what) {
        if (when === "begin") {
            this.setState({beginAMPM: what}, () => {
                this.timeSelectClicked("begin")
            })
        } else {
            this.setState({endAMPM: what}, ()=> {
                this.timeSelectClicked("end")
            })
        }
    }

    changeTime(e, when) {

        let inputTime = ""
        let maxLength = 13
        // oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
        if (Number(e.target.value) < Number(maxLength)) {
            inputTime = e.target.value
        }

        if (when === "begin") {
            this.setState({
                beginTime : inputTime
            })
        } else {
            this.setState({
                endTime : inputTime
            })
        }

    }

    onStartTimeChange = (event) => {
        let time = parseInt(event.target.value)

        if(this.state.beginAMPM === 'AM'){
            if(time <= 0){
                time = 0
            }else if (time > 11){
                time = 11
            }


        }else{
            if( time < 1){
                time = 1
            }else if( time > 12){
                time = 12
            }

        }

        this.setState({beginTime: time})

    };

    onEndTimeChange = (event) => {
        let time = parseInt(event.target.value)

        if(this.state.endAMPM === 'AM'){
            if(time <= 0){
                time = 0
            }else if (time > 11){
                time = 11
            }


        }else{
            if( time < 1){
                time = 1
            }else if( time > 12){
                time = 12
            }

        }

        this.setState({endTime: time})

    };

    addContentTextUpdate(e, index) {


        let object = Object.assign([], this.state.addedContents)
        object[index].content = e.target.value

        this.setState({
            addedContents: object
        })

    }

    hold = () => {

        this.setState({
            isDragDisabled: false
        })
    }

    handleButtonPress = () => {
        setTimeout(() => this.hold(), 600);
    }


    handleButtonRelease = () => {
        // clearTimeout(this.hold())
        this.setState({
            isDragDisabled: true
        })
    }

    toggleLoginPage = () => {
        const element = document.getElementById('logInPage');

        element.classList.toggle('searchViewClose')
    }

    closeLogInPage = () => {
        window.location = '/'
    }

    getUserImage() {
        return ("");
    }

    renderProduct = () => {

        return this.state.products.map((product, index) => {


            console.log(product)


            let productImages = this.props.detail.productImages.filter(x => x.productId === product.productId);

            let image = '';

            if(productImages.length > 0){
                image = productImages[0].image
            }else{
                if(product !== undefined){
                    if(product.images.length > 0){
                        image = product.images[0]
                    }
                }
            }

            return(

                <div className={"productContainer"} id={product.productId} key={product.productId}>
                    <div className="cardProductImg"><img src={RestApi.prod + image}/></div>
                    <div className="productInfo">
                        <div className="cardProductName"><a>{product.title}</a></div>
                        <div className="cardPriceContainer">
                            <div><a>{product.discountRate}% off {(product.currency === 'KRW') ? "₩" : "₩"}{(product.price  * ( (100 - product.discountRate) / 100)).toLocaleString()}</a></div>
                        </div>
                    </div>
                    <div><img className="hashClose" id="close1" src={close} onClick={this.deleteProduct.bind(this, product.productId)}/></div>
                </div>

            );

        });


    }

    renderFeedImages = (item) => {
        if(typeof item === 'object'){


            if(item.file.type === 'video/mp4'){
                return(
                    <video width="280" height="200" controls><source src={item.content} type="video/mp4"/> </video>
                )
            }else{
                return(
                    <img src={item.content}/>
                )
            }
        }else{
            if(item.endsWith('.mp4')){
                return(
                    <video width="280" height="200" controls><source src={RestApi.feedImage + item} type="video/mp4"/> </video>
                )
            }else{
                return(
                    <img src={RestApi.feedImage + item}/>
                )
            }
        }
    }

    render() {
        let feedType;
        if (this.state.feedType === "") {
            feedType = "피드 타입 선택"
        } else {
            feedType = this.state.feedTypeText
        }

        let beginAMPM;
        if (this.state.beginAMPM === "AM") {
            beginAMPM = "AM"
        } else {
            beginAMPM = "PM"
        }

        let endAMPM;
        if (this.state.endAMPM === "AM") {
            endAMPM = "AM"
        } else {
            endAMPM = "PM"
        }


        let profileImage;
        // let attemptedUserImageSrc = RestApi.profile + getUniqueId() + '.png'

        let attemptedUserImageSrc = this.getUserImage()

        if (attemptedUserImageSrc === "") {
            profileImage = `${require("./image/userIconPlaceHolder.png")}`
        } else {
            profileImage = attemptedUserImageSrc
        }

        let timeInputStyle = {
            width: '35px'
        }

        return(
            <div className="newPostBody">
                <div className="profileInfo">
                    <div className={"profileImage"}><ProfileImage uniqueId={getUniqueId()}/></div>
                    <div className={"profileName"}><a>{getUserId()}</a></div>
                </div>

                <div className={"selectFeedTypeContainer"}>
                    <div className={"feedTypeSelectButton"} onClick={this.feedTypeSelectClicked}>{feedType}<img className={`${this.state.feedTypeSelectGrow ? "rotateArrowImage" : ""}`} src={require("./image/triangleRed.png")}/></div>
                    <div className={`feedTypeContainer ${this.state.feedTypeSelectGrow ? "growSelectContainer" : ""}`} id={"feedTypeContainerID"}>
                        <div className={"feedTypeButton"} onClick={() => this.feedTypeButtonClicked("1")}>공구</div>
                        <div className={"feedTypeButton"} onClick={() => this.feedTypeButtonClicked("2")}>프로모션 피드</div>
                    </div>
                </div>

                <div className={`dataPickDiv ${this.state.isFeedForMassSale ? "dataPickGrow" : ""}`}>
                    <div className={"selectImageText"}><a>기간 설정</a></div>
                    <div className={"selectButton"} onClick={this.dateSelectClicked}><img src={require("./image/plusButton.png")}/> select date</div>
                    <div className={"selectedDateForPost"}>
                        <div className={"selectedDateTimeWrapper"}>
                            <div>공구 시작 : {this.state.beginDate}</div>
                            <div className={`timeSelector ${this.state.beginDate !== "" ? "" : "hideTimeSelector"}`}>
                                <input style={timeInputStyle} onChange={(e)=> this.onStartTimeChange(e)} value={this.state.beginTime} maxLength={"5"} type={"number"} placeholder={"00"}/>시

                                <div className={"timeSelectorContainer"}>
                                    <div className={"timeSelectTextStyle"} onClick={(when) => this.timeSelectClicked("begin")}>{beginAMPM}<img className={`${this.state.beginTimeGrow ? "rotateArrowImage" : ""}`} src={require("./image/triangleRed.png")}/></div>
                                    <div className={`feedTypeContainer ${this.state.beginTimeGrow ? "growSelectContainer" : ""}`} id={"feedTypeContainerID"}>
                                        <div className={" timeSelectButton"} onClick={(when, what) => this.timeSelectButtonClicked("begin", "AM")}>AM</div>
                                        <div className={" timeSelectButton"} onClick={(when, what) => this.timeSelectButtonClicked("begin", "PM")}>PM</div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className={"selectedDateTimeWrapper"}>
                            <div>공구 완료 : {this.state.endDate}</div>
                            <div className={`timeSelector ${this.state.endDate !== "" ? "" : "hideTimeSelector"}`}>
                                <input style={timeInputStyle} onChange={(e)=> this.onEndTimeChange(e)} type={"number"} value={this.state.endTime} maxLength={"5"} placeholder={"00"}/>시

                                <div className={"timeSelectorContainer"}>
                                    <div className={"timeSelectTextStyle"} onClick={(when) => this.timeSelectClicked("end")}>{endAMPM}<img className={`${this.state.endTimeGrow ? "rotateArrowImage" : ""}`} src={require("./image/triangleRed.png")}/></div>
                                    <div className={`feedTypeContainer ${this.state.endTimeGrow ? "growSelectContainer" : ""}`} id={"feedTypeContainerID"}>
                                        <div className={"timeSelectButton"} onClick={(when, what) => this.timeSelectButtonClicked("end", "AM")}>AM</div>
                                        <div className={"timeSelectButton"} onClick={(when, what) => this.timeSelectButtonClicked("end", "PM")}>PM</div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                <div className={`datePickerView ${this.state.isCalendarOpen ? "calendarOpen" : ""}`}>
                    {this.state.calendarView}
                </div>

                <div className={"selectImageText"}><a>사진 및 동영상 추가</a></div>
                <div className={"selectImage selectButton"} onClick={() => this.handleImageSelector()}><img src={require("./image/plusButton.png")}/><a> add</a></div>
                <input type="file" multiple name="profileImage" accept=".mp4,.jpg,.png,.jpeg" ref={this.fileSelector} onChange={(event) => this.handleFileUpload(event)} style={{display: "none"}}/>


                <div className={""}>

                    <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>

                        <Droppable droppableId="droppable" direction="horizontal"
                            // isDropDisabled={true}
                        >
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                    className={"scrollToSide imageArrayContainer"}
                                >

                                    {
                                        this.state.imageArray.map((item, index) => {



                                            return (
                                                <div

                                                    key={index}
                                                    onTouchStart={this.handleButtonPress}
                                                    onTouchEnd={this.handleButtonRelease}
                                                    onMouseDown={this.handleButtonPress}
                                                    onMouseUp={this.handleButtonPress}
                                                    onMouseLeave={this.handleButtonPress}
                                                >

                                                    <Draggable key={item} draggableId={item} index={index}
                                                               isDragDisabled={this.state.isDragDisabled}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided.draggableProps.style
                                                                )}

                                                                className={"uploadingImage"}

                                                            >
                                                                <div className={"selectedImage"}>
                                                                    {
                                                                        this.renderFeedImages(item)
                                                                    }
                                                                </div>
                                                                <div className={"deleteButton"} onClick={() => this.deleteImage(index)}>
                                                                    <img src={require("./image/hashX.png")}/>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>

                                                </div>


                                            );
                                        })
                                    }

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                    </DragDropContext>

                </div>

                <div >
                    <TextareaAutosize className="titleInput"  ref={this.titleInputRef} placeholder={"제목"} value={this.state.title} onChange={this.titleInputChange.bind(this)}/>
                </div>

                <div>
                    <TextareaAutosize className="subTitleInput" placeholder={"부제목 (선택사항)"} value={this.state.subtitle} onChange={this.subtitleChange.bind(this)}/>
                </div>

                <div>
                    <TextareaAutosize className="paragraph" placeholder={"문장"} value={this.state.paragraph} onChange={this.paragraphChange.bind(this)}/>
                </div>

                {this.state.addedContents.map((i, index) => {
                    let button;

                    {if (i.file === "image") {
                        button = <div className={"reSelectButton"} onClick={this.reSelectImage}>
                            <a>재선택</a><input type={"file"} ref={this.updateImageRef} onChange={this.updateImage.bind(this, index)} style={{display: "none"}}/>
                        </div>;
                    }}


                    let content = i.content



                    let wrapper;
                    if (i.type === FEED_ADDITIONAL_CONTENTS_TYPE.IMAGE) {

                        if(i.file === undefined){
                            wrapper = <div className={"addContents"}>{(i.filename.endsWith('.mp4'))  ? <video width="400" height="360" controls><source src={RestApi.feedImage + i.filename} type="video/mp4"/> </video> :  <img src={RestApi.feedImage + i.filename}/> }</div>
                        }else{
                            wrapper = <div className={"addContents"}>{(i.file.type === 'video/mp4')  ? <video width="400" height="360" controls><source src={i.content} type="video/mp4"/> </video> :  <img src={i.content}/> }</div>
                        }

                    } else if (i.type === FEED_ADDITIONAL_CONTENTS_TYPE.SUBTITLE) {
                        wrapper = <TextareaAutosize className="subTitleInput" placeholder={"부제목"}
                                                    value={content}
                                                    onChange={(e) => this.addContentTextUpdate(e, index)}
                        />
                    } else if (i.type === FEED_ADDITIONAL_CONTENTS_TYPE.DESCRIPTION) {
                        wrapper = <TextareaAutosize className="paragraph" placeholder={"문장"}
                                                    value={content}
                                                    onChange={(e) => this.addContentTextUpdate(e, index)}
                        />
                    } else if (i.type === FEED_ADDITIONAL_CONTENTS_TYPE.URL) {
                        wrapper = <TextareaAutosize className="paragraph" type={"url"} placeholder={"URL (예: http://www.google.com)"}
                                                    value={content}
                                                    onChange={(e) => this.addContentTextUpdate(e, index)}
                        />
                    }

                    return (
                        <div className={"addingContentsWrapper"} key={index}>
                            <div className={"addedContent"}>
                                {wrapper}
                            </div>

                            <div className={"addContentEditButtonWrapper"}>
                                <div className={"deleteContentButton"} onClick={this.deleteAddedContents.bind(this, index)}>
                                    <img src={require("./image/plusButton.png")}/>
                                </div>
                                {button}
                            </div>
                        </div>
                    );
                })}

                <div className="addContentsTitle"><a>컨텐츠 추가</a></div>
                <div className={"addContentButton"} >
                    <div className={"plusButton"} onClick={this.growWidthOfAddContentsButton}>
                        <img className={`${this.state.isAddContentClicked ? "tiltAddButton" : ""}`} src={require("./image/plusButton.png")}/>
                    </div>

                    <div
                        className={`addMoreContentsButtonWrapper ${this.state.isAddContentClicked ? "growWidth" : ""}`}
                        style={{
                            maxWidth: this.state.isAddContentClicked ? "calc(100% - 32px)" : "0px",
                            maxHeight: this.state.isAddContentClicked ? "64px" : "0px",
                            transitionProperty: "max-height, max-width",
                            transition: "0.5s ease-in-out ",
                            // flexWrap: this.state.isAddContentClicked ? "wrap" : "nowrap",
                        }}
                    >
                        <div className={"addButtonItems"} onClick={this.addPhoto}><img src={require("./image/cameraIcon.png")} /></div>
                        <div className={"addButtonItems"} onClick={this.addSubtitle}><a>+ 부제목</a></div>
                        <div className={"addButtonItems"} onClick={this.addParagraph}><a>+ 문장</a></div>
                        <div className={"addButtonItems"} onClick={this.addURL}><a>+ 링크</a></div>
                    </div>

                </div>

                <input type={"file"} ref={this.addContentPhotoRef} accept=".jpg,.jpeg,.png,.mp4" onChange={(event) => this.addContentPhoto(event)} style={{display: "none"}}/>

                <div className={"addButton"} onClick={this.handleCloseSearchView}><a>태그 추가</a></div>

                <div className={"addedHashtagContainer"}>
                    {this.state.hashTagList.map((i, index) => {



                        return (
                            <div className="hashTag" key={index}>
                                <div className={"hashTagAdded"}><p>#{i.hashTag}</p></div>
                                <div><img className="hashClose" id="close1" src={close} onClick={this.deleteHashTag.bind(this, index)}/></div>
                            </div>
                        );
                    })}
                </div>

                <div className={"addButton"} onClick={this.productSearchViewToggle}><a>상품 추가</a></div>

                <div className={"addedProductListView"}>
                    {this.renderProduct()}


                </div>


                <div className="saveButton" id={"writeFeedID"} onClick={this.editPressed}><a>수정</a></div>


                {this.state.searchView}
                {this.state.productSearchView}
                {this.state.alertMessage}

                <div id="logInPage" className="searchViewBackGround">
                    <div className="searchBarWrapper">
                        <div className="searchCloseButton" ><a onClick={() => this.closeLogInPage()}>close X</a></div>
                    </div>

                    <LogInPage  toggleLogInView={() => this.toggleLoginPage()} redirectUrl={'/writenewpost'}/>
                </div>

            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return{
        detail: state.feed.detail
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setNotificationCount: () => dispatch(setCount()),
        setCartItemCount: () => dispatch(setCartItemCount()),
        getDetail: (params) => dispatch(getDetail(params))
    }
};

FeedEditView = connect(mapStateToProps, mapDispatchToProps)(FeedEditView);

export default FeedEditView;