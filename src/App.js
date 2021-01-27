// App.js -- this is  the full file
import React, { Component } from "react";
import "./App.css";
import io from "socket.io-client";

class App extends Component {
  state = {
    isConnected: false,
    peeps: [],
    color: "red",
    message: {
      text: "",
      id: "",
      name: "Halloum",
    },
    oldMessages: [],
  };
  socket = null;

  componentWillMount() {
    this.socket = io("https://codi-server.herokuapp.com");

    this.socket.on("connect", () => {
      this.setState({ isConnected: true, color: "blue" });
      this.setState({ message: { ...this.state.message, id: this.socket.id } });
    });

    this.socket.on("pong!", (additionalStuff) => {
      console.log("server answered!", additionalStuff);
    });

    // this.socket.on("youare", (answer) => {
    //   console.log(answer);
    //   this.setState({ id: answer.id });
    // });
    // this.socket.on("peeps", (peeps) => {
    //   console.log(peeps);
    //   this.setState({ peeps: peeps });
    // });
    // this.socket.on("next", (message_from_server) =>
    //   console.log(message_from_server)
    // );

    this.socket.on("disconnect", () => {
      this.setState({ isConnected: false });
    });

    // this.socket.on("new connection", () => {
    //   this.state.peeps.push(this.state.uniqueId);
    // });

    // this.socket.on("new disconnection", () => {
    //   this.state.peeps.pop(this.state.uniqueId);
    // });

    /** this will be useful way, way later **/
    this.socket.on("room", (old_messages) => {
      this.setState({ oldMessages: old_messages });
    });
  }

  componentWillUnmount() {
    this.socket.close();
    this.socket = null;
  }

  render() {
    return (
      <div className="App">
        <div>status: {this.state.isConnected ? "online" : "offline"}</div>
        <h1>Codi-Tech New Chatting </h1>
        {/* We add the line below: */}

        {/* <button onClick={() => this.socket.emit("whoami")}>Who am I?</button> */}
        <div className="chat-wrapper">
          <div className="send-div">
            <input
              type="text"
              placeholder="message"
              value={this.state.text}
              onChange={(e) => {
                this.setState({
                  message: { ...this.state.message, text: e.target.value },
                });
              }}
            />
            <button
              className="send-button"
              onClick={() => {
                this.socket.emit("message", this.state.message);
                this.setState({
                  message: {
                    ...this.state.message,
                    text: "",
                  },
                });
              }}
              style={{ backgroundColor: this.state.color }}
            >
              Send
            </button>
          </div>
          <div className="chat-div">
            <ul style={{ listStyleType: "none" }}>
              {this.state.oldMessages.map((message) => {
                return (
                  <li key={message.id}>
                    <div style={{ fontSize: "25px" }}>{message.name}</div>
                    <div>
                      {typeof message.text === "string" ? message.text : ""}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
