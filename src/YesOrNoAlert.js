import React, {Component} from "react";
import "./js/components/AlertMessage.css";


class YesOrNoAlert extends Component {
    constructor(props) {
        super(props)
        this.state = {messages: ""}
        this.renderMessages = this.renderMessages.bind(this)

        this.renderMessages()
    }

    componentDidMount() {
        this.renderMessages()
    }

    renderMessages() {

        const array = this.props.messages


        let alertMessages = []

        array.forEach((i) => {
            const message = <div key={i}><p>{i}</p></div>
            alertMessages.push(message)
        });

        this.setState({
            messages: alertMessages
        })

    }


    render() {

        return(
            <div className="alertBackGroundBody">

                <div className="alertMessageBackground" onClick={this.props.closeAlert}/>

                <div className="messageContainer">
                    <div className="alertMessageContainer">
                        <div className="alertTitle"><h4>{this.props.alertTitle}</h4></div>
                        <div className="alertMessage">{this.state.messages}</div>
                    </div>
                    <div className={"yesNoWrapper"}>
                        <div className="alterCloseButton" onClick={this.props.yes}><a>네</a></div>
                        <div className="alterCloseButton" onClick={this.props.no}><a>아니요</a></div>
                    </div>

                </div>
            </div>

        );
    }
}

export default YesOrNoAlert;
