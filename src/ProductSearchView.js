import React, { Component } from "react";
import "./js/components/ProductSearchView.css";
import "./js/components/HashTagSearchAndAdd.css";
import fetch from 'cross-fetch'
import {getUniqueId, queryString, RestApi} from "./util/Constants";
import {getMatchedProduct} from "./actions/user";
import {connect} from "react-redux";

class ProductSearchView extends Component {
    constructor(props) {
        super(props);

        this.renderProductList = this.renderProductList.bind(this)
        this.state = {
            matchedProducts: [],
            productSearchResult: []
        }

        let params = {
            uniqueId: getUniqueId()
        }

        this.props.getMatchedProducts(params)
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.matchedProducts !== this.props.matchedProducts){



            let self = this;

            this.setState({matchedProducts: this.props.matchedProducts}, () => {
                let rows = [];

                self.props.matchedProducts.forEach(matchedProduct => {
                    const row = <div key={matchedProduct.productId} id={matchedProduct.productId + 'containerID'} className="productContainer" onClick={() => this.containerClick(matchedProduct)}>
                        <div className="cardProductImg"><img src={(matchedProduct.images.length > 0) ? RestApi.prod + matchedProduct.images[0] : 'placeholder'}/></div>
                        <div className="productInfo">
                            <div className="cardProductName"><a>{matchedProduct.title}</a></div>
                            <div className={"commissionRate"}><a>수수료율: {matchedProduct.commissionRate}% </a></div>
                            <div className="cardPriceContainer">
                                <div className={"priceInfo"}><a>{matchedProduct.discountRate}% off {(matchedProduct.currency === 'KRW') ? "₩" : "₩"}{(matchedProduct.price  * ( (100 - matchedProduct.discountRate) / 100)).toLocaleString()}</a></div>
                            </div>
                        </div>
                    </div>;

                    rows.push(row)
                });

                this.setState({productSearchResult: rows})

            })
        }
    }

    containerClick = (product) => {
        let element = document.getElementById(product.productId + 'containerID')
        element.style.animation = "";
        void element.offsetWidth;

        element.style.color = "red";

        element.style.animation = "buttonPressedDown 0.3s 1";

        this.props.productClicked(product)
    };

    renderProductList(input) {

        let keyword = input.target.value;

        if(keyword.length <= 0){
            let rows = [];

            this.props.matchedProducts.forEach(matchedProduct => {
                const row = <div key={matchedProduct.productId} id={matchedProduct.productId + 'containerID'} className="productContainer" onClick={() => this.containerClick(matchedProduct)}>
                    <div className="cardProductImg"><img src={(matchedProduct.images.length > 0) ? RestApi.prod + matchedProduct.images[0] : 'placeholder'}/></div>
                    <div className="productInfo">
                        <div className="cardProductName"><a>{matchedProduct.title}</a></div>
                        <div className="cardPriceContainer">
                            <div className={"priceInfo"}><a>{matchedProduct.discountRate}% off {(matchedProduct.currency === 'KRW') ? "₩" : "₩"}{(matchedProduct.price  * ( (100 - matchedProduct.discountRate) / 100)).toLocaleString()}</a></div>
                        </div>
                    </div>
                </div>;

                rows.push(row)
            });
            this.setState({productSearchResult: rows});
            return;
        }

        let params = {
            keyword: keyword,
            uniqueId: getUniqueId()
        };

        fetch(RestApi.search.matchedProduct + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {
                let products = json;

                let rows = [];

                // this.props.matchedProducts.forEach(matchedProduct => {
                //     const row = <div key={matchedProduct.productId} id={matchedProduct.productId + 'containerID'} className="productContainer" onClick={() => this.containerClick(matchedProduct)}>
                //         <div className="cardProductImg"><img src={(matchedProduct.images.length > 0) ? RestApi.prod + matchedProduct.images[0] : 'placeholder'}/></div>
                //         <div className="productInfo">
                //             <div className="cardProductName"><a>{matchedProduct.title}</a></div>
                //             <div className="cardPriceContainer">
                //                 <div className={"priceInfo"}><a>{matchedProduct.discountRate}% off {(matchedProduct.currency === 'KRW') ? "₩" : "₩"}{(matchedProduct.price  * ( (100 - matchedProduct.discountRate) / 100)).toLocaleString()}</a></div>
                //             </div>
                //         </div>
                //     </div>;
                //
                //     rows.push(row)
                // });

                products.forEach((i) => {

                    // let filteredArray = this.props.matchedProducts.filter(x => x.productId === i.productId);
                    //
                    //
                    // if(filteredArray.length > 0){
                    //     return;
                    // }

                    const row = <div key={i.productId} id={i.productId + 'containerID'} className="productContainer" onClick={() => this.containerClick(i)}>
                        <div className="cardProductImg"><img src={(i.images.length > 0) ? RestApi.prod + i.images[0] : 'placeholder'}/></div>
                        <div className="productInfo">
                            <div className="cardProductName"><a>{i.title}</a></div>
                            <div className="cardPriceContainer">
                                <div className={"priceInfo"}><a>{i.discountRate}% off {(i.currency === 'KRW') ? "₩" : "₩"}{(i.price  * ( (100 - i.discountRate) / 100)).toLocaleString()}</a></div>
                            </div>
                        </div>
                    </div>;

                    rows.push(row)
                });
                this.setState({productSearchResult: rows})

            })



    }

    render() {
        console.log(this.props.matchedProducts)

        return (

            <div className={"searchViewBody"}>
                <div className={"opacityBackGround"}/>

                <div className={"searchViewContainer"}>
                    <div className="searchViewTopContainer">
                        <div className={"searchViewInput"}>
                            <input placeholder={"상품 검색"} onChange={e => this.renderProductList(e)}/>
                        </div>
                        <div className={"closeSearchViewButton"} onClick={this.props.closeSearchView}><a>close X</a></div>
                    </div>

                    <div className={"hashTagSearchResultWrapper"}>
                        {this.state.productSearchResult}
                    </div>

                </div>
            </div>

        );
    }
}

let mapStateToProps = (state) => {
    return{
        matchedProducts: state.user.matchedProduct
    }
};

let mapDispatchToProps = (dispatch) => {
    return{
        getMatchedProducts: (params) => dispatch(getMatchedProduct(params))
    }
};

ProductSearchView = connect(mapStateToProps, mapDispatchToProps)(ProductSearchView)

export default ProductSearchView;