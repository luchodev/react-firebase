import React, { Component } from "react";
import firebase from "firebase";
import "./App.css";

import FileUpload from "./FileUpload";

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      pictures: []
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        user
      });
    });

    firebase
      .database()
      .ref("pictures")
      .on("child_added", snapshot => {
        this.setState({
          pictures: this.state.pictures.concat(snapshot.val())
        });
      });
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} has logged In`))
      .catch(error => console.log(`Error: ${error.code}: ${error.message}`));
  }

  handleLogout() {
    firebase
      .auth()
      .signOut()
      .then(result => console.log(`${result.user.email} has logged out`))
      .catch(error => console.log(`Error: ${error.code}: ${error.message}`));
  }

  handleUpload(event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/pictures/${file.name}`);

    const task = storageRef.put(file);
    task.on(
      "state_changed",
      snapshot => {
        let percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({
          uploadValue: percentage
        });
      },
      err => console.log(`Error when uploading picture: ${err}`),
      () => {
        task.snapshot.ref.getDownloadURL().then(downloadURL => {
          let record = {
            photoURL: this.state.user.providerData[0].photoURL,
            displayName: this.state.user.displayName,
            image: downloadURL
          };
          const dbRef = firebase.database().ref("pictures");
          const newPicture = dbRef.push();
          newPicture.set(record);
        });
      }
    );
  }

  renderLoginButton() {
    if (this.state.user) {
      return (
        <div>
          <img
            className="App-user-photo"
            src={this.state.user.providerData[0].photoURL}
            alt={this.state.user.displayName}
          />
          <p>Hola {this.state.user.displayName}!</p>
          <button onClick={this.handleLogout}>Salir</button>
          <FileUpload onUpload={this.handleUpload} />
          {this.state.pictures
            .map(picture => (
              <div>
                <img className="App-picture" src={picture.image} alt="" />
                <br />
                <img
                  className="App-user-photo"
                  src={picture.photoURL}
                  alt={picture.displayName}
                />
                <br />
                <span>{picture.displayName}</span>
              </div>
            ))
            .reverse()}
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
