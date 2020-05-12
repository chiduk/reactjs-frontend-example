import React, { Component } from "react";
import "./js/components/ProfilePage.css";
import "./js/components/ProfileOrderList.css";
import {getOrderedItem} from "./actions/cart";
import {connect} from "react-redux";
import {
    EXCHANGE_STATUS, getUniqueId,
    ORDER_STATUS,
    REFUND_STATUS,
    RestApi,
    SHIPPING_STATUS,
    SWEET_TRACKER_API
} from "./util/Constants";
import {requestExchange, requestRefund} from "./actions/manager";
import {trackShipping} from  "./actions/cart"
import AlertMessage from "./AlertMessage";
import YesOrNoAlert from "./YesOrNoAlert";
import {withRouter} from "react-router";
import fetch from "cross-fetch";

class ProfileOrderStatus extends  Component {
    constructor(props) {
        super(props)
        this.state = {
            orderList: [],
            alertMessage: '',
            shippingCoCode: '',
            trackingNumber: ''
        };
        this.exchangeClicked = this.exchangeClicked.bind(this)
        this.returnProducClicked = this.returnProducClicked.bind(this)
        this.trackShipping = this.trackShipping.bind(this)
        this.addToBasket = this.addToBasket.bind(this)
        this.writeReview = this.writeReview.bind(this)

        this.props.getOrderedItem()

        this.trackShippingFormRef = React.createRef();
    }

