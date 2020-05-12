import moment from "moment";
import LogInPage from "../LogInPage";
import React from "react"
export function queryString(params) {

    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

export const RestApi = {
    prod: '/api/pd/',
    prodDesc: '/api/pd/desc/',
    profile: '/api/pf/',
    feedImage: '/api/fd/',
    main: {
        getFeeds: '/api/main/feed/get',
        getFeedsFollowing: '/api/main/feed/get/following',
        getJointPurchase: '/api/main/jp/get',
        getJointPurchaseFollowing: '/api/main/jp/get/following',
        getJointPurchaseAll: '/api/main/jp/get/all',
        getJointPurchaseForSale: '/api/main/jp/get/for/sale',
        getJointPurchaseFinished: '/api/main/jp/get/finished',
        getJointPurchaseWillStart: '/api/main/jp/get/will/start',
        uploadFeed: '/api/main/feed/upload',
        uploadJointPurchase: '/api/main/jp/upload',
        editJointPurchase: '/api/main/jp/edit',
        getHashTags: '/api/main/get/hashTags',
        addHashTag: '/api/main/add/hashTag',
        deleteHashTag: '/api/main/delete/hashTag',
        getHashTagInfluencer: '/api/main/get/hashTag/influencer'
    },

    feed:{
        addCommentToComment: '/api/feed/add/comment/comment',
        addCommentFeed: '/api/feed/add/comment',
        deleteCommentFeed: '/api/feed/delete/comment',
        editCommentFeed: '/api/feed/edit/comment',
        getFeedComments: '/api/feed/getFeedComments',
        getDetail: '/api/feed/getDetail',
        getCommentComment: '/api/feed/get/comment/comment',
        like: '/api/feed/like',
        unlike: '/api/feed/unlike',
        isLiked: '/api/feed/isLiked',
        save: '/api/feed/save',
        unsave: '/api/feed/unsave',
        isSaved: '/api/feed/isSaved',
        getCommentCount: '/api/feed/comment/count',
        getLikeCount: '/api/feed/like/count',
        upload: '/api/feed/upload',
        getSuggested: '/api/feed/get/suggested',
        requestAlarm: '/api/feed/request/alarm',
        unrequestAlarm: '/api/feed/unrequest/alarm',
        pin: '/api/feed/pin',
        unpin: '/api/feed/unpin',
        report: '/api/feed/report',
        delete: '/api/feed/delete',
        edit: '/api/feed/edit',
        getSimilarFeed: '/api/feed/get/similar'

    },

    forum: {
        getRecent: '/api/forum/getRecent',
        getByLike: '/api/forum/getByLike',
        getByComment: '/api/forum/getByComment',
        getByRead: '/api/forum/getByRead',
        read: '/api/forum/read',
        getCommentCount: '/api/forum/get/comment/count',
        getLikeCount: '/api/forum/get/like/count',
        add: '/api/forum/add',
        edit: '/api/forum/edit',
        report: '/api/forum/report',
        delete: '/api/forum/delete',
        like: '/api/forum/like',
        unlike: '/api/forum/unlike',
        isLiked: '/api/forum/isLiked',
        comment: {
            get: '/api/forum/comment/get',
            add: '/api/forum/comment/add',
            edit: '/api/forum/comment/edit',
            delete: '/api/forum/comment/delete',
            comment: {
                get: '/api/forum/comment/comment/get',
                add: '/api/forum/comment/comment/add',
                edit: '/api/forum/comment/comment/edit',
                delete: '/api/forum/comment/comment/delete'
            }
        },
        hashTag: {
            get: '/api/forum/get/savedHashTags',
            delete: '/api/forum/delete/hashTag',
            save: '/api/forum/save/hashTag',
            getSuggested: '/api/forum/get/suggestedHashTag'
        }

    },

    login:{
        addNewUser: '/api/login/add/user',
        logIn: '/api/login/logIn',
        facebookLogIn: '/api/login/facebookLogin',
        googleLogIn: '/api/login/googleLogIn',
        kakaoLogIn: '/api/login/kakaoLogIn',
        naverLogIn: '/api/login/naverLogIn',
        checkUserId: '/api/login/check/userId',
        checkEmail: '/api/login/check/email',
        uploadProfilePic: '/api/login/upload/profile/pic'

    },

    user: {
        isFollowing: '/api/user/isFollowing',
        follow: '/api/user/follow',
        unfollow: '/api/user/unfollow',
        getFollowingCount: '/api/user/get/following/count',
        getFollowCount: '/api/user/get/follow/count',
        getReviewCount: '/api/user/get/product/comment/count',
        getForumCount: '/api/user/get/forum/count',
        getUserInfo: '/api/user/get/info',
        getMyInfo: '/api/user/get/my/info',
        getFeed: '/api/user/get/feed',
        getForum: '/api/user/get/forum',
        getSaved: '/api/user/get/saved',
        getReview: '/api/user/get/review',
        saveAddress: '/api/user/save/address',
        getAddress: '/api/user/get/address',
        deleteAddress: '/api/user/delete/address',
        updateInfo: '/api/user/update/info',
        influenerIsApplied: '/api/user/influencer/isApplied',
        influenerIsApproved: '/api/user/influencer/isApproved',
        sellerIsApplied: '/api/user/seller/isApplied',
        sellerIsApproved: '/api/user/seller/isApproved',
        getPassword: '/api/user/get/password',
        getEmail: '/api/user/get/email',
        getMatchedProduct: '/api/user/get/matched/product',
        verifyID: '/api/user/verifyID',
        verifyBank: '/api/user/verifyBank'
    },

    product: {
        add: '/api/product/add',
        getDetail: '/api/product/detail',
        addToCart: '/api/add/cart',
        addComment: '/api/product/comment/add',
        addCommentComment: '/api/product/comment/comment/add',
        editComment: '/api/product/comment/edit',
        deleteComment: '/api/product/comment/delete',
        getComment: '/api/product/get/comment',
        getCommentComment: '/api/product/get/comment/comment',
        updateDetail: '/api/product/update/detail'
    },

    cart: {
        add: '/api/cart/add',
        get: '/api/cart/get/items',
        delete: '/api/car/delete',
        order: '/api/cart/order',
        pay: '/api/pay',
        payIE: '/api/pay/ie',
        payMobile: '/api/pay/mobile',
        getOrderedItem: '/api/cart/get/ordered/items',
        getCount: '/api/cart/get/count',
        deleteItem: '/api/cart/delete/item',
        orderItem: '/api/cart/order/item',
        buyNow: '/api/cart/buynow',
        setQuantity: '/api/cart/set/item/quantity',
        hasPurchased: '/api/cart/has/purchased',
        trackShipping: '/api/cart/track/shipping'
    },

    search: {
        hashTag: '/api/search/hashTag',
        feed: '/api/search/feed',
        product: '/api/search/product',
        matchedProduct: '/api/search/matched/product',
        user: '/api/search/user'
    },

    notification: {
        getNotification: '/api/notification/get/notification',
        reset: '/api/notification/reset',
        getCount: '/api/notification/get/count'
    },

    manager: {
        getApplication: '/api/manager/get/application',
        approveInfluencer: '/api/manager/approve/influencer',
        denyInfluencer: '/api/manager/deny/influencer',
        cancelInfluencer: '/api/manager/cancel/influencer',
        approveSeller: '/api/manager/approve/seller',
        denySeller: '/api/manager/deny/seller',
        cancelSeller: '/api/manager/cancel/seller',
        activateUser: '/api/manager/activate/user',
        blockUser: '/api/manager/block/user',
        saveHashTag: '/api/manager/save/hashTag',
        deleteHashTag: '/api/manager/delete/hashTag',
        getSavedHashTags: '/api/manager/get/savedHashTags',
        requestMatching: '/api/manager/request/matching',
        searchProduct: '/api/manager/search/product',
        getApplied: '/api/manager/get/match/applied',
        unrequestMatching: '/api/manager/unrequest/matching',
        getMatchingRequested: '/api/manager/get/matching/requested',
        confirmMatching: '/api/manager/confirm/matching',
        unconfirmMatching: '/api/manager/unconfirm/matching',
        getSellerProduct: '/api/manager/seller/get/product',
        getProductDetail: '/api/manager/get/product/detail',
        getMatchRequestComment: '/api/manager/get/match/request/comment',
        addMatchRequestComment: '/api/manager/add/match/request/comment',
        getAdminFullReport: '/api/manager/get/admin/full/report',
        getAdminJPReport: '/api/manager/get/admin/jp/report',
        getAdminPromoReport: '/api/manager/get/admin/promo/report',
        getRevenueAll: '/api/manager/get/revenue/all',
        getRevenueInfluencer: '/api/manager/get/revenue/influencer',
        getRevenueProduct: '/api/manager/get/revenue/product',
        getInfluencerPaymentDue: '/api/manager/get/influencer/payment/due',
        getSellerPaymentDue: '/api/manager/get/seller/payment/due',
        getShippingCompanyList: '/api/manager/get/shipping/company',
        sellerGetOrderItem: '/api/manager/get/seller/order/items',
        confirmOrder: '/api/manager/confirm/order',
        cancelOrder:  '/api/manager/request/cancel/order',
        setShippingCompany: '/api/manager/order/set/shipping',
        requestRefund: '/api/manager/request/refund',
        confirmRefund: '/api/manager/confirm/refund',
        requestExchange: '/api/manager/request/exchange',
        confirmExchange: '/api/manager/confirm/exchange',
        getExchangeRequestedItems: '/api/manager/get/seller/exchange/requested/item',
        getRefundRequestedItems: '/api/manager/get/seller/refund/requested/item',
        getExchangeRequestedItemCount: '/api/manager/get/seller/exchange/requested/item/count',
        getRefundRequestedItemCount: '/api/manager/get/seller/refund/requested/item/count',
        setCommissionRate: '/api/manager/set/commission',
        cancelPurchase: '/api/manager/cancelPurchase'
    }

};

export function getUniqueId() {
    return localStorage.getItem('uniqueId')
}

export function getUserId() {
    return localStorage.getItem('userId')
}

export function getNotiCount() {
    return localStorage.getItem('notificationCount')
}

export function getCartItemCount() {
    return localStorage.getItem('cartItemCount')
}

export function getName() {
    return localStorage.getItem('name')
}

export function utcToLocal(date) {
    let tempUtc = moment.utc(date).toDate()
    return moment(tempUtc).local().format('YYYY-MM-DD HH:mm:ss');
}

export function utcToLocalDateOnly(date) {
    let tempUtc = moment.utc(date).toDate()
    return moment(tempUtc).local().format('YYYY-MM-DD');
}

export function isObjectEmpty(obj) {
    for(let key in obj){
        if(obj.hasOwnProperty(key)) return false;
    }

    return true
}

function toggleView(id) {
    const element = document.getElementById(id)

    element.classList.toggle('searchViewClose')
}

export function getLoginPage() {

}

export const profileImagePlaceholder = '../image/userIcon.png';

function getProfileImageSource(uniqueId) {
    return RestApi.profile + uniqueId + '.png'
}

export function profileImage(uniqueId) {
    return (
        <img src={getProfileImageSource(uniqueId)} onError={onProfileImageError}/>
    )
}

function onProfileImageError() {
    getProfileImageSource('profileImagePlaceholder')
}

export const FORUM_VIEW_MODE = {
    ALL: 'ALL',
    ONE_TAG: 'ONE_TAG',
    MY_TAGS: 'MY_TAGS'
};

export const FORUM_MODE = {
    RECENT: 'RECENT',
    BY_LIKE: 'BY_LIKE',
    BY_COMMENT: 'BY_COMMENT',
    BY_READ: 'BY_READ'
};

export const PAYMENT_OPTION = {
    CARD: 'CARD',
    BANK: 'BANK',
    CELLPHONE: 'CELLPHONE',
    VBANK: 'VBANK'
};

export const FEED_TYPE = {
    JOINT_PURCHASE: 'JOINT_PURCHASE',
    PROMOTION: 'PROMOTION'
};

export const JOINT_PURCHASE_VIEW_ID = {
    VIEW_ALL: 'viewAllID',
    VIEW_SELLING: 'viewSellingID',
    VIEW_SOLD: 'viewSoldID',
    VIEW_WILL_SELL: 'viewWillSellID'

}

export const FEED_ADDITIONAL_CONTENTS_TYPE = {
    IMAGE: 'IMAGE',
    SUBTITLE: 'SUBTITLE',
    DESCRIPTION: 'DESCRIPTION',
    URL: 'URL'
}

export const REVENUE_TYPE = {
    ALL: 'ALL',
    JP:'JP',
    PROMO:'PROMO'
}

export const APPLICATION_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED'
}

