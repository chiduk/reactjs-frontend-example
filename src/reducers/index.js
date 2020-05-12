import { combineReducers} from 'redux';

import {
    HOME_FEED_TAG_VIEW_MODE,
    HOME_FEED_VIEW_MODE,
    PAYMENT_DUE_VIEW_TYPE,
    PROFILE_SOCIAL_VIEW_MODE
} from "../util/Constants";

const logIn = (state = {uniqueId: '', userId: '', loggedIn: 'false'}, action) => {
    switch (action.type) {



    }
}

const stella = (state = {type:null, feedReply: [], replies:[], feeds: [], follow: [], jointPurchase: [], isFollowingArray: [],
    myInfo: {
        userId: '',
        firstName: '',
        lastName: '',
        fullName:'',
        instagram: '',
        youtube: '',
        blog: '',
        email: '',
        isInfluencerApplied: false,
        isSellerApplied: false},
        hashTags: [],
        viewMode: HOME_FEED_VIEW_MODE.ALL,
        viewTagMode: HOME_FEED_TAG_VIEW_MODE.ALL
    }, action ) => {



    switch (action.type) {
        case 'LOGIN':

            return {...action}

        case 'GOOGLE_LOG_IN':

            return Object.assign({}, state, {logIn: action.logIn});

        case 'JOINT_PURCHASE':

            let newJPArray = [];

            if(action.renew){

                action.jointPurchase.forEach(jp => {
                    newJPArray.push(jp)
                });

                return Object.assign({}, state, {jointPurchase: newJPArray})

            }else{
                action.jointPurchase.forEach(jp => {

                    let containedArray = state.jointPurchase.filter(x => x.feedId === jp.feedId)

                    if( containedArray.length === 0){
                        newJPArray.push(jp);
                    }

                });

                let concatJPArray = state.jointPurchase.concat(newJPArray)


                return Object.assign({}, state, {jointPurchase: concatJPArray});
            }


        case 'MY_INFO':


            return Object.assign({}, state, {myInfo: action.myInfo});

        case 'MY_UNIQUEID' :

            return Object.assign({}, state, {myUniqueId: action.uniqueId});

        case 'FEED_REPLY':

            let obj = {
                commentFeedId: action.commentFeedId,
                replies: action.replies
            }

            state.feedReply.push(obj);

            let newFeedReplies = []

            state.feedReply.forEach(reply => {
                newFeedReplies.push(reply)
            })

            return Object.assign({}, state, {replies: newFeedReplies});

        case 'ADD_FEED_REPLY':

            let filteredArr = state.feedReply.filter(x => x.commentFeedId === action.commentFeedId)

            if (filteredArr.length > 0){
                let index = state.feedReply.indexOf(filteredArr[0]);

                action.replies.forEach(reply => {
                    filteredArr[0].replies.push(reply)
                })



                if(index !== -1){
                    state.feedReply[index] = filteredArr[0]
                }
            }else{
                let newReply = {
                    commentFeedId: action.commentFeedId,
                    replies: []
                }

                action.replies.forEach(reply => {
                    newReply.replies.push(reply)
                })

                state.feedReply.push(newReply)
            }

            return Object.assign({}, state, {replies: state.feedReply});

        case 'COMMENT_COUNT':


            return Object.assign({}, state, {commentCount: action.count});

        case 'FEEDS':

            let newFeedsArray = [];

            if(action.renew){


                action.feeds.forEach(feed => {
                    newFeedsArray.push(feed)
                });



                return Object.assign({}, state, {feeds:newFeedsArray});
            }else{
                action.feeds.forEach(feed => {

                    let containedArray = state.feeds.filter(x => x.feedId === feed.feedId);

                    if( containedArray.length === 0){
                        newFeedsArray.push(feed);
                    }

                });



                let concatPromoFeedArray = state.feeds.concat(newFeedsArray);

                return Object.assign({}, state, {feeds:concatPromoFeedArray});
            }



        case 'LIKE_FEED' :

            let selFeeds = state.feeds.filter(x => x.feedId === action.feedId);

            if(selFeeds.length > 0){
                selFeeds[0].likeCount = action.count;
                selFeeds[0].isLiked = true;
                let index = state.feeds.indexOf(selFeeds[0]);

                if(index !== -1) {
                    state.feeds[index] = selFeeds[0]
                }
            }

            let newArr = [];

            state.feeds.forEach(feed => {
                newArr.push(feed)
            });

            return Object.assign({}, state, {feeds: newArr});

        case 'LIKE_JP' :
            let selJPs = state.jointPurchase.filter(x => x.feedId === action.feedId);

            if(selJPs.length > 0){

                //console.log(action.count)

                selJPs[0].likeCount = action.count;
                selJPs[0].isLiked = true;
                let index = state.jointPurchase.indexOf(selJPs[0])

                if(index !== -1) {
                    state.jointPurchase[index] = selJPs[0]
                }
            }



            let newJPLikeArr = [];

            state.jointPurchase.forEach(feed => {
                newJPLikeArr.push(feed)
            })

            return Object.assign({}, state, {jointPurchase: newJPLikeArr});

        case 'UNLIKE_FEED':

            let modFeeds = state.feeds.filter(x => x.feedId === action.feedId);

            if(modFeeds.length > 0){
                modFeeds[0].likeCount = action.count;
                modFeeds[0].isLiked = false;
                let index = state.feeds.indexOf(modFeeds[0]);

                if(index !== -1) {
                    state.feeds[index] = modFeeds[0]
                }
            }

            let newArray = [];

            state.feeds.forEach(feed => {
                newArray.push(feed)
            })

            return Object.assign({}, state, {feeds: newArray})

        case 'UNLIKE_JP':

            let modJPs = state.jointPurchase.filter(x => x.feedId === action.feedId);

            if(modJPs.length > 0){
                modJPs[0].likeCount = action.count;
                modJPs[0].isLiked = false;
                let index = state.jointPurchase.indexOf(modJPs[0]);

                if(index !== -1) {
                    state.jointPurchase[index] = modJPs[0]
                }
            }

            let newUnlikeJPArray = [];

            state.jointPurchase.forEach(feed => {
                newUnlikeJPArray.push(feed)
            })

            return Object.assign({}, state, {jointPurchase: newUnlikeJPArray})

        case 'TURN_ON_ALARM' :
            let alarmOnJPs = state.jointPurchase.filter(x => x.feedId === action.feedId);

            if(alarmOnJPs.length > 0){
                alarmOnJPs[0].alarmCount = action.count;
                alarmOnJPs[0].isAlarmOn = true;

                let index = state.jointPurchase.indexOf(alarmOnJPs[0]);

                if(index !== -1){
                    state.jointPurchase[index] = alarmOnJPs[0]
                }


            }

            let newAlarmONJPs = [];

            state.jointPurchase.forEach(jp => {
                newAlarmONJPs.push(jp)
            })

            return Object.assign({}, state, {jointPurchase: newAlarmONJPs} )

        case 'TURN_OFF_ALARM' :

            let alarmOffJPs = state.jointPurchase.filter(x => x.feedId === action.feedId);

            if(alarmOffJPs.length > 0){
                alarmOffJPs[0].alarmCount = action.count;
                alarmOffJPs[0].isAlarmOn = false;

                let index = state.jointPurchase.indexOf(alarmOffJPs[0])

                if(index !== -1){
                    state.jointPurchase[index] = alarmOffJPs[0]
                }


            }

            let newAlarmOffJPs = []

            state.jointPurchase.forEach(jp => {
                newAlarmOffJPs.push(jp)
            })

            return Object.assign({}, state, {jointPurchase: newAlarmOffJPs})

        case 'IS_FEED_LIKED' :
            let isLikedFeeds = state.feeds.filter(x => x.feedId === action.feedId);

            if(isLikedFeeds.length > 0){
                isLikedFeeds[0].isLiked = action.isLiked;

                let index = state.feeds.indexOf(isLikedFeeds[0])

                if(index !== -1){
                    state.feeds[index] = isLikedFeeds[0]
                }
            }

            let isLikedNewFeeds = [];

            state.feeds.forEach(feed => {
                isLikedNewFeeds.push(feed)
            })

            return Object.assign({}, state, {feeds: isLikedNewFeeds})

        case 'IS_JP_LIKED':
            let isLikedJPs = state.jointPurchase.filter((x => x.feedId === action.feedId))

            if(isLikedJPs.length > 0) {
                isLikedJPs[0].isLiked = action.isLiked;

                let index = state.jointPurchase.indexOf(isLikedJPs[0])

                if(index !== -1){
                    state.jointPurchase[index] = isLikedJPs[0]
                }
            }

            let isLikedNewJPs = [];

            state.jointPurchase.forEach(jp => {
                isLikedNewJPs.push(jp)
            })

            return Object.assign({}, state, {jointPurchase: isLikedNewJPs})


        case 'SAVE_FEED':
            let savedFeeds = state.feeds.filter(x => x.feedId === action.feedId)



            if(savedFeeds.length > 0){
                savedFeeds[0].isSaved = true;

                let index = state.feeds.indexOf(savedFeeds[0])

                if(index !== -1){
                    state.feeds[index] = savedFeeds[0]
                }

                let newlySavedFeeds = [];

                state.feeds.forEach(feed => {
                    newlySavedFeeds.push(feed)
                })

                return Object.assign({}, state, {feeds: newlySavedFeeds})

            }else{
                savedFeeds = state.jointPurchase.filter(x => x.feedId === action.feedId)
                if(savedFeeds.length > 0) {
                    savedFeeds[0].isSaved = true;

                    let index = state.feeds.indexOf(savedFeeds[0])

                    if (index !== -1) {
                        state.feeds[index] = savedFeeds[0]
                    }


                }

                let newlySavedFeeds = [];

                state.jointPurchase.forEach(feed => {
                    newlySavedFeeds.push(feed)
                })

                return Object.assign({}, state, {jointPurchase: newlySavedFeeds})

            }



        case 'UNSAVE_FEED':

            let unsavedFeeds = state.feeds.filter(x => x.feedId === action.feedId)

            if(unsavedFeeds.length > 0){
                unsavedFeeds[0].isSaved = false;

                let index = state.feeds.indexOf(unsavedFeeds[0])

                if(index !== -1){
                    state.feeds[index] = unsavedFeeds[0]
                }

                let newlyUnsavedFeeds = [];

                state.feeds.forEach(feed => {
                    newlyUnsavedFeeds.push(feed)
                })

                return Object.assign({}, state, {feeds: newlyUnsavedFeeds})
            }else{
                unsavedFeeds = state.jointPurchase.filter(x => x.feedId === action.feedId)

                if(unsavedFeeds.length > 0) {
                    unsavedFeeds[0].isSaved = false;

                    let index = state.feeds.indexOf(unsavedFeeds[0])

                    if (index !== -1) {
                        state.feeds[index] = unsavedFeeds[0]
                    }
                }

                let newlyUnsavedFeeds = [];

                state.jointPurchase.forEach(feed => {
                    newlyUnsavedFeeds.push(feed)
                })

                return Object.assign({}, state, {jointPurchase: newlyUnsavedFeeds})

            }



        case 'IS_FEED_SAVED' :

            let isSavedFeeds = state.feeds.filter(x => x.feedId === action.feedId)

            if(isSavedFeeds.length > 0){
                isSavedFeeds[0].isSaved = action.isSaved;

                let index = state.feeds.indexOf(isSavedFeeds[0])

                if(index !== -1){
                    state.feeds[index] = isSavedFeeds[0]
                }
            }

            let newlyIsSavedFeeds = [];

            state.feeds.forEach(feed => {
                newlyIsSavedFeeds.push(feed)
            })

            return Object.assign({}, state, {feeds: newlyIsSavedFeeds})

        case 'IS_FOLLOWING':
            let isFollowingArray = state.follow.filter(x => x.followeeId === action.result.followeeId);

            if(isFollowingArray.length > 0){
                isFollowingArray[0].isFollowing = action.result.isFollowing

                let index = state.follow.indexOf(isFollowingArray[0])

                if(index !== -1){
                    state.follow[index] = isFollowingArray[0]
                }
            }else{
                state.follow.push(action.result)
            }

            let newIsFollowingArray = [];

            state.follow.forEach(follow => {
                newIsFollowingArray.push(follow)
            });

            return Object.assign({}, state, {isFollowingArray: newIsFollowingArray})

        case 'FOLLOW' :

            let followArray = state.follow.filter(x => x.followeeId === action.result.followeeId)

            if(followArray.length > 0){
                followArray[0].isFollowing = action.result.isFollowing;

                let index = state.follow.indexOf(followArray[0])

                if(index !== -1) {
                    state.follow[index] = followArray[0]
                }
            }else{
                state.follow.push(action.result)
            }

            let newFollowArray = [];

            state.follow.forEach(follow => {
                newFollowArray.push(follow)
            })


            return Object.assign({}, state, {isFollowingArray: newFollowArray})


        case 'UNFOLLOW' :

            let unfollowArray = state.follow.filter(x => x.followeeId === action.result.followeeId)

            if(unfollowArray.length > 0) {
                unfollowArray[0].isFollowing = action.result.isFollowing

                let index = state.follow.indexOf(unfollowArray[0])

                if(index !== -1){
                    state.follow[index] = unfollowArray[0]
                }
            }else{
                state.follow.push(action.result)
            }

            let newUnfollowArray = [];

            state.follow.forEach(follow => {
                newUnfollowArray.push(follow)
            })

            return Object.assign({}, state, {isFollowingArray: newUnfollowArray})

        case 'FEED_SAVED_HASH_TAG':

            return Object.assign({}, state, {hashTags: action.hashTags})

        case 'HOME_FEED_VIEW_MODE' :

            return Object.assign({}, state, {viewMode: action.viewMode});

        case 'HOME_FEED_TAG_MODE' :

            return Object.assign({}, state, {viewTagMode: action.viewTagMode})

        default:
            return state;
    }

};

