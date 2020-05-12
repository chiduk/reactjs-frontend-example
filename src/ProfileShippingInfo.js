import React, { Component } from "react";
import "./js/components/ProfilePage.css";
import {getAddress, deleteAddress} from "./actions/user";
import {connect} from "react-redux";
import {getUniqueId} from "./util/Constants";

class ProfileShippingInfo extends  Component {
    constructor(props) {
        super(props)

        this.state = {
            addressList:[],
            alert: null,
            edit: null
        }

        this.addAddressClicked = this.addAddressClicked.bind(this)
        this.editClicked = this.editClicked.bind(this)
        this.deleteClicked = this.deleteClicked.bind(this)

        this.props.getAddress();
    }

    addAddressClicked() {
        this.props.openAddressAddView(null)
    }

    editClicked(content, addressId, isDefaultAddress) {
        content.addressId = addressId;
        content.isDefaultAddress = isDefaultAddress;
        this.props.toggleAddressEditor(content)
    }

    deleteClicked(addressId) {

        if(window.confirm('주소를 삭제 하시겠습니까?')) {
            let params = {
                uniqueId: getUniqueId(),
                addressId: addressId
            };

            this.props.deleteAddress(params);
        }

    }

    render() {
        return (
            <div className={"addressControl"}>

                <div className={"addAddress"} onClick={this.addAddressClicked}>
                    <img src={require('./image/plusButton.png')}/>
                    <a className={"addAddressText"}>배송지 등록</a>
                </div>

                {this.props.addresses.map((i, index) => {

                    let defaultAddressState;
                    if (i.isDefaultAddress) {
                        defaultAddressState = <div className={"addressHeaderItem defaultAddressState"}><a>기본 배송지</a></div>
                    }

                    let content = {
                        isDefaultAddress: i.isDefaultAddress,
                        addressName: i.content.addressName,
                        roadAddress: i.content.roadAddress,
                        jibunAddress: i.content.jibunAddress,
                        addressDetail: i.content.addressDetail,
                        zonecode: i.content.zonecode,
                        receiverName: i.content.receiverName,
                        phoneNumber: i.content.phoneNumber
                    }

                    return (
                        <div className={"shippingDestinationItem"}>
                            <div className={"addressHeaderWrap"}>
                                <div className={"addressHeaderItem addressTitle"}><a>{i.content.addressName}</a></div>
                                {defaultAddressState}
                                <div className={"addressHeaderItem addressHeaderRight"}>
                                    <div className={"addressEditButton"} onClick={() => this.editClicked(content, true)} ><a>수정</a></div>
                                    <div className={"addressEditButton"} onClick={() => this.deleteClicked(i.addressId)} ><a>삭제</a></div>
                                </div>
                            </div>

                            <div className={"addressInfo"}>
                                <div><a className={"addressComponent"}>도로명 주소: {i.content.roadAddress}</a></div>
                                <div><a className={"addressComponent"}>지번 주소: {i.content.jibunAddress}</a></div>
                                <div><a className={"addressComponent"}>상세 주소: {i.content.addressDetail}</a></div>
                                <div><a className={"addressComponent"}>우편번호: {i.content.zonecode}</a></div>
                            </div>

                            <div className={"addressInfo"}>
                                <a>전화번호 : {i.content.phoneNumber}</a>
                            </div>

                            <div className={"addressInfo"}>
                                <a>수령인 : {i.content.receiverName}</a>
                            </div>

                        </div>
                    );
                })}
                {this.state.alert}
                {this.state.edit}
            </div>
        );
    }
}


let mapDispatchToProps = (dispatch) => {
    return {
        getAddress: () => dispatch(getAddress()),
        deleteAddress: (params) => dispatch(deleteAddress(params))
    }
};

let mapStateToProps = (state) => {
    return {
        addresses: state.user.addresses
    }
};

ProfileShippingInfo = connect(mapStateToProps, mapDispatchToProps)(ProfileShippingInfo);

export default ProfileShippingInfo;