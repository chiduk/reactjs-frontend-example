import {queryString, RestApi} from '../util/Constants'
import fetch from 'cross-fetch'

export function getReplies(params) {

    return (dispatch) => {
        fetch(RestApi.feed.getCommentComment + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then( json => {

                dispatch({
                    type: 'FEED_REPLY',
                    replies: json,
                    commentFeedId: params.commentFeedId
                })
            })
    }

}

export function sendReply(params) {
    return (dispatch) => {
        fetch(RestApi.feed.addCommentToComment,
            {
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
                    type: 'ADD_FEED_REPLY',
                    replies: json,
                    commentFeedId: params.commentFeedId
                })

                fetch(RestApi.feed.getCommentCount + '?' + queryString({feedId: params.feedId}))
                    .then(res => {
                        return res.json()
                    })
                    .then( commentCount => {
                        dispatch({
                            type: 'COMMENT_COUNT',
                            count: commentCount.count
                        })
                    })

            })
            .catch(err => {
                console.error(err)
            })
    }


}

export function addComment(params) {

    return (dispatch) => {
        fetch(RestApi.feed.addCommentFeed, {
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

                fetchComment(dispatch, params)

            })
    }
}

export function getComments(params) {


    return (dispatch) => {
        fetchComment(dispatch, params)
    }
}

function fetchComment(dispatch, params) {
    fetch(RestApi.feed.getFeedComments + '?' + queryString(params))
        .then(res => {
            return res.json()
        })
        .then(json => {
            dispatch({
                type: 'FEED_COMMENT',
                comments: json
            })
        })
}

export function getSuggestedFeed(params) {
    return (dispatch) => {
        fetch(RestApi.feed.getSuggested + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'FOR_YOU_FEEDS',
                    forYouFeeds: json
                })
            })
    }
}

export function report(params, callback) {
    return (dispatch) => {
        fetch(RestApi.feed.report, {
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

export function pin(params) {
    return (dispatch) => {
        fetch(RestApi.feed.pin, {
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

export function unpin(params) {
    return (dispatch) => {
        fetch(RestApi.feed.unpin, {
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

export function setSavedFeedHashTags(hashTags) {
    return (dispatch) => {
        dispatch({
            type: 'FEED_SAVED_HASH_TAG',
            hashTags: hashTags
        })
    }
}

export function deleteFeed(params, onSuccess , onFail) {
    return (dispatch) => {
        fetch(RestApi.feed.delete , {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){

                    onSuccess()
                }else{
                    onFail()
                }

            })
    }
}

export function getDetail(params) {
    return (dispatch) => {
        fetch(RestApi.feed.getDetail + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_DETAIL',
                    detail: json
                })
            })
    }
}

export function getSimilarFeed(params) {
    return (dispatch) => {
        fetch(RestApi.feed.getSimilarFeed + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'GET_SIMILAR_FEED',
                    similarFeeds: json
                })
            })
    }
}

export function setProfileSocialViewMode(viewMode) {
    return (dispatch) => {
        dispatch({
            type: 'SET_PROFILE_SOCIAL_VIEW_MODE',
            profileSocialViewMode: viewMode
        })
    }
}