import React, { Component } from "react";

import Masonry from "react-masonry-component";
import HomeMasonryCard from "./HomeMasonryCard";
import fetch from 'cross-fetch'
import "./js/components/HashTagSearchView.css";
import {getUniqueId, queryString, RestApi} from "./util/Constants";
import {connect} from "react-redux";
import {searchFeed} from "./actions/search";


class SearchFeedView extends Component {
    constructor(props) {
        super(props)


        const feeds = []

        let feedRows =[]

        feeds.forEach((i) => {
            let feedRow = <HomeMasonryCard feed={i}/>
            feedRows.push(feedRow)
        })

        this.state = {
            feeds: feedRows,
            keyword: ''
        }

       this.searchBarRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.searchedFeeds !== this.props.searchedFeeds){
            this.setState({feeds: this.props.searchedFeeds})
        }
    }

    searchFeed = (input) => {
        let keyword = input.target.value;

        if(keyword.length <= 0){
            this.setState({keyword: '', feeds: []})
            return [];

        }

        this.setState({keyword: keyword})

        let params = {
            keyword: keyword,
            uniqueId: getUniqueId()
        };

        this.props.searchFeeds(params)

    };

    renderSearchedFeed = () => {
        let rows = [];

        this.state.feeds.forEach((feed, index) => {

            let feedRow = <HomeMasonryCard feed={feed} key={index}/>
            rows.push(feedRow)
        })

        return rows

    };

    close = () => {
        this.setState({keyword: '', feeds: []})
        this.props.toggleSearchView("searchFeedViewID")
    }

    render() {

        const masonryOptions = {

            gutter: 32,
            columnWidth: '.grid-sizer',
            itemSelector: '.masonryCard',
            percentPosition: true,
        };

        return (
                <div>
                    <div className="searchBarWrapper">
                        <div className="hashTagSearBarDiv"><input className="searchBar searchHashTagSearchBar" id={'feedSearchBarInputID'} placeholder="Search" ref={this.searchBarRef} value={this.state.keyword} onChange={event => this.searchFeed(event)}/></div>
                        <div className="searchCloseButton" ><a onClick={() => this.close() }>close X</a></div>
                    </div>

                    <div className="searchFeedContainer">

                        <Masonry className={'my-gallery-class'} options = {masonryOptions}>
                            <div className="grid-sizer"/>
                            {this.renderSearchedFeed()}

                        </Masonry>
                    </div>
                </div>
        );
    }
}

let mapStateToProps = (state) => {

    return {
        isFollowing: state.stella.isFollowingArray,
        searchedFeeds: state.search.searchedFeeds
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        searchFeeds: (params) => dispatch(searchFeed(params))
    }
};

SearchFeedView = connect(mapStateToProps, mapDispatchToProps)(SearchFeedView)

export default SearchFeedView;