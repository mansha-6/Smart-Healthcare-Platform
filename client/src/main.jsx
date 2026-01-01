import './i18n';
// Polyfills for simple-peer
import * as process from "process";
window.global = window;
window.process = process;
window.Buffer = [];

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
