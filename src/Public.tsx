/* import React, { Component } from "react";

export default class Public extends Component {
  state = {
    message: "",
  };

  componentDidMount(): void {
    fetch("/public")
      .then((response) => {
        console.log("response", response);
        console.log("response body", response.body);
        if (response.ok) return response.json();
        throw new Error("Network response was not ok.");
      })
      .then((response) => this.setState({ message: response.message }))
      .catch((error) => this.setState({ message: error.message }));
  }
  render() {
    return <p>{this.state.message}</p>;
  }
}
 */
import React, { Component } from "react";

export default class Public extends Component {
  state = {
    message: "",
    error: null,
  };

  componentDidMount() {
    fetch("http://localhost:3001/public")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json(); // Parse response as JSON
      })
      .then((data) => {
        this.setState({ message: data.message, error: null });
      })
      .catch((error) => {
        this.setState({ message: "", error: error.message });
      });
  }

  render() {
    const { message, error } = this.state;

    return (
      <div>
        {error ? <p>Error: {error}</p> : <p>{message || "Loading..."}</p>}
      </div>
    );
  }
}
