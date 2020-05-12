import {getNotiCount, getUniqueId, queryString, RestApi} from '../util/Constants'
import fetch from 'cross-fetch'


export function getNotification() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId()
        }

        fetch(RestApi.notification.getNotification + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {

                dispatch(
                    {
                        type: 'GET_NOTIFICATION',
                        notifications: json
                    }
                )

            })
    }
}


export function getNotificationCount() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId()
        }

        fetch(RestApi.notification.getCount + '?' + queryString(params))
            .then(res => {
                return res.json()
            })
            .then(json => {


                localStorage.setItem('notificationCount', json.count);
                dispatch({
                    type: 'NOTIFICATION_COUNT',
                    count: json.count
                })
            })
    }
}

export function setCount() {
    return (dispatch) => {
        dispatch({
            type: 'NOTIFICATION_COUNT',
            count: getNotiCount()
        })
    }
}

export function resetCount() {
    return (dispatch) => {
        let params = {
            uniqueId: getUniqueId()
        }

        fetch(RestApi.notification.reset ,  {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => {
                if(res.status === 200){
                    localStorage.setItem('notificationCount', '0');
                    dispatch({
                        type: 'NOTIFICATION_COUNT',
                        count: 0
                    })
                }


            })

    }
}