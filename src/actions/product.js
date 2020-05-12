import {getUniqueId, queryString, RestApi} from '../util/Constants'
import fetch from 'cross-fetch'

export function getComment(params) {
    return (dispatch) => {
        fetchComment(dispatch, params)
    }
}

function fetchComment(dispatch, params) {
    fetch(RestApi.product.getComment + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {

            dispatch({
                type: 'PRODUCT_COMMENT',
                comments: json
            })
        })
}

export function addComment(params) {
    return (dispatch) => {
        fetch(RestApi.product.addComment, {
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
                fetchComment(dispatch, {productId: params.productId})
            })
    }
}

export function editComment(params) {
    return (dispatch) => {

    }
}

export function deleteComment(params) {
    return (dispatch) => {

    }
}

export function getCommentComment(params) {
    return (dispatch) => {
        fetchCommentComment(dispatch, params)
    }
}

function fetchCommentComment(dispatch, params){
    fetch(RestApi.product.getCommentComment + '?' + queryString(params))
        .then(res => {
            return res.json();
        })
        .then(json => {
            dispatch({
                type: 'PRODUCT_COMMENT_COMMENT',
                replies: json,
                commentId: params.commentId
            })
        })
}


export function addCommentComment(params) {
    return (dispatch) => {
        fetch(RestApi.product.addCommentComment, {
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
                    type: 'ADD_PRODUCT_COMMENT_COMMENT',
                    replies: json,
                    commentId: params.commentId
                })
            })
    }
}

export function editCommentComment(params) {
    return (dispatch) => {

    }
}

export function deleteCommentComment(params) {
    return (dispatch) => {

    }
}

export function updateProductDetail(params) {
    return (dispatch) => {
        fetch(RestApi.product.update)
    }
}