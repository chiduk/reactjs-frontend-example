import React, { Component } from 'react';
import "./js/components/HashTagSearchAndAdd.css";
import {searchHashTag} from "./actions/search";
import {connect} from "react-redux";



class HashTagSearchAndAddView extends Component {
    constructor(props) {
        super(props)
        this.renderHashTagList = this.renderHashTagList.bind(this)
        this.state = {
            hashTagSearchResult: [],
            searchHashTag: true
        }
    }


    search = (input) => {
        let keyword = input.target.value.trim();

        if(keyword.length > 0) {
            this.setState({searchHashTag: true})
            this.props.searchHashTag(keyword)
        }else{
            this.setState({searchHashTag: false});

        }

    };


    tagClicked = (i, index) => {

        let element = document.getElementById(i.hashTag + index)
        element.style.animation = ""
        void element.offsetWidth;

        element.style.color = "red"

        element.style.animation = "buttonPressedDown 0.3s 1";


        this.props.addHashTag(i)

    }

    renderHashTagList = () => {

        let rows = []

        if(this.state.searchHashTag){

            this.props.hashTags.forEach((i, index) => {

                const row = <div className="hashTagSearchResult" key={i.hashTag} id={i.hashTag + index} onClick={() => this.tagClicked(i, index)}>
                    <div className={"hashTagSearched"} id={"hashTagSearchedID"}>{i.hashTag}</div>
                    <div className="postingCount">{i.count} 포스팅</div>
                </div>
                rows.push(row)
            })

        }else{

            rows = []
        }


        return rows

    }

    render() {
        return (
            <div className={"searchViewBody"}>
                <div className={"opacityBackGround"}/>

                <div className={"searchViewContainer"}>
                    <div className="searchViewTopContainer">
                        <div className={"searchViewInput"}><input placeholder={"#태그검색"} onChange={e => this.search(e)}/></div>
                        <div className={"closeSearchViewButton"} onClick={this.props.closeSearchView}><a>close X</a></div>
                    </div>

                    <div className={"hashTagSearchResultWrapper"}>

                        {this.renderHashTagList()}

                    </div>

                </div>
            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        searchHashTag: (keyword) => dispatch(searchHashTag(keyword))
    }
};

let mapStateToProps = (state) => {

    return {
        hashTags: state.search.hashTags
    }
};

HashTagSearchAndAddView = connect(mapStateToProps, mapDispatchToProps)(HashTagSearchAndAddView);

export default HashTagSearchAndAddView;