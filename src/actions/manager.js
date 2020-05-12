import {getDaysBefore, getNotiCount, getTodayDate, getUniqueId, queryString, RestApi} from '../util/Constants'
import fetch from 'cross-fetch'

export function getApplication() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId()
        }

        fetch(RestApi.manager.getApplication + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {

                dispatch({
                    type: 'GET_APPLICATION',
                    applications: json
                })
            })
    }
}

export function approveInfluencer(applicationId, callback) {
    return(dispatch) => {

        let params = {
            applicationId: applicationId
        }

        fetch(RestApi.manager.approveInfluencer,{
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch({
                        type: 'APPROVE_INFLUENCER',
                        applicationId: applicationId
                    })


                }

                callback()
            })
    }
}

export function denyInfluencer(applicationId, callback) {
    return(dispatch) => {
        let params = {
            applicationId: applicationId
        }

        fetch(RestApi.manager.denyInfluencer,{
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch({
                        type: 'APPROVE_INFLUENCER',
                        applicationId: applicationId
                    })

                    callback()
                }
            })
    }
}

export function cancelInfluencer(applicationId, callback) {
    return(dispatch) => {
        let params = {
            applicationId: applicationId
        }

        fetch(RestApi.manager.cancelInfluencer,{
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch({
                        type: 'CANCEL_INFLUENCER',
                        applicationId: applicationId
                    })


                }

                callback()
            })
    }
}

export function approveSeller(applicationId, callback) {
    return(dispatch) => {
        let params = {
            applicationId: applicationId
        }

        fetch(RestApi.manager.approveSeller,{
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch({
                        type: 'APPROVE_SELLER',
                        applicationId: applicationId
                    })



                    callback()
                }
            })
    }
}

export function denySeller(applicationId, callback) {
    return(dispatch) => {
        let params = {
            applicationId: applicationId
        }

        fetch(RestApi.manager.denySeller,{
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch({
                        type: 'DENY_SELLER',
                        applicationId: applicationId
                    })

                    callback()
                }
            })
    }
}

export function cancelSeller(applicationId, callback) {
    return(dispatch) => {
        let params = {
            applicationId: applicationId
        }

        fetch(RestApi.manager.cancelSeller,{
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch({
                        type: 'CANCEL_SELLER',
                        applicationId: applicationId
                    })

                    callback()
                }
            })
    }
}

export function activateUser(uniqueId, callback) {
    return(dispatch) => {
        let params = {
            uniqueId: uniqueId
        }

        fetch(RestApi.manager.activateUser,{
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch({
                        type: 'ACTIVATE_USER',
                        uniqueId: uniqueId
                    })

                    callback()
                }
            })
    }
}

export function blockUser(uniqueId, callback) {
    return(dispatch) => {
        let params = {
            uniqueId: uniqueId
        }

        fetch(RestApi.manager.blockUser,{
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch({
                        type: 'BLOCK_USER',
                        uniqueId: uniqueId
                    })

                    callback()
                }
            })
    }
}

export function searchUser(params) {
    return (dispatch) => {


        fetch(RestApi.search.user + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_APPLICATION',
                    applications: json
                })
            })

    }
}

export function getSavedHashTags(params) {
    return (dispatch) => {
        fetch(RestApi.manager.getSavedHashTags + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {


                dispatch({
                    type: 'GET_MANAGER_SAVED_HASH_TAG',
                    hashTags: json
                })
            })
    }
}

export function saveHashTag(params) {
    return (dispatch) => {
        fetch(RestApi.manager.saveHashTag , {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch(
                        {
                            type: 'SAVE_MANAGER_SAVED_HASH_TAG',
                            hashTag: params.hashTag
                        }
                    )
                }
            })
    }
}

export function deleteHashTag(params) {
    return (dispatch) => {
        fetch(RestApi.manager.deleteHashTag , {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch(
                        {
                            type: 'DELETE_MANAGER_SAVED_HASH_TAG',
                            hashTag: params.hashTag
                        }
                    )
                }
            })
    }
}

export function searchProduct(params) {
    return (dispatch) => {
        fetch(RestApi.manager.searchProduct + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'MANAGER_SEARCH_PRODUCT',
                    products: json
                })
            })
    }
}

export function requestMatching(params) {
    return (dispatch) => {
        fetch(RestApi.manager.requestMatching, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch({
                        type: 'REQUEST_MATCHING',
                        productId: params.productId
                    })
                }
            })
    }
}

