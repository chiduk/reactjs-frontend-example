import React, { Component } from "react";


import "./js/components/AddProduct.css";
import "./js/components/WriteNewPost.css";
import "./js/components/ProductDetail.css";
// import "./js/components/ProductView.css"

import HashTagSearchAndAddView from "./HashTagSearchAndAddView";
import AlertMessage from "./AlertMessage";
import {getUniqueId, RestApi} from "./util/Constants";

import {connect} from "react-redux";
import {getProductDetail} from "./actions/manager";
import Footer from "./Footer";


class ProductView extends Component {
    constructor(props) {
        super(props);

        this.productNameRef = React.createRef();

        this.state = {
            productImages: [],
            productName:"",
            productDefaultPrice: "",
            totalInventory: '',
            options: [],

            discountRate: "",
            commission: '',
            shippingConst: "",
            shippingCost: "",

            productDescriptionImages: [],
            productDescriptionText: "",
            hashTagList: [],
            searchView: null,
            alertMessage: null,

            isDragDisabled: true,

        }




        this.addOption = this.addOption.bind(this)
        this.deleteOption = this.deleteOption.bind(this)
        this.selectImage = this.selectImage.bind(this)
        this.imageSelectRef = React.createRef()

        this.deleteImage = this.deleteImage.bind(this)

        this.productImageSelect = this.productImageSelect.bind(this)
        this.productImageSelectRef = React.createRef()
        this.productImageSelected = this.productImageSelected.bind(this)
        this.deleteProductImage = this.deleteProductImage.bind(this)

        this.onDragEnd = this.onDragEnd.bind(this)
        this.changeDefaultPrice = this.changeDefaultPrice.bind(this)

        this.productNameEdit = this.productNameEdit.bind(this)
        this.totalInventoryEdit = this.totalInventoryEdit.bind(this)
        this.optionNameAdded = this.optionNameAdded.bind(this)
        this.optionPriceAdded = this.optionPriceAdded.bind(this)
        this.inventoryDataAdded = this.inventoryDataAdded.bind(this)
        this.deleteOption = this.deleteOption.bind(this)

        this.totalInventoryCalc = this.totalInventoryCalc.bind(this)

        this.discountRate = this.discountRate.bind(this)
        this.shippingCost = this.shippingCost.bind(this)

        this.productDescriptionEdit = this.productDescriptionEdit.bind(this)

        this.imageSelected = this.imageSelected.bind(this)
        this.deleteImage = this.deleteImage.bind(this)

        this.handleCloseSearchView =  this.handleCloseSearchView.bind(this)
        this.addHashTag = this.addHashTag.bind(this)
        this.deleteHastTag = this.deleteHastTag.bind(this)

        this.savePressed = this.savePressed.bind(this)
        this.alertMessageViewToggle = this.alertMessageViewToggle.bind(this)

        this.inputNameRef = React.createRef()

        let productId = localStorage.getItem('forwardProductId');

        localStorage.removeItem('forwardProductId');

        let params = {
            uniqueId: getUniqueId(),
            productId: productId
        }

        this.props.getDetail(params)
    }