export const SEARCH_USER_TYPE = {
    ALL: 'ALL',
    INFLUENCER: 'INFLUENCER',
    SELLER: 'SELLER',
    BUYER: 'BUYER'
}

export const PAYMENT_DUE_VIEW_TYPE = {

    INFLUENCER: 'INFLUENCER',
    SELLER: 'SELLER'

}

export const NOTIFICATION_TYPE = {
    FEED_COMMENT: 'FEED_COMMENT',
    PRODUCT_COMMENT: 'PRODUCT_COMMENT',
    MATCH_REQUEST: 'MATCH_REQUEST',
    MATCH_REQUEST_SENT : 'MATCH_REQUEST_SENT',
    MATCH_REQUEST_COMMENT: 'MATCH_REQUEST_COMMENT',
    MATCH_REQUEST_CONFIRM: 'MATCH_REQUEST_CONFIRM',
    MATCH_REQUEST_CANCEL: 'MATCH_REQUEST_CANCEL'
};

export const ORDER_STATUS = {
    WAITING_FOR_CONFIMATION: 'WAITING_FOR_CONFIRMATION',
    CONFIRMED: 'CONFIRMED',
    PACKING: 'PACKING',
    SHIPPED: 'SHIPPED',
    DELIVERING: 'DELIVERING',
    RECEIVED: 'RECEIVED',
    REJECTED_BY_SELLER: 'REJECTED_BY_SELLER', //판매자가 거부
    CANCEL: {
        REQUESTED: 'CANCEL_REQUESTED_BY_BUYER',
        CONFIRMED: 'CANCEL_REQUEST_CONFIRMED',
        DENIED: 'CANCEL_REQUEST_DENIED'
    },
    REFUND: {
        REQUESTED: 'REFUND_REQUESTED_BY_BUYER',
        CONFIRMED: 'REFUND_REQUEST_CONFIRMED',
        DENIED: 'REFUND_REQUEST_DENIED'
    },
    EXCHANGE: {
        REQUESTED: 'EXCHANGE_REQUESTED_BY_BUYER',
        CONFIRMED: 'EXCHANGE_REQUEST_CONFIRMED',
        DENIED: 'EXCHANGE_REQUEST_DENIED'
    }
};