    exchangeClicked(cartItem) {

        if(cartItem.exchangeStatus === undefined){
            this.setState({alertMessage: <YesOrNoAlert
                    alertTitle={"교환신청"}
                    messages={["상품 교환 신청을 하시겠습니까?"]}
                    yes={() => this.exchange(cartItem.cartId)}
                    no={() => this.closeAlert}
                />})

        }else{
            if(cartItem.exchangeStatus === EXCHANGE_STATUS.REQUESTED){
                let message = "교환 신청이 완료되었습니다."

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.closeAlert()} />})
            }else if(cartItem.exchangeStatus === EXCHANGE_STATUS.CONFIRMED){
                let message = "교환 신청이 확인 되었습니다."

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.closeAlert()} />})
            }else if(cartItem.exchangeStatus === EXCHANGE_STATUS.DENIED){
                let message = "교환 신청이 거절 되었습니다."

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.closeAlert()} />})
            }
        }



    }

    closeAlert = () => {
        this.setState({alertMessage: null})
    }

    exchange = (cartId) => {

        let params = {
            cartId: cartId
        }

        this.props.requestExchange(params, () => {
            let message = "교환 신청이 완료되었습니다."

            this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
        })
    }

    returnProducClicked(cartItem) {
        if(cartItem.refundStatus === undefined){

            this.setState({alertMessage: <YesOrNoAlert
                    alertTitle={"반품신청"}
                    messages={["상품 반품 신청을 하시겠습니까?"]}
                    yes={() => this.refund(cartItem.cartId)}
                    no={() => this.closeAlert}
                />})
        }else{
            if(cartItem.refundStatus === REFUND_STATUS.REQUESTED){
                let message = "반품 신청이 완료되었습니다."

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.closeAlert()} />})
            }else if(cartItem.refundStatus === REFUND_STATUS.CONFIRMED){
                let message = "반품 신청이 확인 되었습니다."

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.closeAlert()} />})
            }else if(cartItem.refundStatus === REFUND_STATUS.DENIED){
                let message = "반품 신청이 거절 되었습니다."

                this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={() => this.closeAlert()} />})
            }
        }

    }

    refund = (cartId) => {
        let params = {
            cartId: cartId
        }

        this.props.requestRefund(params, () => {
            let message = "반품 신청이 완료되었습니다."

            this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
        })
    }

    trackShipping(item) {
        if(item.shippingStatus === SHIPPING_STATUS.PREPARING){
            this.setState({alertMessage: <AlertMessage messages={["배송 준비 중입니다."]} closeAlert={() => this.closeAlert()} />})
        }else if(item.shippingStatus === SHIPPING_STATUS.SHIPPED || item.shippingStatus === SHIPPING_STATUS.RECEIVED || item.shippingStatus === SHIPPING_STATUS.DELIVERING){
            let self = this;

            this.setState({
                shippingCoCode: item.order.shippingCoCode,
                trackingNumber: item.order.trackingNumber
            }, () => {

                self.trackShippingFormRef.current.submit()

                let params = {
                    uniqueId: getUniqueId(),
                    orderId: item.order.orderId
                }

                self.props.trackShipping(params, () => {
                    self.props.getOrderedItem()
                })
            })
        }
    }

    addToBasket() {

    }

    writeReview(cartItem) {
        if(cartItem.shippingStatus === SHIPPING_STATUS.RECEIVED){
            let path = '/ProductDetailView';

            this.props.history.push({
                pathname: path,
                state: {
                    productId: cartItem.product.productId,
                    feedId: cartItem.feedId,
                    scrollToCommentBox: true
                }
            })
        }else{
            this.setState({alertMessage: <AlertMessage messages={["구매 후기는 배송완료 후 작성할 수 있습니다."]} closeAlert={() => this.closeAlert()} />})
        }
    }

    alertMessageViewToggle = () => {
        this.setState({alertMessage: ''})
    }

    renderStatus = (cartItem) => {
        if(cartItem.orderStatus === ORDER_STATUS.WAITING_FOR_CONFIMATION){
            return '주문 확인 중'
        }else{
            if(cartItem.shippingStatus === SHIPPING_STATUS.PREPARING){
                return '배송 준비 중'
            }else if(cartItem.shippingStatus === SHIPPING_STATUS.SHIPPED){
                return "배송됨"
            }else if(cartItem.shippingStatus === SHIPPING_STATUS.RECEIVED){
                return "배송완료"
            }
        }
    }


    render() {
        return (
            <div>
                {this.props.items.map((i, index) => {



                    let totalPrice = i.orderQuantity * i.product.price * (1 - i.product.discountRate / 100);
                    let currency;
                    if (i.product.currency === "KRW") {
                        currency = "원"
                    }
                    return (
                        <div className={"profileOrderItem"}>
                            <div className={"profileProductInfoWrap"}>
                                <div className={"profileProductImage"}>
                                    <img src={(i.images.length > 0) ? RestApi.prod + i.images[0] : 'placeholder'}/>
                                </div>

                                <div className={"profileProductInfo"}>
                                    <div className={"profileProductName"}><a>{i.product.title}</a></div>
                                    <div><a>옵션: {i.option.title}</a></div>
                                    {/*<div><a>{(i.product.price * (1 - i.product.discountRate / 100)).toLocaleString()}{currency}  ({i.product.discountRate}% 할인)/ {i.orderQuantity}개, 합: {totalPrice.toLocaleString()}{currency}</a></div>*/}
                                    <div><a>{(i.product.price * (1 - i.product.discountRate / 100)).toLocaleString()}{currency}  X {i.orderQuantity}개, 합: {totalPrice.toLocaleString()}{currency}</a></div>
                                    <div>{this.renderStatus(i)}</div>
                                </div>
                            </div>

                            <div className={"profileOrderListButton"}>
                                <div className={"orderListButton"} onClick={() => this.exchangeClicked(i)}><a>교환신청</a></div>
                                <div className={"orderListButton"} onClick={() => this.returnProducClicked(i)}><a>반품신청</a></div>
                                <div className={"orderListButton"} onClick={() => this.trackShipping(i)}><a>배송조회</a></div>
                                {/*<div className={"orderListButton"} onClick={() => this.addToBasket(i)}><a>장바구니 담기</a></div>*/}
                                <div className={"orderListButton"} onClick={() => this.writeReview(i)}><a>구매 후기 쓰기</a></div>
                            </div>
                        </div>
                    );
                })}
                {this.state.alertMessage}

                <form action="http://info.sweettracker.co.kr/tracking/1" method="post" target="_blank" ref={this.trackShippingFormRef} >
                    <input hidden={true} type="text" className="form-control" id="t_key" name="t_key" value={SWEET_TRACKER_API} required/>
                    <input hidden={true} type="text" className="form-control" name="t_code" id="t_code" value={this.state.shippingCoCode} required/>
                    <input hidden={true} type="text" className="form-control" name="t_invoice" id="t_invoice" value={this.state.trackingNumber} required/>
                </form>
            </div>

        );
    }
}

let mapStateToProps = (state) => {

    return {
        items: state.cart.items
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        getOrderedItem: () => dispatch(getOrderedItem()),
        requestRefund: (params, callback) => dispatch(requestRefund(params, callback)),
        requestExchange: (params, callback) => dispatch(requestExchange(params, callback)),
        trackShipping: (params, callback) => dispatch(trackShipping(params, callback))
    }
}

ProfileOrderStatus = connect(mapStateToProps, mapDispatchToProps)(ProfileOrderStatus)

export default withRouter(ProfileOrderStatus);