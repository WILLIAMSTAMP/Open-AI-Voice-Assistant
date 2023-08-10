import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to our Chat Application</h1>
      <Link to="/login">Log In</Link>
      <Link to="/register">Register</Link>
    </div>
  );
}

export default Home;