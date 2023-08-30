import React, { Component } from "react";
import Auth from "./Auth/Auth";
import { Link } from "react-router-dom";

interface HomeProps {
  auth: Auth;
}

export default class Home extends Component<HomeProps> {
  render() {
    const { isAuthenticated, login } = this.props.auth;
    return (
      <div>
        <h1>Home</h1>
        {isAuthenticated() ? (
          <Link to="/profile">View profile</Link>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </div>
    );
  }
}
