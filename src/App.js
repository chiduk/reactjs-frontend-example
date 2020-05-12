import React, { Component } from 'react';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import Home from "./Home.js";
import Forum from "./Forum.js";
import MarketShare from "./MarketShare.js";
import Alarm from "./Alarm.js";
import Profile from "./Profile.js";
import Basket from "./Basket.js";
import Manager from "./Manager.js";
import InfluencerFeedDetail from "./InfluencerFeedDetail.js";
import ProductDetailView from "./ProductDetailView.js";
import SignUp from "./SignUp.js";
import WriteNewPost from "./WriteNewPost.js";
import LogInPage from "./LogInPage"
import LoftLoginInfo from "./LoftLoginInfo.js";
import UserProfile from "./UserProfile";
import ProductDetailEditView from "./ProductDetailEditView";
import Order from "./Order.js";
import OrderConfirm from "./OrderConfirm.js";
import Error from "./Error.js";
import Navigation from "./Navigation.js";
import {queryString, RestApi} from "./util/Constants";
import naver from "./config/naver";
import "react-bootstrap"
import Pay from "./Pay";
import "./js/components/CustomNav.css";
import pencil from "./image/pencil.png";
import alarm from "./image/alarm.png";
import userIcon from "./image/userIcon.png";
import basket from "./image/basket.png";
import briefCase from "./image/briefCase.png";
import {Nav} from "react-bootstrap";
import {setCount} from "./actions/notification";
import {setCartItemCount} from "./actions/cart";
import {connect} from "react-redux";
import {getUserId, isMobile} from "./util/Constants";
import {getMyInfo, verifyID} from "./actions/user";
import ProductView from "./ProductView";
import FeedEditView from "./FeedEditView"
import {Helmet} from "react-helmet";
import fetch from "cross-fetch";
import { withRouter} from "react-router-dom";
import * as objectFitImages from 'object-fit-images';
import * as postcss from 'postcss-object-fit-images';



function loadNicepayScript() {

    return new Promise((resolve, reject) => {
        let nicePayScript = document.createElement('script');
        nicePayScript.type = 'text/javascript';
        nicePayScript.src = "https://web.nicepay.co.kr/v3/webstd/js/nicepay-2.0.js"
        document.body.scrollTop = 0
        nicePayScript.characterSet = "utf-8";
        document.head.appendChild(nicePayScript);

        nicePayScript.addEventListener('load', function () {
            resolve()
        });

        nicePayScript.addEventListener('error', function (e) {
            reject(e)
        })

    });

}

function loadNicepayStartScript() {
    return new Promise((resolve, reject) => {
        let nicePayStartScript = document.createElement('script');
        nicePayStartScript.type = 'text/javascript';

        if(isMobile()){
            nicePayStartScript.src = 'https://www.earn-it.co.kr/mobile/nicepayStartMobile.js';
        }else{
            nicePayStartScript.src = 'https://www.earn-it.co.kr/nicepayStart.js';
        }

        nicePayStartScript.characterSet = "utf-8";
        document.head.appendChild(nicePayStartScript);


        nicePayStartScript.addEventListener('load', function () {
            resolve();
        });

        nicePayStartScript.addEventListener('error', function (e) {
            reject(e);
        })

    })
}



function loadDaumPostScript() {
    return new Promise((resolve, reject) => {
        let daumPostCodeScript = document.createElement('script');
        daumPostCodeScript.type = 'text/javascript';
        daumPostCodeScript.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        daumPostCodeScript.characterSet = "utf-8";
        document.head.appendChild(daumPostCodeScript);

        daumPostCodeScript.addEventListener('load', function () {
            resolve()
        })

        daumPostCodeScript.addEventListener('error', function (e) {
            reject(e)
        })
    })
}

