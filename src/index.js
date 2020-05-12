import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider  } from 'react-redux';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import stellaStoreApp from './reducers'
import WebFont from 'webfontloader';
const store = createStore(stellaStoreApp, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store = {store} >
        <App />
    </Provider>,
    document.getElementById('root'));


WebFont.load({
    google: {
        families: ['PT Sans:300i,400i,700i', 'sans-serif']
    }
})
serviceWorker.unregister();

