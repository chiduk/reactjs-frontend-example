import React, { Component } from "react";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries, VerticalBarSeries, MarkSeries} from 'react-vis';
import 'react-vis/dist/style.css';
import "./js/components/ProfilePage.css";
import Calendar from "./Calendar";
import {CSVLink} from "react-csv";
import {connect} from 'react-redux'
import {
    getAdminPromoReport,
    getAdminFullReport,
    getAdminJPReport,
    getRevenueAll,
    getRevenueInfluencer, getRevenueProduct
} from "./actions/manager";
import {
    getDateInNumber,
    getDaysBefore,
    getDaysBeforeFromAday,
    getTodayDate, getUniqueId,
    REVENUE_TYPE, utcToLocal,
    utcToLocalDateOnly
} from "./util/Constants";
import ReactResizeDetector from 'react-resize-detector';


class ManagementViewRevenueReport extends Component {
    constructor(props) {
        super(props)
        this.isFiltered = false;
        this.state = {
            brickPosition: {
                left: "0px"
            },
            brickWidth: "0px",
            reportData: [],
            revenue: [],
            calendarView: null,
            isCalendarOpen: false,
            reportType: "",
            isReportTypeOpen: false,
            isSeller: false,
            isInfluencer: false,
            isAdmin: false,
            saleType: "전체",
            isSaleTypeOpen: false,

            myProductList: [],
            myInfluencerList: [],
            mySellerList: [],

            sellerSearchResult: [],
            productSearchResult: [],
            influencerSearchResult: [],

            selectedInfluencers: [],
            selectedProducts: [],
            selectedSeller: [],

            productSearchVal: "제품 검색",
            influencerSearchVal: "인플루언서 검색",
            isSearchingInfluencer: false,
            isSearchingProduct: false,
            isSearchingSeller: false,

            influencerSearchInput: "",
            sellerSearchInput: "",
            productSearchInput: "",

            graphDateArray: [],
            mouseOverDate: "",
            mouseOverAmount: "",
            mouseOverOrderCount: 0,
            mouseOverX: "",
            mouseOverY: "",
            isPopUpWindowOpen: false,
            graphWidth: "",

        }
        this.tapClicked = this.tapClicked.bind(this)
        this.socialRef = React.createRef()

        this.props.getAdminFullReport();
        this.props.getRevenueInfluencer();

        this.influencerSearchRef = React.createRef()

    }

    componentDidMount() {

        this.socialRef.current.click()

    }