export function unrequestMatching(params) {
    return (dispatch) => {
        fetch(RestApi.manager.unrequestMatching, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch({
                        type: 'UNREQUEST_MATCHING',
                        productId: params.productId
                    })
                }
            })
    }
}

export function getApplied(params) {
    return (dispatch) => {
        fetch(RestApi.manager.getApplied + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {



                dispatch({
                    type: 'GET_APPLIED',
                    products: json
                })
            })
    }
}

export function getMatchingRequested(params) {
    return (dispatch) => {
        fetch(RestApi.manager.getMatchingRequested + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_MATCHING_REQUESTED',
                    requests: json
                })
            })
    }
}

export function confirmMatching( params, callback) {
    return (dispatch) => {
        fetch(RestApi.manager.confirmMatching, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch({
                        type: 'CONFIRM_MATCHING',
                        requestId: params.requestId
                    })

                    callback()
                }
            })
    }
}

export function unconfirmMatching( params, callback) {
    return (dispatch) => {
        fetch(RestApi.manager.unconfirmMatching, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    dispatch({
                        type: 'UNCONFIRM_MATCHING',
                        requestId: params.requestId
                    })

                    callback()
                }
            })
    }
}

export function getSellerProduct() {
    return (dispatch) => {

        let params = {
            uniqueId: getUniqueId()
        }

        fetch(RestApi.manager.getSellerProduct + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_SELLER_PRODUCT',
                    products: json
                })
            })
    }
}

export function getProductDetail(params) {
    return (dispatch) => {
        fetch(RestApi.manager.getProductDetail + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_PRODUCT_DETAIL',
                    product: json
                })
            })
    }
}

export function addMatchRequestComment(params) {
    return (dispatch) => {
        fetch(RestApi.manager.addMatchRequestComment, {
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

                console.log(json)

                dispatch({
                    type: 'ADD_MATCH_REQUEST_COMMENT',
                    threadId: params.threadId,
                    comments: json
                })
            })
    }
}

export function getMatchRequestComment(params) {
    return (dispatch) => {
        fetch(RestApi.manager.getMatchRequestComment + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_MATCH_REQUEST_COMMENT',
                    threadId: params.threadId,
                    comments: json
                })
            })
    }
}

export function getAdminFullReport( params = {uniqueId: getUniqueId(), startDate: getDaysBefore(20).text, endDate: getTodayDate().text} ) {

    return (dispatch) => {

        fetch(RestApi.manager.getAdminFullReport + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_ADMIN_FULL_REPORT',
                    report: json
                })
            })
    }
}

export function getAdminJPReport( params = {uniqueId: getUniqueId(), startDate: getDaysBefore(20).text, endDate: getTodayDate().text} ) {
    return (dispatch) => {


        fetch(RestApi.manager.getAdminJPReport + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_ADMIN_JP_REPORT',
                    report: json
                })
            })
    }
}

export function getAdminPromoReport( params = {uniqueId: getUniqueId(), startDate: getDaysBefore(20).text, endDate: getTodayDate().text} ) {
    return (dispatch) => {

        fetch(RestApi.manager.getAdminPromoReport + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_ADMIN_PROMO_REPORT',
                    report: json
                })
            })
    }
}

export function getRevenueAll() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId()
        }
        fetch(RestApi.manager.getRevenueAll + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_REVENUE_ALL',
                    list: json
                })
            })
    }
}

export function getRevenueInfluencer() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId()
        }
        fetch(RestApi.manager.getRevenueInfluencer + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_REVENUE_INFLUENCER',
                    list: json
                })
            })
    }
}

export function getRevenueProduct() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId()
        }
        fetch(RestApi.manager.getRevenueProduct + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_REVENUE_PRODUCT',
                    list: json
                })
            })
    }
}

export function getInfluencerPaymentDue() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId()
        }

        fetch(RestApi.manager.getInfluencerPaymentDue + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_INFLUENCER_PAYMENT_DUE',
                    list: json
                })
            })
    }
}

export function getSellerPaymentDue() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId()
        }

        fetch(RestApi.manager.getSellerPaymentDue + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_SELLER_PAYMENT_DUE',
                    list: json
                })
            })
    }
}

export function getShippingCompanyList() {
    return (dispatch) => {
        fetch(RestApi.manager.getShippingCompanyList)
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_SHIPPING_COMPANY',
                    companies: json.Company
                })
            })
    }
}

