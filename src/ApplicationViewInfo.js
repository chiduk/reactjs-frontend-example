import React, {Component} from "react";
import "./js/components/ApplicationInfoView.css";

class ApplicationViewInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userID: this.props.userID,
            applicationType: this.props.applicationType,
            applicationInfo: ""
        }

        this.closeView = this.closeView.bind(this)
        this.getApplicationInfo = this.getApplicationInfo.bind(this)
        this.checkBusinessNumber = this.checkBusinessNumber.bind(this)
        this.socialMediaLinkClicked = this.socialMediaLinkClicked.bind(this)
    }

    componentWillMount() {

        //console.log("application type" + this.props.applicationType)
        this.getApplicationInfo(this.props.application, this.props.applicationType)

    }

    getApplicationInfo(id, type) {

        let dummyDataCompany = {
            userID: id,
            userName: "chimansong",
            lastName: "송",
            firstName: "치만",
            phoneNumber: "010-6296-9323",
            emailAddress: "chimansong@gmail.com",
            companyName: "지엠에스",
            companyPhoneNumber: "02-456-1234",
            address: "서울시 강남구 율현동 252-5",
            shippingCenterAddress: "경기도 광주시 직동 86-2",
            businessRegistrationNumber: "573-81-00958",

            bank: "우리은행",
            bankNumber: "1234-1233-1234",
            bankHolderName: "도그이어 유한책임회사",
        }


        let dummyDataInfluencer = {
            userID: id,
            userName: "chimansong",
            lastName: "송",
            firstName: "치만",
            emailAddress: "chimansong@gmail.com",
            phoneNumber: "010-6296-9323",
            instaLink: "https://www.instagram.com/chiman_song/",
            youtubeLink: "https://www.youtube.com/channel/UCqky1e199RBUH5A2v-vNt7Q?view_as=subscriber",
            blogLink: "",

            socialNumber: "810314-1111111",

            bank: "우리은행",
            bankNumber: "1234-1233-1234",
            bankHolderName: "도그이어 유한책임회사",
        }

        let info;
        if (type === "seller") {
            info = dummyDataCompany
        } else if (type === "influencer") {
            info = dummyDataInfluencer
        }

        // this.setState({
        //     applicationInfo: info
        // })
    }


    closeView() {
        this.props.closeView()
    }

    checkBusinessNumber(number) {

        var url = "http://www.ftc.go.kr/bizCommPop.do?wrkr_no="+ number;
        window.open(url, "bizCommPop", "width=750, height=700;");

    }

    socialMediaLinkClicked(url) {
        window.open(url, "", "width=750, height=700;");
    }

    render() {

        let content;
        let i = this.props.application;

        if (this.props.applicationType === "seller") {

            content = <div className={"applicationTableContainer"}>

                <table>
                    <tbody>
                        <tr>
                            <td><div>userID</div></td>
                            <td><div>{i.userId}</div></td>
                        </tr>

                        {/*<tr>*/}
                        {/*    <td><div>userName</div></td>*/}
                        {/*    <td><div>{i.userName}</div></td>*/}
                        {/*</tr>*/}

                        <tr>
                            <td><div>성명</div></td>
                            <td><div>{i.lastName}{i.firstName}</div></td>
                        </tr>

                        <tr>
                            <td><div>전화번호</div></td>
                            <td><a href={`tel:${i.phoneNumber}`}>{i.phoneNumber}</a></td>
                        </tr>


                        <tr>
                            <td><div>사업자 등록번호</div></td>
                            <td><div className={"infoLink"} onClick={() => this.checkBusinessNumber(i.sellerApplication.businessRegistrationNumber)} link={i.sellerApplication.businessRegistrationNumber}>{i.sellerApplication.businessRegistrationNumber}</div></td>
                        </tr>

                        <tr>
                            <td><div>회사명</div></td>
                            <td><div>{i.sellerApplication.sellerName}</div></td>
                        </tr>

                        <tr>
                            <td><div>이메일 주소</div></td>
                            <td><a href={`mailto:${i.email}`}>{i.email}</a></td>
                        </tr>

                        <tr>
                            <td><div>회사 전화 번호</div></td>
                            <td><a href={`tel:${i.sellerApplication.cellPhoneNumber}`}>{i.sellerApplication.cellPhoneNumber}</a></td>
                        </tr>

                        <tr>
                            <td><div>사업지 주소</div></td>
                            <td><div>{i.sellerApplication.businessAddress}</div></td>
                        </tr>

                        <tr>
                            <td><div>배송지 주소</div></td>
                            <td><div>{i.sellerApplication.shippingAddress}</div></td>
                        </tr>

                        <tr>
                            <td><div>정산 입금 은행 정보</div></td>
                            <td>
                                <div>{i.sellerApplication.bankName}, {i.sellerApplication.sellerName}</div>
                                <div>{i.sellerApplication.bankAccountNumber}</div>
                            </td>
                        </tr>
                    </tbody>

                </table>

            </div>

        } else if (this.state.applicationType === "influencer") {


            content = <div className={"applicationTableContainer"}>

                <table>
                    <tbody>
                    <tr>
                        <td>userID</td>
                        <td><div>{i.userId}</div></td>
                    </tr>

                    {/*<tr>*/}
                    {/*    <td><div>userName</div></td>*/}
                    {/*    <td><div>{i.userName}</div></td>*/}
                    {/*</tr>*/}

                    <tr>
                        <td><div>성명</div></td>
                        <td><div>{i.lastName}{i.firstName}</div></td>
                    </tr>

                    <tr>
                        <td><div>이메일주소</div></td>
                        <td><a href={`mailto:${i.email}`}>{i.email}</a></td>
                    </tr>

                    <tr>
                        <td><div>전화번호</div></td>
                        <td><a href={`tel:${i.influencerApplication.cellPhoneNumber}`}>{i.influencerApplication.cellPhoneNumber}</a></td>
                    </tr>

                    <tr>
                        <td><div>인스타 링크</div></td>
                        <td><div className={"infoLink"}
                               // href={i.instaLink}
                            onClick={() => this.socialMediaLinkClicked(i.instagram)}
                        >{i.instagram}</div></td>
                    </tr>

                    <tr>
                        <td><div>유투브 링크</div></td>
                        <td><div className={"infoLink"}
                                 // href={i.youtubeLink}
                                 onClick={() => this.socialMediaLinkClicked(i.youtube)}
                        >{i.youtube}</div></td>
                    </tr>

                    <tr>
                        <td><div>블로그 링크</div></td>
                        <td><div className={"infoLink"}
                                 // href={i.blogLink}
                                 onClick={() => this.socialMediaLinkClicked(i.blog)}
                        >{i.blog}</div></td>
                    </tr>

                    <tr>
                        <td><div>주민번호</div></td>
                        <td><div>{i.influencerApplication.personalIDNumber}</div></td>
                    </tr>

                    <tr>
                        <td><div>정산 입금 은행 정보</div></td>
                        <td>
                            <div>{i.influencerApplication.bankName}, {i.lastName + i.firstName}</div>
                            <div>{i.influencerApplication.bankAccountNumber}</div>
                        </td>
                    </tr>

                    </tbody>

                </table>

            </div>

        }


            return (
            <div>
                <div className={"whiteBlurBackGround "} onClick={this.closeView}></div>

                <div className={"applicationInfoContainer myShadowStyle"}>
                        {content}

                    <div className={"closeView"} onClick={this.closeView}>닫기</div>
                </div>

            </div>
        );
    }
}

export default ApplicationViewInfo;