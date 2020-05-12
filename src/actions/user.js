import {getUniqueId, queryString, RestApi} from '../util/Constants'
import fetch from 'cross-fetch'

export function isFollowing(followeeId){
    return (dispatch) => {

        if(getUniqueId() === null || getUniqueId() === undefined){
            return;
        }

        let params = {
            uniqueId: getUniqueId(),
            followeeId: followeeId
        }

        fetch(RestApi.user.isFollowing + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'IS_FOLLOWING',
                    result: {
                        followeeId: followeeId,
                        isFollowing: json.isFollowing
                    }
                })
            })
    }
}

export function follow(followeeId) {
    return (dispatch) => {



        let params = {
            uniqueId: getUniqueId(),
            followeeId: followeeId
        }

        fetch(RestApi.user.follow, {
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
                        type: 'FOLLOW',
                        result: {
                            followeeId: followeeId,
                            isFollowing: true
                        }
                    })
                }
            })
    }
}

export function unfollow(followeeId) {
    return (dispatch) => {


        let params = {
            uniqueId: getUniqueId(),
            followeeId: followeeId
        }

        fetch(RestApi.user.unfollow, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        } )
            .then(res => {
                if(res.status === 200){
                    dispatch({
                        type: 'UNFOLLOW',
                        result: {
                            followeeId: followeeId,
                            isFollowing: false
                        }
                    })
                }
            })
    }
}

export function getFollowingCount(uniqueId) {
    return (dispatch) => {


        let params = {
            uniqueId: uniqueId
        }

        fetch(RestApi.user.getFollowingCount + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then( json => {

                dispatch({
                    type:'FOLLOWING_COUNT',
                    count: json.count
                })
            })
    }
}

export function getFollowCount(uniqueId) {
    return (dispatch) => {



        let params = {
            uniqueId: uniqueId
        }

        fetch(RestApi.user.getFollowCount + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then( json => {

                dispatch({
                    type:'FOLLOW_COUNT',
                    count: json.count
                })
            })
    }
}

export function getMyInfo() {
    return (dispatch) => {
        if(getUniqueId() === null || getUniqueId() === undefined){
            return;
        }

        let params = {
            uniqueId: getUniqueId()
        }

        fetch(RestApi.user.getMyInfo + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {



                localStorage.setItem('userId', json.userId);


                dispatch({
                    type: 'MY_INFO',
                    myInfo: {
                        userId: json.userId,
                        firstName: json.firstName,
                        lastName: json.lastName,
                        fullName: json.fullName,
                        instagram: json.instagram,
                        youtube: json.youtube,
                        blog: json.blog,
                        email: json.email,
                        isInfluencerApplied: json.isInfluencerApplied,
                        isSellerApplied: json.isSellerApplied,
                        isSeller: json.isSeller,
                        isInfluencer: json.isInfluencer,
                        isAdmin: json.isAdmin
                    }
                })
            })
    }
}

export function getUserInfo(uniqueId) {
    return (dispatch) => {



        let params = {
            uniqueId: uniqueId
        };

        fetch(RestApi.user.getUserInfo + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {

                console.log(json)

                dispatch({
                    type: 'USER_INFO',
                    info: {
                        userId: json.userId
                    }
                })


            })

        // fetch('/api/user/get/user/info?' + queryString(params))
        //     .then(res => {
        //         return res.json()
        //     })
        //     .then(json => {
        //
        //         console.log(json)
        //
        //         dispatch({
        //             type: 'USER_INFO',
        //             info: {
        //                 userId: json.userId,
        //                 firstName: json.firstName,
        //                 lastName: json.lastName,
        //                 instagram: json.instagram,
        //                 youtube: json.youtube,
        //                 blog: json.blog,
        //                 email: json.email,
        //                 isInfluencerApplied: json.isInfluencerApplied,
        //                 isSellerApplied: json.isSellerApplied
        //             }
        //         })
        //
        //
        //     })
    }
}

export function updateUserInfo(params, callback) {
    return (dispatch) => {
        fetch(RestApi.user.updateInfo, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                let json = res.json()
                console.log(json)
                return json;
            })
            .then(json => {

                console.log(json);

                localStorage.setItem('userId', params.userId);
                localStorage.setItem('email', params.email);

                if(json.infoUpdateResult === 'OK'){
                    dispatch({
                        type: 'UPDATE_USER_INFO',
                        info: {userId: params.userId,
                            email: params.email,

                            firstName: params.firstName,
                            lastName: params.lastName,
                            instagram: params.instagram,
                            youtube: params.youtube,
                            blog: params.blog
                        }
                    })
                }else{
                    dispatch({})
                }

                callback(json);


            })
    }


}

export function getReviewCount(uniqueId) {
    return (dispatch) => {
        let params = {
            uniqueId: uniqueId
        }

        fetch(RestApi.user.getReviewCount + '?' + queryString(params))
            .then(res => {
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: 'REVIEW_COUNT',
                    count: json.count
                })
            })
    }
}