export function sellerGetOrderItem() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId()
        }

        fetchOrderItems(dispatch, params)
    }
}

function fetchOrderItems (dispatch, params) {

    fetch(RestApi.manager.sellerGetOrderItem + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {
            dispatch({
                type: 'SELLER_GET_ORDER_ITEM',
                orderItems: json
            })
        })
}

export function confirmOrder(params) {
    return (dispatch) => {

        fetch(RestApi.manager.confirmOrder, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        } )
            .then(res => {
                if(res.status === 200){
                    fetchOrderItems(dispatch, {uniqueId: getUniqueId()})
                }
            })
    }
}

export function cancelOrder(params) {
    return (dispatch) => {

        fetch(RestApi.manager.cancelOrder, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        } )
            .then(res => {
                if(res.status === 200){
                    fetchOrderItems(dispatch, {uniqueId: getUniqueId()})
                }
            })
    }
}

export function setShipping(params) {
    return (dispatch) => {
        fetch(RestApi.manager.setShippingCompany, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    //fetchOrderItems(dispatch, {uniqueId: getUniqueId()})
                }
            })
    }
}

export function requestRefund(params, callback) {
    return (dispatch) => {
        fetch(RestApi.manager.requestRefund, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    //fetchOrderItems(dispatch, {uniqueId: getUniqueId()})
                    callback()
                }
            })
    }
}

export function confirmRefund(params, callback) {
    return (dispatch) => {
        fetch(RestApi.manager.confirmRefund, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    fetchRefundRequestItems(dispatch, {uniqueId: getUniqueId()});
                    fetchRefundRequestedItemCount(dispatch, {uniqueId: getUniqueId()});
                    callback()
                }
            })
    }
}

export function requestExchange(params, callback) {
    return (dispatch) => {
        fetch(RestApi.manager.requestExchange, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    //fetchOrderItems(dispatch, {uniqueId: getUniqueId()})
                    callback()
                }
            })
    }
}

export function confirmExchange(params, callback) {
    return (dispatch) => {
        fetch(RestApi.manager.confirmExchange, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    fetExchangeRequestItems(dispatch, {uniqueId: getUniqueId()});
                    fetchExchangeRequestedItemCount(dispatch, {uniqueId: getUniqueId()});
                    callback()
                }
            })
    }
}

export function getExchangeRequestItems(params) {
    return (dispatch) => {
        fetExchangeRequestItems(dispatch, params)
    }
}

function fetExchangeRequestItems(dispatch, params){
    fetch(RestApi.manager.getExchangeRequestedItems + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {
            dispatch({
                type: 'GET_EXCHANGE_REQUESTED_ITEM',
                items: json
            })
        })
}

export function getRefundRequestItems(params) {
    return (dispatch) => {
        fetchRefundRequestItems(dispatch, params)
    }
}

function fetchRefundRequestItems(dispatch, params) {
    fetch(RestApi.manager.getRefundRequestedItems + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {
            dispatch({
                type: 'GET_REFUND_REQUESTED_ITEM',
                items: json
            })
        })
}

export function getExchangeRequestedItemCount(params) {
    return (dispatch) => {
        fetchExchangeRequestedItemCount(dispatch, params)
    }
}

function fetchExchangeRequestedItemCount(dispatch, params) {
    fetch(RestApi.manager.getExchangeRequestedItemCount + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {
            dispatch({
                type: 'GET_EXCHANGE_REQUESTED_ITEM_COUNT',
                count: json.count
            })
        })
}

export function getRefundRequestedItemCount(params) {
    return (dispatch) => {
        fetchRefundRequestedItemCount(dispatch, params)
    }
}

function fetchRefundRequestedItemCount(dispatch, params) {
    fetch(RestApi.manager.getRefundRequestedItemCount + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {
            dispatch({
                type: 'GET_REFUND_REQUESTED_ITEM_COUNT',
                count: json.count
            })
        })
}

export function setCommission(params) {
    return (dispatch) => {
        fetch(RestApi.manager.setCommissionRate, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){

                }
            })
    }
}

export function cancelPurchase(params, callback) {
    let formData = new FormData();

    for(let name in params){
        formData.append(name, params[name])
    }

    return (dispatch) => {
        fetch(RestApi.manager.cancelPurchase,{
            method: 'POST',
            body: formData
        })
            .then(res => {
                return res.text()
            })
            .then(text => {
                dispatch({
                    type: 'CANCEL_PURCHASE',
                    html: text
                });

                callback();

            })
    }
}