const search = (state = {hashTags: [], searchedFeeds: []}, action) => {
    switch (action.type) {
        case 'SEARCH_HASH_TAG' :

            return Object.assign({}, state, {hashTags: action.hashTags});

        case 'SEARCH_FEED' :

            return Object.assign({}, state, {searchedFeeds: action.searchFeeds});

        case 'LIKE_SEARCHED_FEED' :


            let newLikedSearchArray = [];

            state.searchedFeeds.forEach(feed => {
                if(feed.feedId === action.feedId){


                    feed.likeCount = action.count;
                    feed.isLiked = true;

                }

                newLikedSearchArray.push(feed)
            })

            return Object.assign({}, state, {searchedFeeds:newLikedSearchArray});

        case 'UNLIKE_SEARCHED_FEED' :

            let newUnlikedSearchArray = [];

            state.searchedFeeds.forEach(feed => {
                if(feed.feedId === action.feedId){


                    feed.likeCount = action.count;
                    feed.isLiked = false;

                }

                newUnlikedSearchArray.push(feed)
            })

            return Object.assign({}, state, {searchedFeeds: newUnlikedSearchArray});

        case 'SAVE_SEARCHED_FEED' :

            let newSavedSearchArray = [];

            state.searchedFeeds.forEach(feed => {
                if(feed.feedId === action.feedId){

                    feed.isSaved = true;
                }

                newSavedSearchArray.push(feed)
            });

            return Object.assign({}, state, {searchedFeeds: newSavedSearchArray});

        case 'UNSAVE_SEARCHED_FEED' :

            let newUnsavedSearchArray = [];

            state.searchedFeeds.forEach(feed => {
                if(feed.feedId === action.feedId){

                    feed.isSaved = false;
                }

                newUnsavedSearchArray.push(feed)
            });

            return Object.assign({}, state, {searchedFeeds: newUnsavedSearchArray});

        default:
            return state
    }
};