    componentWillMount() {

        let userType = {
            isInfluencer: true,
            isSeller: true,
            isKubric: true
        }

        let viewType;
        if (userType.isInfluencer === true && userType.isSeller === true) {
            viewType = "전체"
        } else if ( userType.isInfluencer === false && userType.isSeller === true ) {
            viewType = "판매자"
        } else if (userType.isInfluencer){
            viewType = "인플루언서"
        } else if (userType.isKubric) {
            viewType = "전체"
        }

        let begin = getDaysBefore(20)
        let end = getTodayDate()

        this.setState({
            reportData: [],
            beginPeriod: begin.text,
            beginPeriodNumber: begin.number,
            endPeriod: end.text,
            endPeriodNumber: end.number,
            reportType: viewType,
            isSeller: userType.isSeller,
            isInfluencer: userType.isInfluencer,
            isAdmin: userType.isKubric,
        }, () => {


        })

    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.report !== this.props.report){
            this.setState({reportData: this.props.report.revenue}, () => {
                this.getMySellers()
                this.setUpGraphArray()

                this.getMyInfluencers()
                this.getMyProducts()

                this.setUpGraphArray()
            })
        }
    }

    getMyInfluencers = () => {

        let myInfluencers = []

        this.state.reportData.forEach((i, index) => {

            let influencer = i.influencer;

            let filteredArray = myInfluencers.filter(x => x.uniqueId === influencer.uniqueId);

            if(filteredArray <= 0){
                myInfluencers.push(influencer)
            }
        })


        this.setState({
            myInfluencerList: myInfluencers
        })

    }

    getMyProducts = () => {

        let myProducts = []

        this.state.reportData.forEach((i, index) => {

            let product = i.product;

            let filteredArray = myProducts.filter(x => x.productId === product.productId);

            if(filteredArray.length <= 0){
                myProducts.push(product)
            }

        });

        this.setState({
            myProductList: myProducts
        })
    }

    getMySellers = () => {

        let mySellers = [];

        this.state.reportData.forEach((i, index) => {

            let seller = i.seller;

            let filteredArray = mySellers.filter(x => x.businessID === seller.businessID)


            if(filteredArray.length <= 0){
                mySellers.push(seller)
            }

        });

        this.setState({
            mySellerList: mySellers
        })

    };

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
        } else if (numberOfDayDifference >= 365) {
            jumpTick = 30
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




            this.setUpGraphArray()
        })

    }

    tapClicked(id, type) {
        const taps = document.getElementsByClassName("socialTapButton")
        for (var i = 0; i < taps.length; i++) {
            const element = taps[i];
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

        if (type === REVENUE_TYPE.ALL){
            this.props.getAdminFullReport()
        }else if(type === REVENUE_TYPE.JP){
            this.props.getAdminJPReport()
        }else if(type === REVENUE_TYPE.PROMO){
            this.props.getAdminPromoReport()
        }
    }

    getRevenueAll = () => {
        this.props.getRevenueAll()
    };

    getRevenueInfluencer = () => {
        this.props.getRevenueInfluencer()
    };

    getRevenueProduct = () => {
        this.props.getRevenueProduct()
    };

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

    toggleReportTypeButton =()=> {
        this.setState({
            isReportTypeOpen: !this.state.isReportTypeOpen
        })
    }

    reportTypeCliched = (type) => {
        this.setState({
            reportType: type
        }, () => {
            this.toggleReportTypeButton()
        })
    }

    saleTypeClicked = (type) => {
        this.setState({
            saleType: type
        }, () => {
            this.toggleSaleTypeButton()
        })
    }

    toggleSaleTypeButton = () => {
        this.setState({
            isSaleTypeOpen: !this.state.isSaleTypeOpen
        })
    }

    searchingSeller = (e) => {

        let newList = this.state.mySellerList.filter(item => {
            return (
                // item.userName.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0 ||
                item.businessName.toLocaleLowerCase().indexOf(e.target.value.toLocaleLowerCase()) >= 0
            )
        })

        console.log(newList)

        this.setState({
            sellerSearchResult: newList
        })

        this.setState({
            sellerSearchInput: e.target.value
        })

        if (e.target.value.length > 0 ) {
            this.setState({
                isSearchingSeller: true
            })
        } else {
            this.setState({
                isSearchingSeller: false
            })
        }
    }

    searchingProduct =(e)=>{

        var query = e.target.value.toLocaleLowerCase();

        let initialProductList = this.state.myProductList.filter(function (item) {
            let val = false
            let matchCount = 0
            this.state.selectedSeller.forEach(seller => {
                if (item.seller.uniqueId === seller.uniqueId) {
                    matchCount += 1
                }
            })
            if (matchCount > 0) {
                val = true
            }

            return val
        }.bind(this))

        let newList;

        let queryResult = initialProductList.filter(item => item.product.title.toLocaleLowerCase().indexOf(query) >= 0)

        if (queryResult.length > 0) {
            newList = queryResult
        } else {
            newList = initialProductList
        }

        this.setState({
            productSearchResult: newList
        })

        this.setState({
            productSearchInput: e.target.value
        })

        if (e.target.value.length > 0 ) {
            this.setState({
                isSearchingProduct: true
            })
        } else {
            this.setState({
                isSearchingProduct: false
            })
        }
    }


    searchingInfluencer =(e) => {

        let query = e.target.value.toLocaleLowerCase()

        let filteredList = this.state.reportData.filter(function (item) {
            let val = false

            let hasSeller = false

            if (this.state.selectedSeller.length > 0) {
                this.state.selectedSeller.forEach((seller) => {
                    if (seller.uniqueId === item.seller.uniqueId) {
                        hasSeller = true
                    }
                })
            } else {
                hasSeller = true
            }

            let hasProduct = false

            if (this.state.selectedProducts.length > 0) {
                this.state.selectedProducts.forEach((product)=>{
                    if (product.product.productId === item.product.productId) {
                        hasProduct  = true
                    }
                })
            } else {
                hasProduct = true
            }


            if (hasSeller && hasProduct) {
                val = true
            }

            return val
        }.bind(this))

        let influencerArray = []
        filteredList.forEach((item)=>{
            if (influencerArray.length === 0) {
                influencerArray.push(item.influencer)
            } else {
                let matchCount = 0
                influencerArray.forEach((influencer)=>{
                    if (influencer.uniqueId === item.influencer.uniqueId) {
                        matchCount += 1
                    }
                })
                if (matchCount === 0) {
                    influencerArray.push(item.influencer)
                }
            }
        })

        let influencerList = influencerArray.filter(item => {
            return (
                item.userId.toLowerCase().indexOf(query) >= 0 ||
                item.firstName.toLocaleLowerCase().indexOf(query) >= 0 ||
                item.lastName.toLocaleLowerCase().indexOf(query) >= 0
            )
        })

        let newList;
        if (influencerList.length > 0) {
            newList = influencerList
        } else {
            newList = influencerArray
        }

        this.setState({
            influencerSearchResult: newList
        })


        this.setState({
            influencerSearchInput: e.target.value
        })

        if (e.target.value.length > 0) {
            this.setState({
                isSearchingInfluencer: true
            })
        } else {
            this.setState({
                isSearchingInfluencer: false
            })
        }
    }



    sellerResultClicked = (i) => {
        let object = Object.assign([], this.state.selectedSeller)

        let count = 0
        object.forEach((v)=>{
            if (v.uniqueId === i.uniqueId) {
                count +=1
            }
        })

        if (count === 0) {
            object.push(i)
        }


        this.setState({
            sellerSearchInput: "",
            isSearchingSeller: false,
            selectedSeller: object
        }, ()=>{

        })
    }

    productResultClicked = (i) => {

        let object = Object.assign([], this.state.selectedProducts)
        let count = 0
        object.forEach((o, index) => {
            if (o.product.productId === i.product.productId) {
                count += 1
            }
        })
        if (count === 0) {
            object.push(i)
        }

        this.setState({
            productSearchInput: "",
            isSearchingProduct: false,
            selectedProducts: object
        })
    }

    influencerResultClicked = (e) => {
        let object = Object.assign([], this.state.selectedInfluencers)

        let count = 0
        object.forEach((o, index) => {
            if (o.uniqueId === e.uniqueId) {
                count += 1
            }
        });

        if (count === 0 ) {
            object.push(e)
        }

        this.setState({
            influencerSearchInput: "",
            isSearchingInfluencer: false,
            selectedInfluencers: object
        })

    }

    deleteSeller = (e) => {

        let object = Object.assign([], this.state.selectedSeller)
        object.forEach((i, index) => {
            if (i.uniqueId === e.uniqueId) {
                object.splice(index, 1)
            }
        })
        this.setState({
            selectedSeller: object
        })

    }

    deleteProduct = (e) => {

        let object = Object.assign([], this.state.selectedProducts)
        object.forEach((i, index) => {
            if (i.productId === e.productId) {
                object.splice(index, 1)
            }
        })
        this.setState({
            selectedProducts: object
        })

    }

    deleteInfluencer = (e) => {

        let object = Object.assign([], this.state.selectedInfluencers)
        object.forEach((i, index) => {
            if (i.uniqueId === e.uniqueId) {
                object.splice(index, 1)
            }
        })
        this.setState({
            selectedInfluencers: object
        })

    }

    renderTable = () => {

        let testingSellerID = "1234amorae";
        let testingInfluencerId = "1234";


        let beginDateInNumber = Number(this.state.beginPeriodNumber)
        let endDateInNumber = Number(this.state.endPeriodNumber)

        let filteredList = this.state.reportData.filter(function(item){
            let val = false

            let dateInNumber = Number(getDateInNumber(item.date))

            let isWithinTheDate = false
            if (dateInNumber >= beginDateInNumber && dateInNumber <= endDateInNumber) {
                isWithinTheDate = true
            }

            let isTheRightSaleType = false
            if (this.state.saleType === "전체") {
                isTheRightSaleType = true
            } else if (this.state.saleType === "프로모션" && item.saleType === "promotion") {
                isTheRightSaleType = true
            } else if (this.state.saleType === "공구" && item.saleType === "shareSale") {
                isTheRightSaleType = true
            }

            let hasSeller = false
            if (this.state.selectedSeller.length > 0) {
                this.state.selectedSeller.forEach((seller)=>{
                    if (seller.uniqueId === item.seller.uniqueId) {
                        hasSeller = true;
                    }
                })
            } else {
                if (this.state.isAdmin || (this.state.isSeller && item.seller.uniqueId === testingSellerID)) {
                    hasSeller = true
                }
            }


            let hasProduct = false
            if (this.state.selectedProducts.length > 0) {
                this.state.selectedProducts.forEach((product)=>{
                    if (product.productId === item.product.productId) {
                        hasProduct = true
                    }
                })
            } else {
                if (this.state.isAdmin || (this.state.isSeller && item.seller.uniqueId === testingSellerID) || (this.state.isInfluencer && item.influencer.uniqueId === testingInfluencerId)) {
                    hasProduct = true
                }
            }



            let hasInfluencer = false
            if (this.state.selectedInfluencers.length > 0) {
                this.state.selectedInfluencers.forEach((influencer)=>{
                    if (influencer.uniqueId === item.influencer.uniqueId) {
                        hasInfluencer = true
                    }
                })
            } else {
                if (this.state.isAdmin || (this.state.isSeller && item.seller.uniqueId === testingSellerID) || (this.state.isInfluencer && item.influencer.uniqueId === testingInfluencerId)) {
                    hasInfluencer = true
                }
            }

            if (isTheRightSaleType && isWithinTheDate && hasSeller && hasProduct && hasInfluencer) {
                val = true
            }

            return val

        }.bind(this))

        let currency;

        let totalRevenue = 0

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

        let cvsHeader = [
            {label: "날짜", key: "date"},
            {label: "상품명", key: "productName"},
            {label: "상품명 판매가", key: "productSellingPrice"},

            {label: "옵션 명", key: "optionName"},
            {label: "옵션 추가 금액", key: "optionAddedPrice"},
            {label: "할인율", key: "discountRate"},

            {label: "할인금액", key: "discountedAmount"},
            {label: "주문 수량", key: "orderAmount"},
            {label: "총 판매 금액", key: "totalOrderAmount"},

            {label: "판매 유형", key: "saleType"},

            {label: "판매사명", key: "sellerName"},
            {label: "판매사 유저명", key: "sellerUserName"},
            {label: "판매사 ID", key: "sellerUniqueID"},

            {label: "인플루언서 이름", key: "influencerName"},
            {label: "인플루언서 유저명", key: "influencerUserName"},
            {label: "인플루언서 유저 ID", key: "influencerUserID"},
        ]

        let cvsData = []


        let table = <table className={"revenueReportTable"}
                           onMouseDown={this.moveScroll}
                           onMouseLeave={this.moveScroll}
                           onMouseUp={this.moveScroll}
                           onMouseMove={this.moveScroll}>
            <thead>
            <tr>
                <th>날짜<span className="resize-handle"/></th>
                <th>상품명<span className="resize-handle"/></th>
                <th>상품 판매가<span className="resize-handle"/></th>

                <th>옵션 명<span className="resize-handle"/></th>
                <th>옵션 추가 금액<span className="resize-handle"/></th>
                <th>할인율<span className="resize-handle"/></th>


                <th>할인금액<span className="resize-handle"/></th>
                <th>주문 수량<span className="resize-handle"/></th>
                <th>총 판매 금액<span className="resize-handle"/></th>

                <th>판매 유형</th>

                <th>판매사명<span className="resize-handle"/></th>
                <th>판매사 유저명<span className="resize-handle"/></th>
                <th>판매사 ID<span className="resize-handle"/></th>

                <th>인플루언서 이름<span className="resize-handle"/></th>
                <th>인플루언서 유저명<span className="resize-handle"/></th>
                <th>인플루언서 유저 ID<span className="resize-handle"/></th>
            </tr>
            </thead>

            {filteredList.map((item, index)=>{



                let productPrice = item.product.sellingPrice;
                let optionPrice = (item.product.option.additionalCost === null || item.product.option.additionalCost === undefined) ? 0 : item.product.option.additionalCost;
                let productsoldPrice = productPrice + optionPrice
                let discountRate = item.product.discountRate
                let discountedAmount = (productsoldPrice) * (discountRate/100)
                let orderCount = item.totalSoldQuantity
                let totalOrderAmount = (productsoldPrice - discountedAmount) * orderCount

                let saleType;
                if (item.saleType === "shareSale") {
                    saleType = "공구"
                } else {
                    saleType = "프로모션"
                }

                if (item.product.currency === "KRW") {
                    currency = "₩"
                }

                totalRevenue += totalOrderAmount

                graphData.forEach((g, index) => {
                    if (g.x === utcToLocalDateOnly(item.date)) {
                        graphData[index].y += totalOrderAmount
                        graphData[index].count += 1
                    }
                })

                let row = <tr>
                    <td>{utcToLocal(item.date)}</td>
                    <td>{item.product.title}</td>
                    <td>{currency}{productPrice.toLocaleString()}</td>

                    <td>{item.product.option.optionName}</td>
                    <td>{currency}{optionPrice.toLocaleString()}</td>
                    <td>{discountRate}%</td>

                    <td>{currency}{discountedAmount.toLocaleString()}</td>
                    <td>{orderCount}</td>
                    <td>{currency}{totalOrderAmount.toLocaleString()}</td>

                    <td>{saleType}</td>

                    <td>{item.seller.businessName}</td>
                    <td>{item.seller.userId}</td>
                    <td>{item.seller.sellerUID}</td>

                    <td>{item.influencer.lastName}{item.influencer.firstName}</td>
                    <td>{item.influencer.userId}</td>
                    <td>{item.influencer.userUID}</td>
                </tr>

                let csvData = {
                    date: item.date,
                    productName: item.product.title,
                    productSellingPrice: productPrice,

                    optionName: item.product.option.optionName,
                    optionAddedPrice: optionPrice,
                    discountRate: discountRate,

                    discountedAmount: discountedAmount,
                    orderAmount: orderCount,
                    totalOrderAmount: totalOrderAmount,

                    saleType: saleType,

                    sellerName: item.seller.businessName,
                    sellerUserName: item.seller.userId,
                    sellerUniqueID: item.seller.uniqueId,

                    influencerName: `${item.influencer.lastName} ${item.influencer.firstName}` ,
                    influencerUserName: item.influencer.userId,
                    influencerUserID: item.influencer.uniqueId,
                }

                cvsData.push(csvData)

                return row

            })}
        </table>

        let data = {
            table: table,
            totalRevenue: totalRevenue,
            graphData: graphData,
            cvsHeader: cvsHeader,
            cvsData: cvsData
        }

        return (data)
    }

    togglePopup = (state) => {
        this.setState({
            isPopUpWindowOpen: !this.state.isPopUpWindowOpen
        })

    }

    moveScroll = () => {
        const slider = document.querySelector('.revenueReportTable');
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
    };

    handleScreenResize = () => {
        this.setState({
            graphWidth: window.document.getElementById("graphWrapperID").offsetWidth
        })
    }

    render() {

        let beginTime = this.state.beginPeriod;
        let endTime = this.state.endPeriod;

        let viewInfluencerButton;
        if (this.state.isInfluencer === true || this.state.isAdmin === true) {
            viewInfluencerButton = <div className={"paymentViewTypeButton"} onClick={() => {this.reportTypeCliched("인플루언서")}}>인플루언서</div>
        }

        let viewSellerButton;
        if (this.state.isSeller === true || this.state.isAdmin === true) {
            viewSellerButton = <div className={"paymentViewTypeButton"} onClick={() => {this.reportTypeCliched("판매사")}}>판매사</div>
        }

        let viewAllButton;
        if (this.state.isSeller === true || this.state.isAdmin === true) {
            viewAllButton = <div className={"paymentViewTypeButton"} onClick={() => {this.reportTypeCliched("전체")}}>전체</div>
        }

        let sellerSearchInputBox;
        let sellerSearchResult;
        if (this.state.sellerSearchResult.length > 0) {
            sellerSearchResult = this.state.sellerSearchResult.map((i, index) =>
                {
                    let element = <div className={"searchResultElement"}
                                       onClick={() => this.sellerResultClicked(i)}>{i.businessName}</div>
                    return (element)
                }
            )
        } else {
            sellerSearchResult = this.state.mySellerList.map((i, index) =>
                {
                    let element = <div className={"searchResultElement"} onClick={() => this.sellerResultClicked(i)}>{i.businessName}</div>
                    return (element)
                }
            )
        }
        if (this.state.isInfluencer || this.state.isAdmin) {
            sellerSearchInputBox = <div className={"revenueReportSearchInput"}>
                <input onChange={(e) => this.searchingSeller(e)} placeholder={"판매사 검색"}
                       value={this.state.sellerSearchInput}/>
                <div className={`inflencerSearchResultBox myShadowStyle ${this.state.isSearchingSeller ? "opendInfluencerSearchResult" : ""}`}>
                    {sellerSearchResult}
                </div>
            </div>
        }








        let productSearchResult;
        if (this.state.selectedSeller.length > 0) {
            productSearchResult = this.state.productSearchResult.map((i, index)=>{
                let list = <div className={"searchResultElement"} onClick={() => this.productResultClicked(i)}>{i.title}</div>
                return list
            })
        } else {
            productSearchResult = this.state.myProductList.map((i, index)=>{
                let list = <div className={"searchResultElement"} onClick={() => this.productResultClicked(i)}>{i.title}</div>
                return list
            })
        }

        let productSearchInputBox = <div className={"revenueReportSearchInput"}>
            <input onChange={(e) => this.searchingProduct(e)} placeholder={"제품 검색"}
                   value={this.state.productSearchInput}/>
            <div className={`inflencerSearchResultBox myShadowStyle ${this.state.isSearchingProduct ? "opendInfluencerSearchResult" : ""}`}>
                {productSearchResult}
            </div>
        </div>







        let influencerSearchResult;
        if (this.state.selectedSeller.length > 0 || this.state.selectedProducts.length > 0) {
            influencerSearchResult = this.state.influencerSearchResult.map((i, index) => {
                // console.log("influencer result", this.state.influencerSearchResult.length)
                let list = <div className={"searchResultElement"} onClick={() => this.influencerResultClicked(i)}>{i.userId}, {i.lastName} {i.firstName}</div>
                return (list)
            })
        } else {
            influencerSearchResult = this.state.myInfluencerList.map((i, index) => {
                let list = <div className={"searchResultElement"} onClick={() => this.influencerResultClicked(i)}>{i.userId}, {i.lastName} {i.firstName}</div>
                return (list)
            })
        }

        let influencerSearch;
        if (this.state.isSeller || this.state.isAdmin) {
            influencerSearch = <div className={"revenueReportSearchInput"}>
                <input onChange={(e) => this.searchingInfluencer(e)} placeholder={"인플루언서 검색"}
                       value={this.state.influencerSearchInput}
                />
                <div className={`inflencerSearchResultBox myShadowStyle ${this.state.isSearchingInfluencer ? "opendInfluencerSearchResult" : ""}`}>
                    {influencerSearchResult}
                </div>
            </div>
        }







        let sellerSelected = this.state.selectedSeller.map((i, index) => {
            let element = <div className={"resultSelected"}>{i.userName} - {i.businessName}<img key={"sellerDeleteButton" + index} src={require("./image/plusButton.png")} onClick={()=>this.deleteSeller(i)}/></div>
            return(element)
        })

        let productSelected = this.state.selectedProducts.map((i, index) => {
            let element = <div className={"resultSelected"}>{i.title}<img src={require("./image/plusButton.png")} onClick={()=>this.deleteProduct(i)} key={"revenueProductDelete" + index}/></div>
            return (element)
        })

        let influencerSelected = this.state.selectedInfluencers.map((i, index) => {
            let element = <div className={"resultSelected"}>{i.userId} - {i.lastName},{i.firstName}<img key={"reveueSellerDelete" + index} src={require("./image/plusButton.png")} onClick={()=>this.deleteInfluencer(i)}/></div>
            return (element)
        })


        let table = this.renderTable()
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


        return (
            <div>

                <div className={"socialTapBar graphTapButtonWidth graphTapTop"}>
                    <div className={"socialTapButton"} id={"bottomSocial"} onClick={() => this.tapClicked("bottomSocial", REVENUE_TYPE.ALL)} ref={this.socialRef}><a>전체</a></div>
                    <div className={"socialTapButton"} id={"bottomForum"} onClick={() => this.tapClicked("bottomForum",REVENUE_TYPE.JP)}><a>공구</a></div>
                    <div className={"socialTapButton"} id={"bottomReview"} onClick={() => this.tapClicked("bottomReview", REVENUE_TYPE.PROMO)}><a>일반</a></div>
                </div>

                <div className={"profileTapLineWrapper graphTapButtonWidth"}>
                    <div className={"profileSocialLine"} id={"profileSocialLineID"}/>
                    <div className={"tapBrick"} style={this.state.brickPosition}/>
                </div>

                <ReactResizeDetector handleWidth onResize={this.handleScreenResize}/>


                <div
                    className={"graphWrapper"}
                    id={"graphWrapperID"}
                    onMouseLeave={()=>this.togglePopup("out")}
                    onMouseEnter={()=>this.togglePopup("enter")}
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

                        {/*<div className={"paymentViewOptionButton"}>*/}
                        {/*    <div onClick={this.toggleReportTypeButton}>유저 유형: {this.state.reportType}<img className={`paymentViewTypeStateTriangle ${this.state.isReportTypeOpen ? "rotatePaymentViewTriangle" : "" }`} src={require("./image/triangleRed.png")}/></div>*/}
                        {/*    <div>*/}
                        {/*        <div className={`viewTypeToggleButton myShadowStyle ${this.state.isReportTypeOpen ? "viewTypeButtonGrow" : ""}`}>*/}
                        {/*            {viewAllButton}*/}
                        {/*            {viewInfluencerButton}*/}
                        {/*            {viewSellerButton}*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <div className={"paymentViewOptionButton"}>
                            <div onClick={this.toggleSaleTypeButton}>판매 유형: {this.state.saleType}<img className={`paymentViewTypeStateTriangle ${this.state.isSaleTypeOpen ? "rotatePaymentViewTriangle" : "" }`} src={require("./image/triangleRed.png")}/></div>
                            <div>
                                <div className={`viewTypeToggleButton myShadowStyle ${this.state.isSaleTypeOpen ? "viewTypeButtonGrow" : ""}`}>
                                    <div className={"paymentViewTypeButton"} onClick={() => {this.saleTypeClicked("전체")}}>전체</div>
                                    <div className={"paymentViewTypeButton"} onClick={() => {this.saleTypeClicked("공구")}}>공구</div>
                                    <div className={"paymentViewTypeButton"} onClick={() => {this.saleTypeClicked("프로모션")}}>프로모션</div>
                                </div>
                            </div>
                        </div>

                        <div className={"selectPeriodForReport selectPeriodButton"} onClick={this.dateSelectClicked}>기간 설정</div>
                        <div className={"selectPeriodForReport"}>{beginTime} ~ {endTime}</div>
                    </div>

                    <div>
                        {sellerSearchInputBox}
                        <div className={"revenueSelectedResultWrapper"}>{sellerSelected}</div>
                        {productSearchInputBox}
                        <div className={"revenueSelectedResultWrapper"}>{productSelected}</div>
                        {influencerSearch}
                        <div className={"revenueSelectedResultWrapper"}>{influencerSelected}</div>
                    </div>

                    <div className={"totalRevenueNumber"}>총 매출: ₩{table.totalRevenue.toLocaleString()}</div>
                    {table.table}

                </div>

                <div className={"shippingButtons excelDownLoadButton"}>
                    <CSVLink
                        headers={table.cvsHeader}
                        data={table.cvsData}
                        filename={`${getTodayDate().text + "revenueReport.csv"}`}
                        className="shippingButton"
                        target="_blank"
                    >
                        엑셀 다운로드
                    </CSVLink>
                </div>

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
        list: state.manager.list
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        getAdminFullReport: (params) => dispatch(getAdminFullReport(params)),
        getAdminJPReport: () => dispatch(getAdminJPReport()),
        getAdminPromoReport: () => dispatch(getAdminPromoReport()),
        getRevenueAll: () => dispatch(getRevenueAll()),
        getRevenueInfluencer: () => dispatch(getRevenueInfluencer()),
        getRevenueProduct: () => dispatch(getRevenueProduct())
    }
}

ManagementViewRevenueReport = connect(mapStateToProps, mapDispatchToProps )(ManagementViewRevenueReport)


export default ManagementViewRevenueReport;