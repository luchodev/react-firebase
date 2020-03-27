import React, { Component } from "react";
import firebase from "firebase";

class FileUpload extends Component {
  constructor() {
    super();
    this.state = {
      uploadValue: 0,
      picture: null
    };

    this.handleUpload = this.handleUpload.bind(this);
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
          this.setState({
            picture: downloadURL
          });
        });
        this.setState({
          uploadValue: 100
        });
      }
    );
  }

  render() {
    return (
      <div>
        <progress value={this.state.uploadValue} max="100"></progress>
        <br />
        <input type="file" onChange={this.handleUpload}></input>
        <br />
        <img width="350" src={this.state.picture} alt=""></img>
      </div>
    );
  }
}

export default FileUpload;
