import React, {Component} from "react";
import "./js/components/Footer.css";

class Footer extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        return (
            <div className={"footerBody"}>
                <div className={"innerFooterBody"}>

                    <div className={"footerLogoContainer"}>
                        <img src={require("./image/earnitLogo.png")}/>
                    </div>

                    <div className={"footerInformationWrapper"}>
                        <div className={"footerInfoElement"}>
                            상호명: (주)큐브릭코퍼레이션
                        </div>

                        <div className={"footerInfoElement"}>
                            대표: 김정호
                        </div>

                        <div className={"footerInfoElement"}>
                            개인정보관리책임자: 김정호
                        </div>

                        <div className={"footerInfoElement"}>
                            사업자등록번호: 474-86-01280
                        </div>

                        <div className={"footerInfoElement"}>
                            통신판매업신고번호: 제2019-서울서초-1482호
                        </div>

                        <div className={"footerInfoElement"}>
                            소재지: 서울시 서초구 잠원동 9-4 유영빌딩 5층
                        </div>

                        <div className={"footerInfoElement"}>
                            대표 전화: 070-4640-7045
                        </div>

                        <div className={"footerInfoElement"}>
                            이메일:  kjh8403@kubrickcorp.com
                        </div>

                        <div className={"footerInfoElement"}>
                            COPYRIGHT © KUBRIC CORP ALL RIGHTS RESERVED.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;