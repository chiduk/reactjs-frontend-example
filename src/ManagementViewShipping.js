import React, {Component} from "react";
import NumberFormat from 'react-number-format';
import { CSVDownload, CSVLink } from "react-csv";
import { CsvToHtmlTable } from 'react-csv-to-table';
import {connect} from "react-redux";
import {getUniqueId, ORDER_STATUS, SHIPPING_STATUS, SHIPPING_COMPANY} from "./util/Constants";
import {cancelOrder, confirmOrder, sellerGetOrderItem, setShipping} from "./actions/manager";
import XLSX from 'xlsx'




const orderData = [

]

class ManagementViewShipping extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numberOfNewOrders: 0,
            orderList: [],
            isAllChecked: false,
            importedCVS: null,
            isOrderListOpen: [],
            shippingData: [],
            isChecked: []
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

        this.props.sellerGetOrderItem()


    }

    componentWillMount() {
        this.setState({
            orderList: orderData
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.orderItems !== this.props.orderItems){
            let newIsOpenArray = [];
            let newIsCheckedArray = [];
            let newShippingDataArray = [];

            let newOrderCount = 0;

            this.props.orderItems.forEach(item => {


                for(let i = 0; i < item.items.length; i++){
                    if(item.items[i].orderStatus === ORDER_STATUS.WAITING_FOR_CONFIMATION){
                        newOrderCount++;
                        break;
                    }
                }

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
                    trackingNumber: item.trackingNumber,
                    shippingStatus: item.shippingStatus
                }

                newShippingDataArray.push(newShippingDataObj)


            })



            this.setState({numberOfNewOrders: newOrderCount, isOrderListOpen: newIsOpenArray, shippingData: newShippingDataArray, isChecked: newIsCheckedArray})
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


        this.state.isChecked.forEach(obj => {

            if(obj.isChecked){

                let params = {
                    orderId: obj.orderId
                }

                this.props.confirmOrder(params)
            }


        })

        this.clearChecks()


    }

    cancelOrder() {

        this.state.isChecked.forEach(obj => {

            let filteredArray = this.props.orderItems.filter(x => x.orderId === obj.orderId)

            if(obj.isChecked){

                if(filteredArray.length > 0){
                    let order = filteredArray[0]

                    console.log(order);

                    let cartIds = [];

                    order.items.forEach(item => {
                        cartIds.push(item.cartId)
                    })

                    let params = {
                        orderId: obj.orderId,
                        uniqueId: getUniqueId(),
                        amount: order.totalAmount,
                        cancelMessage: '테스트 취소',
                        partialCancelCode: '0', //0 전체취소, 1: 부분취소
                        cartIds: cartIds
                    }

                    this.props.cancelOrder(params)

                }

            }


        })

        this.clearChecks()
    }

    checkAllClicked() {

        let isChecked = document.getElementById('shippingTopCheckBox').checked


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

        console.log(orderId)

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

        document.getElementById('shippingTopCheckBox').checked = false

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

        let reader = new FileReader();

        reader.onload = function(e) {
            alert(reader.result)
        }
        reader.readAsText(file.fileList[0])


    }

    cvsFileImported(data) {

        this.setState({importedCVS: <CsvToHtmlTable data={data}/>})
    }

    handleForce(event) {

        let file = event.target.files[0]

        console.log(file)

        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, {header:1});

            console.log(data)


            for(let index = 0; index < data.length ; index++){
                let datum = data[index];

                if(index === 0){
                    if(datum.length === 12){
                        if(datum[5] === '상품주문번호'){

                        }else{
                            alert('잘못된 형식의 엑셀파일입니다.')
                            break;
                        }
                    }else{
                        alert('잘못된 형식의 엑셀파일입니다.')
                        break;
                    }
                }else{

                    if(datum.length === 12){
                        let orderId = datum[4];
                        let shippingCoCode = datum[1];
                        let shippingCoName = datum[2];
                        let trackingNumber = datum[3].toString();




                        let filteredArray = this.state.shippingData.filter(x => x.orderId === orderId);

                        if(filteredArray.length > 0){

                            let dataIndex = this.state.shippingData.indexOf(filteredArray[0])

                            if(dataIndex !== -1){
                                let newArray = []

                                this.state.shippingData.forEach((shippingData, elemIndex) => {
                                    if(dataIndex !== elemIndex){
                                        newArray.push(shippingData)
                                    }else{
                                        let shippingStatus = SHIPPING_STATUS.PREPARING;

                                        console.log(trackingNumber)

                                        if(trackingNumber.length > 0){
                                            shippingStatus = SHIPPING_STATUS.SHIPPED;
                                        }

                                        let newObj = {
                                            orderId: orderId,
                                            shippingCoName: shippingCoName,
                                            shippingCoCode: shippingCoCode,
                                            trackingNumber: trackingNumber.trim(),
                                            shippingStatus: shippingStatus
                                        };

                                        this.props.setShipping(newObj)

                                        newArray.push(newObj)
                                    }
                                });

                                this.setState({shippingData: newArray})
                            }






                        }



                    }else{
                        alert('잘못된 형식의 엑셀파일입니다.')
                        break;
                    }



                }
            }

        };
        if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);

    }

    fileSelected() {
        const element = document.getElementById("csvFileSelectorID")
        element.click()
    }


    renderOrderStatus = (orderId) => {
        let filteredArray = this.props.orderItems.filter(x => x.orderId === orderId)


        if(filteredArray.length > 0) {
            if (filteredArray[0].items.length > 0) {
                let status = filteredArray[0].items[0].orderStatus;



                switch(status){

                    case ORDER_STATUS.WAITING_FOR_CONFIMATION:

                        return '주문 확인대기 중';

                    case ORDER_STATUS.CONFIRMED:

                        return '주문확인';

                    case ORDER_STATUS.REJECTED_BY_SELLER:

                        return '판매자 취소';

                    case ORDER_STATUS.PACKING:

                        return '배송 준비중';

                    case ORDER_STATUS.SHIPPED :

                        return '배송완료';

                    case ORDER_STATUS.DELIVERING :

                        return '배송중';

                    case ORDER_STATUS.RECEIVED :

                        return '배달완료';
                    case ORDER_STATUS.CANCEL.REQUESTED :
                        return '취소 요청됨';

                    case ORDER_STATUS.CANCEL.CONFIRMED :

                        return '취소 수락';
                    case ORDER_STATUS.CANCEL.DENIED :

                        return '취소 거절';

                    case ORDER_STATUS.REFUND.REQUESTED :
                        return '환불 요청';

                    case ORDER_STATUS.REFUND.CONFIRMED :

                        return '환불 요청 수락';
                    case ORDER_STATUS.REFUND.DENIED :

                        return '환뷸 요청 거절';

                    case ORDER_STATUS.EXCHANGE.REQUESTED :
                        return '교환 신청';

                    case ORDER_STATUS.EXCHANGE.CONFIRMED :

                        return '교환 신청 수락';
                    case ORDER_STATUS.EXCHANGE.DENIED :

                        return '교환 신청 거절';
                    default:
                        break;

                }
            }
        }
    }

    renderShippingCost = (orderId) => {
        let filteredArray = this.props.orderItems.filter(x => x.orderId === orderId)
        if(filteredArray.length > 0) {
            if (filteredArray[0].items.length > 0) {
                return  "₩" + filteredArray[0].items[0].product.shippingCost.toLocaleString()
            }
        }

    };

    renderShippingStatus = (orderId) => {
        let filteredArray = this.state.shippingData.filter(x => x.orderId === orderId)

        if(filteredArray.length > 0){
            let status = filteredArray[0].shippingStatus

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
    };

    renderShippingCompanyList = (orderId) => {
        let filteredArray = this.props.orderItems.filter(x => x.orderId === orderId)

        let isDisabled = true;

        if(filteredArray.length > 0){

            let shippingCoCode = filteredArray[0].shippingCoCode


            if(filteredArray[0].items.length > 0){
                if(filteredArray[0].items[0].orderStatus === ORDER_STATUS.CONFIRMED){

                    isDisabled = false;


                }
            }

            let opts = []

            if(this.props.shippingCompanies === undefined || this.props.shippingCompanies){
                SHIPPING_COMPANY.forEach(company => {
                    let isSelected = false;

                    if(shippingCoCode === company.Code){
                        isSelected = true
                    }

                    let option = <option selected={isSelected} id={orderId + company.Code} value={company.Code}>{company.Name}</option>
                    opts.push(option)
                });
            }else{
                this.props.shippingCompanies.forEach(company => {
                    let isSelected = false;

                    if(shippingCoCode === company.Code){
                        isSelected = true
                    }

                    let option = <option selected={isSelected} id={orderId + company.Code} value={company.Code}>{company.Name}</option>
                    opts.push(option)
                });
            }

            return (
                <select disabled={isDisabled} id={orderId+'shippingCompanySelectID'} onChange={() => this.selectShippingCompany(orderId)}>{ opts}</select>
            )
        }
    }

    selectShippingCompany = (orderId) => {



        let select = document.getElementById(orderId + 'shippingCompanySelectID');



        let value = select.options[select.selectedIndex].value;
        let text = select.options[select.selectedIndex].text;

        let trackingNumber = document.getElementById(orderId+'trackingNoInputID').value




        let newArray = []



        this.state.shippingData.forEach(data => {
            newArray.push(data)
        })

        let filteredArray = this.state.shippingData.filter(x => x.orderId === orderId);

        let shippingStatus = SHIPPING_STATUS.PREPARING

        if(trackingNumber.length > 0){
            shippingStatus = SHIPPING_STATUS.SHIPPED
        }


        let obj = {
            orderId: orderId,
            shippingCoName: text,
            shippingCoCode: value,
            trackingNumber: trackingNumber.trim(),
            shippingStatus: shippingStatus
        }

        if(filteredArray.length > 0){
            let index = this.state.shippingData.indexOf(filteredArray[0]);

            if(index !== -1){
               newArray[index].shippingCoCode = value;
               newArray[index].shipipngCoName = text;
               newArray[index].shippingStatus = shippingStatus;
               this.props.setShipping(obj)
            }
        }else{
            newArray.push(obj)
        }


        this.setState({shippingData: newArray})



    };

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
    };

    renderTrackingNumberInput = (orderId) => {
        let filteredArray = this.props.orderItems.filter(x => x.orderId === orderId)

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

            <input disabled={isDisabled} id={orderId+'trackingNoInputID'} value={trackingNumber} placeholder={'송장번호'} onChange={() => this.updateTrackingNumber(orderId)} />

        )

    }

    updateTrackingNumber = (orderId) => {
        let trackingNumber = document.getElementById(orderId+'trackingNoInputID').value


        let select = document.getElementById(orderId + 'shippingCompanySelectID');



        let shippingCode = select.options[select.selectedIndex].value;
        let shippingName = select.options[select.selectedIndex].text;



        let newShippingDataArray = []

        this.state.shippingData.forEach(data => {
            newShippingDataArray.push(data)
        })

        let filteredArray = this.state.shippingData.filter(x => x.orderId === orderId);

        let shippingStatus = SHIPPING_STATUS.PREPARING

        if(trackingNumber.length > 0){
            shippingStatus = SHIPPING_STATUS.SHIPPED
        }

        console.log(shippingStatus)


        if(filteredArray.length > 0){
            let index = this.state.shippingData.indexOf(filteredArray[0]);

            if(index !== -1){
                newShippingDataArray[index].trackingNumber = trackingNumber;
                newShippingDataArray[index].shippingStatus = shippingStatus;
            }
        }else{
            let newShippingData= {
                orderId: orderId,
                shippingCoCode: shippingCode,
                shippingCoName: shippingName,
                trackingNumber: trackingNumber,
                shippingStatus: shippingStatus
            }

            newShippingDataArray.push(newShippingData)
        }

        console.log(newShippingDataArray)

        this.setState({shippingData: newShippingDataArray})



        let params = {
            orderId: orderId,
            shippingCoCode: shippingCode,
            shippingCoName: shippingName,
            trackingNumber: trackingNumber,
            shippingStatus: shippingStatus
        }

        this.props.setShipping(params)

    };

    getOrderData = () => {

        let data = [];

        let columnNames = ['총 결제금액', '택배회사코드', '택배회사명', '송장번호', '주문고유ID', '상품주문번호', '수취인', '전화번호', '택배 배달주소', '우편번호', '메모', '주문물품']
        data.push(columnNames)

        this.props.orderItems.forEach(item => {

            let shippingData = this.state.shippingData.filter(x => x.orderId === item.orderId);

            let orderedItems = '';

            item.items.forEach(product => {
                let item = product.product.UID + ', ' + product.product.title + ' (선택옵션: ' + product.option.title + '), 수량: ' + product.quantity + '\r\n'
                orderedItems += item;

            });



            let datum = [
                item.totalAmount,
                (shippingData.length > 0) ? shippingData[0].shippingCoCode : item.shippingCoCode,
                (shippingData.length > 0) ? shippingData[0].shippingCoName : item.shippingCoName,
                (shippingData.length > 0) ? shippingData[0].trackingNumber : item.trackingNumber,
                item.orderId,
                item.orderUID,
                item.receiverName,
                item.phoneNumber,
                item.address,
                item.zonecode,
                item.requestMessage,
                orderedItems
            ]



            data.push(datum)
        });

        console.log(data)

        let ws = XLSX.utils.aoa_to_sheet(data)
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        XLSX.writeFile(wb, "order.xlsx");

        return data;

    };

    moveScroll = () => {
        const slider = document.querySelector('.shippingManagementTable');
        let isDown = false;
        let startX;
        let scrollLeft;



        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            //console.log('scroll left', startX, scrollLeft)
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            slider.scrollLeft = scrollLeft - walk;
        });

    };

    render() {

        return (
            <div>
                <div className={"newOrderState"}>
                    <div>신규 주문:</div>
                    <div className={"newOrderCount"} onClick={this.getNewOrders}>{this.state.numberOfNewOrders}건</div>
                </div>


                <div className={"shippingDataTableContainer"}>
                    <div className={"shippingButtons"}>
                        <div className={"shippingButton"} onClick={this.orderConfirm}>주문 확인</div>
                        <div className={"shippingButton"} onClick={this.cancelOrder}>판매 취소</div>
                        <div className={"shippingButton"} onClick={this.viewAllClicked}>주문 전체 보기</div>
                    </div>

                    <div className={"shippingOrderView"}>
                        <table className={"shippingManagementTable"} onMouseDown={this.moveScroll} onMouseLeave={this.moveScroll} onMouseUp={this.moveScroll} onMouseMove={this.moveScroll}>

                            <thead>
                            <tr>
                                <th><input id={'shippingTopCheckBox'} type={"checkBox"} onChange={() => this.checkAllClicked()}/><span className="resize-handle"/></th>

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

                                {/*<th>수취인 주소 전체<span className="resize-handle"/></th>*/}
                                {/*<th>수취인 도시<span className="resize-handle"/></th>*/}
                                {/*<th>수취인 구<span className="resize-handle"/></th>*/}

                                <th>수취인 주소<span className="resize-handle"/></th>
                                {/*<th>수취인 주소 상세<span className="resize-handle"/></th>*/}
                                <th>수취인 우편번호<span className="resize-handle"/></th>

                                <th>배송 메시지<span className="resize-handle"/></th>
                            </tr>
                            </thead>
                            {/*<tbody>*/}
                            {this.props.orderItems.map((order, index) => {

                                let currency = "₩"
                                let productCost = order.totalOrderAmount
                                order.totalPaidAmount = order.totalOrderAmount + order.shippingCost;


                                let orderItems = []

                                order.items.forEach(item => {
                                    const text = <div>
                                        <div>{"상품명 : " + item.product.title}</div>
                                        <div>{"옵션 : " + item.option.title}</div>
                                        <div>{"수량 : " + item.quantity + "개"}</div>
                                    </div>;

                                    orderItems.push(text)
                                });


                                return (
                                    <tr>
                                        <td >
                                            {this.renderOrderCheckBox(order.orderId)}
                                        </td>

                                        <td>{order.orderUID}</td>

                                        <td>
                                            <div className={"orderListCell"}>

                                                {
                                                    order.items.map((item) => {

                                                        let element = <div>
                                                            <div>{"상품명 : " + item.product.title}</div>
                                                            <div>{"옵션 : " + item.option.title}</div>
                                                            <div>{"수량 : " + item.quantity + "개"}</div>
                                                        </div>

                                                        return element
                                                    })
                                                }

                                            </div>
                                        </td>

                                        <td><p>{this.renderOrderStatus(order.orderId)}</p></td>

                                        <td><NumberFormat class={"tableNoneInput"} thousandSeparator={true} prefix={currency} value={productCost} readOnly/></td>
                                        <td><NumberFormat class={"tableNoneInput"} thousandSeparator={true} prefix={currency} value={this.renderShippingCost(order.orderId)} readOnly/></td>
                                        <td><NumberFormat class={"tableNoneInput"} thousandSeparator={true} prefix={currency} value={order.totalAmount} readOnly/></td>

                                        <td>
                                            {this.renderShippingCompanyList(order.orderId)}
                                        </td>
                                        <td>{this.renderTrackingNumberInput(order.orderId)}</td>
                                        <td>{this.renderShippingStatus(order.orderId)}</td>

                                        <td>{order.buyer.userUID}</td>
                                        <td>{order.receiverName}</td>
                                        <td>{order.phoneNumber}</td>

                                        <td>{order.address}</td>
                                        <td>{order.zonecode}</td>
                                        <td>{order.requestMessage}</td>
                                    </tr>
                                );
                            })}
                            {/*</tbody>*/}


                        </table>
                    </div>

                </div>

                <div className={"shippingButtons"}>

                    <div className={"shippingButton"} onClick={() => this.getOrderData()}>엑셀 다운로드</div>

                    <div className={"shippingButton"} onClick={this.fileSelected}>엑셀 업로드</div>

                    <input id={"csvFileSelectorID"} type={"file"} accept=".xlsx" onChange={this.handleForce} ref={this.cvsFileSelectorRef} style={{display: "none"}}/>

                </div>
            </div>

        );
    }
}

let mapStateToProps = (state) => {

    return{
        shippingCompanies: state.manager.companies,
        orderItems: state.manager.orderItems
    }
};

let mapDispatchToProps = (dispatch) => {
    return{
        sellerGetOrderItem: () => dispatch(sellerGetOrderItem()),
        confirmOrder: (params) => dispatch(confirmOrder(params)),
        cancelOrder: (params) => dispatch(cancelOrder(params)),
        setShipping: (params) => dispatch(setShipping(params))
    }
}

ManagementViewShipping = connect(mapStateToProps, mapDispatchToProps)(ManagementViewShipping)

export default ManagementViewShipping;