/* import React, { Component } from "react";
import Auth from "./Auth/Auth"; // Import the Auth type from the correct location

interface ProfileProps {
  auth: Auth; // Assuming Auth is the correct type for your authentication class
}

class Profile extends Component<ProfileProps> {
  state = {
    profile: null,
    error: "",
  };

  componentDidMount(): void {
    this.loadUserProfile();
  }
  loadUserProfile() {
    this.props.auth.getProfile((profile, error) =>
      this.setState({ profile, error })
    );
  }

  render() {
    const { profile } = this.state;
    if (!profile) return null;
    return (
      <>
        <h1>Profile</h1>
        <p>{profile.name}</p>
        <img
          style={{ maxWidth: 50, maxHeight: 50 }}
          src={profile.picture}
          alt="profile pic"
        />
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </>
    );
  }
}

export default Profile; */

import React, { useEffect, useState } from "react";
import Auth from "./Auth/Auth";
import { Auth0Error } from "@auth0/auth0-spa-js";

interface ProfileProps {
  auth: Auth;
}

const Profile: React.FC<ProfileProps> = ({ auth }) => {
  const [profile, setProfile] = useState<any | null>(null);
  const [error, setError] = useState<Auth0Error | null>(null);

  useEffect(() => {
    const loadUserProfile = () => {
      auth.getProfile((userProfile: any, err: Auth0Error | null) => {
        if (userProfile) {
          setProfile(userProfile);
          setError(null);
        } else {
          setProfile(null);
          setError(err);
        }
      });
    };

    loadUserProfile();
  }, [auth]);

  if (!profile) return null;

  return (
    <>
      <h1>Profile</h1>
      <p>{profile.name}</p>
      <img
        style={{ maxWidth: 50, maxHeight: 50 }}
        src={profile.picture}
        alt="profile pic"
      />
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </>
  );
};

export default Profile;