const forum = (state = {forums: [], comments: [], replies: [], hashTags: [], forumMode: 'RECENT', viewMode: 'ALL', filterHashTag: '', suggestedHashTags: []}, action) => {
    switch (action.type) {

        case 'SUGGESTED_HASH_TAG' :

            return Object.assign({}, state, {suggestedHashTags: action.suggestedHashTags})

        case 'FILTER_HASH_TAG' :

            return Object.assign({}, state, {filterHashTag: action.hashTag});

        case 'VIEW_MODE':

            return  Object.assign({}, state, {viewMode: action.viewMode});

        case 'MY_FORUM' :

            let newMyForums = [];

            action.feeds.forEach(forum => {
                newMyForums.push(forum)
            })

            return Object.assign({}, state, {forumMode:'RECENT', forums:newMyForums });

        case 'RECENT' :

            let newRecentFeedsArray = [];

            action.feeds.forEach(feed => {
                newRecentFeedsArray.push(feed)
            });

            return Object.assign({}, state, {forumMode: 'RECENT', forums: newRecentFeedsArray});

        case 'BY_LIKE' :
            let newByLikeFeedsArray = [];

            action.feeds.forEach(feed => {
                newByLikeFeedsArray.push(feed)
            });

            return Object.assign({}, state, {forumMode: 'BY_LIKE', forums: newByLikeFeedsArray});

        case 'BY_COMMENT':
            let newByCommentFeedsArray = [];

            action.feeds.forEach(feed => {
                newByCommentFeedsArray.push(feed)
            });

            return Object.assign({}, state, {forumMode: 'BY_COMMENT', forums: newByCommentFeedsArray});

        case 'BY_READ' :
            let newByReadFeedsArray = [];

            action.feeds.forEach(feed => {
                newByReadFeedsArray.push(feed)
            });
            return Object.assign({}, state, {forumMode: 'BY_READ', forums: newByReadFeedsArray});

        case 'LIKE' :
            let likeFeedArray = state.feeds.filter(x => x.forumId === action.result.forumId);

            if(likeFeedArray.length > 0) {
                likeFeedArray[0].isLiked = true

                let index = state.feeds.indexOf(likeFeedArray[0])

                if(index !== -1){
                    state.feeds[index] = likeFeedArray[0]
                }
            }

            let newLikeFeedArray = [];

            state.feeds.forEach(feed => {
                newLikeFeedArray.push(feed)
            });

            return Object.assign({}, state, {feeds: newLikeFeedArray});

        case 'UNLIKE' :
            let unlikeFeedArray = state.feeds.filter(x => x.forumId === action.result.forumId)

            if(unlikeFeedArray.length > 0){
                unlikeFeedArray[0].isLiked = false;

                let index = state.feeds.indexOf(unlikeFeedArray[0])

                if(index !== -1){
                    state.feeds[index] = unlikeFeedArray[0]
                }
            }

            let newUnlikeFeedArray = []

            state.feeds.forEach(feed => {
                newUnlikeFeedArray.push(feed)
            })

            return Object.assign({}, state, {feeds: newUnlikeFeedArray});

        case 'IS_LIKED' :

            let isLikedFeedArray = state.forums.filter(x => x.forumId === action.result.forumId)

            if(isLikedFeedArray.length > 0){
                isLikedFeedArray[0].isLiked = action.result.isLiked;

                let index = state.forums.indexOf(isLikedFeedArray[0])

                if(index !== -1){
                    state.forums[index] = isLikedFeedArray[0]
                }
            }

            let newIsLikedFeedArray = [];

            state.forums.forEach(forum => {
                newIsLikedFeedArray.push(forum)
            })

            return Object.assign({}, state, {forums: newIsLikedFeedArray});

        case 'GET_COMMENT' :

            return Object.assign({}, state, {comments: action.comments});


        case 'ADD_COMMENT' :
            let newComments = [];

            state.comments.forEach(comment => {
                newComments.push(comment)
            });

            action.comments.forEach(comment => {
                newComments.push(comment)
            });

            return Object.assign({}, state, {comments: newComments});

        case 'GET_COMMENT_COMMENT' :

            let repliesSelectedArr = state.replies.filter(x => x.commentForumId === action.commentForumId);

            if(repliesSelectedArr.length > 0){

                if(action.replies.length > 0) {

                    action.replies.forEach(reply => {
                        let existReply = repliesSelectedArr[0].replies.filter(x => x.commentCommentForumId === reply.commentCommentForumId)

                        if(existReply.length > 0){

                        }else{
                            repliesSelectedArr[0].replies.push(reply);
                        }

                    });

                }

                let index = state.replies.indexOf(repliesSelectedArr[0]);

                if(index !== -1){
                    state.replies[index] = repliesSelectedArr[0]
                }

            }else{

                let getCommentReplies = {
                    commentForumId: action.commentForumId,
                    replies: action.replies
                }

                state.replies.push(getCommentReplies)
            }


            let newRepliesArray = [];
            state.replies.forEach(reply => {
                newRepliesArray.push(reply)
            });


            return Object.assign({}, state, {replies: newRepliesArray})


        case 'ADD_COMMENT_COMMENT' :
            let selCommentCommentArr = state.replies.filter(x => x.commentForumId === action.commentForumId);

            if(selCommentCommentArr.length > 0){

                action.replies.forEach(reply => {
                    selCommentCommentArr[0].replies.push(reply)
                });

                let index = state.replies.indexOf(selCommentCommentArr[0])

                if(index !== -1){
                    state.replies[index] = selCommentCommentArr[0]
                }
            }else{
                let commentReplies = {
                    commentForumId: action.commentForumId,
                    replies: action.replies
                }

                state.replies.push(commentReplies)
            }

            let newAddedReplies = [];

            state.replies.forEach(reply => {
                newAddedReplies.push(reply)
            });

            return Object.assign({}, state, {replies: newAddedReplies})

        case 'FORUM_COMMENT_COUNT' :

            let selCommentCountArr = state.forums.filter(x => x.forumId === action.forumId);

            if(selCommentCountArr.length > 0){
                selCommentCountArr[0].numOfComments = action.count;

                let index = state.forums.indexOf(selCommentCountArr[0]);

                if(index !== -1){
                    state.forums[index] = selCommentCountArr[0]
                }
            }

            let newCommentCountArr = [];

            state.forums.forEach(forum => {
                newCommentCountArr.push(forum)
            });

            return Object.assign({}, state, {forums: newCommentCountArr});

        case 'FORUM_LIKE_COUNT' :

            let selLikeCountArr = state.forums.filter(x => x.forumId === action.forumId)

            if(selLikeCountArr.length > 0){

                selLikeCountArr[0].numOfLikes = action.count;

                let index = state.forums.indexOf(selLikeCountArr[0])

                if(index !== -1){
                    state.forums[index] = selLikeCountArr[0]
                }
            }

            let newLikeCountArr = [];

            state.forums.forEach(forum => {
                newLikeCountArr.push(forum)
            });

            return Object.assign({}, state, {forums: newLikeCountArr})

        case 'HASH_TAG':
            let hashTags = [];

            action.hashTags.forEach(hashTag => {
                hashTags.push(hashTag)
            })

            return Object.assign({}, state, {hashTags: hashTags})

        case 'DELETE_FORUM' :
            let newDelForumArray = [];

            state.forums.forEach(forum => {
                if(forum.forumId !== action.forumId){
                    newDelForumArray.push(forum)
                }
            });

            return Object.assign({}, state, {forums: newDelForumArray});


        default :
            return state;
    }
}

