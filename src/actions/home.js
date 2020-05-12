import {getUniqueId, queryString, RestApi} from '../util/Constants'
import fetch from 'cross-fetch'

export function getJointPurchase(skip = 0, renew = false) {

    return (dispatch) => {
        fetch(RestApi.main.getJointPurchase + '?' + queryString({uniqueId: getUniqueId(), skip: skip}))
            .then(res => {

                return res.json()
            })
            .then( json => {

                dispatch({
                    type: 'JOINT_PURCHASE',
                    jointPurchase: json,
                    renew: renew
                })
            })
    }

}

export function getJointPurchaseFollowing(skip = 0, renew = false) {
    return (dispatch) => {

        let params = {
            uniqueId: getUniqueId(),
            skip: skip,
            renew: renew
        }

        fetch(RestApi.main.getJointPurchaseFollowing + '?' + queryString(params))
            .then(res => {
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: 'JOINT_PURCHASE',
                    jointPurchase: json,
                    renew: renew
                })
            })
    }
}

export function getJointPurchaseAll() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId(),
            skip: 0
        }

        fetch(RestApi.main.getJointPurchaseAll + '?' + queryString(params))
            .then(res => {
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: 'JOINT_PURCHASE',
                    jointPurchase: json,
                    renew: true
                })
            })
    }
}

export function getJointPurchaseSelling() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId(),
            skip: 0
        }

        fetch(RestApi.main.getJointPurchaseForSale + '?' + queryString(params))
            .then(res => {
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: 'JOINT_PURCHASE',
                    jointPurchase: json,
                    renew: true
                })
            })
    }


}

export function getJointPurchaseFinished() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId(),
            skip: 0
        }

        fetch(RestApi.main.getJointPurchaseFinished + '?' + queryString(params))
            .then(res => {
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: 'JOINT_PURCHASE',
                    jointPurchase: json,
                    renew: true
                })
            })
    }


}

export function getJointPurchaseWillStart() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId(),
            skip: 0
        }

        fetch(RestApi.main.getJointPurchaseWillStart + '?' + queryString(params))
            .then(res => {
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: 'JOINT_PURCHASE',
                    jointPurchase: json,
                    renew: true
                })
            })
    }


}

export function getFeeds(hashTags = [], skip = 0, renewFeeds = false) {

    if(hashTags === undefined){
        hashTags = []
    }

    return (dispatch) => {

        let params = {
            hashTags: hashTags,
            uniqueId: getUniqueId(),
            skip: skip
        };

        fetch(RestApi.main.getFeeds, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                return res.json();
            })
            .then(json => {


                dispatch({
                    type: 'FEEDS',
                    feeds: json,
                    renew: renewFeeds
                })
            })
    }
}

export function getFeedsFollowing(hashTags = [], skip = 0, renew = false) {
    return (dispatch) => {

        let params = {
            uniqueId: getUniqueId(),
            hashTags: hashTags,
            skip: skip
        }

        fetch(RestApi.main.getFeedsFollowing, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                return res.json();
            })
            .then(json => {

                dispatch({
                    type: 'FEEDS',
                    feeds: json,
                    renew: renew
                })
            })

    }
}

export function like(params) {
    return (dispatch) => {


        fetch(RestApi.feed.like , {
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

                if(params.jointPurchase !== undefined){
                    dispatch({
                        type: 'LIKE_JP',
                        feedId: params.feedId,
                        isLiked: true,
                        count: json.count
                    })
                }else{
                    dispatch({
                        type: 'LIKE_SEARCHED_FEED',
                        feedId: params.feedId,
                        isLiked: true,
                        count: json.count
                    })


                    dispatch({
                        type: 'LIKE_FEED',
                        feedId: params.feedId,
                        isLiked: true,
                        count: json.count
                    });


                }


            })
    }
}

export function isLiked(params) {
    return (dispatch) => {
        fetch(RestApi.feed.isLiked + '?' + queryString(params))
            .then( res => {
                return res.json()
            })
            .then( json => {

                if(params.jointPurchase !== undefined ){

                    dispatch({
                        type: 'IS_JP_LIKED',
                        feedId: params.feedId,
                        isLiked: json.isLiked
                    })
                }else{
                    dispatch({
                        type: 'IS_FEED_LIKED',
                        feedId: params.feedId,
                        isLiked: json.isLiked
                    })

                }

            })
    }
}

export function unlike(params) {
    return (dispatch) => {
        fetch(RestApi.feed.unlike , {
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

                if(params.jointPurchase !== undefined){
                    dispatch({
                        type: 'UNLIKE_JP',
                        feedId: params.feedId,
                        isLiked: false,
                        count: json.count
                    })
                }else{

                    dispatch({
                        type: 'UNLIKE_SEARCHED_FEED',
                        feedId: params.feedId,
                        isLiked: false,
                        count: json.count
                    })

                    dispatch({
                        type: 'UNLIKE_FEED',
                        feedId: params.feedId,
                        isLiked: false,
                        count: json.count
                    })


                }

            })
    }
}

export function save(params) {
    return (dispatch) => {
        fetch(RestApi.feed.save, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then( res => {
                if(res.status === 200){

                    dispatch({
                        type: 'SAVE_SEARCHED_FEED',
                        feedId: params.feedId
                    });

                    dispatch({
                        type: 'SAVE_FEED',
                        isSaved: true,
                        feedId: params.feedId
                    })
                }
            })

    }
}

export function unsave(params) {
    return (dispatch) => {
        fetch(RestApi.feed.unsave, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then( res => {
                if(res.status === 200){
                    dispatch({
                        type: 'UNSAVE_SEARCHED_FEED',
                        feedId: params.feedId
                    });

                    dispatch({
                        type: 'UNSAVE_FEED',
                        isSaved: false,
                        feedId: params.feedId
                    })
                }
            })
    }
}

export function isSaved(params) {
    return (dispatch) => {
        fetch(RestApi.feed.isSaved + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then( json => {
                dispatch({
                    type: 'IS_FEED_SAVED',
                    isSaved: json.isSaved,
                    feedId: params.feedId
                })
            })
    }
}

export function comment() {
    return (dispatch) => {

    }
}

export function turnOnAlarm(params) {
    return (dispatch) => {
        fetch(RestApi.feed.requestAlarm, {
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
                    type: 'TURN_ON_ALARM',
                    feedId: params.feedId,
                    count: json.count
                })
            })
    }
}


export function turnOffAlarm(params) {
    return (dispatch) => {
        fetch(RestApi.feed.unrequestAlarm, {
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
                    type: 'TURN_OFF_ALARM',
                    feedId: params.feedId,
                    count: json.count
                })
            })
    }
}

export function setViewMode(viewMode) {
    return (dispatch) => {
        dispatch({
            type: 'HOME_FEED_VIEW_MODE',
            viewMode: viewMode
        })

    }
}

export function setViewTagMode(viewTagMode) {
    return (dispatch) => {
        dispatch({
            type: 'HOME_FEED_TAG_MODE',
            viewTagMode: viewTagMode
        })
    }
}

export function getSavedFeedHashTag(params) {
    return (dispatch) => {
        fetch(RestApi.main.getHashTags + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {

            })
    }
}