export function loadNaverScript() {
    return new Promise((resolve, reject) => {
        let naverScript = document.createElement('script');
        naverScript.type = 'text/javascript';
        naverScript.src = "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js";

        naverScript.characterSet = "utf-8";

        let t = document.getElementsByTagName("script")[0];
        t.parentNode.insertBefore(naverScript, t)

        document.head.appendChild(naverScript);

        naverScript.addEventListener('load', function () {
            resolve()
        });

        naverScript.addEventListener('error', function (e) {
            reject(e)
        })
    })
}

export const nicepayScript = {
    onload: loadNicepayScript()
};

export const nicepayStartScript = {
    onload: loadNicepayStartScript()
};

export const daumPostScript = {
    onload: loadDaumPostScript()
};

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isHamburgClicked: false,
            userName: (getUserId() === null) ? '' : getUserId(),
            alarmCount: 0,
            basketCount: 0,
        }

        this.toggleNavView = this.toggleNavView.bind(this)
        this.logOut = this.logOut.bind(this)
        this.props.setNotificationCount();
        this.props.setCartItemCount();

        this.logIn = this.logIn.bind(this);



    }

    componentWillMount() {

        this.props.getMyInfo();

    }

    componentDidMount() {

        //loadKakaoScript();
        objectFitImages();

        this.setState({userName: (getUserId() === null) ? '' : getUserId()})
    }

    toggleNavView() {
        this.setState({
            isHamburgClicked: !this.state.isHamburgClicked
        })
    }

    logOut() {
        localStorage.removeItem('uniqueId');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        localStorage.removeItem('uniqueId')

        window.location ='/'
    }

    renderNotificationCount = () => {
        if(this.props.notificationCount === 0 || this.props.notificationCount === '0'){

            return []
        }else{
            return(
                <div className={"responsiveNavCount"}>{this.props.notificationCount}</div>
            )

        }


    };

    renderCartItemCount = () => {

        if(this.props.cartItemCount === 0 || this.props.cartItemCount === '0'){
            return []
        }else{
            return(
                <div className={"responsiveNavCount"}>{ this.props.cartItemCount}</div>
            )
        }
    };


    logIn() {
        const element = document.getElementById('logInPage')
        element.classList.toggle('searchViewClose')
    }

    render() {

        let userName;
        if (this.state.userName !== "") {
            userName = <div className={"homeLogInButton"}>
                <div>Hi, {this.state.userName}</div>
            </div>
        } else {
            userName = <div className={"homeLogInButton"} onClick={this.logIn}>
                <div className={"logInButton"}>Log In</div>
            </div>
        }


        let alarmCount;
        if (this.state.alarmCount > 0) {
            alarmCount = <div className={"responsiveNavCount"}>{this.state.alarmCount}</div>
        }

        let basketCount;
        if (this.state.basketCount > 0) {
            basketCount = <div className={"responsiveNavCount"}>{this.state.basketCount}</div>
        }


        let writeNewPostNavButton;
        let managementNavButton;
        let alarmButton;
        if (this.props.myInfo.isAdmin || this.props.myInfo.isInfluencer || this.props.myInfo.isSeller) {
            alarmButton = <Nav.Item>
                <Nav.Link eventKey={2} componentClass={Link} href="/alarm" to="/alarm">
                    <div className={"navActionItem"}>
                        <div>알람</div>
                        {this.renderNotificationCount()}
                        <img src={alarm}/>
                    </div>
                </Nav.Link>
            </Nav.Item>


            writeNewPostNavButton = <Nav.Item>
                <Nav.Link eventKey={1} componentClass={Link} href="/writenewpost" to="/writenewpost">
                    <div className={"navActionItem"}>피드 작성 <img src={pencil}/></div>
                </Nav.Link>
            </Nav.Item>

            managementNavButton = <Nav.Item>
                <Nav.Link eventKey={3} componentClass={Link} href="/manager" to="/manager" >
                    <div className={"navActionItem"}>관리자 페이지 <img src={briefCase}/></div>
                </Nav.Link>
            </Nav.Item>
        }

        return (
           <BrowserRouter>
               <script>https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap/0.32.4/react-bootstrap.min.js</script>
               <div>
                   <Helmet>
                       <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                   </Helmet>

                   <Navigation toggleNav={this.toggleNavView}/>

                   <div className={`navBackgroudBlurView ${this.state.isHamburgClicked? "navBackgroudBlurViewAnimate" : ""}`} onClick={this.toggleNavView}/>
                   <div className={`navToggleView ${this.state.isHamburgClicked? "navToggleViewClicked" : ""}`}>
                       <div className={"navToggleButtonWrapper"}>

                           <Nav.Item>
                               <Nav.Link eventKey={1} componentClass={Link} href="/profile" to="/profile" >
                                   <div className={"navActionItem"}>{userName}</div>
                               </Nav.Link>
                           </Nav.Item>

                           <Nav.Item>
                               <Nav.Link>
                                   <div className={"navActionItem"} onClick={this.logOut}>
                                       <div className={"responsiveLogout"}>{((getUserId() === null)) ? '' : 'Logout'}</div>
                                   </div>
                               </Nav.Link>
                           </Nav.Item>

                           <Nav.Item>
                               <Nav.Link eventKey={2} componentClass={Link} href="/forum" to="/forum">
                                   <div className={"navActionItem"}>Forum</div>
                               </Nav.Link>
                           </Nav.Item>

                           <Nav.Item>
                               <Nav.Link eventKey={3} componentClass={Link} href="/marketShare" to="/marketShare" >
                                   <div className={"navActionItem"}>캠페인</div>
                               </Nav.Link>
                           </Nav.Item>



                           {writeNewPostNavButton}

                           {alarmButton}

                           <Nav.Item>
                               <Nav.Link eventKey={3} componentClass={Link} href="/profile" to="/profile" >
                                   <div className={"navActionItem"}>프로필 <img src={userIcon}/></div>
                               </Nav.Link>
                           </Nav.Item>

                           <Nav.Item>
                               <Nav.Link eventKey={3} componentClass={Link} href="/basket" to="/basket" >
                                   <div className={"navActionItem"}>
                                       <div>장바구니</div>
                                       {this.renderCartItemCount()}
                                       <img src={basket}/>
                                   </div>
                               </Nav.Link>
                           </Nav.Item>

                           {managementNavButton}

                       </div>
                   </div>

                   <Switch>
                       <Route path="/" component={Home} exact />
                       <Route path="/Forum" component={Forum}/>
                       <Route path="/MarketShare" component={MarketShare}/>
                       <Route path="/Alarm" component={Alarm}/>
                       <Route path="/Profile" component={Profile}/>
                       <Route path="/UserProfile" component={UserProfile}/>
                       <Route path="/Basket" component={Basket}/>
                       <Route path="/Manager" component={Manager}/>
                       <Route path="/InfluencerFeedDetail" component={InfluencerFeedDetail}/>
                       <Route path="/ProductDetailView" component={ProductDetailView}/>
                       <Route path="/Order" component={Order}/>
                       <Route path="/SignUp" component={SignUp}/>
                       <Route path="/writenewpost" component={WriteNewPost}/>
                       <Route path="/OrderConfirm" component={OrderConfirm}/>
                       <Route path="/LogInPage" component={LogInPage}/>
                       <Route path="/Pay" component={Pay}/>
                       <Route path={"/LoftLoginInfo"} component={LoftLoginInfo}/>
                       <Route path={"/ped"} component={ProductDetailEditView}/>
                       <Route path={"/product"} component={ProductView}/>
                       <Route path={"/fe"} component={FeedEditView} />
                       <Route component={Error}/>
                   </Switch>


               </div>

           </BrowserRouter>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        notificationCount: state.notification.count,
        cartItemCount: state.cart.count,
        myInfo: state.stella.myInfo
    }
};

let mapDispatchToProps = (dispatch) => {
    return{
        setNotificationCount: () => dispatch(setCount()),
        setCartItemCount: () => dispatch(setCartItemCount()),
        getMyInfo: () => dispatch(getMyInfo())

    }
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App;
