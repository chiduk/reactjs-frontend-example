import React, {Component} from "react";
import ApplicationViewInfo from "./ApplicationViewInfo";
import "./js/components/ApplicationInfoView.css";
import {connect} from "react-redux";
import {
    approveInfluencer,
    approveSeller, blockUser, activateUser,
    cancelInfluencer,
    cancelSeller,
    denyInfluencer,
    denySeller,
    getApplication, searchUser
} from "./actions/manager";
import {utcToLocal, SEARCH_USER_TYPE, getUniqueId} from "./util/Constants";
import AlertMessage from "./AlertMessage";


const userData = [

]

class ManagementViewUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userList: userData,
            searchType: "All",
            applicationInfoView: null,
            isApproveButtonOpenArray: [],
            isActiveOpenArray: [],
            alertMessage: '',
            searchUserType: SEARCH_USER_TYPE.ALL,
            userId: ''

        }

        this.searchTypeClicked = this.searchTypeClicked.bind(this)
        this.selectButtonClicked = this.selectButtonClicked.bind(this)
        this.approveClicked = this.approveClicked.bind(this)
        this.approveButtonClicked = this.approveButtonClicked.bind(this)
        this.viewApplicationInfo = this.viewApplicationInfo.bind(this)
        this.closeInfoView = this.closeInfoView.bind(this)

        this.props.getApplication()
    }


    searchTypeClicked() {
        const element = document.getElementById("manageUserSearArrowID")
        element.classList.toggle("arrowDown")

        const buttonElement = document.getElementById("searchTypeSelectButtonContainerID")
        buttonElement.classList.toggle("selectButtonGrow")

    }

    selectButtonClicked(type) {
        this.setState({searchType: type})

        if(type === 'All'){
            this.setState({searchUserType: SEARCH_USER_TYPE.ALL}, () => {
                let params = {
                    uniqueId: getUniqueId(),
                    userId: this.state.userId,
                    userType: this.state.searchUserType
                };

                console.log(this.state.userId)

                if(this.state.userId.length <= 0){
                    console.log('ALL APPLICATIONS')
                    this.props.getApplication()
                }else{
                    this.props.searchUser(params)
                }


            })
        }else if(type === '판매자'){
            this.setState({searchUserType: SEARCH_USER_TYPE.SELLER},() => {
                let params = {
                    uniqueId: getUniqueId(),
                    userId: this.state.userId,
                    userType: this.state.searchUserType
                };

                this.props.searchUser(params)
            })
        }else if(type === '인플루언서'){
            this.setState({searchUserType: SEARCH_USER_TYPE.INFLUENCER}, () => {
                let params = {
                    uniqueId: getUniqueId(),
                    userId: this.state.userId,
                    userType: this.state.searchUserType
                };

                this.props.searchUser(params)
            })
        }else if(type === '구매자'){
            this.setState({searchUserType: SEARCH_USER_TYPE.BUYER}, () => {
                let params = {
                    uniqueId: getUniqueId(),
                    userId: this.state.userId,
                    userType: this.state.searchUserType
                };

                this.props.searchUser(params)
            })
        }



    }

    openActivateContainer(applicationId){

        let filteredArrays = this.state.isActiveOpenArray.filter(x => x.applicationId === applicationId)

        if(filteredArrays.length > 0){
            let index = this.state.isActiveOpenArray.indexOf(filteredArrays[0])

            if(index !== -1){

                filteredArrays[0].isActiveOpen = !filteredArrays[0].isActiveOpen;


                let newArray = [];

                this.state.isActiveOpenArray.forEach((elem, arrayIndex) => {
                    if(arrayIndex === index){
                        newArray.push(filteredArrays[0])
                    }else{
                        newArray.push(elem)
                    }
                })

                this.setState({isActiveOpenArray : newArray})

            }
        }else{
            let obj = {
                applicationId: applicationId,
                isActiveOpen: false
            }

            this.state.isActiveOpenArray.push(obj);

        }
    }

    renderActivateBox = (applicationId) => {

        let isOpen = false;



        let filteredArrays = this.state.isActiveOpenArray.filter(x => x.applicationId === applicationId)

        if(filteredArrays.length > 0){


            let index = this.state.isActiveOpenArray.indexOf(filteredArrays[0])

            if(index !== -1){

                isOpen = filteredArrays[0].isActiveOpen
            }


        }else{
            let obj = {
                applicationId: applicationId,
                isActiveOpen: false
            }

            this.state.isActiveOpenArray.push(obj);
            isOpen = false;


        }


        let filteredApplications = this.props.applications.filter(x => x.applicationId === applicationId)

        if(filteredApplications.length > 0){


            if(filteredApplications[0].isActive){
                return(
                    <div className={`approveButtonListContainer ${isOpen ? "approveContainerOpen" : "approveContainerClose"}`}>

                        <div className={"approveButton"}  onClick={() => this.activateButtonClicked("block", applicationId)}><a>차단</a></div>
                    </div>
                )
            }else{
                return(
                    <div className={`approveButtonListContainer ${isOpen ? "approveContainerOpen" : "approveContainerClose"}`}>
                        <div className={"approveButton"} onClick={() => this.activateButtonClicked("active", applicationId)}><a>활성화</a></div>
                    </div>
                )
            }


        }
    }

    openApproveButtonContainer(applicationId) {


        let filteredArrays = this.state.isApproveButtonOpenArray.filter(x => x.applicationId === applicationId)

        if(filteredArrays.length > 0){
            let index = this.state.isApproveButtonOpenArray.indexOf(filteredArrays[0])

            if(index !== -1){



                filteredArrays[0].isApproveButtonOpen = !filteredArrays[0].isApproveButtonOpen;


                let newArray = [];

                this.state.isApproveButtonOpenArray.forEach((elem, arrayIndex) => {
                    if(arrayIndex === index){
                        newArray.push(filteredArrays[0])
                    }else{
                        newArray.push(elem)
                    }
                })

                this.setState({isApproveButtonOpenArray : newArray})

            }
        }else{
            let obj = {
                applicationId: applicationId,
                isApproveButtonOpen: false
            }

            this.state.isApproveButtonOpenArray.push(obj);

        }
    }

    renderApproveBox = (applicationId) => {



        let isOpen = false;

        let filteredArrays = this.state.isApproveButtonOpenArray.filter(x => x.applicationId === applicationId)

        if(filteredArrays.length > 0){


            let index = this.state.isApproveButtonOpenArray.indexOf(filteredArrays[0])

            if(index !== -1){

                isOpen = filteredArrays[0].isApproveButtonOpen
            }


        }else{
            let obj = {
                applicationId: applicationId,
                isApproveButtonOpen: false
            }

            this.state.isApproveButtonOpenArray.push(obj);
            isOpen = false;
        }


        let filteredApplications = this.props.applications.filter(x => x.applicationId === applicationId)

        if(filteredApplications.length > 0){

            if(Object.keys(filteredApplications[0].influencerApplication).length === 0 && Object.keys(filteredApplications[0].sellerApplication).length === 0){

                return []
            }


            if(Object.keys(filteredApplications[0].influencerApplication).length !== 0){
                if(filteredApplications[0].influencerApplication.isApproved){
                    return(
                        <div id={applicationId + 'approveContainerID'} className={`approveButtonListContainer ${isOpen ? "approveContainerOpen" : "approveContainerClose"}`}>
                            <div className={"approveButton"}  onClick={() => this.approveButtonClicked("cancel", applicationId, "apply")}><a>승인 취소</a></div>
                        </div>
                    )


                }else{
                    if(filteredApplications[0].influencerApplication.isDenied){
                        return(
                            <div id={applicationId + 'approveContainerID'} className={`approveButtonListContainer ${isOpen ? "approveContainerOpen" : "approveContainerClose"}`}>
                                <div className={"approveButton"} onClick={() => this.approveButtonClicked("approve", applicationId, "apply")}><a>승인</a></div>
                            </div>
                        )
                    }else{
                        return(
                            <div id={applicationId + 'approveContainerID'} className={`approveButtonListContainer ${isOpen ? "approveContainerOpen" : "approveContainerClose"}`}>
                                <div className={"approveButton"} onClick={() => this.approveButtonClicked("approve", applicationId, "apply")}><a>승인</a></div>
                                <div className={"approveButton"}  onClick={() => this.approveButtonClicked("deny", applicationId, "apply")}><a>승인 거절</a></div>

                            </div>
                        )
                    }


                }
            }

            if(Object.keys(filteredApplications[0].sellerApplication).length !== 0){
                if(!filteredApplications[0].sellerApplication.isApproved){
                    return(
                        <div id={applicationId + 'approveContainerID'} className={`approveButtonListContainer ${isOpen ? "approveContainerOpen" : "approveContainerClose"}`}>

                            <div className={"approveButton"} onClick={() => this.approveButtonClicked("approve", applicationId, "apply")}><a>승인</a></div>
                            <div className={"approveButton"}  onClick={() => this.approveButtonClicked("deny", applicationId, "apply")}><a>승인 거절</a></div>



                        </div>
                    )
                }else{
                    return(
                        <div id={applicationId + 'approveContainerID'} className={`approveButtonListContainer ${isOpen ? "approveContainerOpen" : "approveContainerClose"}`}>

                            <div className={"approveButton"}  onClick={() => this.approveButtonClicked("cancel", applicationId, "apply")}><a>승인 취소</a></div>
                        </div>
                    )
                }
            }

        }


    };

    approveClicked(index, text, from) {
        if (from === "apply") {
            let object = Object.assign([], this.state.userList);
            object[index].isApproved = text
            this.setState({userList: object})
        } else {
            let object = Object.assign([], this.state.userList);
            object[index].userStatus = text
            this.setState({userList: object})
        }
    }

    activateButtonClicked = (name, applicationId) => {

        console.log(name, applicationId)


        let filteredArrays = this.props.applications.filter(x => x.applicationId === applicationId)


        if(filteredArrays.length > 0){
            let uniqueId = filteredArrays[0].uniqueId



            if(name === "block"){
                this.props.blockUser(uniqueId, () => {
                    let message = "차단 처리 완료되었습니다.";

                    this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
                })
            }else if(name === "active"){
                this.props.activateUser(uniqueId, () => {
                    let message = "활성화 처리 완료되었습니다.";

                    this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
                })
            }



        }

        let filteredActiveArrays = this.state.isActiveOpenArray.filter(x => x.applicationId === applicationId)



        if(filteredActiveArrays.length > 0){
            let index = this.state.isActiveOpenArray.indexOf(filteredActiveArrays[0])

            if(index !== -1){



                filteredActiveArrays[0].isActiveOpen = !filteredActiveArrays[0].isActiveOpen;


                let newArray = [];

                this.state.isActiveOpenArray.forEach((elem, arrayIndex) => {
                    if(arrayIndex === index){
                        newArray.push(filteredActiveArrays[0])
                    }else{
                        newArray.push(elem)
                    }
                })


                console.log(newArray)

                this.setState({isActiveOpenArray : newArray})

            }
        }else{
            let obj = {
                applicationId: applicationId,
                isActiveOpen: false
            }

            this.state.isActiveOpenArray.push(obj);

        }

    };

    approveButtonClicked(name, applicationId, from) {

        let filteredArrays = this.state.isApproveButtonOpenArray.filter(x => x.applicationId === applicationId)

        if(filteredArrays.length > 0){
            let index = this.state.isApproveButtonOpenArray.indexOf(filteredArrays[0])

            if(index !== -1){



                filteredArrays[0].isApproveButtonOpen = !filteredArrays[0].isApproveButtonOpen;


                let newArray = [];

                this.state.isApproveButtonOpenArray.forEach((elem, arrayIndex) => {
                    if(arrayIndex === index){
                        newArray.push(filteredArrays[0])
                    }else{
                        newArray.push(elem)
                    }
                })

                this.setState({isApproveButtonOpenArray : newArray})

            }
        }else{
            let obj = {
                applicationId: applicationId,
                isApproveButtonOpen: false
            }

            this.state.isApproveButtonOpenArray.push(obj);

        }


        let filteredApplications = this.props.applications.filter(x => x.applicationId === applicationId)



        if(filteredApplications.length > 0){
            if(Object.keys(filteredApplications[0].influencerApplication).length > 0){
                if(name === "approve"){
                    this.props.approveInfluencer(applicationId, () => {
                        let message = "처리 완료되었습니다."
                        this.props.getApplication()
                        this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
                    })
                }else if(name === "deny"){
                    this.props.denyInfluencer(applicationId, () => {
                        let message = "처리 완료되었습니다."
                        this.props.getApplication()
                        this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
                    })
                }else if(name === "cancel"){
                    this.props.cancelInfluencer(applicationId, () => {
                        let message = "처리 완료되었습니다."
                        this.props.getApplication()
                        this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
                    })
                }
            }

            if(Object.keys(filteredApplications[0].sellerApplication).length > 0){
                if(name === "approve"){
                    this.props.approveSeller(applicationId, () => {
                        let message = "처리 완료되었습니다."
                        this.props.getApplication()
                        this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
                    })
                }else if(name === "deny"){
                    this.props.denySeller(applicationId, () => {
                        let message = "처리 완료되었습니다."
                        this.props.getApplication()
                        this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
                    })
                }else if(name === "cancel"){
                    this.props.cancelSeller(applicationId, () => {
                        let message = "처리 완료되었습니다."
                        this.props.getApplication()
                        this.setState({alertMessage: <AlertMessage messages={[message]} closeAlert={this.alertMessageViewToggle} />})
                    })
                }
            }
        }

    }

    closeInfoView() {
        this.setState({
            applicationInfoView: null
        })
    }

    viewApplicationInfo(data, type) {

        this.setState({
            applicationInfoView: <ApplicationViewInfo application={data} applicationType={type} closeView={this.closeInfoView}/>
        })

    }

    alertMessageViewToggle = () => {


        this.setState({alertMessage: ''})
    }

    searchUser = (event) => {


        let userId = event.target.value.trim();
        let userType = this.state.searchUserType;

        this.setState({userId: userId});

        if(userId.length > 0) {

            let params = {
                uniqueId: getUniqueId(),
                userId: userId,
                userType: userType
            }

            this.props.searchUser(params)

        }else{
            this.props.getApplication()
        }
    }


    render() {

        let applications = [];

        this.props.applications.forEach(application => {
            //console.log(application)

            if(this.state.searchUserType === SEARCH_USER_TYPE.INFLUENCER){
                if(Object.keys(application.isInfluencer).length > 0){
                    //console.log('INFLUENCER', application)

                    applications.push(application)
                }
            }else if(this.state.searchUserType === SEARCH_USER_TYPE.SELLER){
                if(Object.keys(application.isSeller).length > 0){
                    //console.log('SELLER', application)

                    applications.push(application)
                }
            }else if(this.state.searchUserType === SEARCH_USER_TYPE.BUYER) {

            }else{
                applications.push(application)
            }
        })


        return(
            <div>
                <div className={"managementSearchSection"}>
                    <div className={"managementUserSearchInput"}><input className={"searchBar"} placeholder={"유저 이름 검색"} value={this.state.userId} onChange={(e) => this.searchUser(e)} /></div>
                    <div onClick={this.searchTypeClicked} className={"managementUserTypeSelectButton"}>
                        <div><a>검색 유저 타입 선택</a>
                            <img id={"manageUserSearArrowID"}
                                 className={"managementUserTypeSelectImg"}
                                 src={require("./image/triangleRed.png")}
                            />
                        </div>
                        <div>
                            <div className={"searchTypeSelectButtonContainer"} id={"searchTypeSelectButtonContainerID"}>
                                <div className={"userTypeButton"} onClick={() => this.selectButtonClicked("All")}><a>All</a></div>
                                <div className={"userTypeButton"} onClick={() => this.selectButtonClicked("판매자")}><a>판매자</a></div>
                                <div className={"userTypeButton"} onClick={() => this.selectButtonClicked("인플루언서")}><a>인플루언서</a></div>
                                {/*<div className={"userTypeButton"} onClick={() => this.selectButtonClicked("구매자")}><a>일반</a></div>*/}
                            </div>
                        </div>

                    </div>
                    <div className={"searchTypeState"}><a> : {this.state.searchType}</a></div>
                </div>
                <table className={"userManagement"}>
                    <thead>
                    <tr>
                        <th data-type="numeric">USER ID<span className="resize-handle"></span></th>
                        <th data-type="text-long">신청 현황<span className="resize-handle"></span></th>
                        {/*<th data-type="text-long">성<span className="resize-handle"></span></th>*/}
                        <th data-type="text-long">이름<span className="resize-handle"></span></th>
                        <th data-type="text-long">유저 타입<span className="resize-handle"></span></th>
                        <th data-type="text-long">전화번호<span className="resize-handle"></span></th>
                        <th data-type="text-long">이메일<span className="resize-handle"></span></th>
                        <th data-type="text-long">회원 가입일<span className="resize-handle"></span></th>
                        {/*<th data-type="text-long">생년월일<span className="resize-handle"></span></th>*/}
                        {/*<th data-type="text-long">성별<span className="resize-handle"></span></th>*/}
                        <th data-type="text-long">회원 관리<span className="resize-handle"></span></th>
                    </tr>
                    </thead>

                    <tbody>

                    {applications.map((user, index) => {



                        let approveButton = () => {

                            if(Object.keys(user.influencerApplication).length !== 0){
                                if(user.influencerApplication.isApproved) {
                                    return '승인 됨'
                                }else{
                                    if(user.influencerApplication.isDenied){
                                        return '승인 거절됨'
                                    }else{
                                        if(!user.influencerApplication.isApproved){
                                            return '승인 대기중'
                                        }
                                    }


                                }
                            }

                            if(Object.keys(user.sellerApplication).length !== 0){
                                if(user.sellerApplication.isApproved){
                                    return '승인 됨'
                                }else{
                                    if(user.sellerApplication.isDenied){
                                        return '승인 거절됨'
                                    }else{
                                        if(!user.sellerApplication.isApproved){
                                            return '승인 대기중'
                                        }
                                    }
                                }
                            }
                        };

                        let cellPhoneNumber = () => {
                            if(Object.keys(user.influencerApplication).length !== 0){
                                return user.influencerApplication.cellPhoneNumber
                            }

                            if(Object.keys(user.sellerApplication).length !== 0){
                                return user.sellerApplication.cellPhoneNumber
                            }
                        };



                        let userType = () => {

                            let userType = ''

                            if(Object.keys(user.influencerApplication).length !== 0){



                                if(user.influencerApplication.isApproved){
                                    userType = '인플루언서'
                                }

                                //return '인플루언서'
                            }

                            if(Object.keys(user.sellerApplication).length !== 0){



                                if(user.sellerApplication.isApproved){
                                    if(userType.length > 0) {
                                        userType += '/셀러'
                                    }else{
                                        userType = '셀러'
                                    }
                                }

                                //return '셀러'
                            }

                            if(userType.length <= 0){
                                userType = '일반'
                            }

                            return userType
                        }

                        let applicationId = () => {
                            if(Object.keys(user.influencerApplication).length !== 0){
                                return user.influencerApplication.applicationId;
                            }

                            if(Object.keys(user.sellerApplication).length !== 0){
                                return user.sellerApplication.applicationId;
                            }
                        }

                        let application = () => {
                            if(Object.keys(user.influencerApplication).length !== 0){
                                return user.influencerApplication;
                            }

                            if(Object.keys(user.sellerApplication).length !== 0){
                                return user.sellerApplication;
                            }
                        };

                        let applicationType = () => {

                            if(Object.keys(user.influencerApplication).length === 0 && Object.keys(user.sellerApplication).length === 0){
                                return 'regular'
                            }

                            if(this.state.searchUserType === SEARCH_USER_TYPE.INFLUENCER){
                                if(Object.keys(user.influencerApplication).length !== 0){
                                    return 'influencer'
                                }

                            }else if(this.state.searchUserType === SEARCH_USER_TYPE.SELLER){
                                if(Object.keys(user.sellerApplication).length !== 0){
                                    return 'seller'
                                }
                            }else{
                                if(Object.keys(user.influencerApplication).length !== 0){
                                    return 'influencer'
                                }

                                if(Object.keys(user.sellerApplication).length !== 0){
                                    return 'seller'
                                }
                            }
                        }


                        let userStatus = 'active';
                        if (user.isActive) {
                            userStatus = "활성화"
                        } else {
                            userStatus = "차단됨"
                        }


                        return (
                            <tr key={index}>
                                <td>
                                    <div className={"click"}>
                                        <div>{user.userId}</div>
                                        <div>
                                            <div className="toolTipText" onClick={(id, type) => {
                                                //localStorage.setItem('forwardUniqueId', user.uniqueId);
                                                window.open('/UserProfile?uid=' + user.uniqueId)
                                            }}>
                                                <span>사용자 정보 보기</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <div className={"userApplyCell"}>
                                        <div className={"click"}>
                                            <div className={"clickable"}>{ (applicationType() === 'influencer') ? '인플루언서' : ((applicationType() === 'seller') ? '셀러' : '')}</div>
                                            <div>

                                                {(applicationType() === 'influencer' || applicationType() === 'seller') ?
                                                    <div className="toolTipText" onClick={(id, type) => this.viewApplicationInfo(user, applicationType())}>

                                                        <span>신청 정보 보기</span>
                                                    </div> : ''}


                                            </div>
                                        </div>

                                        <div className={"approveContainer"}>
                                            <div className={"userApplyApproveButton"} onClick={() => this.openApproveButtonContainer(applicationId(), "apply")}>
                                                <a>{approveButton()}</a>
                                            </div>

                                            <div className={`relavetiveWrapper`}>

                                                {this.renderApproveBox(applicationId())}
                                            </div>


                                        </div>

                                    </div>
                                </td>

                                {/*<td>{user.lastName}</td>*/}
                                <td>{user.firstName}</td>
                                <td>{userType()}</td>
                                <td>{cellPhoneNumber()}</td>
                                <td>{user.email}</td>
                                <td>{utcToLocal(user.date).split(' ')[0]}</td>
                                {/*<td>{user.birthDate}</td>*/}
                                {/*<td>{user.gender}</td>*/}
                                <td>
                                    <div className={"userApplyCell"}>
                                        <div className={"approveContainer"}>
                                            <div className={"userApplyApproveButton"} onClick={() => this.openActivateContainer(applicationId(), "userManager")}>
                                                <a>{userStatus}</a>
                                            </div>

                                            <div>


                                                {this.renderActivateBox(applicationId())}
                                            </div>
                                        </div>
                                    </div>

                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {this.state.applicationInfoView}
                {this.state.alertMessage}
            </div>
        );
    }
}

let mapStateToProps = (state) => {

    return {
        applications: state.manager.applications
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        getApplication: () => dispatch(getApplication()),
        approveInfluencer: (applicationId, callback) => dispatch(approveInfluencer(applicationId, callback)),
        denyInfluencer : (applicationId, callback) => dispatch(denyInfluencer(applicationId, callback)),
        cancelInfluencer: (applicationId, callback) => dispatch(cancelInfluencer(applicationId, callback)),
        approveSeller: (applicationId, callback) => dispatch(approveSeller(applicationId, callback)),
        denySeller: (applicationId, callback) => dispatch(denySeller(applicationId, callback)),
        cancelSeller: (applicationId, callback) => dispatch(cancelSeller(applicationId, callback)),
        blockUser: (uniqueId, callback) => dispatch(blockUser(uniqueId,callback)),
        activateUser: (uniqueId, callback) => dispatch(activateUser(uniqueId, callback)),
        searchUser: (params) => dispatch(searchUser(params))
    }
};

ManagementViewUser = connect(mapStateToProps, mapDispatchToProps)(ManagementViewUser)

export default ManagementViewUser;