    componentDidMount() {
       // this.productNameRef.current.focus()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.product !== this.props.product){

            let product = this.props.product

            let hashTags = []

            product.hashTags.forEach(tag => {


                hashTags.push(tag.hashTag)
            })

            this.setState({
                productImages: [],
                productName:product.title,
                productDefaultPrice: product.price,
                totalInventory: product.totalInventory,
                options: [],

                discountRate: product.discountRate,
                commission: product.commission,

                shippingCost: product.shippingCost,
                extraShippingCost: product.extraShippingCost ,
                productDescriptionImages: [],
                productDescriptionText: product.description,
                hashTagList: hashTags,
                searchView: null,
                alertMessage: null,

                isDragDisabled: true,
            })


            let productImages = []

            this.props.product.productImages.forEach(image => {
                //const filePath = URL.createObjectURL(RestApi.prod + image.filename)

                const item = {id:RestApi.prod + image.filename, file:image.filename, content: RestApi.prod + image.filename}

                productImages.push(item)
            })

            this.setState({productImages: productImages})

            let descImages = [];

            this.props.product.descriptionImages.forEach(image => {
                //const filePath = URL.createObjectURL(RestApi.prod + image.filename)

                const item = {id:RestApi.prodDesc + image.filename, file:image.filename, content: RestApi.prodDesc + image.filename}

                descImages.push(item)
            })

            this.setState({productDescriptionImages: descImages})

            const list = Object.assign([], this.state.options);
            this.props.product.options.forEach(option => {
                let content = {name: option.title, price: option.priceAddition, inventory: option.inventory, ref: ""}

                list.push(content)

            })

            this.setState({options : list}, () => {
                // this.inputNameRef.current.focus();
            })
        }
    }

    selectImage() {
        this.imageSelectRef.current.click()
    }

    imageSelected(event) {

        const whatImageIsFor = event.target.getAttribute('name')

        const file = event.target.files

        const images = Object.assign([], this.state.productDescriptionImages);

        for (let i = 0; i < file.length; i++) {
            const filePath = URL.createObjectURL(event.target.files[i])
            //const item = {id:filePath, content: filePath, imageIsFor: whatImageIsFor}
            const item = {id:filePath, file:event.target.files[i], content: filePath}
            images.push(item)
        }

        this.setState({productDescriptionImages: images})

    }

    deleteImage(index) {
        const object = Object.assign([], this.state.productDescriptionImages);
        object.splice(index, 1);
        this.setState({productDescriptionImages: object});
    }

    productImageSelect() {
        this.productImageSelectRef.current.click();
    }

    productImageSelected(event) {


        const file = event.target.files

        const images = Object.assign([], this.state.productImages);

        for (let i = 0; i < file.length; i++) {
            const filePath = URL.createObjectURL(event.target.files[i])

            const item = {id:filePath, file:event.target.files[i], content: filePath}
            images.push(item)
        }

        this.setState({productImages: images})

    }

    deleteProductImage(index) {
        const object = Object.assign([], this.state.productImages);
        object.splice(index, 1);
        this.setState({productImages : object});
    }


    onDragEnd(result) {
        if (!result.destination) {
            return;
        }



    }

    productNameEdit(e) {
        this.setState({productName: e.target.value})
    }


    totalInventoryEdit(e) {

        //console.log(e)

        if (this.state.options.length > 0) {
            //console.log("your total inventory will be added")
        } else {
            this.setState({totalInventory: e.target.value})
        }

    }

    changeDefaultPrice(e) {
        this.setState({productDefaultPrice: e.target.value})
    }

    addOption() {
        let content = {name: "", price: "", inventory: "", ref: ""}
        const list = Object.assign([], this.state.options);
        list.push(content)
        this.setState({options : list}, () => {
            this.inputNameRef.current.focus();
        })
    }


    optionNameAdded(e) {
        const index = e.target.getAttribute('index')
        const list = Object.assign([], this.state.options);
        list[index].name = e.target.value
        this.setState({options: list})
    }

    optionPriceAdded(e) {

        const index = e.target.getAttribute('index')
        const list = Object.assign([], this.state.options);
        list[index].price = e.target.value
        this.setState({options: list})

    }

    inventoryDataAdded(e) {

        const index = e.target.getAttribute('index')
        const list = Object.assign([], this.state.options);
        list[index].inventory = e.target.value
        this.setState({options: list});

        this.totalInventoryCalc();

    }

    totalInventoryCalc() {
        let totalNumber = Number(0)

        const list = Object.assign([], this.state.options);
        list.forEach((i) => {
            const number = i.inventory
            totalNumber += Number(number)
        })

        if (totalNumber === Number(0)) {
            //console.log("the value is zero")
            this.setState({totalInventory: ""})
        } else {
            this.setState({totalInventory: totalNumber})
        }
        //console.log('recalc')
    }


    deleteOption(index) {
        const object = Object.assign([], this.state.options);
        object.splice(index, 1);
        this.setState({options : object}, () => {
            this.totalInventoryCalc()
        });
    }

    productDescriptionEdit(e) {
        //console.log(e.target.value)
        let value;
        if (this.state.productDescriptionText.length === 0 ) {
            value =  e.target.value.replace('\n', '')
        } else {
            value = e.target.value.replace('\n\n\n', '\n\n')
        }

        this.setState({productDescriptionText: value})

    }

    handleCloseSearchView() {
        if (this.state.searchView === null ) {
            this.setState({searchView: <HashTagSearchAndAddView closeSearchView={this.handleCloseSearchView} addHashTag={(tag) => this.addHashTag(tag)}/>})
        } else {
            this.setState({searchView: null})
        }
    }

    addHashTag(tag) {
        //console.log("hash tag added", tag)
        const tags = Object.assign([], this.state.hashTagList);
        tags.push(tag.hashTag)
        this.setState({hashTagList : tags})
    }

    deleteHastTag(index) {
        const tags = Object.assign([], this.state.hashTagList);

        tags.splice(index, 1);
        this.setState({hashTagList : tags});

    }

    savePressed() {



    }

    alertMessageViewToggle(e) {
        //console.log(e)
        if (this.state.alertMessage === null) {
            this.setState({alertMessage: <AlertMessage alertTitle={"Oops..."} messages={e} closeAlert={this.alertMessageViewToggle}/>})
        } else {
            this.setState({alertMessage: null})
        }
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

    discountRate(e) {
        this.setState({
            discountRate: e.target.value
        })
    }

    commission = (e) => {
        this.setState({
            commission: e.target.value
        })
    }

    shippingCost(e , extra) {
        if (extra === "extra") {

            this.setState({
                extraShippingCost: e.target.value
            })

        } else {

            this.setState({
                shippingCost: e.target.value
            })

        }

    }

    renderProductImage = () => {
        let imageContainer = []

        if(typeof this.state.productImages !== 'undefined'){



            this.state.productImages.forEach(imageObj => {



                let image =  <div key={imageObj.file} className="productImage">
                    <img src={RestApi.prod + imageObj.file}/>
                </div>;

                imageContainer.push(image)
            })
        }

        return imageContainer
    }


    moveScroll = () => {
        const slider = document.querySelector('.productImageScrollWrapper');
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
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            slider.scrollLeft = scrollLeft - walk;

        });
    }

    render() {
        let extrashippingCost = Number(this.state.extraShippingCost)

        let discountCalc = (this.state.productDefaultPrice - (this.state.productDefaultPrice * (this.state.discountRate/100)))

        let commission = discountCalc * (this.state.commission / 100)

        let infoFontSize = "18px"
        return(
            <div className={"newProduct"}>
                <div className="productDetailBody">
                    <div className={`productImageScrollWrapper ${this.state.productImages.length < 3 ? "productSingleImageScrollWrapper" : "productImageScrollWrapper"}`}
                         onMouseDown={this.moveScroll}
                         onMouseLeave={this.moveScroll}
                         onMouseUp={this.moveScroll}
                         onMouseMove={this.moveScroll}
                        // style={{
                        //     backgroundColor: "red",
                        //     marginLeft: `${this.state.productImages.length < 3 ? "auto" : ""}`,
                        //     marginRight: `${this.state.productImages.length < 3 ? "auto" : ""}`,
                        //     width: `${this.state.productImages.length < 3 ? "max-contents" : ""}`
                        // }}
                    >
                        {this.renderProductImage()}
                    </div>

                    <div className={"productViewInfoTitle"} style={{fontWeight: "bold", fontSize: "22px", marginTop: "16px"}}>상품명</div>
                    <div className={"productViewInfoData"} style={{fontSize: "22px"}}>{this.state.productName}</div>

                    <div className={"productInputWrapper"} style={{marginTop: "32px", fontSize: infoFontSize}}>
                        <div className={"productViewInfoTitle"} style={{fontWeight: "bold", marginRight: "8px"}}>판매 가격 :</div>
                        <div className={"productViewInfoPriceInfo priceMarginLeft"}>{this.state.productDefaultPrice.toLocaleString()}</div>
                        <div className={"productViewInfoTitle"}>원</div>
                    </div>

                    <div className={"productInputWrapper"} style={{fontSize: infoFontSize}}>
                        <div className={"productViewInfoTitle productInfoTitleMarginLeft"} style={{fontWeight: "bold", marginRight: "8px"}}>총 재고량 :</div>
                        <div className={"productViewInfoPriceInfo priceMarginLeft"}>{this.state.totalInventory.toLocaleString()}</div>
                        <div className={"productViewInfoTitle"}>개</div>
                    </div>

                    <div className={"optionInputWrapper"}>
                        {this.state.options.map((i, index) => {
                            return (
                                <div className={"priceOption"}>
                                    <div className={"optionDataWrapper"}>

                                        <div className={"optionNameInput"} style={{fontSize: infoFontSize}}>
                                            <div>옵션 {index + 1}</div>
                                            <div className={"productViewOptionWrapper"} style={{marginLeft: "16px"}}>
                                                <div className={"productViewInfoTitle"} style={{fontWeight: "bold"}}>{this.state.options[index].name}</div>

                                                <div className={"productInputWrapper"}>
                                                    <div className={"productViewInfoTitle productInfoTitleMarginLeft"} style={{fontWeight: "bold", marginRight: "8px"}}>추가 금액 : </div>
                                                    <div className={"productViewInfoPriceInfo priceMarginLeft"}>{this.state.options[index].price}</div>
                                                    <div className={"productViewInfoTitle"}>원</div>
                                                </div>

                                                <div className={"productInputWrapper"} >
                                                    <div className={"productViewInfoTitle productInfoTitleMarginLeft"} style={{fontWeight: "bold", marginRight: "8px"}}>재고량 : </div>
                                                    <div className={"productViewInfoPriceInfo priceMarginLeft"}>{this.state.options[index].inventory}</div>
                                                    <div className={"productViewInfoTitle"}>개</div>
                                                </div>
                                            </div>


                                        </div>


                                    </div>

                                </div>
                            );
                        })}
                    </div>


                    <div className={"productInputWrapper"} style={{marginTop: "32px", fontSize: infoFontSize}}>
                        <div className={"productViewInfoTitle"} style={{fontWeight: "bold", marginRight: "8px"}}>기본 배송비 :</div>
                        <div className={"productViewInfoPriceInfo priceMarginLeft"}>{this.state.shippingCost.toLocaleString()}</div>
                        <div className={"productViewInfoTitle"}>원</div>
                    </div>


                    <div className={"productInputWrapper"} style={{fontSize: infoFontSize}}>
                        <div className={"productViewInfoTitle productInfoTitleMarginLeft"} style={{fontWeight: "bold", marginRight: "8px"}}>도서 산간 지역 :</div>
                        <div className={"productViewInfoPriceInfo priceMarginLeft"}>{extrashippingCost.toLocaleString()}</div>
                        <div className={"productViewInfoTitle"}>원</div>
                    </div>


                    <div className={"productInputWrapper"} style={{marginTop: "32px", fontSize: infoFontSize}}>
                        <div className={"productViewInfoTitle"} style={{fontWeight: "bold", marginRight: "8px"}}>할인율 :</div>
                        <div className={"productViewInfoPriceInfo priceMarginLeft"}>{this.state.discountRate}</div>
                        <div className={"productViewInfoTitle"}>% off</div>
                        <div className={"productViewInfoTitle productViewInfoCommissionMargin"}>(예상 판매가: {discountCalc.toLocaleString()}원)</div>
                    </div>


                    <div className={"productInputWrapper"} style={{fontSize: infoFontSize}}>
                        <div className={"productViewInfoTitle"} style={{fontWeight: "bold", marginRight: "8px"}}>커미션 지급률 :</div>
                        <div className={"productViewInfoPriceInfo priceMarginLeft"}>{this.state.commission}</div>
                        <div className={"productViewInfoTitle"}>%</div>
                        <div className={"productViewInfoTitle productViewInfoCommissionMargin"}>(예: {discountCalc.toLocaleString()}원 X {this.state.commission}% = {commission.toLocaleString()}원)</div>
                    </div>



                    <div className={"productDescriptionImageContainer"}>
                        {this.state.productDescriptionImages.map((i, index) => {
                            return (
                                <div className={"productDescriptionImageWrapper"}>
                                    <div className={"productDescriptionImage"}><img src={i.content}/></div>

                                </div>
                            );
                        })}
                    </div>


                    <div style={{fontSize: infoFontSize}}>{this.state.productDescriptionText}</div>

                    <div className={"addedHashtagContainer"}>
                        {this.state.hashTagList.map((i, index) => {
                            return (
                                <div className="hashTag" key={index}>
                                    <div className={"hashTagAdded"}><p>#{i}</p></div>
                                </div>
                            );
                        })}
                    </div>


                </div>

                <Footer/>

            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        product: state.manager.product
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        getDetail:(params) => dispatch(getProductDetail(params))
    }
}

ProductView = connect(mapStateToProps, mapDispatchToProps)(ProductView)

export default ProductView;