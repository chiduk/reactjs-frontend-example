import React, {Component} from "react";
import {CSVDownload, CSVLink} from "react-csv";
import {CsvToHtmlTable} from "react-csv-to-table";
import NumberFormat from "react-number-format";
import CSVReader from "react-csv-reader";
import {
    cancelOrder, confirmExchange,
    confirmOrder, confirmRefund, getExchangeRequestedItemCount,
    getExchangeRequestItems, getRefundRequestedItemCount,
    getRefundRequestItems,
    sellerGetOrderItem,
    setShipping
} from "./actions/manager";
import {connect} from "react-redux";
import {EXCHANGE_STATUS, getUniqueId, ORDER_STATUS, REFUND_STATUS, SHIPPING_STATUS} from "./util/Constants";
import AlertMessage from "./AlertMessage";

const orderData = [
    {
        isChecked: false,
        isOrderListOpen: false,

        currency: "KRW",

        orderID: "O1234",
        orderList: [
            {
                productID: "P123",
                productName: "channel",
                optionName: "blueBottle",
                orderCount: 2,
                price: "3000"
            },
            {
                productID: "P123asd",
                productName: "Calvin Clein",
                optionName: "red Bottle",
                orderCount: 4,
                price: "7000"
            }
        ],
        orderStatus: "교환 요청",

        totalOrderAmount: 300000,
        shippingCost: 2500,
        totalPaidAmount: "",

        shippingCompany: "현대 택배",
        shippingCode: "SHD123",
        shippingStatus: "배송완료",

        userID: "U123",
        receiverName: "송치만",
        receiverPhoneNumber: "010-6296-9323",

        receiverAddressAll: "서울시 서초구 서초동 현대 아파트 123-1",
        receiverCity: "서울",
        receiverDistrict:"서초구",

        receiverAddress: "서초동 현대 아파트",
        receiverAddressDetail: "123-1",
        receiverPostCode: "135-210",

        shippingMessage: "부제시 전화 주세요. 아님 경비 아저"
    },
    {
        isChecked: false,
        isOrderListOpen: false,

        currency: "KRW",

        orderID: "O1235",
        orderList: [
            {
                productID: "P123",
                productName: "channel",
                optionName: "blueBottle",
                orderCount: 2,
                price: "3000"
            },
            {
                productID: "P123asd",
                productName: "Calvin Clein",
                optionName: "red Bottle",
                orderCount: 4,
                price: "7000"
            }
        ],
        orderStatus: "반품 요청",

        totalOrderAmount: 300000,
        shippingCost: 2500,
        totalPaidAmount: "",

        shippingCompany: "현대 택배",
        shippingCode: "SH12098",
        shippingStatus: "배송완료",

        userID: "U123",
        receiverName: "송치만",
        receiverPhoneNumber: "010-6296-9323",

        receiverAddressAll: "서울시 서초구 서초동 현대 아파트 123-1",
        receiverCity: "서울",
        receiverDistrict:"서초구",

        receiverAddress: "서초동 현대 아파트",
        receiverAddressDetail: "123-1",
        receiverPostCode: "135-210",

        shippingMessage: "부제시 전화 주세요. 아님 경비 아저"
    }
]

class ManagementViewReturnCancelOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numberOfNewOrders: 5000,
            orderList: [],
            isAllChecked: false,
            importedCVS: null,
            isOrderListOpen: [],
            shippingData: [],
            isChecked: [],
            alertMessage: ''
        }

        this.openOrderList = this.openOrderList.bind(this)
        this.orderConfirm = this.orderConfirm.bind(this)
        this.cancelOrder = this.cancelOrder.bind(this)
        this.checkAllClicked = this.checkAllClicked.bind(this)
        this.checkClicked = this.checkClicked.bind(this)
        this.clearChecks = this.clearChecks.bind(this)
        this.downloadCVS = this.downloadCVS.bind(this)
        this.cvsFileImported = this.cvsFileImported.bind(this)
        this.getNewOrders = this.getNewOrders.bind(this)
        this.viewAllClicked = this.viewAllClicked.bind(this)
        this.handleFiles = this.handleFiles.bind(this)

        this.handleForce = this.handleForce.bind(this)

        this.cvsFileSelectorRef = React.createRef()

        this.fileSelected = this.fileSelected.bind(this)

        let params = {
            uniqueId: getUniqueId()
        }

        this.props.getExchangeRequestedItems(params);
        this.props.getRefundRequestItemCount(params);
        this.props.getExchangeRequestItemCount(params);


    }


    componentDidMount() {

        // document.getElementById("csvFileSelectorID").innerText = "파일 선택"
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.items !== this.props.items){
            let newIsOpenArray = []
            let newIsCheckedArray = []
            let newShippingDataArray = []

            this.props.items.forEach(item => {

                let obj = {
                    orderId: item.orderId,
                    isOpen: false
                }

                newIsOpenArray.push(obj)

                let newIsCheckedObj = {
                    orderId: item.orderId,
                    isChecked: false
                }

                newIsCheckedArray.push(newIsCheckedObj)

                let newShippingDataObj = {
                    orderId: item.orderId,
                    shippingCoCode: item.shippingCoCode,
                    shippingCoName: item.shippingCoName,
                    trackingNumber: item.trackingNumber
                }

                newShippingDataArray.push(newShippingDataObj)


            })

            this.setState({isOrderListOpen: newIsOpenArray, shippingData: newShippingDataArray, isChecked: newIsCheckedArray})
        }
    }


    openOrderList(orderId) {
        let filteredArray = this.state.isOrderListOpen.filter(x => x.orderId === orderId)

        if(filteredArray.length > 0){

            let newArray = []

            let index = this.state.isOrderListOpen.indexOf(filteredArray[0])

            if(index !== -1){
                this.state.isOrderListOpen.forEach((item, isOpenIndex) => {
                    if(index === isOpenIndex){
                        let newObj = {
                            orderId: this.state.isOrderListOpen[index].orderId,
                            isOpen : !this.state.isOrderListOpen[index].isOpen
                        }

                        newArray.push(newObj)
                    }else{
                        newArray.push(item)
                    }

                })
            }

            this.setState({isOrderListOpen: newArray})
        }
    }

    orderConfirm() {
        const object = Object.assign([], this.state.orderList)

        for (var i = 0; i < object.length; i++) {
            if (object[i].isChecked === true) {
                object[i].orderStatus = "주문 확인"
            }
        }
        this.setState({orderList: object})
        this.clearChecks()
    }

    cancelOrder() {
        const object = Object.assign([], this.state.orderList)
        for (var i = 0; i < object.length; i++) {
            if (object[i].isChecked === true) {
                object[i].orderStatus = "주문 취소"
            }
        }
        this.setState({orderList: object})
        this.clearChecks()
    }

    checkAllClicked() {

        let isChecked = document.getElementById('topCheckBox').checked
        //console.log(isChecked)

        let newArray = []

        this.state.isChecked.forEach(obj => {
            let newObj = {
                orderId: obj.orderId,
                isChecked: isChecked
            }

            newArray.push(newObj)
        })

        this.setState({isChecked: newArray})

    }

    checkClicked(orderId) {


        let newArray = []

        this.state.isChecked.forEach(obj => {
            newArray.push(obj)
        })

        let filteredArray = newArray.filter(x => x.orderId === orderId)

        if(filteredArray.length > 0){
            let index = newArray.indexOf(filteredArray[0])

            if(index !== -1){
                newArray[index].isChecked = !newArray[index].isChecked
            }
        }

        this.setState({isChecked: newArray})

    }

    clearChecks() {

        let newArray = []

        this.state.isChecked.forEach(obj => {
            let newObj = {
                orderId: obj.orderId,
                isChecked: false
            }

            newArray.push(newObj)
        })

        this.setState({isChecked: newArray})

        document.getElementById('topCheckBox').checked = false

    }

    downloadCVS() {
        return (
            <CSVDownload data={this.state.orderList} target="_blank"/>
        );
    }

    getNewOrders() {

        const object = Object.assign([], this.state.orderList)
        var newOrderList = []
        for (var i = 0; i < object.length; i++) {
            if (object[i].shippingCode === "") {
                newOrderList.push(object[i])
            }
        }
        this.setState({orderList: newOrderList})
    }

    viewAllClicked() {
        this.setState({orderList: orderData})
    }

    handleFiles(file) {
        //console.log(file.fileList[0])
        var reader = new FileReader();
        let data;
        reader.onload = function(e) {
            // data = reader.result
            // return reader.result;
            alert(reader.result)
        }
        reader.readAsText(file.fileList[0])
        // reader.readAsArrayBuffer(file.fileList[0])
        // //console.log(reader.readAsText(file.fileList))
        // this.cvsFileImported(reader)

    }

    cvsFileImported(data) {
        //console.log("cvs data" + data)
        this.setState({importedCVS: <CsvToHtmlTable data={data}/>})
    }

    handleForce(e) {
        //console.log(e)
        const object = Object.assign([], this.state.orderList)

        for (var i = 0; i < e.length; i++) {
            if (i > 0) {
                let orderRow = e[i]
                if (object[i-1].orderID === orderRow[3]) {
                    object[i-1].shippingCode = orderRow[10]
                }
            }
        }

        this.setState({orderList: object})
    }

    fileSelected() {
        const element = document.getElementById("csvFileSelectorID");
        element.click()
    }

    renderOrderList = (orderId, text) => {
        let filteredArray = this.state.isOrderListOpen.filter(x => x.orderId === orderId)

        let isOpen = false

        if(filteredArray.length > 0){
            isOpen = filteredArray[0].isOpen
        }

        return(
            <div id={orderId} className={`orderListItemsView approveButtonListContainer ${isOpen ? "approveContainerOpen" : "approveContainerClose"}`}>{text}</div>
        )

    }

    renderOrderStatus = (orderId) => {
        let filteredArray = this.props.items.filter(x => x.orderId === orderId)


        let status = '';


        if(filteredArray.length > 0){
            if(filteredArray[0].items.length > 0){

                if(filteredArray[0].items[0].exchangeStatus !== undefined){
                    status = filteredArray[0].items[0].exchangeStatus
                }

                if(filteredArray[0].items[0].refundStatus !== undefined){
                    status = filteredArray[0].items[0].refundStatus
                }

                //let status = filteredArray[0].items[0].orderStatus




            }
        }

        switch(status){




            case REFUND_STATUS.REQUESTED :
                return '환불 요청';

            case REFUND_STATUS.CONFIRMED :

                return '환불 요청 수락';
            case REFUND_STATUS.DENIED :

                return '환뷸 요청 거절';

            case EXCHANGE_STATUS.REQUESTED :
                return '교환 신청';

            case EXCHANGE_STATUS.CONFIRMED :

                return '교환 신청 수락';
            case EXCHANGE_STATUS.DENIED :

                return '교환 신청 거절';
            default:
                break;

        }
    }

    renderShippingCost = (orderId) => {
        let filteredArray = this.props.items.filter(x => x.orderId === orderId)



        if(filteredArray.length > 0) {
            if (filteredArray[0].items.length > 0) {
                return  "₩" + filteredArray[0].items[0].product.shippingCost.toLocaleString()
            }
        }

    };

    renderShippingStatus = (orderId) => {
        let filteredArray = this.props.items.filter(x => x.orderId === orderId)



        if(filteredArray.length > 0) {
            if (filteredArray[0].items.length > 0) {
                let status = filteredArray[0].items[0].shippingStatus

                switch(status){

                    case SHIPPING_STATUS.PREPARING:

                        return '배송준비중';

                    case SHIPPING_STATUS.DELIVERING :

                        return '배송중';

                    case SHIPPING_STATUS.SHIPPED :

                        return '배송시작';

                    case SHIPPING_STATUS.RECEIVED :

                        return '배달완료';

                    default:
                        break;
                }
            }
        }
    }

    renderShippingCompanyList = (orderId) => {
        let filteredArray = this.props.items.filter(x => x.orderId === orderId)



        let isDisabled = true;

        if(filteredArray.length > 0){

            let shippingCoCode = filteredArray[0].shippingCoCode


            if(filteredArray[0].items.length > 0){
                if(filteredArray[0].items[0].orderStatus === ORDER_STATUS.CONFIRMED){

                    isDisabled = false;


                }
            }

            let opts = []

            this.props.shippingCompanies.forEach(company => {
                let isSelected = false

                if(shippingCoCode === company.Code){
                    isSelected = true
                }

                let option = <option selected={isSelected} id={orderId + company.Code} value={company.Code}>{company.Name}</option>
                opts.push(option)
            });



            return (

                <select disabled={true} id={orderId+'shippingCompanySelectID'} onChange={() => this.selectShippingCompany(orderId)}>{ opts}</select>

            )

        }


    }



    renderOrderCheckBox = (orderId) => {

        let filteredArray = this.state.isChecked.filter(x => x.orderId === orderId)

        let isChecked = false;

        if(filteredArray.length > 0){
            if(filteredArray[0].isChecked){
                isChecked = true
            }
        }

        return(
            <input id={orderId+'checkBoxID'} type={"checkBox"} checked={isChecked} onChange={() => this.checkClicked(orderId)}/>
        )



    }

    renderTrackingNumberInput = (orderId) => {
        let filteredArray = this.props.items.filter(x => x.orderId === orderId)



        let isDisabled = true;

        if(filteredArray.length > 0){


            if(filteredArray[0].items.length > 0){
                if(filteredArray[0].items[0].orderStatus === ORDER_STATUS.CONFIRMED){

                    isDisabled = false;


                }
            }


        }


        let trackingNumber = ''
        let filteredShippingData = this.state.shippingData.filter(x => x.orderId === orderId)

        if(filteredShippingData.length > 0){



            trackingNumber = filteredShippingData[0].trackingNumber
        }



        return (

            <input disabled={true} id={orderId+'trackingNoInputID'} value={trackingNumber} placeholder={'송장번호'} onChange={() => this.updateTrackingNumber(orderId)} />

        )

    }

    getRefundItems = () => {
        this.props.getRefundRequestedItems({uniqueId: getUniqueId()})
    }


    getExchangeItems = () => {
        this.props.getExchangeRequestedItems({uniqueId: getUniqueId()})
    }

    confirmExchange = () => {




        this.state.isChecked.forEach(order => {
            let orderId = order.orderId



            let filteredOrder = this.props.items.filter(x => x.orderId === orderId)

            if(filteredOrder.length > 0){
                let items = filteredOrder[0].items



                if(items.length > 0){



                    if(items[0].exchangeStatus === EXCHANGE_STATUS.REQUESTED){


                        let cartId = items[0].cartId
                        let params = {
                            cartId: cartId
                        }

                        this.props.confirmExchange(params, () => {
                            let message = "교환 신청이 승인되었습니다."

                            this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
                        })

                    }
                }
            }
        })


    }

    confirmRefund = () => {



        this.state.isChecked.forEach(order => {
            let orderId = order.orderId

            let filteredOrder = this.props.items.filter(x => x.orderId === orderId)

            if(filteredOrder.length > 0){
                let items = filteredOrder[0].items


                if(items.length > 0){
                    if(items[0].refundStatus === REFUND_STATUS.REQUESTED){
                        let cartId = items[0].cartId
                        let params = {
                            cartId: cartId
                        }

                        this.props.confirmRefund(params, () => {
                            let message = "반품 신청이 승인되었습니다."

                            this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
                        })

                    }
                }
            }
        })


    }

    alertMessageViewToggle = () => {


        this.setState({alertMessage: ''})
    }


    render() {


        return (
            <div>
                <div className={"newOrderState"}>

                    <div className={"newOrderState"}>
                        <div>교환 요청:</div>
                        <div className={"newOrderCount"} onClick={() => this.getExchangeItems()}>{this.props.exchangeCount}건</div>
                    </div>

                    <div className={"newOrderState"}>
                        <div>반품 요청:</div>
                        <div className={"newOrderCount"} onClick={() => this.getRefundItems() }>{this.props.refundCount}건</div>
                    </div>


                </div>


                <div className={"shippingDataTableContainer"}>
                    <div className={"shippingButtons"}>
                        <div className={"shippingButton"} onClick={() => this.confirmExchange()}>교환 승인</div>
                        <div className={"shippingButton"} onClick={() => this.confirmRefund()}>반품 승인</div>
                        {/*<div className={"shippingButton"} onClick={this.viewAllClicked}>요청건 전체 보기</div>*/}
                    </div>
                    <table className={"shippingManagementTable"}>
                        <thead>
                        <tr>
                            <th><input id={'topCheckBox'} type={"checkBox"} onChange={this.checkAllClicked}/><span className="resize-handle"/></th>

                            <th>상품 주문 번호<span className="resize-handle"/></th>
                            <th>주문 목록<span className="resize-handle"/></th>
                            <th>주문 처리 현황<span className="resize-handle"/></th>

                            <th>총 주문 제품 금액<span className="resize-handle"/></th>
                            <th>택배비<span className="resize-handle"/></th>
                            <th>총 결제 금액<span className="resize-handle"/></th>

                            <th>택배사<span className="resize-handle"/></th>
                            <th>송장 번호<span className="resize-handle"/></th>
                            <th>배송 현황<span className="resize-handle"/></th>

                            <th>주문 유저 ID<span className="resize-handle"/></th>
                            <th>수취인 성명<span className="resize-handle"/></th>
                            <th>수취인 전화번호<span className="resize-handle"/></th>

                            <th>수취인 주소<span className="resize-handle"/></th>
                            <th>수취인 우편번호<span className="resize-handle"/></th>

                            <th>베송 메시지<span className="resize-handle"/></th>
                        </tr>
                        </thead>

                        {this.props.items.map((order, index) => {

                            let currency = "₩"


                            const totalCost = order.totalOrderAmount + order.shippingCost
                            order.totalPaidAmount = totalCost


                            let orderItems = []

                            order.items.forEach(item => {
                                const text = <div>{"상품명:" + item.product.title + ", 옵션:" + item.option.title + ", " + item.quantity + "개"}</div>

                                orderItems.push(text)
                            })


                            return (
                                <tr>
                                    <td >
                                        {this.renderOrderCheckBox(order.orderId)}
                                    </td>

                                    <td>{order.orderUID}</td>

                                    <td>
                                        <div className={"orderListCell"}>
                                            <div className={"orderListCount"} onClick={() => this.openOrderList(order.orderId)}>{order.items.length}건, 자세히 보기</div>
                                            <div>
                                                {/*<div id={order.ordreId} className={`orderListItemsView approveButtonListContainer ${order.isOrderListOpen ? "approveContainerOpen" : "approveContainerClose"}`}>{orderItems}</div>*/}

                                                {this.renderOrderList(order.orderId, orderItems)}

                                            </div>
                                        </div>
                                    </td>

                                    <td>{this.renderOrderStatus(order.orderId)}</td>

                                    <td><NumberFormat class={"tableNoneInput"} thousandSeparator={true} prefix={currency} value={order.totalOrderAmount} readonly/></td>
                                    <td><NumberFormat class={"tableNoneInput"} thousandSeparator={true} prefix={currency} value={this.renderShippingCost(order.orderId)} readonly/></td>
                                    <td><NumberFormat class={"tableNoneInput"} thousandSeparator={true} prefix={currency} value={order.totalAmount} readonly/></td>

                                    <td>
                                        {this.renderShippingCompanyList(order.orderId)}
                                        {/*<select disabled={true} id={order.orderId+'shippingCompanySelectID'} onChange={(orderId) => this.selectShippingCompany(order.orderId)}>{ this.renderShippingCompanyList(order.orderId)}</select>*/}
                                    </td>
                                    <td>{this.renderTrackingNumberInput(order.orderId)}</td>
                                    <td>{this.renderShippingStatus(order.orderId)}</td>

                                    <td>{order.buyer.userUID}</td>
                                    <td>{order.receiverName}</td>
                                    <td>{order.phoneNumber}</td>

                                    <td>{order.address}</td>
                                    {/*<td>{order.receiverAddressDetail}</td>*/}
                                    <td>{order.zonecode}</td>

                                    <td>{order.requestMessage}</td>
                                </tr>
                            );
                        })}


                    </table>
                </div>

                {this.state.alertMessage}
            </div>

        );
    }
}

let mapStateToProps = (state) => {

    return{
        shippingCompanies: state.manager.companies,
        items: state.manager.items,
        refundCount: state.manager.refundCount,
        exchangeCount: state.manager.exchangeCount
    }
};

let mapDispatchToProps = (dispatch) => {
    return{
        sellerGetOrderItem: () => dispatch(sellerGetOrderItem()),
        confirmExchange: (params, callback) => dispatch(confirmExchange(params, callback)),
        confirmRefund: (params, callback) => dispatch(confirmRefund(params, callback)),
        getExchangeRequestedItems: (params) => dispatch(getExchangeRequestItems(params)),
        getRefundRequestedItems: (params) => dispatch(getRefundRequestItems(params)),
        getExchangeRequestItemCount: (params) => dispatch(getExchangeRequestedItemCount(params)),
        getRefundRequestItemCount: (params) => dispatch(getRefundRequestedItemCount(params))
    }
}

ManagementViewReturnCancelOrder = connect(mapStateToProps, mapDispatchToProps)(ManagementViewReturnCancelOrder)

export default ManagementViewReturnCancelOrder;