const user = (state = {hashTagInfluencers: [],
    userFeeds: [],
    info:{},
    addresses: [],
    comments: [],
    followCount: 0,
    followingCount: 0,
    reviewCount:0,
    forumCount: 0,
    scrollToSaved: false,
    isInfluencerApplied: false,
    isSellerApplied: false,
    matchedProduct: [],
    niceIdVerifyBody: '',
    niceBankVerifyBody: ''}, action) => {
    switch (action.type) {

        case 'USER_FEED' :

            let newFeeds = [];

            action.userFeeds.forEach(feed => {
                newFeeds.push(feed)
            })

            return Object.assign({}, state, {userFeeds: newFeeds});

        case 'USER_INFO' :

            return Object.assign( {}, state, {info: action.info});

        case 'UPDATE_USER_INFO' :

            return Object.assign({}, state, {info: action.info});

        case 'UNIQUEID' :

            return Object.assign({}, state, {uniqueId: action.uniqueId});

        case 'ADDRESSES' :

            return Object.assign({}, state, {addresses: action.addresses});
        case 'FOLLOW_COUNT' :

            return Object.assign({}, state, {followCount: action.count});

        case 'FOLLOWING_COUNT' :

            return Object.assign({}, state, {followingCount: action.count});

        case 'REVIEW_COUNT' :

            return Object.assign({}, state, {reviewCount: action.count});

        case 'FORUM_COUNT' :

            return Object.assign({}, state, {forumCount: action.count});

        case 'MY_REVIEW' :

            return Object.assign({}, state, {comments: action.comments});

        case 'SCROLL_TO_SAVED' :

            return Object.assign({}, state, {scrollToSaved: action.scroll});

        case 'IS_INFLUENCER_APPLIED' :

            return Object.assign({}, state, {isInfluencerApplied: action.isApplied});

        case 'IS_SELLER_APPLIED' :

            return Object.assign({}, state, {isSellerApplied: action.isApplied});

        case 'GET_HASH_TAG_INFLUENCER' :

            return Object.assign({}, state, {hashTagInfluencers: action.hashTagInfluencers});

        case 'GET_MATCHED_PRODUCT' :

            return Object.assign({}, state, {matchedProduct: action.matchedProduct});


        case 'VERIFY_ID' :

            return Object.assign({}, state, {niceIdVerifyBody: action.html})

        case 'VERIFY_BANK':

            return Object.assign({}, state, {niceBankVerifyBody: action.html})

        default:
            return state;

    }
}

