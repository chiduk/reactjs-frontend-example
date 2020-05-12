import React, { Component } from "react";
import "./js/components/Alarm.css";
import {getNotificationCount} from "./util/Constants";
import {getNotification, resetCount, setCount} from "./actions/notification";
import {connect} from "react-redux";
import Notification from "./Notification";
import {setCartItemCount} from "./actions/cart";


class Alarm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            messages: []
        }
        this.replyBoxChange = this.replyBoxChange.bind(this)


        this.props.getNotifications();

        this.props.resetNotificationCount();
        this.props.setCartItemCount();
    }


    replyBoxChange(event, index) {

        const object = Object.assign([], this.state.messages);


        let value;
        if (object[index].reply === "" ) {
            value =  event.target.value.replace('\n', '')
        } else {
            value = event.target.value.replace('\n\n\n', '\n\n')
        }


        object[index].reply = value;
        this.setState({options : object});

    }

    renderNotifications = () => {
        if(this.props.notifications.length === 0) {
            return(
                <div>
                    {/*<h2>새로운 알림이 없습니다.</h2>*/}
                </div>
            )
        }else{
            return (
                <div className={"alarmBody"}>
                    {this.props.notifications.map((i, index) => (
                        <Notification notification={i} index={index} onChangeReplyBox={(event, index) => this.replyBoxChange(event, index)}/>
                    ))}
                </div>
            );
        }
    }

    render() {
        return(

            <div>
                {
                    this.renderNotifications()
                }

            </div>

        )

    }
}

let mapStateToProps = (state) => {

    return {
        notifications: state.notification.notifications,
        notificationCount: state.notification.count,
        cartItemCount: state.cart.count
    }
}

let mapDispatchToProps = (dispatch) => {


    return {
        getNotifications: () => dispatch(getNotification()),
        setCartItemCount: () => dispatch(setCartItemCount()),
        resetNotificationCount: () => dispatch(resetCount())


    }
}

Alarm = connect(mapStateToProps, mapDispatchToProps)(Alarm)

export default Alarm;