export const SHIPPING_STATUS = {
        PACKING: 'PACKING',
        SHIPPED: 'SHIPPED',
        DELIVERING: 'DELIVERING',
        RECEIVED: 'RECEIVED',
        PREPARING: 'PREPARING'
}


export const REFUND_STATUS = {
    REQUESTED: 'REFUND_REQUESTED_BY_BUYER',
        CONFIRMED: 'REFUND_REQUEST_CONFIRMED',
        DENIED: 'REFUND_REQUEST_DENIED'
}

export const EXCHANGE_STATUS = {
    REQUESTED: 'EXCHANGE_REQUESTED_BY_BUYER',
        CONFIRMED: 'EXCHANGE_REQUEST_CONFIRMED',
        DENIED: 'EXCHANGE_REQUEST_DENIED'
}


export const PURCHASE_PAY_STATUS = {
    WAITING: 'WAITING', // 입금 대기중,
    PAID: 'PAID', //결제 완료,
    CANCEL: 'CANCEL', //취소됨
    REFUND: 'REFUND' //환불됨
}

export const HOME_FEED_VIEW_MODE = {
    ALL: 'ALL',
    FOLLOWING: 'FOLLOWING'
};

export const HOME_FEED_TAG_VIEW_MODE = {
    ALL: 'ALL',
    TAG_ONLY: 'TAG_ONLY'
};

