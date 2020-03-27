import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import firebase from "firebase";

firebase.initializeApp({
  apiKey: "AIzaSyDs0H7SvIXc0G24LYUMDzrBOUSwq3GmuPk",
  authDomain: "pseudogram-d590d.firebaseapp.com",
  databaseURL: "https://pseudogram-d590d.firebaseio.com",
  projectId: "pseudogram-d590d",
  storageBucket: "pseudogram-d590d.appspot.com",
  messagingSenderId: "752284085527",
  appId: "1:752284085527:web:6658b65af14027f0b61b52"
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
