import React, {Component} from "react";
import "./js/components/Basket.css";
import Footer from "./Footer.js";
import {deleteItem, getItemsInCart, setCartItemCount, setIsChecked, setQuantity} from "./actions/cart";
import { withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {RestApi} from "./util/Constants";
import {setCount} from "./actions/notification";
import AutosizeInput from 'react-input-autosize';
import {nicepayScript} from "./App";

class Basket extends Component{
    constructor(props) {
        super(props)

        this.state = {
            // items: this.props.getItemsInCart(),
            orderList: [],
            isAllChecked: true,
            isCheckedArray: [],
            totalProductCost: 0,
            totalShippingCost: 0,
            totalDiscountedAmount: 0,
            totalCost: 0,
            items: []
        }

        this.orderPressed = this.orderPressed.bind(this)
        this.deleteItem = this.deleteItem.bind(this)

        this.orderButtonClicked = this.orderButtonClicked.bind(this)

        this.orderAll = this.orderAll.bind(this)
        this.checkAllClicked = this.checkAllClicked.bind(this)
        this.totalShippingCostCalc = this.totalShippingCostCalc.bind(this)
        this.deleteSelected = this.deleteSelected.bind(this)
        this.orderSelected = this.orderSelected.bind(this)

        this.changeOrderNumber = this.changeOrderNumber.bind(this)

        this.props.getItemsInCart()
        this.props.setNotificationCount();
        this.props.setCartItemCount()

    }

    componentDidMount() {
        // let nicePayScript = document.createElement('script');
        // nicePayScript.type = 'text/javascript';
        // nicePayScript.src = "https://web.nicepay.co.kr/v3/webstd/js/nicepay-2.0.js"
        // document.body.scrollTop = 0
        // nicePayScript.characterSet = "utf-8";
        // document.head.appendChild(nicePayScript);

        nicepayScript.onload = function () {

        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.items !== this.props.items){
            this.setState({items: this.props.items})
        }
    }


    deleteItem(cartId) {


        this.props.deleteItem(cartId)

    }

    orderAll() {

    }

    checkAllClicked() {

        let isAllChecked = true;

        if(this.state.isAllChecked){
            isAllChecked = false;
        }else{

            isAllChecked = true
        }

        this.setState({isAllChecked: !this.state.isAllChecked}, () => {
            this.props.checkStatus.forEach(elem => {
                let params = {
                    cartId: elem.cartId,
                    isChecked: isAllChecked
                }

                this.props.setIsChecked(params)
            })
        })

    }

    checkClicked(cartId) {

        let checkedArray = this.props.checkStatus.filter(x => x.cartId === cartId);

        if(checkedArray.length > 0){

            let params = {
                cartId: cartId,
                isChecked: !checkedArray[0].isChecked
            };

            this.props.setIsChecked(params);


        }



    }

    totalShippingCostCalc() {

        let totalShippingCost = 0;
        let uniqueNames = [];


        let object = Object.assign([], this.state.orderList)

        for (var i = 0; i < object.length; i++) {
            if (object[i].isChecked === true) {

                let uniqueNameCount = 0

                uniqueNames.push(object[i].sellerName)

                for (var j = 0; j < uniqueNames.length; j++) {
                    if (object[i].sellerName === uniqueNames[j]) {
                        uniqueNameCount += 1;
                    }
                }

                if (uniqueNameCount === 1) {
                    totalShippingCost += object[i].shippingCost;
                }
            }
        }
        this.setState({totalShippingCost: totalShippingCost})
    }

    orderButtonClicked() {

        let path = '/Order'
        let basketList = []


        this.props.items.forEach(item => {
            if(item.isChecked){
                console.log(item)
                basketList.push(item)
            }
        })


        if (basketList.length > 0) {
            this.props.history.push({
                pathname: path,
                state: {

                    orderList: basketList
                }
            })
        } else {
            alert("제품을 1개 이상 선택해 주세요")
        }


    }

    orderPressed(cartId) {
        let path = '/Order'

        let items = this.props.items.filter(x => x.cartId === cartId)
        let basketList = [];

        if(items.length > 0){
            basketList.push(items[0])
        }


        if (basketList.length > 0) {
            this.props.history.push({
                pathname: path,
                state: {

                    orderList: basketList
                }
            })
        } else {
            alert("제품을 1개 이상 선택해 주세요")
        }

    }

    deleteSelected() {

        this.props.items.forEach(item => {
            if(item.isChecked){
                this.props.deleteItem(item.cartId)
            }
        })

    }

    orderSelected(e, id) {

        let checkedArray = this.props.items.filter(x => x.cartId === id);


        let params = {
            cartId: id,
            isChecked: !checkedArray[id].isChecked
        };

        this.props.setIsChecked(params);

    }

    changeOrderNumber(e, cartId) {


        let quantity = e.target.value;
        let filteredArray = this.state.items.filter(x => x.cartId === cartId);

        let newArray = []

        if(filteredArray.length > 0){
            let index = this.state.items.indexOf(filteredArray[0]);

            this.state.items.forEach((item, itemIndex) => {
                if(index === itemIndex){
                    let newItem = item;
                    newItem.orderQuantity = quantity
                    newArray.push(newItem)
                }else{
                    newArray.push(item)
                }
            })
        }

        let self = this;

        this.setState({items: newArray}, () => {
            let params = {
                cartId: cartId,
                quantity: quantity
            }

            console.log(cartId, quantity)

            self.props.setQuantity(params)
        })

        this.props.setCartItemCount(e.target.value);

    }

    render() {

        let currency;

        let totalProductCost = 0;
        let totalShippingCost = 0;
        let totalDiscountedAmount = 0;
        let totalCost = 0;
        let originalTotalPrice = 0;



        return (
            <div>
                <div className={"basketBody"}>
                    <div className={"orderProcess"}>
                        <div className={"basketTitle"}>장바구니</div>
                        <div className={"orderStepWrapper"}>
                            <div className={"orderStep"} style={{fontWeight: "bold"}}>장바구니<img src={require("./image/arrowNext.png")}/></div>
                            <div className={"orderStep"}>주문 / 결제<img src={require("./image/arrowNext.png")}/></div>
                            <div className={"orderStep"}>결제 완료</div>
                        </div>
                    </div>

                    {/*<div className={"basketWarning"}>*/}
                    {/*    <li>가격, 옵션등 상품 정보가 변경된 경우 주문을 할 수 없습니다.</li>*/}
                    {/*    <li>주문 시간과 판매자의 일정에 따라 당일 출고가 불가피 할 수 있습니다.</li>*/}
                    {/*</div>*/}

                    <div className={"basketLine"}/>
                    <div className={"basketTable"}>

                        <div className={"tableTopBox"}>
                            <div className={"allCheckBox"}>
                                <input type={"checkBox"} checked={this.state.isAllChecked} onChange={this.checkAllClicked}/>
                            </div>
                            <div className={"allCheckBox allCheckBoxText"}>Check All</div>
                        </div>

                        {this.state.items.map((i, index) => {

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


                            if (i.product.currency === "KRW") {
                                currency = "₩"
                            }

                            //let productPrice = (parseInt(i.product.price) + parseInt(i.option.priceAddition));

                            //console.log(productPrice)

                            let discountedAmount = productPrice*(parseInt(i.product.discountRate)/100);
                            let orderCost = (productPrice - discountedAmount) * i.orderQuantity + parseInt(i.product.shippingCost);
                            let costWithoutShippingCost = (productPrice - discountedAmount) * i.orderQuantity;
                            let isCheckedArr = this.props.checkStatus.filter(x => x.cartId === i.cartId);

                            let isChecked = false;



                            if(isCheckedArr.length > 0){


                                isChecked = isCheckedArr[0].isChecked;


                                if(isCheckedArr[0].isChecked){
                                    totalProductCost += ( productPrice * i.orderQuantity);

                                    totalDiscountedAmount += (discountedAmount * i.orderQuantity) ;

                                    totalCost += costWithoutShippingCost;

                                }
                            }

                            let inputWidth = {
                                'width': '40px'
                            }

                            return (
                                <div className={"basketItemWrapper"} id={index + "basketItem"}>
                                    <div >
                                        <input type={"checkBox"} checked={isChecked} onChange={() => this.checkClicked(i.cartId)}/>
                                    </div>

                                    <div className={"basketOrderInfo"}>
                                        <div>
                                            <div className={"productInfo"}>
                                                <div className={"productInfoImg"}><img src={(i.productImages.length > 0) ? RestApi.prod + i.productImages[0] : 'placeholder'}/></div>
                                                <div className={"productInfoText"}>
                                                    <div>{i.product.title}</div>
                                                    <div>선택옵션: {option}</div>

                                                </div>
                                            </div>
                                        </div>

                                        <div>

                                        </div>

                                        <div className={"orderInfo"}>
                                            <div>판매자</div>
                                            <div className={"orderData"}>{i.seller.sellerName}</div>
                                        </div>



                                        <div className={"orderInfo"}>
                                            <div>주문 수량 {currency}{productPrice.toLocaleString()} <input style={inputWidth} type={"number"} value={i.orderQuantity} onChange={(e, id) => this.changeOrderNumber(e, i.cartId)}/>개</div>
                                            <div className={"orderData"}>{currency}{(productPrice * i.orderQuantity).toLocaleString()}</div>
                                        </div>

                                        <div className={"orderInfo"}>
                                            <div>총 할인 금액({i.product.discountRate}%)</div>
                                            <div className={"orderData"}>-{currency}{(discountedAmount * i.orderQuantity).toLocaleString()}</div>
                                        </div>

                                        <div className={"orderInfo"}>
                                            <div>배송비</div>
                                            <div className={"orderData"}>{currency}{(parseInt(i.product.shippingCost)).toLocaleString()}</div>
                                        </div>



                                        <div className={"orderInfo"}>
                                            <div>총 주문 금액</div>
                                            <div className={"orderData"} style={{fontWeight: "bold", fontSize: "20px"}}>{currency}{orderCost.toLocaleString()}</div>
                                        </div>


                                        <div className={"basketButtonFlex"}>
                                            <div className={"basketTableButton"} onClick={() => this.orderPressed(i.cartId)}>주문</div>
                                            <div className={"basketTableButton"} onClick={() => this.deleteItem(i.cartId)}>삭제</div>
                                        </div>


                                    </div>


                                </div>
                            );
                        })}

                    </div>

                    <div className={"finalAmountLine"}></div>

                    <div className={"selectButtonWrapper"}>
                        <div className={"basketTableButton"} style={{marginRight: "16px"}} onClick={this.deleteSelected}>선택 상품 삭제</div>
                        <div className={"basketTableButton"} onClick={this.orderButtonClicked}>선택 상품만 주문</div>
                    </div>

                    <div className={"finalAmountLine lienBelowFinalAmount"}></div>

                    <div className={"finalAmountWrapper"}>
                        <div className={"finalAmountDiv"}>
                            <div className={"calculatedAmountText"}>총 상품 금액</div>
                            <div className={"calculatedAmountText"}>총 배송비</div>
                            <div className={"calculatedAmountText"}>총 할인 금액 (-)</div>
                            <div className={"calculatedAmountText basketOrderPaymentAmount"}>결제 금액</div>
                        </div>

                        <div className={"finalAmountDiv"}>
                            <div className={"calculatedAmountText calculatedAmount"}>{currency}{totalProductCost.toLocaleString()}</div>
                            <div className={"calculatedAmountText calculatedAmount"}>{currency}{this.props.totalShippingCost.toLocaleString()}</div>
                            <div className={"calculatedAmountText calculatedAmount"}>{currency}{totalDiscountedAmount.toLocaleString()}</div>
                            <div className={"calculatedAmountText calculatedAmount basketOrderPaymentAmount"}>{currency}{(totalCost + this.props.totalShippingCost).toLocaleString()}</div>

                        </div>
                    </div>



                    <div className={"orderButton"} onClick={() => this.orderButtonClicked("orderButton")}>주문 하기</div>

                    <form name="payForm">
                        <input type="hidden" name="Amt" value={totalCost}/>
                    </form>
                </div>

                <Footer/>
            </div>
        );
    }
}


let mapDispatchToProps = (dispatch) => {
    return {
        setQuantity: (params) => dispatch(setQuantity(params)),
        getItemsInCart: () => dispatch(getItemsInCart()),
        setIsChecked: (params) => dispatch(setIsChecked(params)),
        setNotificationCount: () => dispatch(setCount()),
        setCartItemCount: () => dispatch(setCartItemCount()),
        deleteItem: (cartId) => dispatch(deleteItem(cartId))
    }
};

let mapStateToProps = (state) => {
    //console.log(state.cart)
    return {
        totalShippingCost: state.cart.totalShippingCost,
        checkStatus: state.cart.checkStatus,
        items: state.cart.items
    }
};

Basket = connect(mapStateToProps, mapDispatchToProps)(Basket);

export default withRouter(Basket);