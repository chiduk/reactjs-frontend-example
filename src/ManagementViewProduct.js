import React, { Component } from "react";
import "./js/components/Manager.css";
import {connect} from "react-redux";
import {getSellerProduct} from "./actions/manager";

const min = 150;
// The max (fr) values for grid-template-columns
const columnTypeToRatioMap = {
    numeric: 1,
    'text-short': 1.67,
    'text-long': 3.33,
};

const table = document.querySelector('table');
/*
  The following will soon be filled with column objects containing
  the header element and their size value for grid-template-columns
*/
const columns = [];
let headerBeingResized;

class ManagementViewProduct extends Component {
    constructor(props) {
        super(props)

        this.state = {
            productList : []
        }

        this.props.getSellerProduct()
    }


    requestAnimationFrame(e) {
        console.log(e.clientX)
        const horizontalScrollOffset = document.documentElement.scrollLeft;
        console.log("horizonstal scroll" + horizontalScrollOffset)

    }

    openEditView = (productId) => {
        localStorage.setItem('forwardProductId', productId)
        window.open('/ped')

    }

    render() {
        return (
            <div className={"productManagementView"}>
                <table className={"productManagementTable"}>
                    <thead>
                        <tr>
                            <th data-type="numeric">상품 ID<span className="resize-handle" onMouseMove={(e) => this.requestAnimationFrame(e)}/></th>
                            <th data-type="text-long">상품명<span className="resize-handle"/></th>
                            <th data-type="text-long">판매사<span className="resize-handle"/></th>
                            <th data-type="text-long">판매사 ID<span className="resize-handle"/></th>
                            <th data-type="text-long">판매 옵션<span className="resize-handle"/></th>
                            <th data-type="text-long">정상 판매가<span className="resize-handle"/></th>
                            <th data-type="text-long">할인율<span className="resize-handle"/></th>
                            <th data-type="text-long">할인 판매가<span className="resize-handle"/></th>
                            <th data-type="text-long">재고 현황<span className="resize-handle"/></th>
                            <th data-type="text-long">제조국<span className="resize-handle"/></th>
                            <th data-type="text-long">출고지<span className="resize-handle"/></th>
                        </tr>
                    </thead>

                    <tbody>

                    {this.props.products.map((seller, index) => {
                        return (
                            <tr>
                                <td >
                                    <div className={"productCellID"}>
                                        <div><a>{seller.product.productUID}</a></div>
                                        <div className="toolTipText" onClick={() => this.openEditView(seller.product.productId)}><a>정보 수정 클릭</a></div>
                                    </div>
                                </td>

                                <td>{seller.product.title}</td>
                                <td>{seller.sellerName}</td>
                                <td>{seller.sellerUID}</td>
                                <td>{seller.product.options} 가지</td>
                                <td>{(seller.product.currency === 'KRW') ? "₩" : "₩"}{parseInt(seller.product.price).toLocaleString()}</td>
                                <td>{seller.product.discountRate}%</td>
                                <td>{(seller.product.currency === 'KRW') ? "₩" : "₩"}{(seller.product.price * (1 - seller.product.discountRate / 100)).toLocaleString()}</td>
                                <td>{seller.product.totalInventory}</td>
                                <td>{seller.origin}</td>
                                <td>{seller.warehouse}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

let mapStateToProps = (state) => {


    return {
        products: state.manager.sellerProducts
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        getSellerProduct: () => dispatch(getSellerProduct())
    }
};


ManagementViewProduct = connect(mapStateToProps, mapDispatchToProps)(ManagementViewProduct)

export default ManagementViewProduct;