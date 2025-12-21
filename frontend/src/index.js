import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Default create-react-app CSS
import App from './App'; // Import the main App component
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* <--- You need to render your App component here! */}
  </React.StrictMode>
);

// If you want your app to work offline and load faster, change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register(); // Changed to register for PWA
