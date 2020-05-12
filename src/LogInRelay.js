import React, { Component } from 'react';
import "./js/components/LogInPage.css";
import { withRouter} from "react-router-dom";
import naver from "./config/naver";

class LogInRelay extends Component{
    constructor(props){
        super(props)
        let logInParams = localStorage.getItem('logInParams')

        //window.close()




    }

    render() {
        return (
            <div>

            </div>
        )
    }


}

export default withRouter(LogInRelay);