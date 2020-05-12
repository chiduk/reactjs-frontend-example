import {getUniqueId, queryString, RestApi} from '../util/Constants'
import fetch from 'cross-fetch'
import is from 'is_js'

export function getItemsInCart() {
    return (dispatch) => {
        fetchItems(dispatch)
    }
}

function fetchItems(dispatch) {
    let params = {
        uniqueId: getUniqueId()
    }

    fetch(RestApi.cart.get + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {
            let items = json;

            let newItems = [];

            items.forEach(item => {
                item.isChecked = true;
                newItems.push(item)
            })

            dispatch({
                type: 'GET_ITEMS',
                items: newItems
            })

            return json
        })
        .then(json => {
            //console.log('json', json)

            let items = json;

            let status = [];

            items.forEach(item => {
                let obj = {
                    cartId: item.cartId,
                    isChecked: true
                }

                status.push(obj)
            })

            dispatch({
                type: 'GET_IS_CHECKED',
                checkStatus: status
            })

            return json;
        })
        .then(json => {
            dispatch({
                type: 'TOTAL_SHIPPING_COST'

            })
        })
}

export function getCartItemCount() {
    return (dispatch) => {
        fetchCount(dispatch)
    }
}

function fetchCount(dispatch) {
    let params = {
        uniqueId: getUniqueId()
    }

    fetch(RestApi.cart.getCount + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {

            localStorage.setItem('cartItemCount', json.count)

            dispatch({
                type: 'ITEM_COUNT',
                count: json.count
            })
        })
}

export function setCartItemCount() {
    return (dispatch) => {
        dispatch({
            type: 'ITEM_COUNT',
            count: localStorage.getItem('cartItemCount')
        })
    }
}

export function setIsChecked(params) {
    return (dispatch) => {
        dispatch({
            type: 'SET_IS_CHECKED',
            elem: {cartId: params.cartId, isChecked: params.isChecked}
        })

        dispatch({
            type: 'TOTAL_SHIPPING_COST'
        })
    }
}

export function setOrderItemShippingCost(orderList) {
    return (dispatch) => {
        dispatch(
            {
                type: 'SET_TOTAL_SHIPPING_COST',
                orderList: orderList
            }
        )
    }
}

export function order(params, callback) {
    return (dispatch) => {

        fetch(RestApi.cart.order, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                return res.json()
            })
            .then(json => {


                dispatch({
                    type: 'ORDER',
                    orderId: json.orderId
                })

                return json
            })
            .then(json => {

                params.orderId = json.orderId;

                if(params.isMobile){
                    fetch(RestApi.cart.payMobile + '?' + queryString(params),{
                        headers: {
                            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
                        }
                    })
                        .then(res => {

                            return res.text();
                        })
                        .then(text => {

                            dispatch({
                                type: 'NICEPAY_BODY',
                                html: text
                            })

                            //console.log(text)
                            callback();
                        })

                }else{

                    let encodedURI = encodeURI(RestApi.cart.pay + '?' + queryString(params))

                    if(is.ie()){
                        fetch(encodedURI,{
                            headers: {
                                //Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;charset=utf-8',
                                'Access-Control-Allow-Origin': true,
                                //"Content-type": "text/html; charset=utf-8"
                            }
                        })
                            .then(res => {

                                return res.text();
                            })
                            .then(text => {

                                dispatch({
                                    type: 'NICEPAY_BODY',
                                    html: text
                                });

                                callback();
                            })
                    }else{
                        fetch(RestApi.cart.pay + '?' + queryString(params),{
                            headers: {
                                //Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;charset=utf-8',
                                'Access-Control-Allow-Origin': true
                                //"Content-type": "text/html; charset=utf-8"
                            }
                        })
                            .then(res => {

                                return res.text();
                            })
                            .then(text => {

                                dispatch({
                                    type: 'NICEPAY_BODY',
                                    html: text
                                });

                                callback();
                            })
                    }


                }
            })


    }
}

export function orderItem(params, callback) {
    return (dispatch) => {


        fetch(RestApi.cart.orderItem, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                return res.json()
            })
            .then(json => {


                dispatch({
                    type: 'ORDER',
                    orderId: json.orderId
                })

                return json
            })
            .then(json => {

                params.orderId = json.orderId;
                if(params.isMobile){
                    fetch(RestApi.cart.payMobile + '?' + queryString(params),{
                        headers: {
                            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
                        }
                    })
                        .then(res => {

                            return res.text();
                        })
                        .then(text => {

                            dispatch({
                                type: 'NICEPAY_BODY',
                                html: text
                            })

                            //console.log(text)
                            callback();
                        })

                }else{
                    fetch(RestApi.cart.pay + '?' + queryString(params),{
                        headers: {
                            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
                        }
                    })
                        .then(res => {

                            return res.text();
                        })
                        .then(text => {

                            dispatch({
                                type: 'NICEPAY_BODY',
                                html: text
                            })

                            //console.log(text)
                            callback();
                        })

                }
            })
    }



}

export function pay() {
    return (dispatch) => {
        dispatch({

        })
    }
}

export function getOrderedItem() {
    return (dispatch) => {

        let params = {
            uniqueId: getUniqueId()
        }

        fetch(RestApi.cart.getOrderedItem + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_ORDERED_ITEM',
                    items: json
                })
            })
    }
}

export function deleteItem (cartId) {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId(),
            cartId: cartId
        }

        fetch(RestApi.cart.deleteItem, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    fetchItems(dispatch)
                    fetchCount(dispatch)
                }
            })
    }
}

export function buyNow(params, callback) {
    return (dispatch) => {
        fetch(RestApi.cart.buyNow, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                return res.json()
            })
            .then(json => {
                callback(json)
            })
    }
}

export function setQuantity(params) {
    return(dispatch) => {
        fetch(RestApi.cart.setQuantity, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {

            })
    }
}

export function hasPurchased(params) {
    return (dispatch) => {
        fetch(RestApi.cart.hasPurchased + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'HAS_PURCHASED',
                    hasPurchased: json.hasPurchased
                })
            })
    }
}

export function trackShipping(params, callback) {
    return (dispatch) => {
        fetch(RestApi.cart.trackShipping, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                callback()
            })
    }
}