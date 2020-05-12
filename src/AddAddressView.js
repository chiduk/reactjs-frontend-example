import React, { Component } from "react";
import "./js/components/AddAddress.css";
import {saveAddress} from "./actions/user";
import {connect} from "react-redux";
import {getUniqueId} from "./util/Constants";

class AddAddressView extends Component {
    constructor(props) {
        super(props)

        this.state ={
            addressName: "",
            roadAddress:'',
            jibunAddress:'',
            addressDetail: "",
            zonecode:"",
            receiverName:"",
            receiverPhoneNumber: "",
            loaded: false,
            isDefaultAddress: false
        }
        this.addressInputChange = this.addressInputChange.bind(this)



    }

    componentDidMount() {
        //this.setAddressFromProps()

        console.log(this.props)

        if(this.props.editInfo){

            let content = this.props.content

            console.log(content)

            this.setState({
                addressName: content.addressName,
                roadAddress: content.roadAddress,
                jibunAddress: content.jibunAddress,
                addressDetail: content.addressDetail,
                zonecode: content.zonecode,
                receiverName: content.receiverName,
                receiverPhoneNumber:content.phoneNumber,
                loaded: false,
                isDefaultAddress: (this.props.content.isDefaultAddress === undefined) ? false : this.props.content.isDefaultAddress
            })
        }

    }

    setAddressFromProps() {

        if (this.props.content === null) {

        } else {
            this.setState({
                isDefaultAddress: (this.props.content.isDefaultAddress === undefined) ? false : this.props.content.isDefaultAddress,
                addressName: (this.props.content.addressName === undefined) ? '' : this.props.content.addressName,
                roadAddress: this.props.content.roadAddress,
                jibunAddress: this.props.content.jibunAddress,
                addressDetail: (this.props.content.addressDetail === undefined) ? '' : this.props.content.addressDetail,
                zonecode: this.props.content.zonecode,
                receiverName: (this.props.content.receiverName === undefined) ? '' : this.props.content.receiverName,
                receiverPhoneNumber: (this.props.content.phoneNumber === undefined) ? '' : this.props.content.phoneNumber
            })
        }

    }


    addressInputChange(event) {

        const id = event.target.getAttribute('id');

        if (id === "addressNameID") {
            this.setState({addressName: event.target.value})
        } else if (id === "roadAddress") {
            this.setState({roadAddress: event.target.value})
        }else if( id === "jibunAddress"){
            this.setState({jibunAddress: event.target.value})
        } else if (id === "districID") {
            this.setState({district: event.target.value})
        } else if (id === "townID") {
            this.setState({town: event.target.value})
        } else if (id === "addressDetailID") {
            this.setState({addressDetail: event.target.value})
        } else if (id === "postCodeID") {
            this.setState({zonecode: event.target.value})
        } else if (id === "receiverNameID") {
            this.setState({receiverName: event.target.value})
        } else if (id === "receiverPhoneNumberID") {
            this.setState({receiverPhoneNumber: event.target.value})
        }

    }

    saveAddress = () => {
        if(this.state.addressName.trim().length === 0){
            alert('배송지 이름을 입력하세요.');
            return;
        }else if(this.state.receiverName.trim().length === 0){
            alert('수령인 성함을 입력하세요.');
            return;
        }else if(this.state.receiverPhoneNumber.trim().length === 0){
            alert('수령인 전화번호를 입력하세요.');
            return;
        }


        let params = {
            uniqueId: getUniqueId(),
            addressId: this.props.content.addressId,
            isDefaultAddress: this.state.isDefaultAddress,

            content: {

                addressName: this.state.addressName.trim(),
                roadAddress: this.state.roadAddress.trim(),
                jibunAddress: this.state.jibunAddress.trim(),
                addressDetail: this.state.addressDetail.trim(),
                zonecode: this.state.zonecode.trim(),
                receiverName: this.state.receiverName.trim(),
                phoneNumber : this.state.receiverPhoneNumber.trim()
            }
        };

        this.props.saveAddress(params, (addressId) => {
            console.log(addressId)

            params.addressId = addressId
            this.props.closeView(true, params);
        });
    };

    defaultAddresCheckboxClicked = () => {
        this.setState({isDefaultAddress: !this.state.isDefaultAddress})
    }

    popUpDaumAddress = () => {

        let self = this;

        new window.daum.Postcode({
            onComplete: function (data) {

                self.setState({
                    roadAddress: data.roadAddress,
                    jibunAddress: data.jibunAddress,
                    addressDetail: "",
                    zonecode: data.zonecode
                })
            }
        }).open()

    }

    render() {

        return(
            <div>
                <div className={"addAddressBackGround"} />

                <div className={"addAddressBody"}>
                    <div className={"addressEditCloseButton"} onClick={this.props.closeView} ><a>close X</a></div>
                    <div className={"addressCard"}>
                        <div><input className={"defaultAddressCheckbox"} id={"defaultAddressCheckboxId"} type={"checkBox"} checked={this.state.isDefaultAddress} onChange={this.defaultAddresCheckboxClicked}/> <label htmlFor={"defaultAddressCheckboxId"} className={"defaultAddressCheckboxLabel"}>기본 배송지로 지정</label></div>
                        <div><input className={"addressInput"} id={"addressNameID"} placeholder={"배송지 이름"} onChange={(event) => this.addressInputChange(event)} value={this.state.addressName}/></div>

                        <div>
                            <input className={"addressInput"}
                                   id={"roadAddress"}
                                   placeholder={"도로명 주소"}
                                   onClick={()=>this.popUpDaumAddress()}
                                // onChange={(event) => this.addressInputChange(event)}
                                   value={this.state.roadAddress}
                            />
                        </div>

                        <div>
                            <input className={"addressInput"}
                                   id={"jibunAddress"}
                                   placeholder={"지번 주소"}
                                   onClick={()=>this.popUpDaumAddress()}
                                // onChange={(event) => this.addressInputChange(event)}
                                   value={this.state.jibunAddress}
                            />
                        </div>

                        <div><input className={"addressInput"} id={"addressDetailID"} placeholder={"주소 상세"} onChange={(event) => this.addressInputChange(event)} value={this.state.addressDetail}/></div>
                        <div>
                            <input className={"addressInput"}
                                   type={"number"}
                                   id={"postCodeID"}
                                   placeholder={"우편 번호"}
                                // onChange={(event) => this.addressInputChange(event)}
                                   onClick={()=>this.popUpDaumAddress()}
                                   value={this.state.zonecode}
                            />
                        </div>
                        <div><input className={"addressInput"} id={"receiverNameID"} placeholder={"수령인 성함"} onChange={(event) => this.addressInputChange(event)} value={this.state.receiverName}/></div>
                        <div><input className={"addressInput"}  id={"receiverPhoneNumberID"} placeholder={"수령인 전화번호"} onChange={(event) => this.addressInputChange(event)} value={this.state.receiverPhoneNumber}/></div>

                        <div className={"addressSave"}>
                            <div className={"saveAddress cancelAddressButton"} onClick={this.props.closeView}><a>취소</a></div>
                            <div className={"saveAddress saveAdressButton"} onClick={this.saveAddress}><a>저장</a></div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        saveAddress: (params, callback) => dispatch(saveAddress(params, callback))
    }
};

let mapStateToProps = (state) => {
    return {
        addresses: state.user.addresses
    }
};

AddAddressView = connect(mapStateToProps, mapDispatchToProps)(AddAddressView);

export default AddAddressView;