export const PROFILE_SOCIAL_VIEW_MODE = {
    VIEW_ALL: 'ALL',
    VIEW_FOR_SALE: 'FOR_SALE'
};

export const SHIPPING_COMPANY = [
    { Code: '04', Name: 'CJ대한통운' },
    { Code: '05', Name: '한진택배' },
    { Code: '08', Name: '롯데택배' },
    { Code: '01', Name: '우체국택배' },
    { Code: '06', Name: '로젠택배' },
    { Code: '11', Name: '일양로지스' },
    { Code: '12', Name: 'EMS' },
    { Code: '13', Name: 'DHL' },
    { Code: '20', Name: '한덱스' },
    { Code: '21', Name: 'FedEx' },
    { Code: '14', Name: 'UPS' },
    { Code: '26', Name: 'USPS' },
    { Code: '22', Name: '대신택배' },
    { Code: '23', Name: '경동택배' },
    { Code: '32', Name: '합동택배' },
    { Code: '46', Name: 'CU 편의점택배' },
    { Code: '24', Name: 'CVSnet 편의점택배' },
    { Code: '25', Name: 'TNT Express' },
    { Code: '16', Name: '한의사랑택배' },
    { Code: '17', Name: '천일택배' },
    { Code: '18', Name: '건영택배' },
    { Code: '28', Name: 'GSMNtoN' },
    { Code: '29', Name: '에어보이익스프레스' },
    { Code: '30', Name: 'KGL네트웍스' },
    { Code: '33', Name: 'DHL Global Mail' },
    { Code: '34', Name: 'i-Parcel' },
    { Code: '37', Name: '판토스' },
    { Code: '38', Name: 'ECMS Express' },
    { Code: '40', Name: '굿투럭' },
    { Code: '41', Name: 'GSI Express' },
    { Code: '42', Name: 'CJ대한통운 국제특송' },
    { Code: '43', Name: '애니트랙' },
    { Code: '44', Name: '로지스링크(SLX택배)' },
    { Code: '45', Name: '호남택배' },
    { Code: '47', Name: '우리한방택배' },
    { Code: '48', Name: 'ACI Express' },
    { Code: '49', Name: 'ACE Express' },
    { Code: '50', Name: 'GPS Logix' },
    { Code: '51', Name: '성원글로벌카고' },
    { Code: '52', Name: '세방' },
    { Code: '53', Name: '농협택배' },
    { Code: '54', Name: '홈픽택배' },
    { Code: '55', Name: 'EuroParcel' },
    { Code: '56', Name: 'KGB택배' },
    { Code: '57', Name: 'Cway Express' },
    { Code: '58', Name: '하이택배' },
    { Code: '59', Name: '지오로직' },
    { Code: '60', Name: 'YJS글로벌(영국)' },
    { Code: '61', Name: '워펙스코리아' },
    { Code: '62', Name: '(주)홈이노베이션로지스' },
    { Code: '63', Name: '은하쉬핑' },
    { Code: '64', Name: 'FLF퍼레버택배' },
    { Code: '65', Name: 'YJS글로벌(월드)' },
    { Code: '66', Name: 'Giant Network Group' },
    { Code: '67', Name: '디디로지스' },
    { Code: '68', Name: '우리동네택배' },
    { Code: '69', Name: '대림통운' },
    { Code: '70', Name: 'LOTOS CORPORATION' },
    { Code: '71', Name: 'IK물류' },
    { Code: '99', Name: '롯데택배 해외특송' }
]

