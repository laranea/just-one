import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const socket = socketIOClient("http://localhost:4001");
    this.setState({ socket });

    const myName = prompt("Enter your name") || undefined;
    this.setState({ myName });

    socket.emit("name", myName);
    socket.on("players", (players, playerOrder) => this.setState({ players, playerOrder }));
    socket.on("phase", (phase, activePlayer) => this.setState({ phase, activePlayer }));
    socket.on("word", word => this.setState({ word }));
    socket.on("clues", clues => this.setState({ clues }));
    socket.on("guess", guess => this.setState({ guess }));

    // socket.emit("end")
  }

  handleChange = (e) => {
    this.setState({value: e.target.value});
  }

  submitClue = (e) => {
    this.state.socket.emit("clue", this.state.value);
  }

  submitGuess = (e) => {
    this.state.socket.emit("guess", this.state.value);
  }

  handlePhase = (phase) => {
    this.state.socket.emit("phase", phase);
  }

  handleKick = (name) => {
    this.state.socket.emit("kick", name);
  }

  toggleClue = (name) => {
    this.state.socket.emit("toggle", name);
  }

  submitJudge = (judgement) => {
    this.state.socket.emit("judge", judgement);
  }

  render() {
    const { activePlayer, clues, guess, phase, players, playerOrder, word } = this.state;

    return (
      <div id="wrapper">
        {`The phase is ${phase}.`}
        <div id="status">
          {
            (activePlayer) ? "You are the active player." : `The word is ${word || "nothing"}. The guess was ${guess || "nothing"}.`
          }
        </div>
        <div id="action">
          <input type="text" onChange={this.handleChange}/>
          <button onClick={this.submitClue}>submit clue</button>
          <button onClick={this.submitGuess}>submit clue</button>
          <button onClick={e => this.submitJudge(false)}>judge incorrect</button>
          <button onClick={e => this.submitJudge(true)}>judge correct</button>

          <button onClick={e => this.handlePhase("clue")}>start clue</button>
          <button onClick={e => this.handlePhase("eliminate")}>start eliminate</button>
          <button onClick={e => this.handlePhase("guess")}>start guess</button>
          <button onClick={e => this.handlePhase("judge")}>start judge</button>
          <button onClick={e => this.handlePhase("end")}>start end</button>
        </div>
        <div id="players">
          {playerOrder && playerOrder.map(name => (
              <div>
                {name}
                {players[name].status}
                {clues && clues[name]}
                <button onClick={e => this.handleKick(name)}>kick</button>
                <button onClick={e => this.toggleClue(name)}>toggle</button>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default App;
