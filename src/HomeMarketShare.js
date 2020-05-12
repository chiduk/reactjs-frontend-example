import React, { Component }  from 'react';
import "./js/components/Home.css";
import HomeMarketFeed from "./HomeMarketFeed.js";
import {connect} from "react-redux";
import {getJointPurchase, getJointPurchaseFollowing} from "./actions/home";
import {HOME_FEED_VIEW_MODE, JOINT_PURCHASE_FEED_LIMIT_COUNT} from "./util/Constants";

class HomeMarketShare extends Component{
    constructor(prop) {
        super(prop)
        this.state = {}
        this.loadMore = true
    }

    componentDidMount() {

        let self = this;

        document.getElementById('jpFeedOuterArea').onclick = function (e) {


            if(e.target === document.getElementById('jpFeedOuterArea')){

                self.closeMenu()
            }else{

            }
        };


        document.getElementById('jpFeedOuterArea').onscroll = function (e) {

            let outerArea = document.getElementById('jpFeedOuterArea');

            if(outerArea.scrollLeft >  (self.props.jointPurchase.length - JOINT_PURCHASE_FEED_LIMIT_COUNT) * 300){


                if(self.loadMore){
                    self.loadMore = false;

                    if(self.props.viewMode === HOME_FEED_VIEW_MODE.ALL){
                        self.props.getJointPurchase(self.props.jointPurchase.length)
                    }else if(self.props.viewMode === HOME_FEED_VIEW_MODE.FOLLOWING){
                        self.props.getJointPurchaseFollowing(self.props.jointPurchase.length)
                    }
                }
            }




        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.jointPurchase !== this.props.jointPurchase){
            this.loadMore = true
        }
    }

    moveScroll = () => {
        const slider = document.querySelector('.scrolling-wrapper');
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            slider.scrollLeft = scrollLeft - walk;

        });

    };

    closeMenu = () => {
        let promoElems = document.querySelectorAll('[id^="optionBox"]');
        promoElems.forEach(element => {
            element.style.visibility = 'hidden'
        })

        let elements = document.querySelectorAll('[id^="jpOptionBox"]');
        elements.forEach(element => {
            element.style.visibility = 'hidden'
        })
    }

    render() {
        let rows = [];

        let wrapperHeight = '700px';

        if(typeof this.props.marketFeed !== 'undefined'){
            this.props.marketFeed.forEach((feed, index) => {

                if(feed.description.startsWith('<iframe')){
                    wrapperHeight = '780px'
                }

                const row = <HomeMarketFeed closeMenu={() => this.closeMenu()} key={index} feedData={feed} logInPage={this.props.logInPage}/>
                rows.push(row)
            })
        }

        return (

            <div>
                <div className="scrolling-wrapper" id={'jpFeedOuterArea'} onMouseDown={this.moveScroll} onMouseLeave={this.moveScroll} onMouseUp={this.moveScroll} onMouseMove={this.moveScroll}>
                    {rows}
                </div>
            </div>
        );

    }
}

let mapStateToProps = (state) => {
    return {
        jointPurchase: state.stella.jointPurchase,
        viewMode: state.stella.viewMode
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        getJointPurchase: (skip) => dispatch(getJointPurchase(skip)),
        getJointPurchaseFollowing: (skip) => dispatch(getJointPurchaseFollowing(skip))
    }
};

HomeMarketShare = connect(mapStateToProps, mapDispatchToProps)(HomeMarketShare)

export default HomeMarketShare;