const cart = (state = {items: [], checkStatus: [], totalShippingCost: 0, orderId: '', nicepayBody: '', count: 0, hasPurchased: false}, action) => {
    switch (action.type) {
        case 'GET_ITEMS' :

            return Object.assign({}, state, {items: action.items});

        case 'ORDER':

            return Object.assign({}, state, {orderId: action.orderId});

        case 'SET_IS_CHECKED' :

            let isCheckedElem = state.checkStatus.filter(x => x.cartId === action.elem.cartId);

            if(isCheckedElem.length > 0){
                let index = state.checkStatus.indexOf(isCheckedElem[0]);

                if(index !== -1){
                    state.checkStatus[index].isChecked = action.elem.isChecked
                }
            }

            let newArray = Object.assign([], state.checkStatus)

            let selItem = state.items.filter(x => x.cartId === action.elem.cartId);

            if(selItem.length > 0){
                let index = state.items.indexOf(selItem[0]);

                if(index !== -1){
                    state.items[index].isChecked = action.elem.isChecked
                }
            }


            let newItemArray = Object.assign([], state.items);

            return Object.assign({}, state, {items: newItemArray, checkStatus: newArray});

        case 'GET_IS_CHECKED' :

            return Object.assign({}, state, {checkStatus: action.checkStatus})

        case 'TOTAL_SHIPPING_COST':



            let totalShippingCostArr = []

            state.checkStatus.forEach(item => {
                if(item.isChecked){
                    let selItem = state.items.filter(x => x.cartId === item.cartId)
                    if(selItem.length > 0){
                        let sellerId = selItem[0].seller.sellerId;
                        let shippingCost = parseInt(selItem[0].product.shippingCost);

                        let sellerShippingCost = totalShippingCostArr.filter(x => x.sellerId === sellerId)

                        if(sellerShippingCost.length <= 0) {
                            totalShippingCostArr.push({sellerId: sellerId, shippingCost: shippingCost})
                        }
                    }
                }
            });

            let totalShippingCost = 0;

            totalShippingCostArr.forEach((seller) => {
                totalShippingCost += seller.shippingCost
            });

            return Object.assign({}, state, {totalShippingCost: totalShippingCost})

        case 'SET_TOTAL_SHIPPING_COST' :

            let sellerArray = []

            action.orderList.forEach(item => {


                let filteredArray = sellerArray.filter(x => x.sellerId === item.seller.sellerId)

                if(filteredArray.length > 0){

                }else{
                    let obj = {
                        sellerId : item.seller.sellerId,
                        shippingCost: parseInt(item.product.shippingCost)
                    };

                    sellerArray.push(obj)
                }
            });

            let totalCost = 0;

            sellerArray.forEach(seller => {
                totalCost += seller.shippingCost
            })

            return Object.assign({}, state, {totalShippingCost: totalCost})

        case 'NICEPAY_BODY' :

            return Object.assign({}, state, {nicepayBody: action.html});

        case 'GET_ORDERED_ITEM' :

            return Object.assign({}, state, {items: action.items})

        case 'ITEM_COUNT':

            return Object.assign({}, state, {count: action.count})

        case 'HAS_PURCHASED' :

            return Object.assign({}, state, {hasPurchased: action.hasPurchased})

        default :

            return state;
    }
}

