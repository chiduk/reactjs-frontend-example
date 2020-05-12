import React , {Component} from "react";
import {HorizontalGridLines, LineSeries, VerticalBarSeries, XAxis, XYPlot, YAxis, DecorativeAxis, FlexibleXYPlot} from "react-vis/es";
import 'react-vis/dist/style.css';
import "./js/components/ProfilePage.css";
import {
    getAdminFullReport,
    getAdminJPReport,
    getAdminPromoReport,
    getRevenueAll,
    getRevenueInfluencer, getRevenueProduct,
    getInfluencerPaymentDue, getSellerPaymentDue
} from "./actions/manager";
import {connect} from "react-redux";
import {REVENUE_TYPE, PAYMENT_DUE_VIEW_TYPE, utcToLocal, getTodayDate, getDaysBefore, getDateInNumber, kubricCommissionRate, pgFeeRate, govLaborFee, getUniqueId, getUserId, utcToLocalDateOnly, getDaysBeforeFromAday} from "./util/Constants";
import AlertMessage from "./AlertMessage";
import Calendar from "./Calendar";
import {CSVLink} from "react-csv";
import CSVReader from "react-csv-reader";
import ReactResizeDetector from "react-resize-detector";



class ManagementViewPaymentReceivableReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            brickPosition: {
                left: "0px"
            },
            brickWidth: "0px",
            reportData: [],
            revenue: [],
            alertMessage: '',
            reportType: "",
            isReportTypeOpen: false,
            viewType: "리포트 뷰 단위",
            isViewTypeButtonOn: false,

            saleViewType: "전체",

            beginPeriod: "",
            beginPeriodNumber: 0,

            endPeriod: "",
            endPeriodNumber: 0,

            graphDateArray: [],
            dateDifference: "",
            isCalendarOpen: false,
            calendarView: null,
            dueReceivable: "",
            dueReceived: "",
            mouseOverDate: "",
            mouseOverAmount: "",
            mouseOverOrderCount: 0,
            mouseOverX: "",
            mouseOverY: "",
            isPopUpWindowOpen: false,
            graphWidth: "",
            graphHeight: "",
            userType: "",

        }

        this.tapClicked = this.tapClicked.bind(this)
        this.socialRef = React.createRef()

        this.props.getAdminFullReport()
        this.props.getRevenueInfluencer();

        this.paymentViewType = PAYMENT_DUE_VIEW_TYPE.INFLUENCER
        this.props.getInfluencerPaymentDue();

        this.props.getAdminFullReport()

    }

    componentWillMount() {

        let begin = getDaysBefore(20)
        let end = getTodayDate()

        /* for dummy data */
        let userType = {
            isInfluencer: true,
            isSeller: true,
            isKubric: true
        };

        let type;
        if (userType.isInfluencer === true && userType.isSeller === true) {
            type = "인플루언서"
        } else if ( userType.isInfluencer === false && userType.isSeller === true ) {
            type = "판매자"
        } else if (userType.isInfluencer){
            type = "인플루언서"
        } else if (userType.isKubric) {
            type = "큐브릭"
        }
        /* for dummy data */

        this.setState({
            userType: type,

            beginPeriod: begin.text,
            beginPeriodNumber: begin.number,
            endPeriod: end.text,
            endPeriodNumber: end.number,
            /* for dummy data */
            reportData: [],
            reportType: type
            /* for dummy data */
        }, ()=>{
            this.setUpGraphArray()
        })
    }

    componentDidMount() {
        this.socialRef.current.click()

        // let graphElement = document.getElementById("graphContainerID");
        // let graphWidth = graphElement.getBoundingClientRect().width;
        // let graphHeight = graphElement.getBoundingClientRect().height;
        // this.setState({
        //     graphWidth: graphWidth,
        //     graphHeight: graphHeight,
        //
        // })

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.report !== this.props.report){

            this.setState({reportData: this.props.report.revenue})
        }

    }

    tapClicked(id, type) {
        const taps = document.getElementsByClassName("socialTapButton")
        for (var i = 0; i < taps.length; i++) {
            const element = taps[i]
            const elementID = element.getAttribute('id')

            if (elementID === id) {
                element.style.color = "#FF0000";
                element.style.fontWeight = "bold";
            } else {
                element.style.color = "#282c34";
                element.style.fontWeight = "normal";
            }
        }

        const line = document.getElementById('profileSocialLineID')
        const lineOffset = line.offsetLeft

        const buttonElement = document.getElementById(id)
        const buttonWidth = buttonElement.offsetWidth

        const elementLeftCoordinate = buttonElement.offsetLeft


        const coordinate = {
            left: elementLeftCoordinate - lineOffset,
            width: buttonWidth
        }

        this.setState({brickPosition: coordinate})

        if(type === REVENUE_TYPE.ALL){
            this.props.getAdminFullReport()
        }else if(type === REVENUE_TYPE.JP){
            this.props.getAdminJPReport()
        }else if(type === REVENUE_TYPE.PROMO){
            this.props.getAdminPromoReport()
        }
    }

    getInfluecerPaymentDue = () => {

        this.props.getInfluencerPaymentDue()

        this.setState({
            reportType: "인플루언서"
        })

        this.toggleReportTypeButton()
    }

    getSPaymentDue = () => {

        this.props.getSellerPaymentDue()

        this.setState({
            reportType: "판매사"
        })

        this.toggleReportTypeButton()

    }


    getKubricPayableDue = () => {

        this.setState({
            reportType: "큐브릭"
        })

        this.toggleReportTypeButton()

    }

    handleScreenResize = () => {
        this.setState({
            graphWidth: window.document.getElementById("receivableGraphWrapperID").offsetWidth
        })
    }


    renderTable = () => {
        let platformFee = kubricCommissionRate
        let pgFee = pgFeeRate

        let receivable = 0
        let received = 0

        let graphData = []

        for (var d = 0; d < this.state.dateDifference; d++) {

            let date = getDaysBeforeFromAday(this.state.endPeriod, d)

            let data = {
                x: date.text,
                y: 0,
                count: 0
            }

            graphData.splice(0, 0, data)
        }




        // if(this.props.paymentDueViewType === PAYMENT_DUE_VIEW_TYPE.INFLUENCER){
        if(this.state.reportType === "인플루언서") {

            let cvsHeader = [
                {label: "날짜" ,key: "date"},
                {label: "주문 ID" ,key: "orderID"},
                {label: "인플루언서 ID" ,key: "influencerID"},

                {label: "판매 타입" ,key: "saleType"},
                {label: "제품ID" ,key: "productID"},
                {label: "제품명" ,key: "productName"},

                {label: "제품 가격" ,key: "productPrice"},
                {label: "할인율" ,key: "discountRate"},
                {label: "할인 가격" ,key: "discountedAmount"},

                {label: "판매가" ,key: "salePrice"},
                {label: "주문 수량" ,key: "orderAmount"},
                {label: "총 판매금액" ,key: "totalAmount"},

                {label: "부가세" ,key: "VAT"},
                {label: "플렛폼 fee" ,key: "platformFee"},
                {label: "PG사 fee" ,key: "pgFee"},

                {label: "커미션율" ,key: "commissionRate"},
                {label: "정산금액" ,key: "commissionAmount"},
                {label: "정산 현황" ,key: "paymentStatus"},
            ]

            let cvsData = []

            let table =  <div>
                <div>

                </div>
                <table className={"payableInfluencer payableTable"}
                       onMouseDown={this.moveScroll}
                       onMouseLeave={this.moveScroll}
                       onMouseUp={this.moveScroll}
                       onMouseMove={this.moveScroll}>
                    <thead>

                    <tr>
                        <th>날짜<span className="resize-handle"/></th>
                        <th>주문 ID<span className="resize-handle"/></th>
                        <th>인플루언서 ID<span className="resize-handle"/></th>

                        <th>판매 타입<span className="resize-handle"/></th>
                        <th>제품ID<span className="resize-handle"/></th>
                        <th>제품명<span className="resize-handle"/></th>

                        <th>제품 가격<span className="resize-handle"/></th>
                        <th>할인율<span className="resize-handle"/></th>
                        <th>할인 가격<span className="resize-handle"/></th>

                        <th>판매가<span className="resize-handle"/></th>
                        <th>주문 수량<span className="resize-handle"/></th>
                        <th>총 판매금액<span className="resize-handle"/></th>

                        <th>부가세<span className="resize-handle"/></th>
                        <th>플렛폼 fee<span className="resize-handle"/></th>
                        <th>PG사 fee<span className="resize-handle"/></th>

                        <th>커미션율<span className="resize-handle"/></th>
                        <th>정산금액<span className="resize-handle"/></th>
                        <th>정산 현황<span className="resize-handle"/></th>
                    </tr>
                    </thead>


                    {
                        this.state.reportData.map((i, index) => {

                            let dateInNumber = Number(getDateInNumber(i.date))

                            let beginDateInNumber = Number(this.state.beginPeriodNumber)
                            let endDateInNumber = Number(this.state.endPeriodNumber)


                            if (getUserId() === i.influencer.userId || this.state.userType === "큐브릭") {

                                if (dateInNumber >= beginDateInNumber && dateInNumber <= endDateInNumber) {

                                    let currency;
                                    if (i.product.currency === "KRW") {
                                        currency = "₩"
                                    }

                                    let optionPrice = (i.product.option.additionalCost === null || i.product.option.additionalCost === undefined) ? 0 : i.product.option.additionalCost;

                                    let productPrice = i.product.sellingPrice + optionPrice;
                                    let discountedAmount = productPrice * (i.product.discountRate / 100)

                                    let sellingPrice = productPrice - discountedAmount

                                    let totalAmount = sellingPrice * (i.totalSoldQuantity)

                                    let vat = Math.round(totalAmount - (totalAmount / (1.1)))

                                    let platformFeeCalc = totalAmount * (platformFee / 100)

                                    let pgFeeCalc = Math.round((totalAmount + i.product.totalShippingCost) * (pgFee / 100))

                                    let commissionCalc = Math.round(totalAmount * (i.product.commissionRate / 100))

                                    let commissionFinalAmount = 0
                                    if (i.influencer.isBusiness === true) {
                                        commissionFinalAmount = commissionCalc
                                    } else {
                                        let commissionWithoutVAT = (commissionCalc / 1.1)
                                        commissionFinalAmount = Math.round(commissionWithoutVAT - (commissionWithoutVAT * (govLaborFee / 100)))
                                    }

                                    let paymentStatus;
                                    if (i.isCommisionPaidToInfluencer === false) {
                                        paymentStatus = "정산 예정"
                                    } else {
                                        paymentStatus = "정산 완료"
                                    }

                                    let saleType;
                                    if (i.saleType === "shareSale") {
                                        saleType = "공구"
                                    } else {
                                        saleType = "프로모션"
                                    }

                                    if (i.isCommisionPaidToInfluencer === false ) {
                                        receivable += commissionFinalAmount
                                    } else {
                                        received += commissionFinalAmount
                                    }


                                    graphData.forEach((g, index) => {
                                        if (g.x === utcToLocalDateOnly(i.date)) {
                                            graphData[index].y += commissionFinalAmount
                                            graphData[index].count += 1
                                        }
                                    })

                                    let cvsRowData = {
                                        date: i.date,
                                        orderID: i.orderID,
                                        influencerID: i.influencer.userId,

                                        saleType: saleType,
                                        productID: i.product.productId,
                                        productName: i.product.title,

                                        productPrice: productPrice,
                                        discountRate: i.product.discountRate,
                                        discountedAmount: discountedAmount,

                                        salePrice: sellingPrice,
                                        orderAmount: i.totalSoldQuantity,
                                        totalAmount: totalAmount,

                                        VAT: vat,
                                        platformFee: platformFeeCalc,
                                        pgFee: pgFeeCalc,

                                        commissionRate: i.product.commissionRate,
                                        commissionAmount: commissionFinalAmount,
                                        paymentStatus: paymentStatus,
                                    }

                                    cvsData.push(cvsRowData)

                                    return (
                                        <tr>
                                            <td>{utcToLocal(i.date)}</td>
                                            <td>{i.orderID}</td>
                                            <td>{i.influencer.userId}</td>

                                            <td>{saleType}</td>
                                            <td>{i.product.productId}</td>
                                            <td>{i.product.title}</td>

                                            <td>{currency}{productPrice.toLocaleString()}</td>
                                            <td>{i.product.discountRate}%</td>
                                            <td>{currency}{discountedAmount.toLocaleString()}</td>

                                            <td>{currency}{sellingPrice.toLocaleString()}</td>
                                            <td>{i.totalSoldQuantity}</td>
                                            <td>{currency}{totalAmount.toLocaleString()}</td>

                                            <td>{currency}{vat.toLocaleString()}</td>
                                            <td>{currency}{platformFeeCalc.toLocaleString()}</td>
                                            <td>{currency}{pgFeeCalc.toLocaleString()}</td>

                                            <td>{i.product.commissionRate}%</td>
                                            <td>{currency}{commissionFinalAmount.toLocaleString()}</td>
                                            <td>{paymentStatus}</td>
                                        </tr>
                                    );
                                }
                            }
                        })
                    }
                </table>
            </div>


            let returnVal = {
                table: table,
                receivable: receivable,
                received: received,
                graphData: graphData,
                cvsHeader: cvsHeader,
                cvsData: cvsData
            }

            return ( returnVal )


        } else if (this.state.reportType === '판매사') {

            let receivable = 0
            let received = 0

            let cvsHeader = [
                {label: "날짜" ,key: "date"},
                {label: "인플루언서 유저명" ,key: "influencerUserID"},
                {label: "인플루언서 성명" ,key: "influencerName"},

                {label: "판매 타입" ,key: "saleType"},
                {label: "제품ID" ,key: "productID"},
                {label: "제품명" ,key: "productName"},

                {label: "제품 가격" ,key: "productPrice"},
                {label: "할인율" ,key: "discountRate"},
                {label: "할인 가격" ,key: "discountedAmount"},

                {label: "판매가" ,key: "salePrice"},
                {label: "주문 수량" ,key: "orderAmount"},
                {label: "총 판매금액" ,key: "totalAmount"},

                {label: "부가세" ,key: "VAT"},
                {label: "플렛폼 fee" ,key: "platformFee"},
                {label: "PG사 fee" ,key: "pgFee"},

                {label: "인플루언서 커미션율" ,key: "commissionRate"},
                {label: "인플루언서 사업자 형태" ,key: "influencerBusinessType"},
                {label: "인플루언서 사업자 번호" ,key: "influencerBusinessRegistrationID"},

                {label: "인플루언서 커미션 fee" ,key: "commissionFee"},
                {label: "판매자 정산금액" ,key: "sellerReceivable"},
                {label: "정산 현황" ,key: "paymentStatus"},
            ]

            let cvsData = []


            let table =  <div>
                <table className={"payableSellerTable payableTable"}
                       onMouseDown={this.moveScroll}
                       onMouseLeave={this.moveScroll}
                       onMouseUp={this.moveScroll}
                       onMouseMove={this.moveScroll}>
                    <thead>

                    <tr>
                        <th>날짜<span className="resize-handle"/></th>
                        <th>판매사 ID<span className="resize-handle"/></th>
                        <th>판매사 유저명<span className="resize-handle"/></th>

                        <th>판매 타입<span className="resize-handle"/></th>
                        <th>제품ID<span className="resize-handle"/></th>
                        <th>제품명<span className="resize-handle"/></th>

                        <th>제품 가격<span className="resize-handle"/></th>
                        <th>할인율<span className="resize-handle"/></th>
                        <th>할인 가격<span className="resize-handle"/></th>

                        <th>판매가<span className="resize-handle"/></th>
                        <th>주문 수량<span className="resize-handle"/></th>
                        <th>총 판매금액<span className="resize-handle"/></th>

                        <th>부가세<span className="resize-handle"/></th>
                        <th>플렛폼 fee<span className="resize-handle"/></th>
                        <th>PG사 fee<span className="resize-handle"/></th>

                        <th>인플루언서 커미션율<span className="resize-handle"/></th>
                        <th>인플루언서 사업자 형태<span className="resize-handle"/></th>
                        <th>인플루언서 사업자 번호<span className="resize-handle"/></th>

                        <th>인플루언서 커미션 fee<span className="resize-handle"/></th>
                        <th>판매자 정산금액<span className="resize-handle"/></th>
                        <th>정산 현황<span className="resize-handle"/></th>
                    </tr>
                    </thead>


                    {
                        this.state.reportData.map((i, index) => {

                            let dateInNumber = Number(getDateInNumber(i.date))

                            let beginDateInNumber = Number(this.state.beginPeriodNumber)
                            let endDateInNumber = Number(this.state.endPeriodNumber)

                            if (getUserId() === i.seller.userId || this.state.userType === "큐브릭") {

                                if (dateInNumber >= beginDateInNumber && dateInNumber <= endDateInNumber) {

                                    let currency;
                                    if (i.product.currency === "KRW") {
                                        currency = "₩"
                                    }

                                    let optionPrice = (i.product.option.additionalCost === null || i.product.option.additionalCost === undefined) ? 0 : i.product.option.additionalCost;

                                    let productPrice = i.product.sellingPrice + optionPrice
                                    let discountedAmount = productPrice * (i.product.discountRate / 100)

                                    let sellingPrice = productPrice - discountedAmount

                                    let totalAmount = sellingPrice * (i.totalSoldQuantity)

                                    let vat = Math.round(totalAmount - (totalAmount / (1.1)))

                                    let platformFeeCalc = totalAmount * (platformFee / 100)

                                    let shippingCost = i.product.totalShippingCost

                                    let pgFeeCalc = Math.round((totalAmount + shippingCost) * (pgFee / 100))

                                    let commissionCalc = Math.round(totalAmount * (i.product.commissionRate / 100))


                                    let influencerEntity;
                                    if(i.influencer.isBusiness === true) {
                                        influencerEntity = "사업자"
                                    } else {
                                        influencerEntity = "비사업자"
                                    }

                                    let commissionFinalAmount;
                                    if (i.influencer.isBusiness === true) {
                                        commissionFinalAmount = commissionCalc
                                    } else {
                                        let commissionWithoutVAT = (commissionCalc / 1.1)
                                        commissionFinalAmount = Math.round(commissionWithoutVAT - (commissionWithoutVAT * (govLaborFee / 100)))
                                    }

                                    let sellerFinalAmountReceivable = (totalAmount + shippingCost) - pgFeeCalc - platformFeeCalc - commissionFinalAmount

                                    let paymentStatus;
                                    if (i.isSalesFeePaidToSeller === false) {
                                        paymentStatus = "정산 예정"
                                    } else {
                                        paymentStatus = "정산 완료"
                                    }

                                    let saleType;
                                    if (i.saleType === "shareSale") {
                                        saleType = "공구"
                                    } else {
                                        saleType = "프로모션"
                                    }

                                    if (i.isSalesFeePaidToSeller === false ) {
                                        receivable += sellerFinalAmountReceivable
                                    } else {
                                        received += sellerFinalAmountReceivable
                                    }

                                    graphData.forEach((g, index) => {
                                        if (g.x === utcToLocalDateOnly(i.date)) {
                                            graphData[index].y += sellerFinalAmountReceivable
                                            graphData[index].count += 1
                                        }
                                    })

                                    let cvsRowData = {
                                        date: i.date,
                                        influencerUserID: i.influencer.userId,
                                        influencerName: `${i.influencer.lastName} ${i.influencer.firstName}`,

                                        saleType: saleType,
                                        productID: i.product.productId,
                                        productName: i.product.title,

                                        productPrice: productPrice,
                                        discountRate: i.product.discountRate,
                                        discountedAmount: discountedAmount,

                                        salePrice: sellingPrice,
                                        orderAmount: i.totalSoldQuantity,
                                        totalAmount: totalAmount,

                                        VAT: vat,
                                        platformFee: platformFeeCalc,
                                        pgFee: pgFeeCalc,

                                        commissionRate: i.product.commissionRate,
                                        influencerBusinessType: influencerEntity,
                                        influencerBusinessRegistrationID: i.influencer.businessID,

                                        commissionFee: commissionFinalAmount,
                                        sellerReceivable: sellerFinalAmountReceivable,
                                        paymentStatus: paymentStatus,
                                    }

                                    cvsData.push(cvsRowData)

                                    return (
                                        <tr>
                                            <td>{utcToLocal(i.date)}</td>
                                            <td>{i.influencer.userId}</td>
                                            <td>{i.influencer.lastName}{i.influencer.firstName}</td>

                                            <td>{saleType}</td>
                                            <td>{i.product.productId}</td>
                                            <td>{i.product.title}</td>

                                            <td>{currency}{productPrice.toLocaleString()}</td>
                                            <td>{i.product.discountRate}%</td>
                                            <td>{currency}{discountedAmount.toLocaleString()}</td>

                                            <td>{currency}{sellingPrice.toLocaleString()}</td> {/*판메가*/}
                                            <td>{i.totalSoldQuantity}</td> {/*주문 수량*/}
                                            <td>{currency}{totalAmount.toLocaleString()}</td> {/*총 판매금액*/}

                                            <td>{currency}{vat.toLocaleString()}</td> {/*부가세*/}
                                            <td>{currency}{platformFeeCalc.toLocaleString()}</td> {/*플렛폼fee*/}
                                            <td>{currency}{pgFeeCalc.toLocaleString()}</td> {/*PG사 fee*/}

                                            <td>{i.product.commissionRate}%</td> {/*인플루언서 커미션율*/}
                                            <td>{influencerEntity}</td> {/*인플루언서 사업자 형태*/}
                                            <td>{i.influencer.businessID}</td> {/*인플루언서 사업자 번호*/}

                                            <td>{currency}{commissionFinalAmount.toLocaleString()}</td> {/*인플루언서 커미션 fee*/}
                                            <td>{currency}{sellerFinalAmountReceivable.toLocaleString()}</td> {/*예상 정산금액*/}
                                            <td>{paymentStatus}</td>  {/*정산 상황*/}
                                        </tr>
                                    );
                                }
                            }
                        })
                    }

                </table>
            </div>

            let returnVal = {
                table: table,
                receivable: receivable,
                received: received,
                graphData: graphData,
                cvsHeader: cvsHeader,
                cvsData: cvsData
            }

            return ( returnVal )

        } else if (this.state.reportType === "큐브릭") {

            let receivable = 0
            let received = 0

            let cvsHeader = [
                {label: "날짜", key: "date"},
                {label: "판매사 ID", key: "sellerID"},
                {label: "판매사 사업자명", key: "sellerName"},

                {label: "판매 타입", key: "saleType"},
                {label: "제품ID", key: "productID"},
                {label: "제품명", key: "productName"},

                {label: "제품 가격", key: "productPrice"},
                {label: "할인율", key: "discountRate"},
                {label: "할인 가격", key: "discountedAmount"},

                {label: "판매가", key: "salePrice"},
                {label: "주문 수량", key: "orderAmount"},
                {label: "총 판매금액", key: "totalAmount"},

                {label: "부가세" , key: "VAT"},
                {label: "플렛폼 fee" , key: "platformFee"},
                {label: "PG사 fee" , key: "pgFee"},

                {label: "인플루언서 ID" , key: "influencerID"},
                {label: "인플루언서 유저명" , key: "influencerUserName"},
                {label: "인플루언서 커미션율" , key: "influencerCommissionRate"},

                {label: "인플루언서 사업자 형태" , key: "influencerBusinessType"},
                {label: "인플루언서 사업자 번호" , key: "influencerBusinessNumber"},
                {label: "인플루언서 주민 번호" , key: "influecerSSNumber"},

                {label: "인플루언서 커미션 fee" , key: "influencerCommissionFee"},
                {label: "인플루언서 정산 현황" , key: "influencerPayOutStatus"},
                {label: "판매자 사업자 명" , key: "sellerBusinessName"},

                {label: "판매자 사업자 번호" , key: "sellerBusinessNumber"},

                {label: "판매자 정산금액" , key: "sellerReceivable"},
                {label: "판매자 정산 현황" , key: "sellerReceivableStatus"},
                {label: "큐브릭 수익금" , key: "kubricProfit"},
            ]

            let cvsData = [];

            let table =  <div>
                <table className={"paymentReportTable payableTable"}
                       onMouseDown={this.moveScroll}
                       onMouseLeave={this.moveScroll}
                       onMouseUp={this.moveScroll}
                       onMouseMove={this.moveScroll}
                >
                    <thead>
                    <tr>
                        <th>날짜<span className="resize-handle"/></th>
                        <th>판매사 ID<span className="resize-handle"/></th>
                        <th>판매사 사업자명<span className="resize-handle"/></th>

                        <th>판매 타입<span className="resize-handle"/></th>
                        <th>제품ID<span className="resize-handle"/></th>
                        <th>제품명<span className="resize-handle"/></th>

                        <th>제품 가격<span className="resize-handle"/></th>
                        <th>할인율<span className="resize-handle"/></th>
                        <th>할인 가격<span className="resize-handle"/></th>

                        <th>판매가<span className="resize-handle"/></th>
                        <th>주문 수량<span className="resize-handle"/></th>
                        <th>총 판매금액<span className="resize-handle"/></th>

                        <th>부가세<span className="resize-handle"/></th>
                        <th>플렛폼 fee<span className="resize-handle"/></th>
                        <th>PG사 fee<span className="resize-handle"/></th>

                        <th>인플루언서 ID<span className="resize-handle"/></th>
                        <th>인플루언서 유저명<span className="resize-handle"/></th>
                        <th>인플루언서 커미션율<span className="resize-handle"/></th>

                        <th>인플루언서 사업자 형태<span className="resize-handle"/></th>
                        <th>인플루언서 사업자 번호<span className="resize-handle"/></th>
                        <th>인플루언서 주민 번호<span className="resize-handle"/></th>

                        <th>인플루언서 커미션 fee<span className="resize-handle"/></th>
                        <th>인플루언서 정산 현황<span className="resize-handle"/></th>
                        <th>판매자 사업자 명<span className="resize-handle"/></th>

                        <th>판매자 사업자 번호<span className="resize-handle"/></th>

                        <th>판매자 정산금액<span className="resize-handle"/></th>
                        <th>판매자 정산 현황<span className="resize-handle"/></th>
                        <th>큐브릭 수익금<span className="resize-handle"/></th>
                    </tr>
                    </thead>

                    {
                        this.state.reportData.map((i, index) => {

                            let dateInNumber = Number(getDateInNumber(i.date))

                            let beginDateInNumber = Number(this.state.beginPeriodNumber)
                            let endDateInNumber = Number(this.state.endPeriodNumber)

                            if (dateInNumber >= beginDateInNumber && dateInNumber <= endDateInNumber) {

                                let currency;
                                if (i.product.currency === "KRW") {
                                    currency = "₩"
                                }

                                let optionPrice = (i.product.option.additionalCost === null || i.product.option.additionalCost === undefined) ? 0 : i.product.option.additionalCost;


                                let productPrice = i.product.sellingPrice + optionPrice
                                let discountedAmount = productPrice * (i.product.discountRate / 100)

                                let sellingPrice = productPrice - discountedAmount

                                let totalAmount = sellingPrice * (i.totalSoldQuantity)

                                let vat = Math.round(totalAmount - (totalAmount / (1.1)))

                                let platformFeeCalc = totalAmount * (platformFee / 100)

                                let shippingCost = i.product.totalShippingCost

                                let pgFeeCalc = Math.round((totalAmount + shippingCost) * (pgFee / 100))

                                let commissionCalc = Math.round(totalAmount * (i.product.commissionRate / 100))

                                let influencerEntity;
                                if(i.influencer.isBusiness === true) {
                                    influencerEntity = "사업자"
                                } else {
                                    influencerEntity = "비사업자"
                                }

                                let commissionFinalAmount;
                                if (i.influencer.isBusiness === true) {
                                    commissionFinalAmount = commissionCalc
                                } else {
                                    let commissionWithoutVAT = (commissionCalc / 1.1)
                                    commissionFinalAmount = Math.round(commissionWithoutVAT - (commissionWithoutVAT * (govLaborFee / 100)))
                                }

                                let influencerPaymentStatus;
                                if (i.isCommisionPaidToInfluencer === false) {
                                    influencerPaymentStatus = "정산 예정"
                                } else {
                                    influencerPaymentStatus = "정산 완료"
                                }

                                let sellerFinalAmountReceivable = (totalAmount + shippingCost) - pgFeeCalc - platformFeeCalc - commissionFinalAmount

                                let sellerPaymentStatus;
                                if (i.isSalesFeePaidToSeller === false) {
                                    sellerPaymentStatus = "정산 예정"
                                } else {
                                    sellerPaymentStatus = "정산 완료"
                                }

                                let saleType;
                                if (i.saleType === "shareSale") {
                                    saleType = "공구"
                                } else {
                                    saleType = "프로모션"
                                }

                                if (i.isCommisionPaidToInfluencer === false ) {
                                    receivable += commissionFinalAmount
                                }

                                if (i.isSalesFeePaidToSeller === false ) {
                                    receivable += sellerFinalAmountReceivable
                                }

                                if (i.isCommisionPaidToInfluencer === true && i.isSalesFeePaidToSeller === true) {
                                    received += platformFeeCalc
                                }

                                graphData.forEach((g, index) => {
                                    if (g.x === utcToLocalDateOnly(i.date)) {
                                        graphData[index].y += platformFeeCalc
                                        graphData[index].count += 1
                                    }
                                })



                                let cvsRowData = {
                                    date: i.date,
                                    sellerID: i.seller.userId,
                                    sellerName: i.seller.businessName,

                                    saleType: saleType,
                                    productID: i.product.productId,
                                    productName: i.product.title,

                                    productPrice: productPrice,
                                    discountRate: i.product.discountRate,
                                    discountedAmount: discountedAmount,

                                    salePrice: sellingPrice,
                                    orderAmount: i.totalSoldQuantity,
                                    totalAmount: totalAmount,

                                    VAT: vat,
                                    platformFee: platformFeeCalc,
                                    pgFee: pgFeeCalc,

                                    influencerID: i.influencer.uniqueId,
                                    influencerUserName: i.influencer.userId,
                                    influencerCommissionRate: i.product.commissionRate,

                                    influencerBusinessType: influencerEntity,
                                    influencerBusinessNumber: i.influencer.businessID,
                                    influecerSSNumber: i.influencer.socialNumber,

                                    influencerCommissionFee: commissionFinalAmount,
                                    influencerPayOutStatus: influencerPaymentStatus,
                                    sellerBusinessName: i.seller.businessName,

                                    sellerBusinessNumber: i.seller.businessID,

                                    sellerReceivable: sellerFinalAmountReceivable,
                                    sellerReceivableStatus: sellerPaymentStatus,
                                    kubricProfit: platformFeeCalc,
                                }

                                cvsData.push(cvsRowData)

                                return (
                                    <tr>
                                        <td>{utcToLocal(i.date)}</td>
                                        <td>{i.seller.userId}</td>
                                        <td>{i.seller.businessName}</td>

                                        <td>{saleType}</td>
                                        <td>{i.product.productId}</td>
                                        <td>{i.product.title}</td>

                                        <td>{currency}{productPrice.toLocaleString()}</td>
                                        <td>{i.product.discountRate}%</td>
                                        <td>{currency}{discountedAmount.toLocaleString()}</td>

                                        <td>{currency}{sellingPrice.toLocaleString()}</td> {/*판메가*/}
                                        <td>{i.totalSoldQuantity}</td> {/*주문 수량*/}
                                        <td>{currency}{totalAmount.toLocaleString()}</td> {/*총 판매금액*/}

                                        <td>{currency}{vat.toLocaleString()}</td> {/*부가세*/}
                                        <td>{currency}{platformFeeCalc.toLocaleString()}</td> {/*플렛폼fee*/}
                                        <td>{currency}{pgFeeCalc.toLocaleString()}</td> {/*PG사 fee*/}

                                        <td>{i.influencer.userUID}</td> {/*인플루언서 ID*/}
                                        <td>{i.influencer.userId}</td> {/*인플루언서 유저명*/}
                                        <td>{i.product.commissionRate}</td> {/*인플루언서 커미션율*/}

                                        <td>{influencerEntity}</td> {/*인플루언서 사업자 형태*/}
                                        <td>{i.influencer.businessID}</td> {/*인플루언서 사업자 번호*/}
                                        <td>{i.influencer.socialNumber}</td>  {/*인플루언서 주민 번호*/}

                                        <td>{currency}{commissionFinalAmount.toLocaleString()}</td> {/*인플루언서 커미션 fee*/}
                                        <td>{influencerPaymentStatus}</td>  {/*인플루언서 정산 현황*/}
                                        <td>{i.seller.businessName}</td>
                                        <td>{i.seller.businessID}</td> {/*판매자 사업자 번호*/}

                                        <td>{currency}{sellerFinalAmountReceivable.toLocaleString()}</td>  {/*판매자 예상 정산금액*/}
                                        <td>{sellerPaymentStatus}</td>  {/*판매자 정산 현황*/}
                                        <td>{currency}{platformFeeCalc.toLocaleString()}</td>  {/*큐브릭 수익금*/}
                                    </tr>
                                );

                            }


                        })
                    }

                </table>
            </div>

            let returnVal = {
                table: table,
                receivable: receivable,
                received: received,
                graphData: graphData,
                cvsHeader: cvsHeader,
                cvsData: cvsData
            }

            return ( returnVal )

        }

    }

    // requestPay = () => {
    //
    //     let message = "결제 대금 지급이 요청되었습니다.";
    //
    //     this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
    //
    // }

    toggleViewTypeButton = () => {

        this.setState({
            isViewTypeButtonOn: !this.state.isViewTypeButtonOn
        })

    }

    setUpGraphArray = () => {

        let xAxisTickValue = []

        let timeInADay = 24*60*60*1000

        let numberOfDayDifference = ((new Date(this.state.endPeriod).getTime() - new Date(this.state.beginPeriod).getTime()) / timeInADay) + 1
        let jumpTick = 1
        if (numberOfDayDifference < 30) {
            jumpTick = 1
        } else if (numberOfDayDifference >= 30 && numberOfDayDifference < 50) {
            jumpTick = 2
        } else if (numberOfDayDifference >= 50  && numberOfDayDifference < 100) {
            jumpTick = 7
        } else if (numberOfDayDifference >= 100  && numberOfDayDifference < 365) {
            jumpTick = 14
        }

        for (var i = 0; i < numberOfDayDifference; i+= jumpTick) {
            let dateData = getDaysBeforeFromAday(this.state.endPeriod, i)
            xAxisTickValue.splice(0, 0, dateData.text)
        }

        this.setState({
            graphDateArray: xAxisTickValue,
            dateDifference: numberOfDayDifference,
        })

    }

    setDates = (begin, beginDate, end, endDate) => {

        this.setState({
            beginPeriod: begin,
            beginPeriodNumber: getDateInNumber(begin) ,
            endPeriod: end,
            endPeriodNumber: getDateInNumber(end),
        }, ()=>{

            let startDate = new Date(begin).toISOString();
            let endDate = new Date(end).toISOString();

            let params = {
                uniqueId: getUniqueId(),
                startDate: startDate,
                endDate: endDate
            }

            this.props.getAdminFullReport(params)

            this.setUpGraphArray()
        })

    }

    dateSelectClicked = () => {

        if (this.state.isCalendarOpen === false) {
            this.setState({calendarView: <Calendar setDates={(begin, beginDate, end, endDate) => this.setDates(begin, beginDate, end, endDate)} beginDate={this.state.beginDate} endData={this.state.endDate} isBackward={true}  closeView={this.dateSelectClicked}/>}, () => {
                this.setState({isCalendarOpen: !this.state.isCalendarOpen})
            })
        } else {
            this.setState({isCalendarOpen: !this.state.isCalendarOpen}, () => {
                this.setState({calendarView: null})
            })
        }

    }

    moveScroll = () => {
        const slider = document.querySelector('.payableTable');
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            slider.classList.add("grab");
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
            slider.classList.remove("grab");
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
            slider.classList.remove("grab");
        });
        slider.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            slider.scrollLeft = scrollLeft - walk;

        });
    }

    alertMessageViewToggle = () => {
        this.setState({alertMessage: ''})
    }

    toggleReportTypeButton =()=> {
        this.setState({
            isReportTypeOpen: !this.state.isReportTypeOpen
        })
    }

    viewTypeClicked = (type) => {
        let text;

        if (type === 1) {
            text = "정산 주기 단위"
        } else {
            text = "주문건 단위"
        }

        this.setState({
            viewType: text
        }, () => {
            this.toggleViewTypeButton()
        })
    }

    togglePopup = (state) => {
        this.setState({
            isPopUpWindowOpen: !this.state.isPopUpWindowOpen
        })

    }

    render() {

        let userType = {
            isInfluencer: true,
            isSeller: true,
            isKubric: true
        }

        let influencerPaymentDueReportViewButton;
        if (userType.isInfluencer === true || userType.isKubric === true) {
            influencerPaymentDueReportViewButton = <div className={"paymentViewTypeButton"} onClick={() => {this.getInfluecerPaymentDue()}}>인플루언서 정산 내역</div>
        }

        let sellerPaymentDueReportViewButton;
        if (userType.isSeller === true || userType.isKubric === true) {
            sellerPaymentDueReportViewButton = <div className={"paymentViewTypeButton"} onClick={() => {this.getSPaymentDue()}}>판매사 정산 내역</div>
        }

        let kubricPaymentDueReportViewButton;
        if (userType.isKubric === true) {
            kubricPaymentDueReportViewButton = <div className={"paymentViewTypeButton"} onClick={() => {this.getKubricPayableDue()}}>큐브릭 정산 내역</div>
        }

        let beginTime = this.state.beginPeriod
        let endTime = this.state.endPeriod

        let table = this.renderTable()
        let receivable = table.receivable
        let received = table.received
        let graphData = table.graphData

        let maxYValue = 0

        graphData.forEach((x, index)=>{

            if (x.y >= maxYValue) {
                if (x.y === 0) {
                    maxYValue = 1000
                } else {
                    maxYValue = x.y
                }
            }

        })

        // if (graphData.length > 5) {
        //
        //     for (var i = 0; i < graphData.length; i+=2) {
        //         xAxisTickValue.push(graphData[i].x)
        //     }
        //
        // } else if (graphData.length < 10) {
        //     for (var i = 0; i < graphData.length; i++) {
        //         xAxisTickValue.push(graphData[i].x)
        //     }
        // }

        let totalAmountElement;

        if (this.state.reportType === "큐브릭") {
            totalAmountElement = <div className={"paymentStatusWrapper"}>
                <div className={"paymentStatusText"}>총 정산 예정 금액 : ₩{receivable.toLocaleString()}</div>
                <div className={"paymentStatusText"}>총 수익 금액 : ₩{received.toLocaleString()}</div>
            </div>
        } else {
            totalAmountElement = <div className={"paymentStatusWrapper"}>
                <div className={"paymentStatusText"}>정산 예정 금액 : ₩{receivable.toLocaleString()}</div>
                <div className={"paymentStatusText"}>정산 완료 금액 : ₩{received.toLocaleString()}</div>
            </div>
        }

        let graphWidth;
        let graphHeight;

        return (
            <div>
                <div className={"socialTapBar graphTapButtonWidth graphTapTop"}>
                    <div className={"socialTapButton"} id={"bottomSocial"} onClick={() => this.tapClicked("bottomSocial", REVENUE_TYPE.ALL)} ref={this.socialRef}><a>전체</a></div>
                    <div className={"socialTapButton"} id={"bottomForum"} onClick={() => this.tapClicked("bottomForum", REVENUE_TYPE.JP)}><a>공구</a></div>
                    <div className={"socialTapButton"} id={"bottomReview"} onClick={() => this.tapClicked("bottomReview", REVENUE_TYPE.PROMO)}><a>일반</a></div>
                </div>

                <div className={"profileTapLineWrapper graphTapButtonWidth"}>
                    <div className={"profileSocialLine"} id={"profileSocialLineID"}/>
                    <div className={"tapBrick"} style={this.state.brickPosition}/>
                </div>

                <ReactResizeDetector handleWidth onResize={this.handleScreenResize}/>

                <div className={"graphWrapper"} id={"receivableGraphWrapperID"}
                    onMouseLeave={()=>this.togglePopup("out")}
                    onMouseEnter={()=>this.togglePopup("enter")}
                    // id={"graphContainerID"}
                >
                    <XYPlot
                        className={"graphContainer"}
                        height={500}
                        width={this.state.graphWidth}
                        margin={{left: 80, bottom: 100, right: 32}}
                        xType="ordinal"
                        yDomain={[0, maxYValue]}
                    >
                        {/*<FlexibleXYPlot>*/}
                        <HorizontalGridLines />
                        {/*<VerticalBarSeries data={graphData} color={"red"} />*/}

                        <LineSeries
                            data={graphData}
                            style={{stroke: 'violet', strokeWidth: 3, fill: "none", strokeLinejoin: "round"}}
                            onNearestXY={(datapoint, event)=>{
                                this.setState({
                                    mouseOverDate: datapoint.x,
                                    mouseOverAmount: datapoint.y,
                                    mouseOverOrderCount: datapoint.count,
                                    mouseOverX: event.innerX,
                                    mouseOverY: event.innerY,
                                    graphMouseOverEvent: event
                                })
                            }}
                        >

                        </LineSeries>

                        <XAxis
                            // tickFormat={v => `${v}`}
                            tickSize={1}
                            tickLabelAngle={-45}
                            hideTicks
                        />
                        <XAxis
                            tickTotal={this.state.graphDateArray.length}
                            tickValues={this.state.graphDateArray}
                            tickLabelAngle={-45}
                        />

                        <YAxis
                            tickSize={1}
                            tickFormat={v => `₩${v.toLocaleString()}`}
                            tickLabelAngle={-45}
                        />
                        {/*</FlexibleXYPlot>*/}
                        <div className={"myShadowStyle"} style={{
                            position: "absolute",
                            top: `${this.state.mouseOverY + 0}px` ,
                            left: `${this.state.mouseOverX > 100 ? this.state.mouseOverX - 70 : this.state.mouseOverX + 100}px`,
                            width: "max-content",
                            height: "max-content",
                            backgroundColor: "white",
                            color: "black",
                            padding: "8px 16px",
                            borderRadius: "15px",
                            display: `${this.state.isPopUpWindowOpen ? "block" : "none"}`
                        }}>
                            <div>{this.state.mouseOverDate}</div>
                            <div>₩{this.state.mouseOverAmount.toLocaleString()}</div>
                            <div>{this.state.mouseOverOrderCount}건</div>
                        </div>

                        <div style={{
                            position: "absolute",
                            top: `${this.state.mouseOverY+6}px`,
                            left: `${this.state.mouseOverX+75}px`,
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "red",
                            display: `${this.state.isPopUpWindowOpen ? "block" : "none"}`
                        }}>
                        </div>

                    </XYPlot>
                </div>

                <div className={"tableBox"}>
                    <div className={"tableDataTypeSelectWrapper"}>

                        <div className={"paymentViewOptionButton"}>
                            <div onClick={this.toggleReportTypeButton}>{this.state.reportType}<img className={`paymentViewTypeStateTriangle ${this.state.isReportTypeOpen ? "rotatePaymentViewTriangle" : "" }`} src={require("./image/triangleRed.png")}/></div>
                            <div>
                                <div className={`viewTypeToggleButton myShadowStyle ${this.state.isReportTypeOpen ? "viewTypeButtonGrow" : ""}`}>
                                    {influencerPaymentDueReportViewButton}
                                    {sellerPaymentDueReportViewButton}
                                    {kubricPaymentDueReportViewButton}
                                </div>
                            </div>
                        </div>

                        {/*<div className={"paymentViewOptionButton"}>*/}
                        {/*    <div onClick={this.toggleViewTypeButton}>{this.state.viewType}<img className={`paymentViewTypeStateTriangle ${this.state.isViewTypeButtonOn ? "rotatePaymentViewTriangle" : "" }`} src={require("./image/triangleRed.png")}/></div>*/}
                        {/*    <div>*/}
                        {/*        <div className={`viewTypeToggleButton myShadowStyle ${this.state.isViewTypeButtonOn ? "viewTypeButtonGrow" : ""}`}>*/}
                        {/*            <div className={"paymentViewTypeButton"} onClick={() => this.viewTypeClicked(1)}>정산 주기 단위</div>*/}
                        {/*            <div className={"paymentViewTypeButton"} onClick={() => this.viewTypeClicked(2)}>주문건 단위</div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <div className={"selectPeriodForReport selectPeriodButton"} onClick={this.dateSelectClicked}>기간 설정</div>
                        <div className={"selectPeriodForReport"}>{beginTime} ~ {endTime}</div>
                    </div>

                    {totalAmountElement}

                    {table.table}

                </div>

                <div className={"shippingButtons excelDownLoadButton"}>
                    <CSVLink
                        headers={table.cvsHeader}
                        data={table.cvsData}
                        filename={`${getTodayDate().text + "receivableReport.csv"}`}
                        className="shippingButton"
                        target="_blank"
                    >
                        엑셀 다운로드
                    </CSVLink>
                </div>

                {this.state.alertMessage}

                <div className={`datePickerView ${this.state.isCalendarOpen ? "calendarOpen" : ""}`}>
                    {this.state.calendarView}
                </div>

            </div>
        );
    }

}


let mapStateToProps = (state) => {




    return {
        report: state.manager.report,
        list: state.manager.dueList,
        paymentDueViewType: state.manager.paymentDueViewType
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        getAdminFullReport: (params) => dispatch(getAdminFullReport(params)),
        getAdminJPReport: () => dispatch(getAdminJPReport()),
        getAdminPromoReport: () => dispatch(getAdminPromoReport()),
        getRevenueAll: () => dispatch(getRevenueAll()),
        getRevenueInfluencer: () => dispatch(getRevenueInfluencer()),
        getRevenueProduct: () => dispatch(getRevenueProduct()),
        getInfluencerPaymentDue:() => dispatch(getInfluencerPaymentDue()),
        getSellerPaymentDue: () => dispatch(getSellerPaymentDue())
    }
};

ManagementViewPaymentReceivableReport = connect(mapStateToProps, mapDispatchToProps)(ManagementViewPaymentReceivableReport)

export default ManagementViewPaymentReceivableReport;