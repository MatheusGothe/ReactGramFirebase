import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalContextProvider from './state/context/GlobalContext';
// Redux



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GlobalContextProvider>
        <App />
    </GlobalContextProvider>


);

reportWebVitals();
