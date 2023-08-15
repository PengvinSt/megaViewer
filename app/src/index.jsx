import React from 'react';
import ReactDOM from 'react-dom/client';

import "./stylesheets/index.css";
import "./stylesheets/variables_styles.css";
import "./stylesheets/file_icon.css"
import App from "./components/App";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App/>);