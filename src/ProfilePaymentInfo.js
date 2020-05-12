import React, { Component } from "react";
import "./js/components/ProfilePage.css";

class ProfilePaymentInfo extends  Component {
    constructor(props) {
        super(props)

    }

    render() {
        return (
            <div className={"tapView"}>
                <a>Payment Info</a>
            </div>
        );
    }
}

export default ProfilePaymentInfo;