export function getForumCount(uniqueId) {
    return (dispatch) => {
        let params = {
            uniqueId: uniqueId
        }

        fetch(RestApi.user.getReviewCount + '?' + queryString(params))
            .then(res => {
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: 'FORUM_COUNT',
                    count: json.count
                })
            })
    }
}

export function getFeed(params) {
    return (dispatch) => {
        fetch(RestApi.user.getFeed + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {

                //console.log('feeds', json)

                dispatch({
                    type: 'FEEDS',
                    feeds: json,
                    renew: true
                })
            })
    }
}

export function getForum(uniqueId) {
    return (dispatch) => {

        let params = {
            uniqueId: uniqueId
        }



        fetch(RestApi.user.getForum + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                //console.log(json)
                dispatch({
                    type: 'MY_FORUM',
                    feeds: json
                })
            })
    }
}

export function getSaved( params) {
    return (dispatch) => {
        fetch(RestApi.user.getSaved + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {

                dispatch({
                    type: 'FEEDS',
                    feeds: json
                })
            })
    }
}

export function setProfileUniqueId(uniqueId) {
    return (dispatch) => {
        dispatch({
            type: 'UNIQUEID',
            uniqueId: uniqueId
        })
    }
}

export function setMyUniqueId(uniqueId) {
    return (dispatch) => {
        dispatch({
            type: 'MY_UNIQUEID',
            uniqueId: uniqueId
        })
    }
}

export function saveAddress(params, callback) {
    return (dispatch) => {
        fetch(RestApi.user.saveAddress, {
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
                console.log(json.addressId)

                fetchAddress(dispatch);
                callback(json.addressId)

            })
    }
}

export function getAddress() {
    return (dispatch) => {
        fetchAddress(dispatch)
    }
}

function fetchAddress(dispatch) {
    fetch(RestApi.user.getAddress + '?' + queryString({uniqueId: getUniqueId()}))
        .then(res => {
            return res.json()
        })
        .then(json => {
            let addresses = json;

            dispatch({
                type: 'ADDRESSES',
                addresses: addresses
            })
        })
}

export function deleteAddress(params) {
    return (dispatch) => {
        fetch(RestApi.user.deleteAddress, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                fetchAddress(dispatch)
            })
    }
}

export function getReview(uniqueId) {
    return (dispatch) => {
        let params = {
            uniqueId: uniqueId
        }

        fetch(RestApi.user.getReview + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'MY_REVIEW',
                    comments: json
                })
            })
    }
}

export function scrollToSaved(scroll) {
    return (dispatch) => {
        dispatch({
            type: 'SCROLL_TO_SAVED',
            scroll: scroll
        })
    }
}

export function isInfluencerApplied(params) {
    return (dispatch) => {

        fetch(RestApi.user.influenerIsApplied + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'IS_INFLUENCER_APPLIED',
                    isApplied: json.isApplied
                })
            })



    }
}

export function isInfluencerApproved(params) {
    return (dispatch) => {

        fetch(RestApi.user.influenerIsApplied + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'IS_INFLUENCER_APPROVED',
                    isApproved: json.isApproved
                })
            })
    }
}

export function isSellerApplied(params) {
    return (dispatch) => {

        fetch(RestApi.user.influenerIsApplied + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'IS_SELLER_APPLIED',
                    isApplied: json.isApplied
                })
            })



    }
}

export function isSellerApproved(params) {
    return (dispatch) => {

        fetch(RestApi.user.influenerIsApplied + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type: 'IS_SELLER_APPROVED',
                    isApplied: json.isApplied
                })
            })



    }
}

export function getEmail(params, callback) {
    return (dispatch) => {
        fetch(RestApi.user.getEmail, {
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
               callback(json)

            })
    }
}

export function getPassword(params, callback) {
    return (dispatch) => {
        fetch(RestApi.user.getPassword + '?' + queryString(params))
            .then(res => {
                callback(res.status)
            })
    }
}

export function getHashTagInfluencer(params) {

    return (dispatch) => {
        fetch(RestApi.main.getHashTagInfluencer + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {


                dispatch({
                    type: 'GET_HASH_TAG_INFLUENCER',
                    hashTagInfluencers: json
                })
            })
    }
}

export function getMatchedProduct(params) {
    return (dispatch) => {
        fetch(RestApi.user.getMatchedProduct + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                dispatch({
                    type:'GET_MATCHED_PRODUCT',
                    matchedProduct: json
                })
            })
    }
}

export function verifyID(params, callback) {
    return (dispatch) => {
        fetch(RestApi.user.verifyID , {
            headers: {
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
            }
        })
            .then(res => {
                return res.text()
            })
            .then(text => {
                dispatch({
                    type: 'VERIFY_ID',
                    html: text
                })

                callback();
            })

    }
}

export function verifyBank(params, callback) {

    let formData = new FormData();

    for(let name in params){
        formData.append(name, params[name])
    }

    return (dispatch) => {
        fetch(RestApi.user.verifyBank,  {
            method: 'POST',
            body: formData
        })
            .then(res => {
                return res.text()
            })
            .then(text => {
                dispatch({
                    type: 'VERIFY_BANK',
                    html: text
                });

                callback();

            })
    }
}