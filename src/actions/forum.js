import {getUniqueId, queryString, RestApi, FORUM_VIEW_MODE} from '../util/Constants'
import fetch from 'cross-fetch'


export function getRecent(params) {

    return (dispatch) => {
        recentForums(dispatch, params)
    }

}

function recentForums(dispatch, params) {
    fetch(RestApi.forum.getRecent + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {

            dispatch({
                type: 'RECENT',
                feeds: json
            })
        })
}

export function getByLike(params) {
    return (dispatch) => {
        forumsByLike(dispatch, params)
    }
}

function forumsByLike(dispatch, params) {

    fetch(RestApi.forum.getByLike + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {
            dispatch({
                type: 'BY_LIKE',
                feeds: json
            })
        })
}

export function getByComment(params) {
    return (dispatch) => {
        forumsByComment(dispatch, params)
    }
}

function forumsByComment(dispatch, params) {

    fetch(RestApi.forum.getByComment + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {

            dispatch({
                type: 'BY_COMMENT',
                feeds: json
            })
        })
}

export function getByRead(params) {
    return (dispatch) => {
        forumsByRead(dispatch, params)
    }
}

function forumsByRead(dispatch, params) {


    fetch(RestApi.forum.getByRead + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {
            dispatch({
                type: 'BY_READ',
                feeds: json
            })
        })
}

export function read(params) {
    return (dispatch) => {
        fetch(RestApi.forum.read, {
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

export function add(params) {
    return (dispatch) => {
        fetch(RestApi.forum.add, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                let forumMode = params.forumMode;
                let viewMode = params.viewMode;
                let hashTag = params.filterHashTag;

                let paramObj = {
                    uniqueId: getUniqueId(),
                    filterHashTag: false
                }

                if(viewMode === FORUM_VIEW_MODE.ALL){

                }else if(viewMode === FORUM_VIEW_MODE.ONE_TAG){
                    paramObj.filterHashTag = true;
                    paramObj.hashTag = hashTag;
                }else if(viewMode === FORUM_VIEW_MODE.MY_TAGS){
                    paramObj.filterHashTag = true;
                }

                if(forumMode === 'byRecent'){
                    recentForums(dispatch, paramObj)
                }else if(forumMode === 'byLike'){
                    forumsByLike(dispatch, paramObj)
                }else if(forumMode === 'byComment'){
                    forumsByComment(dispatch, paramObj)
                }else if(forumMode === 'byRead'){
                    forumsByRead(dispatch, paramObj)
                }


            })
    }
}

export function report(params, callback) {
    return(dispatch) => {
        fetch(RestApi.forum.report, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    callback()
                }
            })
    }
}

export function edit(params, callback) {
    return(dispatch) => {
        fetch(RestApi.forum.edit, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    callback()
                }
            })
    }
}


export function deleteForum(params){
    return(dispatch) => {
        fetch(RestApi.forum.delete, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                dispatch({
                    type: 'DELETE_FORUM',
                    forumId: params.forumId
                })
            })
    }
}

export function like(forumId) {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId(),
            forumId: forumId
        }

        fetch(RestApi.forum.like, {
            method: 'POST',
                headers: {
                'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {

                dispatch({
                    type: 'IS_LIKED',
                    result: {forumId: forumId, isLiked: true}
                })
            })

            .then(() => {
                getLikeCount(dispatch, params)
            })
    }
}

export function unlike(forumId) {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId(),
            forumId: forumId
        }

        fetch(RestApi.forum.unlike, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                console.log(res)

                dispatch({
                    type: 'IS_LIKED',
                    result: {forumId: forumId, isLiked: false}
                })
            })

            .then(() => {
                getLikeCount(dispatch, params)
            })
    }
}

export function isLiked(forumId) {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId(),
            forumId: forumId
        }

        fetch(RestApi.forum.isLiked + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then( json => {
                dispatch({
                    type: 'IS_LIKED',
                    result: {forumId: forumId, isLiked: json.isLiked}
                })
            })
    }


}

export function getComments(forumId) {
    return (dispatch) => {

        let params = {
            forumId: forumId
        }

        fetch(RestApi.forum.comment.get + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_COMMENT',
                    comments: json
                })
            })
    }
}

