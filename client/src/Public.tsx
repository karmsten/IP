import { useState, useEffect } from "react";

export default function Public() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/public`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json(); // Parse response as JSON
      })
      .then((data) => {
        setMessage(data.message);
        setError(null);
      })
      .catch((error) => {
        setMessage("");
        setError(error.message);
      });
  }, []); // Empty dependency array means this effect runs once on component mount

  return (
    <div>
      {error ? <p>Error: {error}</p> : <p>{message || "Loading..."}</p>}
    </div>
  );
}
