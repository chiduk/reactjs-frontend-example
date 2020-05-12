import React, { Component } from "react";
import "./js/components/Calendar.css";
import CalendarLib from 'react-calendar';


class Calendar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            year: "",
            month:"",
            today: "",
            date: "",
            day: "",
            dayArray: [],

            todayYear: "",
            todayMonth: "",
            todayDate: "",

            beginDate: "",
            endDate: "",

            datesSelected: [],

            isBackward: false,

        }

        this.closeView = this.closeView.bind(this)

        this.getCurrentDate = this.getCurrentDate.bind(this)

        this.getTheFirstDayOfTheMonth = this.getTheFirstDayOfTheMonth.bind(this)

        this.isLeapYear = this.isLeapYear.bind(this)

        this.renderDays = this.renderDays.bind(this)

        this.whatIsToday = this.whatIsToday.bind(this)

        this.previousMonth = this.previousMonth.bind(this)

        this.dateCellClicked = this.dateCellClicked.bind(this)

        // this.toggleDateSelected = this.toggleDateSelected.bind(this)

        this.loopCell = this.loopCell.bind(this)

        this.submitPressed = this.submitPressed.bind(this)
    }

    closeView() {
        this.props.closeView()
    }

    componentWillMount() {
        this.getCurrentDate()
        this.setState({
            isBackward: this.props.isBackward
        }, () => {

        })
    }

    getCurrentDate(){
        let separator = ' ';
        let newDate = new Date();
        let date = newDate.getDate();
        let day = newDate.getDay()
        let month = newDate.getMonth() + 1;

        let year = newDate.getFullYear();


        this.setState( {
            today :  `${year}년 ${separator} ${ month<10 ? `0${month}월` : `${month}월`} ${separator} ${date}일`,
            showMonthSelect: false,
            date: `${newDate<10 ? `0${newDate}` : `${newDate}`}`,
            month: month,
            year: year,

            todayYear: year,
            todayMonth: `${ month<10 ? `0${month}` : `${month}`}`,
            todayDate: `${ date<10 ? `0${date}` : `${date}`}`,
        }, () => {
            this.renderDays(year, month, date)

        })

        this.whatIsToday(year, month, date)

    }


    getTheFirstDayOfTheMonth(year, month, date) {
        let monthNum;
        if (month > 2) {
            monthNum = Math.abs(month - 2)
        } else if(month === 2){
            monthNum = 12
        } else if (month ===1) {
            monthNum = 11
        }

        let yearNum;
        if (month < 3) {
            yearNum = (year%100) - 1
        } else {
            yearNum = year%100
        }

        let century = (year - yearNum)/100

        let weekday = (date + (5 * century) + yearNum + parseInt(century / 4) + parseInt(yearNum / 4) + ((2.6 * monthNum) - 0.2))%7

        return (Math.floor(weekday));

    }

    whatIsToday(year, month, day) {

        let weekdays = ["일", "월", "화", "수", "목", "금", "토"]
        this.setState({day: weekdays[this.getTheFirstDayOfTheMonth(year, month, day)]})

    }

    isLeapYear(year) {

        if (year%4 === 0) {
            return true;
        } else if (year%100 === 0 && year%400 === 0){
            return true;
        } else {
            return false;
        }
    }

    dateCellClicked(id) {

        let begin = Number(this.state.beginDate)
        let end = Number(this.state.endDate)
        let selectedDate = Number(id)

        if (this.state.beginDate !== "") {
            if (selectedDate === begin || selectedDate === end) {
                if (selectedDate === begin) {
                    if (this.state.endDate === "") {
                        this.setState({beginDate: ""},()=>{
                            this.loopCell(id)
                        })
                    } else {
                        this.setState({
                            beginDate: end,
                            endDate: ""
                        }, ()=> {
                            this.loopCell(id)
                        })
                    }

                } else {
                    this.setState({
                        endDate: ""
                    }, ()=>{
                        this.loopCell(id)
                    })
                }
            } else if (selectedDate > begin) {
                this.setState({endDate: selectedDate}, ()=> {
                    this.loopCell(id)
                })
            } else {
                this.setState({
                    beginDate: selectedDate,
                    endDate: begin
                }, ()=> {
                    this.loopCell(id)
                })
            }
        } else {
            this.setState({
                beginDate: id
            }, ()=> {
                this.loopCell(id)
            })
        }

    }

    loopCell(id) {

        // let begin = this.state.beginDate
        // let end = this.state.endDate
        // let clickedDate = Number(id)

        let viewYear = this.state.year
        let viewMonth = this.state.month

        this.renderDays(viewYear, viewMonth, 1)



    }



    renderDays(year, month, date) {
        let monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
        let numberOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        // this.whatIsToday(year, month, date)
        let todayYear = this.state.todayYear
        let todayMonth = this.state.todayMonth
        let todayDate = this.state.todayDate

        let dateFull = String(todayYear) + String(todayMonth) + String(todayDate)



        let selectedDates = []

        // console.log("today's date is: " + dateFull)

        let firstDay = this.getTheFirstDayOfTheMonth(year, month, 1)
        let isLeapYear = this.isLeapYear(year)
        let numberOfDateCell;
        // console.log('numberof expected days :' + numberOfDays[month-1])
        if (isLeapYear === true && month === 2) {
            numberOfDateCell = numberOfDays[month-1] + 1 + (firstDay)
        } else {
            numberOfDateCell = numberOfDays[month-1] + (firstDay)
        }

        let weekArray = []
        let day = 0
        for (let i = 0; i < numberOfDateCell; i++) {

            let element;

            if (i >= firstDay) {
                day += 1

                let id = String(year) + String(month<10 ? `0${month}` : `${month}`) + String(day<10 ? `0${day}` : `${day}`)
                let selectedDate = String(year) + String("-") + String(month<10 ? `0${month}` : `${month}`) + String("-") + String(day<10 ? `0${day}` : `${day}`)



                let selectedDateBegin = this.state.beginDate
                let selectedDateEnd = this.state.endDate
                let isSelected;

                if (selectedDateEnd === "" && selectedDateBegin !== "" && Number(selectedDateBegin) === Number(id)) {
                    isSelected = true
                    selectedDates.push(selectedDate)
                } else if (selectedDateBegin !== "" && selectedDateEnd !== "") {
                    if (Number(this.state.beginDate) <= Number(id) && Number(id) <= Number(this.state.endDate)) {
                        isSelected = true
                        selectedDates.push(selectedDate)
                    }
                } else {
                    isSelected = false
                }
                // ${dateFull === id ? "todayDateCell" : ""}



                if (this.state.isBackward === false ) {

                    element = <div key={i} className={`weekDayText dayCell dayCellText 
                                ${Number(dateFull) <= Number(id) ? "" : "inactiveCell"} 
                                ${isSelected ? "dateSelected" : ""}
                                ${Number(selectedDateBegin) === Number(id) ? "selectedDateFirst" : ""}
                                ${Number(selectedDateEnd) === Number(id) ? "selectedDateLast" : ""}
                                `}
                                   id={id}
                                   onClick={() => this.dateCellClicked(id)}>
                        {day}
                    </div>

                } else {
                    element = <div key={i} className={`weekDayText dayCell dayCellText 
                                ${Number(dateFull) >= Number(id) ? "" : "inactiveCell"} 
                                ${isSelected ? "dateSelected" : ""}
                                ${Number(selectedDateBegin) === Number(id) ? "selectedDateFirst" : ""}
                                ${Number(selectedDateEnd) === Number(id) ? "selectedDateLast" : ""}
                                `}
                                   id={id}
                                   onClick={() => this.dateCellClicked(id)}>
                        {day}
                    </div>
                }

            } else {
                element = <div key={i} className={"weekDayText dayCell dayCellText"}/>
            }

            weekArray.push(element)
        }

        let object = Object.assign([], this.state.datesSelected)
        if (object.length>1) {
            object.push(selectedDates)
        } else {
            object = selectedDates
        }

        this.setState({
            dayArray: weekArray,
            datesSelected: object
        })
    }

    previousMonth(int) {



        let month = this.state.month
        let year = this.state.year



        if (int === 0) {
            if (month === 1) {
                year -= 1
                month = 12

            } else {
                month -= 1
            }

        } else if (int === 1){
            if (month === 12) {
                year += 1
                month = 1
            } else {
                month += 1
            }
        }

        this.setState({
            year: year,
            month: month
        }, () => {
            this.renderDays(year, month, 1)
        })

    }

    submitPressed() {
        // let beginDate = Number(this.state.beginDate)
        let beginYear = []
        let beginMonth = []
        let beginDay = []

        let endYear = []
        let endMonth = []
        let endDay = []



        String(this.state.beginDate).split("").forEach((i, index) => {

            if (index < 4) {
                beginYear.push(i)
            }

            if (index < 6 && index > 3) {
                beginMonth.push(i)
            }

            if (index > 5 && index < 8) {
                beginDay.push(i)
            }
        })

        String(this.state.endDate).split("").forEach((i, index) => {

            if (index < 4) {
                endYear.push(i)
            }

            if (index < 6 && index > 3) {
                endMonth.push(i)
            }

            if (index > 5 && index < 8) {
                endDay.push(i)
            }
        })


        let beginfullDate = new Date(beginYear.join(''), beginMonth.join(''), beginDay.join('')).getTime()
        let endFullDate = new Date(endYear.join(''), endMonth.join(''), endDay.join('')).getTime()
        let difference = endFullDate - beginfullDate
        let gap = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1

        if (this.state.isBackward === false) {

            if (gap < 2) {
                alert("1일 이상 기간을 선택 하셔야 합니다")
            } else if (gap > 30) {
                alert("기간을 30일 이하로 선정 하셔야 합니다.")
            } else {
                //this.props.setDates(this.state.beginDate, `${beginYear.join('')}년 ${beginMonth.join('')}월 ${beginDay.join('')}일`,this.state.endDate, `${endYear.join('')}년 ${endMonth.join('')}월 ${endDay.join('')}일`)
                this.props.setDates(`${beginYear.join('')}-${beginMonth.join('')}-${beginDay.join('')}`, `${beginYear.join('')}년 ${beginMonth.join('')}월 ${beginDay.join('')}일`,`${endYear.join('')}-${endMonth.join('')}-${endDay.join('')}`, `${endYear.join('')}년 ${endMonth.join('')}월 ${endDay.join('')}일`)
                this.props.closeView()
            }
        } else {
            this.props.setDates(`${beginYear.join('')}-${beginMonth.join('')}-${beginDay.join('')}`, `${beginYear.join('')}년 ${beginMonth.join('')}월 ${beginDay.join('')}일`,`${endYear.join('')}-${endMonth.join('')}-${endDay.join('')}`, `${endYear.join('')}년 ${endMonth.join('')}월 ${endDay.join('')}일`)
            this.props.closeView()
        }
    }

    render() {

        let weekdays = ["일", "월", "화", "수", "목", "금", "토"]

        return (
            <div>
                <div className={"blurBackGround"}/>

                <div className={"calendarWrapper myShadowStyle"}>
                    <div className={"closeCalendar myButton"} onClick={this.closeView}>close X</div>
                    <div className={"todayDate"}>{this.state.today} {this.state.day}요일</div>

                    <div className={"calendarArrowWrapper"}>
                        <div className={"arrow"} onClick={()=>this.previousMonth(0)}><img src={require("./image/arrowPrevious2.png")}/></div>
                        <div className={"monthStatus"}>{this.state.year}년 {this.state.month}월</div>
                        <div className={"arrow"} onClick={()=>this.previousMonth(1)}><img src={require("./image/arrowNext2.png")}/> </div>
                    </div>

                    <div className={"weekWrapper weekTop"}>
                        {weekdays.map((i, index) => {
                            return (
                                <div key={index} className={"weekDayText"}>{i}</div>
                            );
                        })}
                    </div>

                    <div className={"weekWrapper weekDayCellWrapper"}>
                        {this.state.dayArray.map((i, index) => {
                            return (
                                i
                            );
                        })}
                    </div>

                    <div className={"dateSubmit"} onClick={this.submitPressed}>저장</div>
                </div>

            </div>
        );
    }
}

export default Calendar;