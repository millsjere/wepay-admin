import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import reducers from './reducers/reducers';
import App from './App';
import { ThemeProvider } from '@material-ui/core/styles'
import { theme } from './theme'

ReactDOM.render( 
<Provider store={createStore(reducers, applyMiddleware(thunk))} >
<BrowserRouter>
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
</BrowserRouter> 
</Provider>, document.getElementById('root'));
