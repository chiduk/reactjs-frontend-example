import React, { Component } from "react";
import { withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {order} from './actions/cart';
import {isMobile} from "./util/Constants";

class Pay extends Component{
    constructor(props){
        super(props)


    }

    componentDidMount() {


        console.log(this.props)

        this.setState({nicepayBody: this.props.nicepayBody}, () => {
            console.log('component did mount')

            if(isMobile()){
                window.eval(window.goPay())
            }else{
                window.eval(window.nicepayStart())
            }

        })

    }


    renderPage = () => {
        return {__html: this.props.nicepayBody}
    };

    render() {

        return(
            <div style={{height: "100vh"}}>
                <div dangerouslySetInnerHTML={this.renderPage()}/>
            </div>

        )
    }
}

let mapDispatchToProps = (dispatch) => {
    return{
        order: (params) => dispatch(order(params))
    }
};

let mapStateToProps = (state) => {


    return {
        nicepayBody: state.cart.nicepayBody
    }
};

Pay = connect(mapStateToProps, mapDispatchToProps)(Pay);

export default withRouter(Pay)

