import React, { Component } from "react";
import Auth from "./Auth/Auth";

interface HomeProps {
  auth: Auth;
}

export default class Home extends Component<HomeProps> {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <button onClick={this.props.auth.login}>Login</button>
      </div>
    );
  }
}
