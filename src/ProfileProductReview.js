import React, { Component } from "react";
import AlarmMessage from "./AlarmMessage";
import {getReview} from "./actions/user";
import {connect} from "react-redux";




class ProfileProductReview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reviews : []
        };

        this.replyBoxChange = this.replyBoxChange.bind(this)

        this.props.getReview(this.props.uniqueId);
    }

    replyBoxChange(event, index) {
        // const index = event.target.getAttribute('index')

        //console.log(event.target.value, index)
        const object = Object.assign([], this.state.reviews);


        let value;
        if (object[index].reply === "" ) {
            value =  event.target.value.replace('\n', '')
        } else {
            value = event.target.value.replace('\n\n\n', '\n\n')
        }


        object[index].reply = value;
        this.setState({reviews : object});

    }

    render() {
        return(
            <div>
                {this.props.comments.map((i, index) => {

                    return (
                        <AlarmMessage productId={i.product.productId} content={i} index={index} onChangeReplyBox={(event, index) => this.replyBoxChange(event, index)}/>
                    );
                })}
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        comments: state.user.comments

    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        getReview: (uniqueId) => dispatch(getReview(uniqueId))
    }
};

ProfileProductReview = connect(mapStateToProps, mapDispatchToProps)(ProfileProductReview);


export default ProfileProductReview;