import React, { Component } from "react";
import TextareaAutosize from 'react-autosize-textarea';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import "./js/components/AddProduct.css";
import "./js/components/WriteNewPost.css";

import AutosizeInput from 'react-input-autosize';
import close from "./image/hashX.png";
import HashTagSearchAndAddView from "./HashTagSearchAndAddView";
import AlertMessage from "./AlertMessage";
import {getUniqueId, RestApi} from "./util/Constants";
import fetch from "cross-fetch";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

// const getItems = count =>
//     Array.from({ length: count }, (v, k) => k).map(k => ({
//         id: `item-${k}`,
//         content: `item ${k}`,
//     }));

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

class AddProductView extends Component {
    constructor(props) {
        super(props);

        this.productNameRef = React.createRef()

        this.state = {
            productImages: [],
            productName:"",
            productDefaultPrice: "",
            totalInventory: "",
            options: [],

            discountRate: "",
            commission: "",
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
    }



    componentDidMount() {
        this.productNameRef.current.focus()
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
        // //console.log(event.target.name)
        //console.log("productImageSelected" + event.target.files[0])
        //console.log("value type is" + event.target.getAttribute('name'))
        const whatImageIsFor = event.target.getAttribute('name')

        const file = event.target.files

        const images = Object.assign([], this.state.productImages);

        for (let i = 0; i < file.length; i++) {
            const filePath = URL.createObjectURL(event.target.files[i])
            //const item = {id:filePath, content: filePath, imageIsFor: whatImageIsFor}
            const item = {id:filePath, file:event.target.files[i], content: filePath}
            images.push(item)
        }

        console.log(images)

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

        const items = reorder (
            this.state.productImages,
            result.source.index,
            result.destination.index
        );

        this.setState({ productImages: items });
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

        let alertMessage = []
        let element = document.getElementById("addProductSaveID")
        element.style.animation = ""
        void element.offsetWidth
        element.style.animation = "buttonPressedDown 0.3s 1 ease-in-out"

        element.addEventListener(("animationend"), () => {
            element.style.animation = ""
        })


        if (this.state.productName ===  "") {
            alertMessage.push("상품명을 입력해 주세요")
        }

        if (this.state.productImages.length ===  0) {
            alertMessage.push("상품 이미지를 선해 주세요")
        }

        if (this.state.productDefaultPrice.length ===  0) {
            alertMessage.push("가격을 입력해 주세요")
        }

        if(this.state.totalInventory === 0 || this.state.totalInventory.length <= 0){
            alertMessage.push("재고 수량을 입력해 주세요")
        }

        if (this.state.options.length > 0) {
            let ommitCount = 0
            this.state.options.forEach((i, index) => {

                if (i.name === null || i.name === "" || i.price === null || i.price === "" || i.inventory === null || i.inventory === "") {
                    ommitCount += 1
                }
            })

            if (ommitCount > 0) {
                alertMessage.push("옵션 정보를 모두 입력해 주세요.")
            }
        }

        if (alertMessage.length > 0 ) {

            this.alertMessageViewToggle(alertMessage)

        } else {




            let formData = new FormData();

            for(let image of this.state.productImages){
                //console.log(image)
                formData.append('file[]', image.file, image.file.name+':product')
            }

            for(let image of this.state.productDescriptionImages){
                //console.log(image)

                formData.append('file[]', image.file, image.file.name+':description')
            }

            formData.append('uniqueId', getUniqueId());
            formData.append('title', this.state.productName);

            formData.append('price', this.state.productDefaultPrice);
            formData.append('description', this.state.productDescriptionText);

            formData.append('commission', this.state.commission);
            formData.append('discountRate', this.state.discountRate);
            formData.append('shippingCost', this.state.shippingCost);
            formData.append('extraShippingCost', this.state.extraShippingCost);
            formData.append('totalInventory', this.state.totalInventory);
            formData.append('currency', 'KRW');
            let hashTags = [];

            this.state.hashTagList.forEach(hashTag => {
                hashTags.push(hashTag)
            });


            formData.append('hashTags', JSON.stringify(hashTags));


            let options = []

            for(let option of this.state.options){
                let obj = {
                    name: option.name,
                    inventory: option.inventory,
                    price: option.price
                }

                options.push(obj)
            }

            if(this.state.totalInventory === 0 || this.state.totalInventory.length <= 0){
                alertMessage.push("재고 수량을 입력해 주세요")
                this.alertMessageViewToggle(alertMessage)
                return;
            }


            formData.append('options', JSON.stringify(options));


            fetch(RestApi.product.add,  {
                method: 'POST',
                body: formData
            })
                .then(res => {
                    if(res.status === 200){
                        alert('성공적으로 추가 되었습니다.')
                        window.location ='/'
                    }else if(res.status === 600){
                        alert('상품 추가를 하기 위해서는 먼저 판매자 신청을 하셔야 합니다.')
                    }
                })



        }

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

    render() {

        let defaultPrice = this.state.productDefaultPrice
        let discountRate = this.state.discountRate
        let commision = this.state.commission

        let predictedSellingPrice;
        predictedSellingPrice = defaultPrice - (defaultPrice * (discountRate/100))

        let predictedProfit;
        predictedProfit = predictedSellingPrice - (predictedSellingPrice * (commision / 100))



        return(
            <div className={"newProduct"}>

                <div>
                    <DragDropContext onDragEnd={this.onDragEnd} >
                        <Droppable droppableId="droppable" direction="horizontal" >
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}

                                    className={"newProductImageArrayContainer"}
                                >
                                    {this.state.productImages.map((item, index) => (
                                    <div
                                        onTouchStart={this.handleButtonPress}
                                        onTouchEnd={this.handleButtonRelease}
                                        onMouseDown={this.handleButtonPress}
                                        onMouseUp={this.handleButtonPress}
                                        onMouseLeave={this.handleButtonPress}
                                    >

                                        <Draggable key={item.id} draggableId={item.id} index={index}
                                                   isDragDisabled={this.state.isDragDisabled}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}

                                                    className={"uploadingImageCard"}
                                                >
                                                    <div className={"uploadingImageImage"}><img src={item.content}/></div>
                                                    <div className={"upLoadingImageDeleteButton"} onClick={() => this.deleteProductImage(index)}>
                                                        <img src={require("./image/hashX.png")}/>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    </div>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                <div className="addMoreContentsButtonWrapper" id={"addContentButton"} onClick={this.productImageSelect}>
                    <div className={"plusButton"}><img src={require("./image/plusButton.png")}  /></div>
                    <div className={"plusButtonText"}><a>상품 이미지 선택</a></div>
                </div>
                <input type={"file"} multiple name={"productImage"} accept=".png,.jpg,.jpeg" onChange={(e) => this.productImageSelected(e)} ref={this.productImageSelectRef} style={{display: "none"}}/>

                <TextareaAutosize className={"productName"} placeholder={"상품명"} ref={this.productNameRef} value={this.state.productName} onChange={(e) => this.productNameEdit(e)}/>

                <div className={"productInputWrapper"}>
                    <AutosizeInput
                        name="form-field-name"
                        placeholder={"가격"}
                        value={this.state.productDefaultPrice}
                        style={{ fontSize: 24}}
                        onChange={(e) => this.changeDefaultPrice(e)}
                    />
                    <div className={"priceCurrency"}><a>원</a></div>

                    <div className={"priceCurrency"} style={{marginLeft: "24px"}}><a>총</a></div>
                    <AutosizeInput

                        type={"number"}
                        name="form-field-name"
                        placeholder={"재고"}
                        value={this.state.totalInventory}
                        style={{ fontSize: 24,
                            marginLeft: "8px"
                        }}
                        extraWidth={0}
                        onChange={(e) => this.totalInventoryEdit(e)}
                    />
                    <div className={"priceCurrency"}><a>개</a></div>
                </div>

                <div className={"optionInputWrapper"}>
                    {this.state.options.map((i, index) => {
                        return (
                            <div className={"priceOption"}>
                                <div className={"optionDataWrapper"}>

                                    <div className={"optionNameInput"}>
                                        <AutosizeInput placeholder={"옵션명"} value={this.state.options[index].name} index={index}
                                                       ref={this.inputNameRef} onChange={(e) => this.optionNameAdded(e)} style={{maxWidth: "100%"}}/>
                                    </div>

                                    <div className={"optionPriceInventoryWrapper"}>
                                        <div>
                                            <AutosizeInput type={"number"} placeholder={"추가 금액"} value={this.state.options[index].price} index={index}
                                                           extraWidth={0}  onChange={(e) => this.optionPriceAdded(e)}/>
                                        </div>
                                        <div className={"optionData"}><a>원</a></div>
                                        <div className={"inventoryNumber"}>
                                            <AutosizeInput type={"number"} placeholder={"재고"} value={this.state.options[index].inventory} index={index}
                                                           extraWidth={0} onChange={(e) => this.inventoryDataAdded(e)}/>
                                        </div>
                                        <div className={"optionData"}><a>개</a></div>
                                    </div>

                                </div>

                                <div className={"deleteContentButton"} onClick={() => this.deleteOption(index)}>
                                    <img src={require("./image/plusButton.png")}/>
                                </div>

                            </div>
                        );
                    })}
                </div>

                <div className="addMoreContentsButtonWrapper" id={"addContentButton"} onClick={this.addOption}>
                    <div className={"plusButton"}><img src={require("./image/plusButton.png")}  /></div>
                    <div className={"plusButtonText"}><a>상품 옵션 추가</a></div>
                </div>

                <div className={"priceOption extraInfo"}>
                    <div className={"optionDataWrapper"}>

                        <div className={"optionPriceInventoryWrapper"}>
                            <div>
                                <AutosizeInput
                                    type={"number"}
                                    placeholder={"할인율"}
                                    value={this.state.discountRate}
                                    extraWidth={0}
                                    onChange={(e) => this.discountRate(e)}
                                    style={{fontSize: "24px"}}
                                />
                            </div>
                            <div className={"optionData extraInfoText"}><a>% off</a></div>
                        </div>

                    </div>

                </div>


                <div className={"priceOption extraInfo"}>
                    <div className={"optionDataWrapper"}>

                        <div className={"optionPriceInventoryWrapper"}>
                            <div>
                                <AutosizeInput
                                    type={"number"}
                                    placeholder={"커미션 지급률"}
                                    value={this.state.commission}
                                    extraWidth={0}
                                    onChange={(e) => this.commission(e)}
                                    style={{fontSize: "24px"}}
                                />
                            </div>
                            <div className={"optionData extraInfoText"}><a>%</a></div>
                        </div>

                    </div>

                </div>

                <div className={"priceOption extraInfo"}>
                    <div className={"optionDataWrapper"}>

                        <div className={"optionPriceInventoryWrapper"}>
                            <div>
                                 예상 판매가 : {predictedSellingPrice.toLocaleString()}
                            </div>
                            <div className={"optionData extraInfoText"}><a>원</a></div>
                        </div>

                    </div>

                </div>

                <div className={"priceOption extraInfo"}>
                    <div className={"optionDataWrapper"}>

                        <div className={"optionPriceInventoryWrapper"}>
                            <div>
                                예상 정산 금액 : {predictedProfit.toLocaleString()}
                            </div>
                            <div className={"optionData extraInfoText"}><a>원</a></div>
                        </div>

                    </div>

                </div>


                <div className={"priceOption extraInfo"}>
                    <div className={"optionDataWrapper"}>

                        <div className={"optionPriceInventoryWrapper"}>
                            <div>
                                <AutosizeInput
                                    type={"number"}
                                    placeholder={"배송비"}
                                    value={this.state.shippingCost}
                                    extraWidth={0}
                                    onChange={(e, extra) => this.shippingCost(e, "normal")}
                                    style={{fontSize: "24px"}}
                                />
                            </div>
                            <div className={"optionData extraInfoText"}><a>원</a></div>



                            <div className={"extraShippingcost"}><a>도서 산간 지역</a></div>
                            <div className={"inventoryNumber"}>
                                <AutosizeInput
                                    type={"number"}
                                    placeholder={"배송비"}
                                    value={this.state.extraShippingCost}
                                    onChange={(e, extra) => this.shippingCost(e, "extra")}
                                    extraWidth={0}

                                    style={{fontSize: "24px"}}
                                />
                            </div>
                            <div className={"optionData extraInfoText"}><a>원</a></div>
                        </div>

                    </div>

                </div>




                <div className={"productDescriptionImageContainer"}>
                    {this.state.productDescriptionImages.map((i, index) => {
                        return (
                            <div className={"productDescriptionImageWrapper"}>
                                <div className={"productDescriptionImage"}><img src={i.content}/></div>
                                <div className={"productDescriptionImageDelete"}><img src={require("./image/plusButton.png")} onClick={() => this.deleteImage(index)}/></div>
                            </div>
                        );
                    })}
                </div>

                <div className="addMoreContentsButtonWrapper" id={"addContentButton"} onClick={this.selectImage}>
                    <div className={"plusButton"}><img src={require("./image/plusButton.png")}  /></div>
                    <div className={"plusButtonText"}><a>상세 페이지 이미지 선택</a></div>
                </div>
                <input type={"file"} multiple accept=".png,.jpg,.jpeg" onChange={this.imageSelected} ref={this.imageSelectRef} style={{display: "none"}}/>

                <TextareaAutosize className={"productDescriptionTextInput"} placeholder={"상품설명"} ref={this.productNameRef} value={this.state.productDescriptionText} onChange={(e) => this.productDescriptionEdit(e)}/>

                <div className={"addedHashtagContainer"}>
                    {this.state.hashTagList.map((i, index) => {
                        return (
                            <div className="hashTag" key={index}>
                                <div className={"hashTagAdded"}><p>#{i}</p></div>
                                <div><img className="hashClose" id="close1" src={close} onClick={() => this.deleteHastTag(index)}/></div>
                            </div>
                        );
                    })}
                </div>
                <div className={"addButton"} onClick={this.handleCloseSearchView}><a>태그 추가</a></div>

                <div className="saveButton" id={"addProductSaveID"} onClick={this.savePressed}><a>상품 등록</a></div>

                {this.state.searchView}
                {this.state.alertMessage}


            </div>
        );
    }

    // onOpen(value) {
    //     var url = "http://www.ftc.go.kr/bizCommPop.do?wrkr_no=" + value;
    //     window.open(url, "bizCommPop", "width=750, height=700;");
    // }

}

export default AddProductView;