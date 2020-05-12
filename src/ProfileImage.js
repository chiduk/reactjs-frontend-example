import React, {Component} from "react";
import {RestApi} from "./util/Constants";

class ProfileImage extends Component{

    constructor(props){
        super(props)

        this.state = {
            imageSource : this.props.uniqueId
        }
    }

    onError = () => {
        this.setState({imageSource: 'profileImagePlaceholder'})
    }

    render() {
        return(
            <img className={this.props.className} alt={""} src={RestApi.profile + this.state.imageSource + '.png'} onError={this.onError} />
        )
    }

}

export default ProfileImage