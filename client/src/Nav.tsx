import React from "react";
import { Link } from "react-router-dom";
import Auth from "./Auth/Auth";

interface NavProps {
  auth: Auth;
}

const Nav: React.FC<NavProps> = ({ auth }) => {
  const isAuthenticated = auth.isAuthenticated();
  const { login, logout } = auth;

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
          {isAuthenticated && (
            <li>
              <Link to="/private">Customers</Link>
            </li>
          )}
          <li>
            <button onClick={isAuthenticated ? logout : login}>
              {isAuthenticated ? "Log Out" : "Log In"}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Nav;