export const JOINT_PURCHASE_FEED_LIMIT_COUNT = 10;

export const PROMOTION_FEED_LIMIT_COUNT = 5;

export const SWEET_TRACKER_API = '';

export function groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

export function getDateString(newdate) {


    let date = new Date(newdate);

    let currentTime = Number(date.getFullYear() + `${(date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)}` + `${(date.getDate()) < 10 ? "0" + (date.getDate()) : (date.getDate())}` + `${(date.getHours()) < 10 ? "0" + (date.getHours()) : (date.getHours())}` + `${(date.getMinutes()) < 10 ? "0" + (date.getMinutes()) : (date.getMinutes())}`)


    return currentTime
}


export function getTodayDate() {
    let separator = "-"
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    let val = {
        text: `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date<10?`0${date}`:`${date}`}`,
        number: `${year}${month<10?`0${month}`:`${month}`}${date<10?`0${date}`:`${date}`}`
    }

    return val

}

export function getDaysBefore(days) {
    let separator = "-"
    let newDate = new Date(new Date().getTime() - (days*24*60*60*1000))
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    let val = {
        text: `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`,
        number: `${year}${month<10?`0${month}`:`${month}`}${date}`
    }

    return val
}


export function getDaysBeforeFromAday(dateVal, days) {
    let separator = "-"
    // let newDate = new Date(new Date().setDate(dateVal) - (days*24*60*60*1000))
    let newDate = new Date( new Date(dateVal) - (days*24*60*60*1000))
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    //
    let val = {
        text: `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date<10?`0${date}`:`${date}`}`,
        number: `${year}${month<10?`0${month}`:`${month}`}${date}`
    }

    return val
}

