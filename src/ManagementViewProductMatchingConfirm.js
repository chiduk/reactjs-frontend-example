import React, {Component} from "react";
import {connect} from "react-redux";
import {getMatchingRequested, confirmMatching, unconfirmMatching, setCommission} from "./actions/manager";
import {getUniqueId, RestApi} from "./util/Constants";
import AlertMessage from "./AlertMessage";
import ProfileImage from "./ProfileImage";
import YesOrNoAlert from "./YesOrNoAlert";


class ManagementViewProductMatchingConfirm extends Component {
    constructor(props) {
        super(props);

        this.state = {

            isConfirmedOpenArray: [],
            alertMessage: null,
            commissionRate: []
        }

        this.confirmClicked = this.confirmClicked.bind(this)
        this.matchCancel = this.matchCancel.bind(this)

        this.upDateMatchingPeriod = this.upDateMatchingPeriod.bind(this)
        let params = {
            uniqueId: getUniqueId()
        }

        this.props.getMatchingRequest(params)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.requests !== this.props.requests){

            let commissionRates = []
            this.props.requests.forEach(request => {
                let obj = {
                    matchRequestId: request.matchRequestId,
                    commissionRate: request.commissionRate
                }

                commissionRates.push(obj)
            })

            this.setState({commissionRate: commissionRates})
        }
    }

    alertMessageViewToggle = () => {


        this.setState({alertMessage: ''})
    }

    confirmClicked(requestId) {



        let filteredArray = this.props.requests.filter(x => x.matchRequestId === requestId)

        if(filteredArray.length){
            if(filteredArray[0].isConfirmed){

                if(this.state.alertMessage === null){
                    let self = this;

                    this.setState({alertMessage: <YesOrNoAlert
                            alertTitle={"매칭취소"}
                            messages={["매칭을 취소 하시겠습니까?"]}
                            yes={() => {
                                self.matchCancel(requestId)

                                self.setState({alertMessage: null})
                            }}
                            no={() => {
                                self.setState({alertMessage: null})
                            }}
                        />})
                }

            }else{

                let selCommissionRate = this.state.commissionRate.filter(x => x.matchRequestId === requestId);

                let commissionRate = 0;
                if(selCommissionRate.length > 0){
                    commissionRate = selCommissionRate[0].commissionRate
                }


                let params = {
                    uniqueId: getUniqueId(),
                    requestId: requestId,
                    commissionRate: commissionRate

                }

                this.props.confirmMatching(params, () => {
                    let message = "매칭이 완료되었습니다.";

                    this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
                })
            }
        }

        let newArray = [];

        this.state.isConfirmedOpenArray.forEach(isOpenElem => {
            isOpenElem.isOpen = false;
            newArray.push(isOpenElem)
        });

        this.setState({isConfirmedOpenArray: newArray})

    }

    upDateMatchingPeriod(index, e) {
        let object = Object.assign([], this.state.matchingList)

        //console.log("index" + index)
        //console.log(e.target.value)
        // console.log(object[index].matchingPeriod)
        object[index].matchingPeriod = e.target.value

        this.setState({
            matchingList: object
        })
    }


    upDateCommisionRate =(index, e) => {

        let object = Object.assign([], this.state.matchingList)

        // console.log(object[index].matchingPeriod)
        object[index].commisionRate = e.target.value

        this.setState({
            matchingList: object
        })

    }



    matchCancel(requestId) {
        let params = {
            uniqueId: getUniqueId(),
            requestId: requestId
        }

        this.props.unconfirmMatching(params,  () => {
            let message = "매칭이 취소되었습니다.";

            this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
        })
    }

    renderMatchConfirmButton = (data) => {
        let isOpen = false;

        let isOpenArray = this.state.isConfirmedOpenArray.filter(x => x.matchRequestId === data.matchRequestId)

        if(isOpenArray.length > 0){


            let index = this.state.isConfirmedOpenArray.indexOf(isOpenArray[0])

            if(index !== -1){

                isOpen = isOpenArray[0].isOpen


            }


        }else{
            let obj = {
                matchRequestId: data.matchRequestId,
                isOpen: false
            }

            this.state.isConfirmedOpenArray.push(obj);


            isOpen = false;
        }



        let filteredArray = this.props.requests.filter(x => x.matchRequestId === data.matchRequestId)

        if(filteredArray.length > 0){

            let request = filteredArray[0]


            let matching;
            let matchButtonStyle;


            if(request.isConfirmed){

                matching = "매칭 컨펌됨";
                matchButtonStyle = {
                    backgroundColor: "#FF0000",
                    color: "white"
                }

                return(

                    <div className={"matchingProductInfo"}>
                        <div className={"matchingButton"}
                             style={matchButtonStyle}
                             onClick={() => this.confirmClicked(request.matchRequestId)}>
                            {matching}
                        </div>
                        {/*<div className={`matchOption ${isOpen ? "approveContainerOpen" : "approveContainerClose"}`}>*/}
                        {/*    <div className={`matchiOptionButton`} onClick={() => this.matchCancel(request.matchRequestId)}><a>컨펌 취소</a></div>*/}
                        {/*</div>*/}


                    </div>

                )
            }else{
                matching = "컨펌";
                matchButtonStyle = {
                    backgroundColor: "white",
                    color: "#FF0000",


                }

                return(
                    <div className={"matchingProductInfo"}>
                        <div className={"matchingButton"}
                             style={matchButtonStyle}
                             onClick={() => this.confirmClicked(request.matchRequestId)}>
                            {matching}
                        </div>
                    </div>

                )

            }

        }
    };


    profileClick = (uniqueId) => {
        //localStorage.setItem('forwardUniqueId', uniqueId);
        window.open('/UserProfile?uid=' + uniqueId)
    };


    onCommissionRateChange = (event, matchRequestId) => {
        let commissionRate = parseFloat(event.target.value);


        if(commissionRate < 0){
            commissionRate = 0
        }else if(commissionRate > 100){
            commissionRate = 100
        }


        let newArray = [];

        let filteredArray = this.state.commissionRate.filter(x => x.matchRequestId === matchRequestId);

        if(filteredArray.length > 0){
            let index = this.state.commissionRate.indexOf(filteredArray[0])

            if(index !== -1){
                let obj = {
                    matchRequestId: this.state.commissionRate[index].matchRequestId,
                    commissionRate: commissionRate
                }

                newArray.push(obj)

                this.state.commissionRate.forEach((elem, elemIndex) => {
                    if(index !== elemIndex){
                        newArray.push(elem)
                    }
                })
            }
        }else{


            let obj = {
                matchRequestId: matchRequestId,
                commissionRate: commissionRate
            };

            newArray.push(obj);

            this.state.commissionRate.forEach(elem => {
                newArray.push(elem)
            });


        }

        this.setState({commissionRate: newArray})


        let params = {
            matchRequestId : matchRequestId,
            commissionRate: commissionRate
        }

        this.props.setCommission(params)
    }

    getCommissionRateValue = (matchRequestId) => {
        let filteredArray = this.state.commissionRate.filter(x => x.matchRequestId === matchRequestId);

        if(filteredArray.length > 0){
            return filteredArray[0].commissionRate
        }else{
            return 0
        }
    };

    viewProductDetail = (productId) => {
        localStorage.setItem('forwardProductId', productId);
        window.open('/product')
    }

    render() {
        let inputStyle = {
            width: '60px'
        };

        return(
            <div className={"productMatchingProductListWrapper"}>
                {
                   this.props.requests.map((request, index) => {
                       let currency;
                       if (request.matchProduct.currency === "KRW") {
                           currency = "₩"
                       }

                       let sellingPrice = (request.matchProduct.price) - (request.matchProduct.price * (request.matchProduct.discountRate/100))


                       return (
                           <div className={"matchingProductWrapper"}>
                               <div className={"matchingProductImg"}> <ProfileImage uniqueId={request.requester.uniqueId}  onClick={() => this.profileClick(request.requester.uniqueId)}/></div>
                               <div className={"matchingProductInfo"}>
                                   <div onClick={() => this.profileClick(request.requester.uniqueId)} >{request.requester.userId}</div>
                                   <div>Follower: {request.requester.followers.toLocaleString()}명</div>
                                   <div className={"socialLink"} >
                                       <a href={request.requester.instagram} target="_blank">
                                           Instagram
                                       </a>
                                   </div>

                               </div>


                               <div className={"matchingProductImg"} style={{marginLeft: "24px"}}><img src={(request.matchProduct.images.length > 0) ? RestApi.prod + request.matchProduct.images[0] : 'placholder'}/></div>
                               <div className={"matchingProductInfo"}>
                                   <div>{request.matchProduct.title}</div>
                                   {/*<div>가격: {currency}{request.matchProduct.price.toLocaleString()}</div>*/}
                                   <div>판매가: {currency}{sellingPrice.toLocaleString()}</div>
                                   {/*<div>기간: {request.matchProduct.matchingPeriod}개월</div>*/}
                                   <div className={'commissionRate'}>수수료율: <input style={inputStyle} type={'number'} onChange={(e, matchRequestId) => this.onCommissionRateChange(e, request.matchRequestId)} value={this.getCommissionRateValue(request.matchRequestId)}/> %</div>
                               </div>
                               {this.renderMatchConfirmButton(request)}

                           </div>
                       );
                   })
                }
                {this.state.alertMessage}
            </div>

        );
    }
}

let mapStateToProps = (state) => {


    return {
        requests: state.manager.requests
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        getMatchingRequest: (params) => dispatch(getMatchingRequested(params)),
        confirmMatching: (params, callback) => dispatch(confirmMatching(params,callback)),
        unconfirmMatching: (params, callback) => dispatch(unconfirmMatching(params, callback)),
        setCommission: (params) => dispatch(setCommission(params))
    }
};

ManagementViewProductMatchingConfirm = connect(mapStateToProps, mapDispatchToProps)(ManagementViewProductMatchingConfirm)


export default ManagementViewProductMatchingConfirm;