export function getCommentReplies(params) {
    return (dispatch) => {

        fetch(RestApi.forum.comment.comment.get + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_COMMENT_COMMENT',
                    replies: json,
                    commentForumId: params.commentForumId
                })
            })
    }
}

export function commentAdd(params) {
    return (dispatch) => {
        fetch(RestApi.forum.comment.add, {
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
                console.log(json);
                dispatch({
                    type: 'ADD_COMMENT',
                    comments: json,
                    forumId: params.forumId
                })
            })
            .then( () => {
                commentCount(dispatch, params)
            })
    }
}

export function commentEdit() {

}

export function commentDelete() {

}

export function commentCommentAdd(params) {
    return (dispatch) => {
        fetch(RestApi.forum.comment.comment.add, {
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
                    type: 'ADD_COMMENT_COMMENT',
                    replies: json,
                    commentForumId: params.commentForumId
                })
            })
            .then(() => {
                commentCount(dispatch, params)
            })
    }
}

export function commentCommentEdit() {

}

export function commentCommentDelete() {

}

function getLikeCount(dispatch, params) {
    fetch(RestApi.forum.getLikeCount + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {
            dispatch({
                type: 'FORUM_LIKE_COUNT',
                count: json.count,
                forumId: params.forumId
            })
        })
}

function commentCount(dispatch, params) {
    fetch(RestApi.forum.getCommentCount + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {

            dispatch({
                type: 'FORUM_COMMENT_COUNT',
                count: json.count,
                forumId: params.forumId
            })
        })
}

export function getHashTags() {
    return (dispatch) => {
        requestHashTags(dispatch)

    }
}

function requestHashTags(dispatch) {
    let params = {
        uniqueId: getUniqueId()
    };

    fetch(RestApi.forum.hashTag.get + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {
            dispatch({
                type: 'HASH_TAG',
                hashTags: json
            })
        })
}

export function saveHashTag(hashTag, forumMode) {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId(),
            hashTag: hashTag
        }

        fetch(RestApi.forum.hashTag.save, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                requestHashTags(dispatch)
            })
            .then(() => {

                let params = {
                    uniqueId: getUniqueId(),
                    filterHashTag: true
                }

                if(forumMode === 'RECENT'){
                    recentForums(dispatch, params)
                }else if(forumMode === 'BY_LIKE'){
                    forumsByLike(dispatch, params)
                }else if(forumMode === 'BY_COMMENT'){
                    forumsByComment(dispatch, params);
                }else if(forumMode === 'BY_READ'){
                    forumsByComment(dispatch, params)
                }
            })
            .then(() => {
                requestSuggestedHashTag(dispatch)
            })

    }
}

export function deleteHashTag(hashTag, forumMode) {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId(),
            hashTag: hashTag
        }

        fetch(RestApi.forum.hashTag.delete, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                requestHashTags(dispatch)
            })
            .then(() => {

                let params = {
                    uniqueId: getUniqueId(),
                    filterHashTag: true
                }

                if(forumMode === 'RECENT'){
                    recentForums(dispatch, params)
                }else if(forumMode === 'BY_LIKE'){
                    forumsByLike(dispatch, params)
                }else if(forumMode === 'BY_COMMENT'){
                    forumsByComment(dispatch, params);
                }else if(forumMode === 'BY_READ'){
                    forumsByComment(dispatch, params)
                }
            })
            .then(() => {
                requestSuggestedHashTag(dispatch)
            })
    }
}

export function setViewMode(viewMode) {
    return (dispatch) => {
        dispatch({
            type: 'VIEW_MODE',
            viewMode: viewMode
        })
    }

}

export function setFilterHashTag(hashTag) {
    return (dispatch) => {
        dispatch({
            type: 'FILTER_HASH_TAG',
            hashTag: hashTag
        })
    }
}

export function getSuggestedHashTags() {
    return (dispatch) => {
        requestSuggestedHashTag(dispatch)
    }
}

function requestSuggestedHashTag(dispatch) {
    let params = {
        uniqueId: getUniqueId()
    }

    fetch(RestApi.forum.hashTag.getSuggested + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {
            dispatch({
                type:'SUGGESTED_HASH_TAG',
                suggestedHashTags: json
            })
        })
}