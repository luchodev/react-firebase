import React, { Component } from "react";
import firebase from "firebase";
import "./App.css";

import FileUpload from "./FileUpload";

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        user
      });
    });
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result =>
        console.log(`${result.user.email} has logged In ${result}`)
      )
      .catch(error => console.log(`Error: ${error.code}: ${error.message}`));
  }

  handleLogout() {
    firebase
      .auth()
      .signOut()
      .then(result => console.log(`${result.user.email} has logged out`))
      .catch(error => console.log(`Error: ${error.code}: ${error.message}`));
  }

  renderLoginButton() {
    if (this.state.user) {
      return (
        <div>
          <img
            className="App-picture"
            src={this.state.user.providerData[0].photoURL}
            alt={this.state.user.displayName}
          />
          <p>Hola {this.state.user.displayName}!</p>
          <button onClick={this.handleLogout}>Salir</button>
          <FileUpload />
        </div>
      );
    } else {
      return <button onClick={this.handleAuth}>Login con Google</button>;
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Pseudogram</h2>
        </header>
        <div>{this.renderLoginButton()}</div>
      </div>
    );
  }
}

export default App;
