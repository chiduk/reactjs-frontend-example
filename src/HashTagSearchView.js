import React, { Component } from 'react';
import "./js/components/HashTagSearchView.css";


class HashTagSearchView extends Component{
    constructor(props) {
        super(props)
        this.state = {}

    }



    render() {
        return(

                <div className="searchBodyContainer">

                        <div className="hashTagSearchResult" onClick={this.props.tagPressed}>
                            <div><a>#예쁜옷</a></div>
                            <div className="postingCount"><a>20 포스팅</a></div>
                        </div>
                        <div className="hashTagSearchResult">
                            <div><a>#여름옷</a></div>
                            <div className="postingCount"><a>30 포스팅</a></div>
                        </div>
                        <div className="hashTagSearchResult">
                            <div><a>#가을옷</a></div>
                            <div className="postingCount"><a>40 포스팅</a></div>
                        </div>
                        <div className="hashTagSearchResult">
                            <div><a>#겨울옷</a></div>
                            <div className="postingCount"><a>200 포스팅</a></div>
                        </div>

                </div>


        );
    }
}

export default HashTagSearchView