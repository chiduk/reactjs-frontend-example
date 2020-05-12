import React , {Component} from "react";
import HashTagSearchAndAddView from "./HashTagSearchAndAddView";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import ProductDetailView from "./ProductDetailView";
import {
    deleteHashTag,
    getApplied,
    getSavedHashTags,
    requestMatching,
    saveHashTag,
    searchProduct, unrequestMatching
} from "./actions/manager";
import {getUniqueId, RestApi} from "./util/Constants";
import YesOrNoAlert from "./YesOrNoAlert";


class ManagementViewProductMatching extends Component{
    constructor(props) {
        super(props);

        this.state = {
            productList: [],
            tagArray:[],
            isAddTagViewOn: false,
            productModalView: null,
            addTagView: null,
            isMatchReqOpenArray: [],
            alertMessage: null

        }

        this.searchTypeClicked = this.searchTypeClicked.bind(this)
        this.selectButtonClicked = this.selectButtonClicked.bind(this)
        this.deleteHastTag = this.deleteHastTag.bind(this)
        this.matchClicked = this.matchClicked.bind(this)
        this.matchCancel = this.matchCancel.bind(this)
        this.viewDetail = this.viewDetail.bind(this)
        let params = {
            uniqueId: getUniqueId()
        }

        this.props.getHashTags(params);
        this.props.getApplied(params)
    }

    searchTypeClicked() {
        const element = document.getElementById("manageUserSearArrowID");
        element.classList.toggle("arrowDown");

        const buttonElement = document.getElementById("searchTypeSelectButtonContainerID");
        buttonElement.classList.toggle("selectButtonGrow");

    }

    selectButtonClicked(type) {
        this.setState({searchType: type})
    }

    deleteHastTag(tag) {

        let params = {
            uniqueId: getUniqueId(),
            hashTag: tag
        };

        this.props.deleteHashTag(params)
    }

    matchClicked(productId) {

        let filteredArray = this.props.products.filter(x => x.productId === productId);

        if(filteredArray.length > 0){

            console.log(filteredArray[0]);


            let params = {
                uniqueId: getUniqueId(),
                productId: productId
            }
            if(filteredArray[0].isRequested){

                // let isOpenArray = this.state.isMatchReqOpenArray.filter(x => x.productId === productId)
                //
                // if(isOpenArray.length > 0){
                //
                //
                //     let index = this.state.isMatchReqOpenArray.indexOf(isOpenArray[0])
                //
                //     if(index !== -1){
                //
                //         isOpenArray[0].isOpen = !isOpenArray[0].isOpen
                //
                //         let newArray = [];
                //
                //         this.state.isMatchReqOpenArray.forEach((elem, arrayIndex) => {
                //             if(arrayIndex === index){
                //                 newArray.push(isOpenArray[0])
                //             }else{
                //                 newArray.push(elem)
                //             }
                //         })
                //
                //         this.setState({isMatchReqOpenArray : newArray})
                //     }
                //
                //
                // }

                if(this.state.alertMessage === null){
                    let self = this;
                    this.setState({alertMessage: <YesOrNoAlert
                            alertTitle={"취소"}
                            messages={["취소 하시겠습니까?"]}
                            yes={() => {
                                self.matchCancel(productId)

                                self.setState({alertMessage: null})
                            }}
                            no={() => {
                                self.setState({alertMessage: null})
                            }}/>})
                }

            }else{
                this.props.requestMatching(params)
            }
        }
    }

    matchCancel(productId) {
        let filteredArray = this.props.products.filter(x => x.productId === productId);

        if(filteredArray.length > 0){

            let params = {
                uniqueId: getUniqueId(),
                productId: productId
            }
            if(filteredArray[0].isRequested){
                this.props.unrequestMatching(params)


            }else{
               // this.props.requestMatching(params)
            }
        }
    }

    addTagView = () => {

        if (this.state.isAddTagViewOn) {
            this.setState({addTagView: null})
        } else (
            this.setState({addTagView: <HashTagSearchAndAddView closeSearchView={this.addTagView} addHashTag={(tag) => this.addHashTag(tag)}/>})
        )
        this.setState({isAddTagViewOn: !this.state.isAddTagViewOn})
    }

    addHashTag = (tag) => {

        let params = {
            uniqueId: getUniqueId(),
            hashTag: tag.hashTag
        }

        this.props.saveHashTag(params)

    }

    searchProduct = (event) => {
        let product = event.target.value.trim()

        if(product.length > 0) {

            let params = {
                keyword: product
            }

            this.props.searchProduct(params)

        }else{

            let params = {
                uniqueId: getUniqueId()
            };


            this.props.getApplied(params)
        }
    };

