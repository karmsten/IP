import React, { useEffect, useState } from "react";
import Auth from "./Auth/Auth";
//@ts-ignore
import { Auth0Error } from "@auth0/auth0-spa-js";

interface ProfileProps {
  auth: Auth;
}

const Profile: React.FC<ProfileProps> = ({ auth }) => {
  const [profile, setProfile] = useState<any | null>(null);
  const [error, setError] = useState<Auth0Error | null>(null);

  console.log(error); //to be able to npm run build (needs proper solution)

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
