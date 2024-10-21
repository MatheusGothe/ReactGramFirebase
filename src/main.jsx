import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import GlobalContextProvider from './state/context/GlobalContext.jsx';
// Redux


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GlobalContextProvider>
        <App />
    </GlobalContextProvider>


);

