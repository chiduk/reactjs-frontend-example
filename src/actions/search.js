import {queryString, RestApi} from '../util/Constants'
import fetch from 'cross-fetch'
import HomeMasonryCard from "../HomeMasonryCard";



export function searchHashTag(keyword) {
    return dispatch => {

        let params = {
            keyword: keyword
        }

        fetch(RestApi.search.hashTag + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then( json => {

                let hashTags = json;

                let filteredHashTags = hashTags.filter(x => x.hashTag === keyword)

                if(filteredHashTags.length === 0){
                    let tag = {
                        _id: keyword,
                        hashTag: keyword,
                        count: 0
                    }

                    hashTags.unshift(tag)
                }

                dispatch({
                    type: 'SEARCH_HASH_TAG',
                    hashTags: hashTags
                })
            })
    }
}

export function searchFeed(params) {
    return (dispatch) => {
        fetch(RestApi.search.feed + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {




                dispatch({
                    type: 'SEARCH_FEED',
                    searchFeeds: json
                })
            })
    }
}