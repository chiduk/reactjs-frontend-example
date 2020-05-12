import React, { Component } from "react";
import "./js/components/Manager.css";
import TextareaAutosize from 'react-autosize-textarea';
import AddProductView from './AddProductView.js';
import ManagementViewProduct from './ManagementViewProduct.js';
import ManagementViewRevenueReport from './ManagementViewRevenueReport.js';
import ManagementViewPaymentReceivableReport from './ManagementViewPaymentReceivableReport.js';
import ManagementViewProductMatching from "./ManagementViewProductMatching.js";
import ManagementViewReturnCancelOrder from "./ManagementViewReturnCancelOrder.js";
import ManagementViewShipping from "./ManagementViewShipping.js";
import ManagementViewUser from "./ManagementViewUser.js";
import ManagementViewProductMatchingConfirm from "./ManagementViewProductMatchingConfirm.js";
import {getUniqueId} from "./util/Constants";
import {getMyInfo} from "./actions/user";
import LogInPage from "./LogInPage";
import {setCount} from "./actions/notification";
import {connect} from "react-redux";
import {setCartItemCount} from "./actions/cart";
import {getShippingCompanyList} from "./actions/manager";

class Manager extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isProductAddViewOn: false,
            isProductManageViewOn: false,
            isRevenueReportViewOn: false,
            isPaymentReportViewOn: false,
            isProductMatchingViewOn: false,
            isProductMatchingConfirmViewOn: false,
            isOrderCancelReturnViewOn: false,
            isShippingManagermentViewOn: false,
            isUserManagermentViewOn: false,
            isMenuClicked: false,
            isLoadFirstTime: true,
            viewName: "관리자 메뉴"
        }
        this.tapButtonPressed = this.tapButtonPressed.bind(this)
        this.addProductRef = React.createRef()

        this.menuClicked = this.menuClicked.bind(this)

        this.props.setNotificationCount();
        this.props.setCartItemCount();

        this.props.getShippingCompanyList();

        this.props.getMyInfo()

        this.reveueReport = React.createRef()

    }

    componentWillMount() {

        this.props.getMyInfo();

        document.addEventListener('mousedown', this.handleOutsideClick, false)

    }

    componentWillUnmount() {

        document.removeEventListener('mousedown', this.handleOutsideClick, false)

    }

    handleOutsideClick = (e) =>{

        if (!this.managerButton.contains(e.target) && !this.managerButtonView.contains(e.target)) {
            this.closeViewOptionButton()
        }
    }

    closeViewOptionButton = () => {
        this.setState({
            isMenuClicked: false
        })
    }

    componentDidMount() {
        // this.tapButtonPressed("addProduct")
        this.reveueReport.current.click()

        this.setState({
            isLoadFirstTime: false
        })

        if(getUniqueId() === undefined || getUniqueId() === null){
            if(window.confirm('서비스 사용을 위해서 로그인을 먼저 해야 합니다. 로그인 하시겠습니까?')){
                const element = document.getElementById('logInPage')

                element.classList.toggle('searchViewClose')
            }else{
                window.location ='/'
            }

            return
        }



        if(this.props.location.state !== undefined){



            if(this.props.location.state.page === 'matchRequest'){

                this.setState({isLoadFirstTime: false},
                    () => {
                        this.tapButtonPressed('productMatching', "상품 매칭")
                    })
            }else if(this.props.location.state.page === 'matchRequestConfirm'){
                this.tapButtonPressed('productMatchingConfirm', "상품 매칭 컨펌")
                this.setState({isLoadFirstTime: false})
            }
        }

    }


    tapButtonPressed(id, name) {

        this.setState({
            isProductAddViewOn: false,
            isProductManageViewOn: false,
            isRevenueReportViewOn: false,
            isPaymentReportViewOn: false,
            isProductMatchingViewOn: false,
            isProductMatchingConfirmViewOn: false,
            isOrderCancelReturnViewOn: false,
            isShippingManagermentViewOn: false,
            isUserManagermentViewOn: false
        }, () => {
            if (id === "addProduct") {




                this.setState({isProductAddViewOn: true})
            } else if (id === "productManagement") {
                this.setState({isProductManageViewOn: true})
            } else if (id === "revenueReport") {
                this.setState({isRevenueReportViewOn: true})
            } else if (id === "paymentReport") {
                this.setState({isPaymentReportViewOn: true})
            } else if (id === "productMatching") {
                this.setState({isProductMatchingViewOn: true})
            } else if (id === "productMatchingConfirm") {
                this.setState({isProductMatchingConfirmViewOn: true})
            } else if (id === "orderCancelReturn") {
                this.setState({isOrderCancelReturnViewOn: true})
            } else if (id === "shippingManagement") {
                this.setState({isShippingManagermentViewOn: true})
            } else if (id === "userManagement") {
                this.setState({isUserManagermentViewOn: true})
            }


        })
        if (this.state.isLoadFirstTime === false) {
            this.menuClicked(name)
        }
    }



    menuClicked(name) {

        this.setState({
            isMenuClicked: !this.state.isMenuClicked,
            viewName: name
        })

    }

    toggleLoginPage = () => {
        const element = document.getElementById('logInPage');

        element.classList.toggle('searchViewClose')

        if(getUniqueId() === undefined || getUniqueId() === null){
            window.location ='/'
        }
    }

    render() {

        let userManagementView;
        if (this.props.myInfo.isAdmin) {
            userManagementView = <div className={`leftTapButtons ${this.state.isUserManagermentViewOn ? "leftTapButtonWhite" : ""}`}
                                      id={"userManagement"}
                                      onClick={() => this.tapButtonPressed("userManagement", "회원 관리")}>
                <a>회원 관리</a>
                <div className={"leftTapButtonBottomLine"}></div>
            </div>
        }
        let matchingConfirmView;
        let salesCancelReturnView;
        let shippingManagementView;
        let productUpLoader;
        let productManager;
        if (this.props.myInfo.isSeller || this.props.myInfo.isAdmin) {
            productUpLoader = <div className={`leftTapButtons ${this.state.isProductAddViewOn ? "leftTapButtonWhite" : ""}`}
                                   id={"addProduct"} ref={this.addProductRef}
                                   onClick={() => this.tapButtonPressed("addProduct", "제품 추가")}>
                <a>제품 추가</a>
                <div className={"leftTapButtonBottomLine"}></div>
            </div>

            productManager = <div className={`leftTapButtons ${this.state.isProductManageViewOn ? "leftTapButtonWhite" : ""}`}
                                  id={"productManagement"}
                                  onClick={() => this.tapButtonPressed("productManagement", "상품 관리")}
                                  ref={node => this.myProductListView = node}
            >
                <a>상품 관리</a>
                <div className={"leftTapButtonBottomLine"}></div>
            </div>

            matchingConfirmView = <div className={`leftTapButtons ${this.state.isProductMatchingConfirmViewOn ? "leftTapButtonWhite" : ""}`}
                                       id={"productMatchingConfirm"}
                                       onClick={() => this.tapButtonPressed("productMatchingConfirm", "상품 매칭 컨펌")}>
                <a>상품 매칭 컨펌</a>
                <div className={"leftTapButtonBottomLine"}></div>
            </div>

            salesCancelReturnView = <div className={`leftTapButtons ${this.state.isOrderCancelReturnViewOn ? "leftTapButtonWhite" : ""}`}
                                         id={"orderCancelReturn"}
                                         onClick={() => this.tapButtonPressed("orderCancelReturn", "최소 / 환불 관리")}>
                <a>취소 / 환불 관리</a>
                <div className={"leftTapButtonBottomLine"}></div>
            </div>

            shippingManagementView = <div className={`leftTapButtons ${this.state.isShippingManagermentViewOn ? "leftTapButtonWhite" : ""}`}
                                          id={"shippingManagement"}
                                          onClick={() => this.tapButtonPressed("shippingManagement", "배송 관리")}>
                <a>배송 관리</a>
                <div className={"leftTapButtonBottomLine"}></div>
            </div>

        }

        return(
            <div className={"managerBody"}>
                <div ref={node => this.managerButton = node} onClick={() => this.menuClicked("관리자 메뉴")} className={"managerMenuButton"}>{this.state.viewName}<img className={`${this.state.isMenuClicked ? "rotateTriangle" : ""}`} src={require("./image/triangleRed.png")}/></div>
                <div>
                    <div ref={node => this.managerButton = node} ref={node => this.managerButtonView = node} className={`leftTap ${this.state.isMenuClicked ? "growManagerMenuView" : ""}`}>



                        {productUpLoader}

                        {productManager}

                        <div ref={this.reveueReport} className={`leftTapButtons ${this.state.isRevenueReportViewOn ? "leftTapButtonWhite" : ""}`}
                             id={"revenueReport"}
                             onClick={() => this.tapButtonPressed("revenueReport", "매출 리포트")}>
                            <a>매출 리포트</a>
                            <div className={"leftTapButtonBottomLine"}></div>
                        </div>

                        <div className={`leftTapButtons ${this.state.isPaymentReportViewOn ? "leftTapButtonWhite" : ""}`}
                             id={"paymentReport"}
                             onClick={() => this.tapButtonPressed("paymentReport", "정산 관리")}>
                            <a>정산 관리</a>
                            <div className={"leftTapButtonBottomLine"}></div>
                        </div>

                        <div className={`leftTapButtons ${this.state.isProductMatchingViewOn ? "leftTapButtonWhite" : ""}`}
                             id={"productMatching"}
                             onClick={() => this.tapButtonPressed("productMatching", "상품 매칭")}>
                            <a>상품 매칭</a>
                            <div className={"leftTapButtonBottomLine"}></div>
                        </div>

                        {matchingConfirmView}
                        {salesCancelReturnView}
                        {shippingManagementView}
                        {userManagementView}

                    </div>
                </div>


                <div className={"rightSideView"}>
                    <div className={`tapBody addProductView ${this.state.isProductAddViewOn ? "" : "hideView"}`}
                         id={"addProductView"}
                    >
                        <AddProductView />
                    </div>

                    <div className={`tapBody  ${this.state.isProductManageViewOn ? "" : "hideView"}`}
                         id={"productManagementView"}
                    >
                        <ManagementViewProduct/>
                    </div>

                    <div className={`tapBody revenueReportView ${this.state.isRevenueReportViewOn ? "" : "hideView"}`}
                         id={"revenueReportView"}
                    >
                        <ManagementViewRevenueReport/>
                    </div>

                    <div className={`tapBody paymentReportView ${this.state.isPaymentReportViewOn ? "" : "hideView"}`}
                         id={"paymentReportView"}
                    >
                        <ManagementViewPaymentReceivableReport/>
                    </div>

                    <div className={`tapBody productMatchingView ${this.state.isProductMatchingViewOn ? "" : "hideView"}`}
                         id={"productMatchingView"}
                    >
                        <ManagementViewProductMatching/>
                    </div>

                    <div className={`tapBody productMatchingView ${this.state.isProductMatchingConfirmViewOn ? "" : "hideView"}`}
                         id={"productMatchingConfirmView"}
                    >
                        <ManagementViewProductMatchingConfirm/>
                    </div>

                    <div className={`tapBody orderCancelReturnView ${this.state.isOrderCancelReturnViewOn ? "" : "hideView"}`}
                         id={"orderCancelReturnView"}
                    >
                        <ManagementViewReturnCancelOrder/>
                    </div>

                    <div className={`tapBody shippingManagementView ${this.state.isShippingManagermentViewOn ? "" : "hideView"}`}
                         id={"shippingManagementView"}
                    >
                        <ManagementViewShipping/>
                    </div>

                    <div className={`tapBody userManagementView ${this.state.isUserManagermentViewOn ? "" : "hideView"}`}
                         id={"userManagementView"}
                    >
                        <ManagementViewUser />
                    </div>
                </div>

                <div id="logInPage" className="searchViewBackGround" ref={this.logInRef}>
                    <div className="searchBarWrapper">
                        <div className="searchCloseButton" ><a onClick={() => this.toggleLoginPage()}>close X</a></div>
                    </div>

                    <LogInPage  toggleLogInView={() => this.toggleLoginPage()} redirectUrl={'/'} />
                </div>
            </div>
        );

    }

}

let mapStateToProps = (state) => {

    return {
        myInfo: state.stella.myInfo
    }
};

let mapDispatchToProps = (dispatch) => {
    return{
        setNotificationCount: () => dispatch(setCount()),
        setCartItemCount: () => dispatch(setCartItemCount()),
        getShippingCompanyList: () => dispatch(getShippingCompanyList()),
        getMyInfo: () => dispatch(getMyInfo())
    }
};

Manager = connect(mapStateToProps, mapDispatchToProps)(Manager);

export default Manager;