export function getDateInNumber(text) {
    let date = text
    let dateNumber =[]
    String(date).split("").forEach((i, index) => {
        if (index < 4) {
            dateNumber.push(i)
        }
        if (index > 4 && index < 7) {
            dateNumber.push(i)
        }

        if (index > 7 && index < 10) {
            dateNumber.push(i)
        }
    })

    return dateNumber.join("")
}

export function isMobile(){

    let UserAgent = navigator.userAgent;



    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null)
    {

        return true;

    }else{

        return false;

    }

}

export function getBeginTimeText(when, number) {
    let year =[]
    let month = []
    let date = []
    let hour = []
    let minute = []

    String(number).split("").forEach((i, index) => {
        if (index < 4) {
            year.push(i)
        }

        if (index > 3 && index < 6) {
            month.push(i)
        }

        if (index > 5 && index < 8) {
            date.push(i)
        }

        if (index > 7 && index < 10) {
            hour.push(i)
        }

        if (index > 9 && index < 12) {
            minute.push(i)
        }
    })

    let monthText = `${Number(month.join('')) < 10 ? month[1] : month.join('')}`
    let dayText = `${Number(date.join('')) < 10 ? date[1] : date.join('')}`

    let timeText;
    if (Number(hour.join('')) > 12) {
        timeText = `${(Number(hour.join('')) - 12)}PM`
    } else if (Number(hour.join('')) < 12) {
        if ( Number(hour.join('')) < 10 ) {
            timeText = `${hour[1]}AM`
        } else {
            timeText = `${hour.join('')}AM`
        }
    } else if (Number(hour.join('')) === 12) {
        timeText = `${hour.join('')}PM`
    } else if (Number(hour.join('')) === 0) {
        timeText = `12AM`
    }

    let text;
    if (when === "begin") {
        text = `${year.join('')}. ${monthText}. ${dayText}. ${timeText}`
    } if (when === "end") {
        text = `${monthText}. ${dayText}. ${timeText}`
    }
    return (
        text
    );
}

export const kubricCommissionRate = 10
export const pgFeeRate = 2.5
export const govLaborFee = 3.3

export function logOut() {
    localStorage.removeItem('uniqueId');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('uniqueId')
}

export function shortenDesc(description) {
    if(description.length > 42){
        let shortenedDesc = ''

        for(let i = 0; i < 42; i++){
            if(i < 38){
                shortenedDesc += description[i]


            }else{
                shortenedDesc += '...';

                break;
            }
        }

        description = shortenedDesc
    }

    return description;
}

export function shortenHashTags(hashTags) {
    let shortenedHashTags = ''

    if(hashTags.length > 20){


        for(let i = 0; i < 42; i++){
            if(i < 38){
                shortenedHashTags += hashTags[i]


            }else{
                shortenedHashTags += '...';

                break;
            }
        }

        hashTags = shortenedHashTags
    }

    return hashTags;
}