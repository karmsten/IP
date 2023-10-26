import React from "react";
import Auth from "../Auth/Auth";
import { Link } from "react-router-dom";

interface HomeProps {
  auth: Auth;
}

const Home: React.FC<HomeProps> = ({ auth }) => {
  const isAuthenticated = auth.isAuthenticated();
  const login = auth.login;

  return (
    <div>
      <h1>Home</h1>
      {isAuthenticated ? (
        <Link to="/profile">View profile</Link>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
};

export default Home;
