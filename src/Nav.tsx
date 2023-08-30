import React, { Component } from "react";
import { Link } from "react-router-dom";
import Auth from "./Auth/Auth";

interface NavProps {
  auth: Auth;
}

export default class Nav extends Component<NavProps> {
  render() {
    const { isAuthenticated, login, logout } = this.props.auth;
    return (
      <>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/public">Public</Link>
            </li>
            <li>
              <button onClick={isAuthenticated() ? logout : login}>
                {isAuthenticated() ? "Log Out" : "Log In"}
              </button>
            </li>
          </ul>
        </nav>
      </>
    );
  }
}
