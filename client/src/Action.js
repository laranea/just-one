import React, { Component } from "react";

import "./Action.css";

class Action extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      value: "",
    };
  }

  componentDidMount() {}

  handleChange = (e) => { this.setState({value: e.target.value}); }

  submit = () => {
    const { phase } = this.props;
    const { value } = this.state;
    if (phase === "clue") this.props.submitClue(value);
    else if (phase === "guess") this.props.submitGuess(value);
    this.setState({input: value, value: ""});
  }

  render() {
    const { activePlayer, amActive, guess, judgment, myClue, phase, spectating } = this.props;

    let message = "";
    let showInput = false;
    let buttons = [];

    if (phase === "disconnected") {
      return (<div className="Action-Wrapper"></div>);
    } else if (phase === "clue") {
      if (amActive || spectating) {
        message = "waiting for clues...";
      } else if (myClue) {
        message = `you wrote ${this.state.input}. waiting for others...`;
        buttons.push(<button key="next" onClick={e => this.props.handlePhase("eliminate")}>compare clues</button>);
      } else {
        message = "write a clue!";
        showInput = true;
        buttons.push(<button key="next" onClick={e => this.props.handlePhase("eliminate")}>compare clues</button>);
        // (<button onClick={e => this.props}>new word</button>),
      }
    } else if (phase === "eliminate") {
      if (amActive || spectating) {
        message = "the group is comparing clues...";
      } else {
        message = "hide clues that are invalid or identical!";
        buttons.push(<button key="next" onClick={e => this.props.handlePhase("guess")}>show clues</button>);
      }
    } else if (phase === "guess") {
      if (amActive) {
        message = "guess the word!";
        showInput = true;
      } else {
        message = `${activePlayer} is guessing...`;
      }
    } else if (phase === "judge") {
      if (amActive) {
        message = `you wrote ${guess}. waiting for judgment...`;
      } else if (spectating) {
        message = `${activePlayer} guessed ${guess}.`
      } else {
        message = `${activePlayer} guessed ${guess}. is it right?`;
        buttons.push(<button key="wrong" onClick={e => this.props.submitJudge(false)}>nope</button>);
        buttons.push(<button key="right" onClick={e => this.props.submitJudge(true)}>yep</button>);
      }
    } else if (phase === "end") {
      if (amActive) {
        message = judgment ? "you got it right!" : "you were wrong :(";
      } else if (spectating) {
        message = judgment ? `${activePlayer} got it right!` : `${activePlayer} got it wrong :(`;
      } else {
        message = judgment ? `${activePlayer} got it right!` : `${activePlayer} got it wrong :(`;
        buttons.push(<button key="reveal" onClick={e => this.props.submitReveal()}>reveal clues</button>);
        // buttons.push(<button onClick={e => this.props.submitReveal()}>reveal word</button>);
      }
    }
    
    if (!spectating) {
      if (phase === "wait") {
        buttons.push(<button key="skip" onClick={e => this.props.handlePhase("clue")}>start game</button>);
      } else if (phase !== "end") {
        buttons.push(<button key="skip" className="unfocused" onClick={e => this.props.handlePhase("clue")}>next round</button>);
      } else {
        buttons.push(<button key="skip" onClick={e => this.props.handlePhase("clue")}>next round</button>);
      }
    }

    return (
      <div className="Action-Wrapper">
        <div className="Action-Message">{message}</div>
        {showInput && (
          <div className="Action-Input">
            <input
              onChange={this.handleChange}
              type="text"
              value={this.state.value}
            />
            <button onClick={e => this.submit()}>send</button>
          </div>
        )}
        {buttons.length > 0 && (<div className="Action-Buttons">{buttons}</div>)}
      </div>
    );
  }
}

export default Action;
