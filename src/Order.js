import React, { Component } from "react";
import Footer from "./Footer.js";
import "./js/components/Basket.css";
import AddAddressView from "./AddAddressView";
import { withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {order, setOrderItemShippingCost} from "./actions/cart";
import {RestApi, PAYMENT_OPTION, getUniqueId} from "./util/Constants";
import {isMobile} from "./util/Constants";
import {getAddress, getMyInfo} from "./actions/user";

class Order extends Component {
    constructor(props) {
        super(props);

        this.state = {
            orderList: [],

            totalProductCost: 0,
            totalShippingCost: 0,
            totalDiscountedAmount: 0,
            totalCost: 0,
            addressList: [],
            selectedAddressId: '',
            selectedAddress: "",
            selectedZonecode: '',

            receiverName: "",
            receiverPhoneNumber: "",

            requestOptionOpen: false,
            paymentOptionOpen: false,
            requestMessage: "",
            addressEdit: null,
            paymentMethod: '',
            payment: '',
            newAddress: '',
            newReceiverName: '',
            newReceiverPhoneNumber: '',
            billingName: '',
            billingEmail: ''
            // billingPhoneNo: '',
            // billingZipcode: ''
        };


        this.totalProductCost = 0;
        this.totalDiscountedAmount = 0;

        this.orderButtonClicked = this.orderButtonClicked.bind(this)
        this.addressSelected = this.addressSelected.bind(this)
        this.totalCostCalc = this.totalCostCalc.bind(this)
        this.optionArrowClicked = this.optionArrowClicked.bind(this)
        this.requestOptionClicked = this.requestOptionClicked.bind(this)
        this.addressEditOpen= this.addressEditOpen.bind(this)
        this.updateRequestMessage = this.updateRequestMessage.bind(this)

        this.props.getAddress();
        this.props.getMyInfo();

    }

    componentDidMount() {
        this.setState({orderList: this.props.location.state.orderList}, () => {
            this.totalCostCalc()
            this.props.setOrderItemShippingCost(this.props.location.state.orderList)

        });


        this.addressSelected(0)


        window.scrollTo(0, 0)



    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.addresses !== this.props.addresses){

            this.setState({addressList: this.props.addresses}, () => {

                this.state.addressList.forEach((item, index) => {

                    if (item.isDefaultAddress) {
                        this.addressSelected(index)
                    }

                })
            })

            let addresses = this.props.addresses.filter(x => x._id === this.state.selectedAddressId)

            if(addresses.length > 0){
                let selAddress = addresses[0];
                let address = selAddress.content.roadAddress + ' ' + selAddress.content.addressDetail;
                let phonumber = selAddress.content.phoneNumber;
                let receiverName = selAddress.content.receiverName;
                let zonecode = selAddress.content.zonecode;
                let addressId = selAddress._id;

                if(this.state.newAddress.length > 0){

                    this.setState({

                        selectedAddress: this.state.newAddress,
                        receiverName: this.state.newReceiverName,
                        receiverPhoneNumber: this.state.newReceiverPhoneNumber
                    })

                }else{

                    this.setState({
                        selectedAddressId: addressId,
                        selectedAddress: address,
                        receiverName: receiverName,
                        receiverPhoneNumber: phonumber,
                        selectedZonecode: zonecode
                    })

                }
            }else{
                this.props.addresses.forEach(address => {


                    if(address.isDefaultAddress){



                        let selAddress = address.content.roadAddress + ' ' + address.content.addressDetail;
                        let phonumber = address.content.phoneNumber;
                        let receiverName = address.content.receiverName;
                        let addressId = address._id;
                        let zonecode = address.zonecode;

                        this.setState({
                            selectedAddressId: addressId,
                            selectedAddress: selAddress,
                            receiverName: receiverName,
                            receiverPhoneNumber: phonumber,
                            selectedZonecode: zonecode
                        })
                    }
                })
            }
        }

        if(prevProps.myInfo !== this.props.myInfo){

            this.setState({billingName: this.props.myInfo.fullName, billingEmail: this.props.myInfo.email})
        }
    }

    optionArrowClicked() {
        this.setState({requestOptionOpen: !this.state.requestOptionOpen})
    }

    paymentOptionArrowClicked = () => {
        this.setState({paymentOptionOpen: !this.state.paymentOptionOpen})
    }

    addressSelected(indexNum) {

        let newList = [];

        this.state.addressList.forEach((item, index) => {

            let newData = item;
            newData.isSelected = false;

            if (index === indexNum) {

                newData.isSelected = true;

                let address = newData.content.roadAddress + ' ' + newData.content.addressDetail;
                let phonumber = newData.content.phoneNumber;
                let receiverName = newData.content.receiverName;
                let addressId = newData._id;
                let zonecode = newData.content.zonecode;
                this.setState({
                    selectedAddressId: addressId,
                    selectedAddress: address,
                    receiverName: receiverName,
                    receiverPhoneNumber: phonumber,
                    selectedZonecode: zonecode
                })
            }else{
                newData.isSelected = false
            }

            newList.push(newData)
        });




        this.setState({addressList: newList})

    }


    totalCostCalc() {

        let totalShippingCost = 0
        let totalOrderAmountBeforeDiscount = 0
        let totalDiscountedAmount = 0
        let finalAmount = 0
        let uniqueNames = []
        let object = Object.assign([], this.state.orderList)

        // console.log("shipping cost" + object[0].seller.shippingCost)

        for (let i = 0; i < object.length; i++) {
            if (i > 0) {
                uniqueNames.forEach((a, index) => {
                    // console.log("id for state" + object[i].seller.sellerId)
                    // console.log("id for array" + a.shippingCost)
                    if (a.sellerId !== object[i].seller.sellerId) {
                        uniqueNames.push(object[i].seller)
                        totalShippingCost += a.shippingCost
                        //console.log("id different")
                    } else {
                        //console.log("id same")
                        if (a.shippingCost > object[i].seller.shippingCost) {
                            totalShippingCost += (a.shippingCost - object[i].seller.shippingCost)
                        }
                    }
                })
            } else {
                uniqueNames.push(object[i].seller)
                totalShippingCost += object[i].seller.shippingCost
            }

            let productCost = ((object[i].product.price + object[i].option.priceAddition ) * object[i].quantity)
            let discountAmount = (productCost * (object[i].product.discountRate/100))
            let discountedCost = (productCost - discountAmount)

            totalOrderAmountBeforeDiscount += productCost
            totalDiscountedAmount += discountAmount
            finalAmount += discountedCost
        }


        this.setState({
            totalProductCost: totalOrderAmountBeforeDiscount,
            totalShippingCost: totalShippingCost,
            totalDiscountedAmount: totalDiscountedAmount,
            totalCost: finalAmount + totalShippingCost,
        })
    }

    orderButtonClicked(from) {

        if(this.state.paymentMethod.length <= 0){
            alert('결제 방식을 선택해 주세요.');
            return;
        }

        // if(this.state.billingName.length <= 0){
        //     alert('청구상세 이름을 입력해주세요.');
        //     return;
        // }
        //
        // if(this.state.billingEmail.length <= 0){
        //     alert('청구상세 이메일 주소를 입력해주세요.');
        //     return;
        // }
        //
        // if(this.state.billingPhoneNo.length <= 0){
        //     alert('청구상세 전화번호를 입력해주세요.');
        //     return;
        // }

        // if(this.state.billingZipcode.length <= 0){
        //     alert('청구상세 우편번호를 입력해주세요.');
        //     return;
        // }

        let cartIds = [];

        this.state.orderList.forEach(item => {
            //console.log(item)

            cartIds.push(item.cartId)
        });

        let productNames = '';

        let numOfProduct  = 0;


        this.state.orderList.forEach(item => {
            if(numOfProduct === 0){
                productNames = item.product.title
            }
            numOfProduct ++;
        });

        if(numOfProduct > 1){
            productNames = productNames + ' 외 ' + (numOfProduct - 1).toString() + '종'
        }

        let amount = this.totalProductCost + this.props.totalShippingCost - this.totalDiscountedAmount


        let params = {
            uniqueId: getUniqueId(),
            cartIds: cartIds,
            paymentMethod: this.state.paymentMethod,
            amount: amount,
            items: JSON.stringify(this.state.orderList),
            productNames: productNames,
            isMobile: false,
            receiverName: this.state.receiverName,
            address: this.state.selectedAddress,
            zonecode: this.state.selectedZonecode,
            phoneNumber: this.state.receiverPhoneNumber,
            requestMessage: this.state.requestMessage,
            billingInfoName: this.state.billingName,
            billingInfoEmail: this.state.billingEmail,
            billingInfoPhoneNo: this.state.receiverPhoneNumber,
            // billingInfoZipcode: this.state.billingZipcode
        };


        if(isMobile()){
            params.isMobile = true
        }else{

        }

        this.props.order(params, ()=> {

            this.props.history.push({
                pathname: '/Pay',
                state: {
                    params: params
                }
            })

        })


    }

    requestOptionClicked(message) {

        this.setState({requestMessage: message})
        this.optionArrowClicked()

    }

    addressEditOpen(editInfo, newAddress) {

        if (this.state.addressEdit === null ) {

            console.log(this.state)


            if(editInfo){

                let address = this.props.addresses.filter(x => x._id === this.state.selectedAddressId)

                console.log(this.props.addresses)

                console.log(address[0])
                let content = {

                    addressDetail: address[0].content.addressDetail,
                    addressName: address[0].content.addressName,
                    jibunAddress: address[0].content.jibunAddress,
                    phoneNumber: address[0].content.phoneNumber,
                    receiverName: address[0].content.receiverName,
                    roadAddress: address[0].content.roadAddress,
                    zonecode: address[0].content.zonecode,
                    isDefaultAddress: address[0].isDefaultAddress,
                    addressId: address[0].addressId
                }

                if(address.length > 0){
                    this.setState({addressEdit : <AddAddressView closeView={this.addressEditOpen} editInfo={true} content={content}/>})
                }



            }else{
                let self = this;

                new window.daum.Postcode({
                    onComplete: function (data) {


                        self.setState({


                            newAddress: '',
                            newReceiverName: '',
                            newReceiverPhoneNumber: ''
                        });

                        let content = {
                            isDefaultAddress: false,
                            addressName: '',
                            roadAddress: data.roadAddress,
                            jibunAddress: data.jibunAddress,
                            addressDetail: '',
                            zonecode: data.zonecode,
                            receiverName: '',
                            phoneNumber: ''
                        }



                        self.setState({addressEdit : <AddAddressView closeView={(isNew, newAddress) => self.addressEditOpen(isNew, newAddress)} editInfo={true} content={content}/>})
                    }
                }).open()
            }


        } else {


            if(newAddress !== undefined && newAddress !== null){
                let address = newAddress.content.roadAddress + ' ' + newAddress.content.addressDetail
                let phonumber = newAddress.content.phoneNumber
                let receiverName = newAddress.content.receiverName

                this.setState({

                    selectedAddressId: newAddress.addressId,
                    selectedAddress: address,
                    receiverName: receiverName,
                    receiverPhoneNumber: phonumber,

                    newAddress: address,
                    newReceiverName: receiverName,
                    newReceiverPhoneNumber: phonumber
                })
            }



            this.setState({addressEdit : null})
        }




    }

    updateRequestMessage(e) {
        this.setState({requestMessage:e.target.value})
    }

    updatePaymentMethod = (paymentMethod) => {



        this.setState({paymentMethod:paymentMethod})

        if(paymentMethod === PAYMENT_OPTION.CARD){
            this.setState({payment:'신용카드'})
        }else if(paymentMethod === PAYMENT_OPTION.CELLPHONE){
            this.setState({payment:'휴대전화 소액결제'})
        }else if(paymentMethod === PAYMENT_OPTION.BANK){
            this.setState({payment:'계좌이체'})
        }else if(paymentMethod === PAYMENT_OPTION.VBANK){
            this.setState({payment:'가상계좌결제'})
        }

        this.paymentOptionArrowClicked()
    };

    updateBillingName = (event) => {
        this.setState({billingName: event.target.value.trim()})
    };

    updateBillingEmail = (event) => {
        this.setState({billingEmail: event.target.value.trim()})
    };

    updateBillingPhoneNo = (event) => {
        this.setState({billingPhoneNo: event.target.value.trim()})
    };

    updateBillingZipcode = () => {
        let self = this;

        new window.daum.Postcode({
            onComplete: function (data) {
                console.log(data)

                self.setState({billingZipcode: data.zonecode})
            }
        }).open()


    };


    render() {
        let currency;

        let totalProductCost = 0
        let totalShippingCost = 0
        let totalDiscountedAmount = 0
        let totalCost = 0

        this.totalDiscountedAmount = 0;
        this.totalProductCost = 0;

        return (
            <div>
                <div className={"basketBody"}>
                    <div className={"orderProcess"}>
                        <div className={"basketTitle"}>주문 / 결제</div>
                        <div className={"orderStepWrapper"}>
                            <div className={"orderStep"}>장바구니<img src={require("./image/arrowNext.png")}/></div>
                            <div className={"orderStep"} style={{fontWeight: "bold"}}>주문 / 결제<img src={require("./image/arrowNext.png")}/></div>
                            <div className={"orderStep"}>결제 완료</div>
                        </div>
                    </div>

                    <div className={"finalAmountLine lineBeforePurchasingItem"}/>

                    <div className={"basketTable"}>

                        {this.state.orderList.map((i, index) => {



                            if (i.product.currency === "KRW") {
                                currency = "₩"
                            }

                            let productPrice = parseInt(i.product.price);
                            let option = '';

                            if(i.option.title === "추가 옵션이 없습니다." || i.option.length === 0){
                                option = '없음'
                            }else{
                                if(i.option.priceAddition !== null && i.option.priceAddition !== undefined){

                                    productPrice += parseInt(i.option.priceAddition);
                                    option = i.option.title + ' (+' + parseInt(i.option.priceAddition).toLocaleString() + '원)'

                                }
                            }


                            let discountedAmount = productPrice*(parseInt(i.product.discountRate)/100);
                            let orderCost = ( productPrice - discountedAmount ) * i.orderQuantity + parseInt(i.product.shippingCost);
                            let costWithoutShippingCost = productPrice - discountedAmount;

                            totalProductCost += ( productPrice * i.orderQuantity );
                            this.totalProductCost += ( productPrice * i.orderQuantity )

                            totalDiscountedAmount += (discountedAmount * i.orderQuantity);
                            this.totalDiscountedAmount +=  (discountedAmount * i.orderQuantity);

                            totalCost += costWithoutShippingCost;
                            totalCost += this.props.totalShippingCost;

                            return (
                                <div className={"basketItemWrapper "} id={index + "basketItem"}>

                                    <div className={"basketOrderInfo orderPageBasket "}>

                                        <div className={"productInfo "}>
                                            <div className={"productInfoImg"}><img src={(i.productImages.length > 0) ? RestApi.prod + i.productImages[0] : 'placeholder'}/></div>
                                            <div className={"productInfoText"}>
                                                <div className={"productTitle"}>{i.product.title}</div>
                                                <div className={"productOption"}>선택옵션: {option}</div>

                                            </div>
                                        </div>

                                        <div className={"orderInfoSellerInfo"}>

                                            <div className={"orderInfo"}>
                                                <div>판매자</div>
                                                <div className={"orderData"}>{i.seller.sellerName}</div>
                                            </div>



                                            <div className={"orderInfo"}>
                                                <div>주문 수량 ({i.orderQuantity}개)</div>
                                                <div className={"orderData"}>{currency}{(productPrice * i.orderQuantity).toLocaleString()}</div>
                                            </div>

                                            <div className={"orderInfo"}>
                                                <div>총 할인 금액 ({i.product.discountRate}%)</div>
                                                <div className={"orderData"}>-{currency}{(discountedAmount * i.orderQuantity).toLocaleString()}</div>
                                            </div>

                                            <div className={"orderInfo"}>
                                                <div>배송비</div>
                                                <div className={"orderData"}>{currency}{parseInt(i.product.shippingCost).toLocaleString()}</div>
                                            </div>



                                            <div className={"orderInfo"}>
                                                <div>총 주문 금액</div>
                                                <div className={"orderData"} style={{fontWeight: "bold", fontSize: "20px"}}>{currency}{orderCost.toLocaleString()}</div>
                                            </div>

                                        </div>


                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    <div className={"orderButton"} onClick={() => this.orderButtonClicked("orderButton")}>바로 결제</div>

                    <div className={"finalAmountLine"}/>


                    <div className={"finalAmountWrapper"}>
                        <div className={"finalAmountDiv"}>
                            <div className={"calculatedAmountText"}>총 상품 금액</div>
                            <div className={"calculatedAmountText"}>총 배송비</div>
                            <div className={"calculatedAmountText"}>총 할인 금액</div>
                            <div className={"calculatedAmountText basketOrderPaymentAmount"}>총 결제 금액</div>
                        </div>

                        <div className={"finalAmountDiv"}>
                            <div className={"calculatedAmountText calculatedAmount"}>{currency}{totalProductCost.toLocaleString()}</div>
                            <div className={"calculatedAmountText calculatedAmount"}>{currency}{this.props.totalShippingCost.toLocaleString()}</div>
                            <div className={"calculatedAmountText calculatedAmount"}>- {currency}{totalDiscountedAmount.toLocaleString()}</div>
                            <div className={"calculatedAmountText calculatedAmount basketOrderPaymentAmount"}>{currency}{(totalProductCost + this.props.totalShippingCost - totalDiscountedAmount).toLocaleString()}</div>

                        </div>
                    </div>

                    <div className={"finalAmountLine lienBelowFinalAmount"}/>

                    <div className={"shippingAddressSelect"}>
                        <div className={"basketTitle"}>배송지 정보</div>
                        <div className={"shippingAddressSelectButtonWrapper"}>
                            {this.props.addresses.map((i, index) => {
                                return (
                                    <div className={"addressListSelectButton"} key={index}>
                                        <input type={"checkBox"}
                                               checked={i.isSelected}
                                               onChange={() => this.addressSelected(index)}/> {i.content.addressName}
                                    </div>
                                );
                            })}

                            <div className={"addressListSelectButton addNewAddressButton"} onClick={() => this.addressEditOpen(false)}>신규 주소 등록</div>
                        </div>

                        <div className={"addressSelectLine"}/>

                        <div className={"addressInfoWrapper lineAboveAddressSelected"}>
                            <div className={"addressListSelectButton"}>
                                <div>{this.state.receiverName}</div>
                                <div>{this.state.receiverPhoneNumber}</div>
                                <div>{this.state.selectedAddress}</div>
                            </div>
                            <div className={"addNewAddressButtonAlignRight"}>
                                {(this.state.selectedAddress.length > 0 ) ? <div className={"addNewAddressButton "} onClick={() => this.addressEditOpen(true)}>정보 수정</div> : []}
                            </div>
                        </div>

                        <div className={"requestWrapper"}>
                            <input className={"requestInput"} value={this.state.requestMessage} onChange={(e) =>this.updateRequestMessage(e)} placeholder={"요청 사항 입력"}/><img  onClick={this.optionArrowClicked} src={require("./image/arrowDown.png")}/>
                        </div>

                        <div>
                            <div className={`requestSelectContainer ${this.state.requestOptionOpen ? "requestSelectContainerOpen" : "requestSelectContainerClose"}`}>
                                <div className={"requestSelectOption"} onClick={() => this.requestOptionClicked("문앞에 놓아주세요")}>문앞에 놓아주세요</div>
                                <div className={"requestSelectOption"} onClick={() => this.requestOptionClicked("부재시 전화 주세요")}>부재시 전화 주세요</div>
                                <div className={"requestSelectOption"} onClick={() => this.requestOptionClicked("부재시 경비실에 맞겨 주세요")}>부재시 경비실에 맞겨 주세요</div>
                                <div className={"requestSelectOption"} onClick={() => this.requestOptionClicked("부재시 문자 주세요")}>부재시 문자 주세요</div>
                            </div>
                        </div>

                        <div className={"requestWrapper selectPaymentWrapper"} onClick={this.paymentOptionArrowClicked} >
                            <input readOnly className={"requestInput"} value={this.state.payment} onChange={this.updatePaymentMethod} placeholder={"결제 방식 선택"}/><img onClick={this.paymentOptionArrowClicked} src={require("./image/arrowDown.png")}/>
                        </div>

                        <div>
                            <div className={`requestSelectContainer ${this.state.paymentOptionOpen ? "requestSelectContainerOpen" : "requestSelectContainerClose"}`}>
                                <div className={"requestSelectOption"} onClick={() => this.updatePaymentMethod(PAYMENT_OPTION.CARD)}>신용카드</div>
                                <div className={"requestSelectOption"} onClick={() => this.updatePaymentMethod(PAYMENT_OPTION.BANK)}>계좌이체</div>
                                <div className={"requestSelectOption"} onClick={() => this.updatePaymentMethod(PAYMENT_OPTION.CELLPHONE)}>휴대폰결제</div>
                                <div className={"requestSelectOption"} onClick={() => this.updatePaymentMethod(PAYMENT_OPTION.VBANK)}>가상계좌</div>
                            </div>
                        </div>

                    </div>

                    <div className={"orderButton lastOrderButton"} onClick={() => this.orderButtonClicked("orderButton")}>결제 하기</div>

                </div>

                <Footer/>
                {this.state.addressEdit}
            </div>

        );
    }
}


let mapDispatchToProps = (dispatch) => {
    return {
        setOrderItemShippingCost: (orderList) => dispatch(setOrderItemShippingCost(orderList)),
        getAddress: () => dispatch(getAddress()),
        order: (params, callback) => dispatch(order(params, callback)),
        getMyInfo: () => dispatch(getMyInfo())
    }
};

let mapStateToProps = (state) => {
    return {
        totalShippingCost: state.cart.totalShippingCost,
        nicepayBody: state.cart.nicepayBody,
        addresses: state.user.addresses,
        myInfo: state.stella.myInfo

    }
};

Order = connect(mapStateToProps, mapDispatchToProps)(Order);

export default withRouter(Order);