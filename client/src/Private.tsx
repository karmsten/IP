import React, { useState, useEffect } from "react";
import Auth from "./Auth/Auth";
import { sec } from "./Auth/security"; //not in use

interface PrivateProps {
  auth: Auth;
}

const Private: React.FC<PrivateProps> = ({ auth }) => {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivateData = async () => {
      fetch("http://localhost:3001/private", {
        headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
      })
        .then((response) => {
          if (!response.ok) {
            console.log("Response status:", response.status);
            throw new Error("Network response was not ok.");
          }
          return response.json(); // Parse response as JSON
        })
        .then((data) => {
          setMessage(data.message);
          setError(null);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setMessage("");
          setError(err.message);
        });
    };
    fetchPrivateData();
  }, []);

  return (
    <div>
      {error ? <p>Error: {error}</p> : <p>{message || "Loading..."}</p>}
    </div>
  );
};

export default Private;