const product = (state = {comments: [], replies: []}, action) => {
    switch (action.type) {
        case 'PRODUCT_COMMENT':

            return Object.assign({}, state, {comments: action.comments})

        case 'PRODUCT_COMMENT_COMMENT' :

            let selReplies = state.replies.filter(x => x.commentId === action.commentId);

            if(selReplies.length > 0){
                let index = state.replies.indexOf(selReplies[0]);
                selReplies[0].repiles = action.replies;
                state.replies[index] = selReplies[0];
            }else{
                let newReply = {
                    commentId: action.commentId,
                    replies: action.replies
                };

                state.replies.push(newReply);
            }

            let newRepliesArray = [];

            state.replies.forEach(reply => {
                newRepliesArray.push(reply)
            })

            return Object.assign({}, state, {replies: newRepliesArray})

        case 'ADD_PRODUCT_COMMENT_COMMENT' :

            let selCommentCommentArr = state.replies.filter(x => x.commentId === action.commentId);

            if(selCommentCommentArr.length > 0){

                action.replies.forEach(reply => {
                    selCommentCommentArr[0].replies.push(reply)
                });

                let index = state.replies.indexOf(selCommentCommentArr[0])

                if(index !== -1){
                    state.replies[index] = selCommentCommentArr[0]
                }
            }else{
                let commentReplies = {
                    commentId: action.commentId,
                    replies: action.replies
                }

                state.replies.push(commentReplies)
            }

            let newAddedReplies = [];

            state.replies.forEach(reply => {
                newAddedReplies.push(reply)
            });

            return Object.assign({}, state, {replies: newAddedReplies});

        default :

             return state;
    }

};

const feed = (state = {comments: [], replies: [], forYouFeeds: [], similarFeeds: [], profileSocialViewMode: PROFILE_SOCIAL_VIEW_MODE.VIEW_FOR_SALE}, action) => {
    switch (action.type) {
        case 'FEED_COMMENT' :

            return Object.assign({}, state, {comments: action.comments});

        case 'ADD_FEED_COMMENT':

            return Object.assign({}, state, {comments: state.comments})

        case 'FOR_YOU_FEEDS' :

            return Object.assign({}, state, {forYouFeeds: action.forYouFeeds})

        case 'GET_DETAIL' :

            return Object.assign({}, state, {detail: action.detail})

        case 'GET_SIMILAR_FEED':

            return Object.assign({}, state, {similarFeeds: action.similarFeeds});

        case 'SET_PROFILE_SOCIAL_VIEW_MODE' :

            return Object.assign({}, state, {profileSocialViewMode: action.profileSocialViewMode});

        default:

            return state;
    }
};

const notification = (state = {notifications: [], count: 0}, action) => {

    switch (action.type) {
        case 'GET_NOTIFICATION' :


            return Object.assign({}, state, {notifications: action.notifications});


        case 'NOTIFICATION_COUNT':

            return Object.assign({}, state, {count: action.count});


        default :

            return state;
    }

};