    renderMatchRequestButton = (product) => {
        let isOpen = false;

        let isOpenArray = this.state.isMatchReqOpenArray.filter(x => x.productId === product.productId)

        if(isOpenArray.length > 0){


            let index = this.state.isMatchReqOpenArray.indexOf(isOpenArray[0])

            if(index !== -1){

                isOpen = isOpenArray[0].isOpen
            }


        }else{
            let obj = {
                productId: product.productId,
                isOpen: false
            }

            this.state.isMatchReqOpenArray.push(obj);

            isOpen = false;
        }



        let filteredArray = this.props.products.filter(x => x.productId === product.productId)

        if(filteredArray.length > 0){

            let matching = '매칭 신청';
            let matchButtonStyle;

            if(filteredArray[0].isConfirmed){

                matching = "매칭완료"
                matchButtonStyle = {
                    backgroundColor: "#FF0000",
                    color: "white"
                }

                return(
                    <div className={"matchOptionButtonWrapper"}>
                        <div className={"matchingButton"}
                             style={matchButtonStyle}
                             onClick={() => this.matchClicked(product.productId)}>{matching}</div>
                        <div className={`matchOption ${isOpen ? "approveContainerOpen" : "approveContainerClose"}`}>
                            <div className={`matchiOptionButton`} onClick={() => this.matchCancel(product.productId)}><a>신청 취소</a></div>
                        </div>
                    </div>
                )
            }else{


                if(filteredArray[0].isRequested){



                    if(filteredArray[0].isRejected !== undefined && filteredArray[0].isRejected !== null){
                        if(filteredArray[0].isRejected){
                            matching = "매칭취소됨"
                            matchButtonStyle = {
                                backgroundColor: "#d11b32",
                                color: "white"
                            };



                            return(
                                <div>
                                    <div className={"matchingButton"} style={matchButtonStyle}>{matching}</div>
                                </div>
                            )
                        }
                    }else{
                        matching = "신청중"
                        matchButtonStyle = {
                            backgroundColor: "#d11b32",
                            color: "white"
                        }



                        return(
                            <div className={"matchOptionButtonWrapper"}>
                                <div className={"matchingButton"} style={matchButtonStyle} onClick={() => this.matchClicked(product.productId)}>{matching}</div>
                                <div className={`matchOption ${isOpen ? "approveContainerOpen" : "approveContainerClose"}`}>
                                    <div className={`matchiOptionButton`} onClick={() => this.matchCancel(product.productId)}><a>신청 취소</a></div>
                                </div>
                            </div>
                        )
                    }


                }else{
                    matching = "매칭 신청"

                    return(
                        <div>
                            <div className={"matchingButton"} style={matchButtonStyle} onClick={() => this.matchClicked(product.productId)}>{matching}</div>
                            {/*<div className={`matchOption ${product.isMatchClicked ? "approveContainerOpen" : "approveContainerClose"}`}>*/}
                            {/*    <div className={`matchiOptionButton`} onClick={() => this.matchCancel(product.productId)}><a>신청 취소</a></div>*/}
                            {/*</div>*/}
                        </div>
                    )
                }

            }

        }
    }

    showCommissionRate = (product) => {
        let filteredArray = this.props.products.filter(x => x.productId === product.productId)

        if(filteredArray.length > 0) {

            let matching = '매칭 신청';
            let matchButtonStyle;


            if (filteredArray[0].isConfirmed) {

                matching = "매칭완료"
                matchButtonStyle = {
                    backgroundColor: "#FF0000",
                    color: "white"
                }

                return (
                    <div>수수료율: {product.commissionRate}%</div>
                )
            }else{
                return (
                    <div>

                    </div>
                )
            }
        }else{
            return (
                <div>

                </div>
            )
        }

    }

    viewDetail(id) {

        let productView = <div className={"productViewModalWrapper"}>
            <div className={"productViewModalContainer"}>
                <ProductDetailView productId={id}/>
            </div>
        </div>

        if (this.state.productModalView === null) {
            this.setState( {
                productModalView : productView
            })
        } else {
            this.setState( {
                productModalView : null
            })
        }

    }

    viewProductDetail = (productId) => {
        localStorage.setItem('forwardProductId', productId);
        window.open('/product')
    }

    render() {
        return (
            <div>
                <div className={"managementSearchSection"}>
                    <div className={"managementUserSearchInput"}><input className={"searchBar"} placeholder={"상품명 검색"} onChange={(e) => {this.searchProduct(e)}}/></div>
                </div>

                <div className={"productMatchingProductListWrapper"}>
                    {this.props.products.map((product, index) => {

                        let currency;
                        if (product.currency === "KRW") {
                            currency = "₩"
                        }

                        return (
                            <div key={index} className={"matchingProductWrapper"} id={index}>

                                <div className={"matchingProductImageNameWrapper"}>
                                    <div className={"matchingProductImg"}>
                                        <img src={(product.images.length > 0) ? RestApi.prod + product.images[0] : 'placeholder'}/>
                                    </div>

                                    <div className={"productFirstInfo"}>
                                        <div className={"productName"}>{product.title}</div>
                                        <div><a>{product.sellerName}</a></div>
                                        <div><a>판매 옵션 : {product.optionCount} 가지</a></div>
                                    </div>
                                </div>

                                <div className={"matchingProductInfo"}>
                                    <div>판매가 : {currency}{(product.price * (1 - product.discountRate / 100)).toLocaleString()}</div>
                                    {this.showCommissionRate(product)}
                                </div>

                                <div className={"matchingButtonWrapper"}>
                                    <div className={"matchingButton"} style={{marginBottom: "16px"}} onClick={() => {this.viewProductDetail(product.productId)}} >자세히 보기</div>
                                    {this.renderMatchRequestButton(product)}
                                </div>

                            </div>
                        );
                    })}

                </div>
                {this.state.addTagView}
                {this.state.alertMessage}
            </div>
        );
    }

}

let mapStateToProps = (state) => {


    return {
        hashTags: state.manager.hashTags,
        products: state.manager.products
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        getHashTags: (params) => dispatch(getSavedHashTags(params)),
        saveHashTag: (params) => dispatch(saveHashTag(params)),
        deleteHashTag: (params) => dispatch(deleteHashTag(params)),
        searchProduct: (params) => dispatch(searchProduct(params)),
        requestMatching: (params) => dispatch(requestMatching(params)),
        unrequestMatching: (params) => dispatch(unrequestMatching(params)),
        getApplied: (params) => dispatch(getApplied(params))
    }
};

ManagementViewProductMatching = connect(mapStateToProps, mapDispatchToProps)(ManagementViewProductMatching)

export default withRouter(ManagementViewProductMatching);