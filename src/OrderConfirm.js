import React, {Component} from "react";
import { withRouter} from "react-router-dom";
import Footer from "./Footer";

class OrderConfirm extends Component {
    constructor(props) {
        super(props)

        this.continueShoppingClicked = this.continueShoppingClicked.bind(this)

    }


    componentDidMount() {
        window.scrollTo(0, 0)
    }


    continueShoppingClicked() {
        let path = '/';
        this.props.history.push({
            pathname: path,

        })

    }

    render() {
        return (
            <div>
                <div className={"basketBody"}>
                    <div className={"orderProcess"}>
                        <div className={"basketTitle"}>결제 완료</div>
                        <div className={"orderStepWrapper"}>
                            <div className={"orderStep"}>장바구니<img src={require("./image/arrowNext.png")}/></div>
                            <div className={"orderStep"} >주문 / 결제<img src={require("./image/arrowNext.png")}/></div>
                            <div className={"orderStep"} style={{fontWeight: "bold"}}>결제 완료</div>
                        </div>
                    </div>

                    <div className={"orderCompletedMessage"}><img src={require("./image/checkCircle.png")}/><a>주문이 완료 되었습니다</a></div>
                    <div className={"continueShopping"} onClick={this.continueShoppingClicked}>Continue Shopping</div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default withRouter(OrderConfirm);