const manager = (state = {applications: [],
    hashTags: [], products: [],
    requests: [], sellerProducts: [],
    product:{}, matchRequestReplies: [],
    report: [], list: [], paymentDueViewType: PAYMENT_DUE_VIEW_TYPE.INFLUENCER,
    dueList: [], companies: [], orderItems: [],
    items: [], refundCount: 0, exchangeCount: 0}, action) => {
    switch (action.type) {
        case 'GET_APPLICATION' :

            return Object.assign({}, state, {applications: action.applications})

        case 'APPROVE_INFLUENCER' :

            let approveInfArrays = state.applications.filter(x => x.applicationId === action.applicationId);

            if(approveInfArrays.length > 0){
                let index = state.applications.indexOf(approveInfArrays[0])

                if(index !== -1){
                    state.applications[index].influencerApplication.isApproved = true


                }
            }

            let newAppInfArrays = [];

            state.applications.forEach(application => {
                newAppInfArrays.push(application)
            })

            return Object.assign({}, state, {applications: newAppInfArrays})

        case 'DENY_INFLUENCER' :

            let denyInfArrays = state.applications.filter(x => x.applicationId === action.applicationId);

            if(denyInfArrays.length > 0){
                let index = state.applications.indexOf(denyInfArrays[0])

                if(index !== -1){
                    state.applications[index].influencerApplication.isApproved = false;
                    state.applications[index].influencerApplication.isDenied = true

                }
            }

            let newDenyInfArrays = [];

            state.applications.forEach(application => {
                newDenyInfArrays.push(application)
            });

            return Object.assign({}, state, {applications: newDenyInfArrays});

        case 'CANCEL_INFLUENCER' :

            let cancelInfArrays = state.applications.filter(x => x.applicationId === action.applicationId);

            if(cancelInfArrays.length > 0){
                let index = state.applications.indexOf(cancelInfArrays[0])

                if(index !== -1){
                    state.applications[index].influencerApplication.isApproved = false


                }
            }

            let newCancelInfArrays = [];

            state.applications.forEach(application => {
                newCancelInfArrays.push(application)
            });

            return Object.assign({}, state, {applications: newCancelInfArrays})




        case 'APPROVE_SELLER' :

            let approveSellerArrays = state.applications.filter(x => x.applicationId === action.applicationId);

            if(approveSellerArrays.length > 0){
                let index = state.applications.indexOf(approveSellerArrays[0])

                if(index !== -1){
                    state.applications[index].sellerApplication.isApproved = true


                }
            }

            let newAppSellerArrays = [];

            state.applications.forEach(application => {
                newAppSellerArrays.push(application)
            })

            return Object.assign({}, state, {applications: newAppSellerArrays});

        case 'DENY_SELLER' :

            let denySellerArrays = state.applications.filter(x => x.applicationId === action.applicationId);

            if(denySellerArrays.length > 0){
                let index = state.applications.indexOf(denySellerArrays[0])

                if(index !== -1){
                    state.applications[index].sellerApplication.isApproved = false;
                    state.applications[index].sellerApplication.isDenied = true

                }
            }

            let newDenySellerArrays = [];

            state.applications.forEach(application => {
                newDenySellerArrays.push(application)
            });

            return Object.assign({}, state, {applications: newDenySellerArrays});

        case 'CANCEL_SELLER' :

            let cancelSellerArrays = state.applications.filter(x => x.applicationId === action.applicationId);

            if(cancelSellerArrays.length > 0){
                let index = state.applications.indexOf(cancelSellerArrays[0])

                if(index !== -1){
                    state.applications[index].sellerApplication.isApproved = false


                }
            }

            let newCancelSellerArrays = [];

            state.applications.forEach(application => {
                newCancelSellerArrays.push(application)
            });

            return Object.assign({}, state, {applications: newCancelSellerArrays})


        case 'ACTIVATE_USER' :

            let activateUserArrays = state.applications.filter(x => x.uniqueId === action.uniqueId);

            if(activateUserArrays.length > 0){

                activateUserArrays.forEach(array => {
                    let index = state.applications.indexOf(array)

                    if(index !== -1){
                        state.applications[index].isActive = true


                    }
                })


            }

            let newActiveUserArrays = [];

            state.applications.forEach(application => {
                newActiveUserArrays.push(application)
            });

            return Object.assign({}, state, {applications: newActiveUserArrays})

        case 'BLOCK_USER' :

            let blockUserArrays = state.applications.filter(x => x.uniqueId === action.uniqueId);

            if(blockUserArrays.length > 0){

                blockUserArrays.forEach(array => {
                    let index = state.applications.indexOf(array)

                    if(index !== -1){
                        state.applications[index].isActive = false


                    }
                });


            }

            let newBlockUserArrays = [];

            state.applications.forEach(application => {
                newBlockUserArrays.push(application)
            });

            return Object.assign({}, state, {applications: newBlockUserArrays});

        case 'GET_MANAGER_SAVED_HASH_TAG':



            return Object.assign({}, state, {hashTags: action.hashTags});

        case 'SAVE_MANAGER_SAVED_HASH_TAG':

            let newSaveHashTags = [];

            state.hashTags.forEach(hashTag => {
                newSaveHashTags.push(hashTag)
            })

            if(newSaveHashTags.indexOf(action.hashTag) === -1){
                newSaveHashTags.push(action.hashTag)
            }

            return Object.assign({}, state, {hashTags: newSaveHashTags});

        case 'DELETE_MANAGER_SAVED_HASH_TAG':

            let newDelHashTags = [];

            state.hashTags.forEach(hashTag => {
                console.log(hashTag, action.hashTag)

                if(hashTag !== action.hashTag){
                    newDelHashTags.push(hashTag)
                }


            })


            return Object.assign({}, state, {hashTags: newDelHashTags});

        case 'MANAGER_SEARCH_PRODUCT' :

            return Object.assign({}, state, {products: action.products});

        case 'GET_APPLIED' :



            return Object.assign({}, state, {products: action.products});

        case 'REQUEST_MATCHING' :

            let reqProductArray = state.products.filter(x => x.productId === action.productId)

            if(reqProductArray.length > 0){
                let index = state.products.indexOf(reqProductArray[0])

                if(index !== -1){
                    state.products[index].isRequested = true
                }
            }

            let newReqProductArray = [];

            state.products.forEach(product => {
               newReqProductArray.push(product)
            });

            return Object.assign({}, state, {products: newReqProductArray});

        case 'UNREQUEST_MATCHING' :

            let unreqProductArray = state.products.filter(x => x.productId === action.productId);

            if(unreqProductArray.length > 0){
                let index = state.products.indexOf(unreqProductArray[0])

                if(index !== -1){
                    state.products[index].isRequested = false
                }
            }

            let newUnReqProductArray = [];

            state.products.forEach(product => {
                if(product.productId !== action.productId){
                    newUnReqProductArray.push(product)
                }


            })

            return Object.assign({}, state, {products: newUnReqProductArray});

        case 'GET_MATCHING_REQUESTED' :



            return Object.assign({}, state, {requests: action.requests})

        case 'CONFIRM_MATCHING':

            let confFilteredArray = state.requests.filter(x => x.matchRequestId === action.requestId);

            if(confFilteredArray.length > 0){
                let index = state.requests.indexOf(confFilteredArray[0]);

                if(index !== -1){
                    state.requests[index].isConfirmed = true
                }
            }

            let newConfReqArray = [];

            state.requests.forEach(request => {
                newConfReqArray.push(request)
            })

            return Object.assign({}, state, {requests: newConfReqArray})

        case 'UNCONFIRM_MATCHING' :

            let unconfFilteredArray = state.requests.filter(x => x.matchRequestId === action.requestId);

            if(unconfFilteredArray.length > 0){
                let index = state.requests.indexOf(unconfFilteredArray[0]);

                if(index !== -1){
                    state.requests[index].isConfirmed = false
                }


            }

            let newUnconfReqArray = []

            state.requests.forEach(request => {
                newUnconfReqArray.push(request)
            });


            return Object.assign({}, state, {requests: newUnconfReqArray})

        case 'GET_SELLER_PRODUCT' :

            return Object.assign({}, state, {sellerProducts: action.products})

        case 'GET_PRODUCT_DETAIL':

            return Object.assign({}, state, {product: action.product})

        case 'GET_MATCH_REQUEST_COMMENT' :

            let selReplies = state.matchRequestReplies.filter(x => x.threadId === action.threadId);

            if(selReplies.length > 0){
                let index = state.matchRequestReplies.indexOf(selReplies[0]);


                selReplies[0].repiles = action.comments;


                state.matchRequestReplies[index] = selReplies[0];
            }else{
                let newReply = {
                    threadId: action.threadId,
                    replies: action.comments
                };

                state.matchRequestReplies.push(newReply);
            }

            let newRepliesArray = [];

            state.matchRequestReplies.forEach(reply => {
                newRepliesArray.push(reply)
            })

            return Object.assign({}, state, {matchRequestReplies:newRepliesArray})

        case 'ADD_MATCH_REQUEST_COMMENT' :

            let selCommentCommentArr = state.matchRequestReplies.filter(x => x.threadId === action.threadId);

            if(selCommentCommentArr.length > 0){

                action.comments.forEach(reply => {
                    selCommentCommentArr[0].replies.push(reply)
                });

                let index = state.matchRequestReplies.indexOf(selCommentCommentArr[0])

                if(index !== -1){
                    state.matchRequestReplies[index] = selCommentCommentArr[0]
                }
            }else{
                let commentReplies = {
                    threadId: action.threadId,
                    replies: action.replies
                }

                state.matchRequestReplies.push(commentReplies)
            }

            let newAddedReplies = [];

            state.matchRequestReplies.forEach(reply => {
                newAddedReplies.push(reply)
            });

            return Object.assign({}, state, {matchRequestReplies : newAddedReplies})

        case 'GET_ADMIN_FULL_REPORT' :

            return Object.assign({}, state, {report : action.report})

        case 'GET_ADMIN_JP_REPORT' :

            return Object.assign({}, state, {report : action.report})

        case 'GET_ADMIN_PROMO_REPORT' :

            return Object.assign({}, state, {report : action.report})

        case 'GET_REVENUE_ALL' :

            return Object.assign({}, state, {list : action.list})

        case 'GET_REVENUE_INFLUENCER' :

            return Object.assign({}, state, {list : action.list})

        case 'GET_REVENUE_PRODUCT' :

            return Object.assign({}, state, {list : action.list})

        case 'GET_INFLUENCER_PAYMENT_DUE' :

            return Object.assign({}, state, {paymentDueViewType: PAYMENT_DUE_VIEW_TYPE.INFLUENCER, dueList : action.list})

        case 'GET_SELLER_PAYMENT_DUE' :

            return Object.assign({}, state, {paymentDueViewType: PAYMENT_DUE_VIEW_TYPE.SELLER ,dueList : action.list})

        case 'GET_SHIPPING_COMPANY' :

            return Object.assign({}, state, {companies: action.companies})

        case 'SELLER_GET_ORDER_ITEM':

            return Object.assign({}, state, {orderItems: action.orderItems})

        case 'GET_EXCHANGE_REQUESTED_ITEM':

            return Object.assign({}, state, {items: action.items})

        case 'GET_REFUND_REQUESTED_ITEM' :

            return Object.assign({}, state, {items: action.items})

        case 'GET_EXCHANGE_REQUESTED_ITEM_COUNT':

            return Object.assign({}, state, {exchangeCount: action.count})

        case 'GET_REFUND_REQUESTED_ITEM_COUNT' :

            return Object.assign({}, state, {refundCount: action.count})
        default:
            return state;
    }
}

const stellaStoreApp = combineReducers({
    stella,
    search,
    forum,
    user,
    cart,
    product,
    feed,
    notification,
    manager
});

export default stellaStoreApp;