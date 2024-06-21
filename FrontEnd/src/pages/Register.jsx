/* eslint-disable react/no-unescaped-entities */
import Button from "../components/Button";
import FlowerImage from "../assets/Flower.jsx";
import { NavLink } from "react-router-dom";
import { createUser } from "../api/api.js";
import { useState } from "react";

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await createUser(firstname, lastname, email, password);
    if (response.message) {
      setMessage(response.message);
    } else if (response.errors) {
      setMessage(`Errors: ${JSON.stringify(response.errors)}`);
    } else {
      setMessage("An error occurred");
    }
  };

  return (
    <main className="mainlogin">
      <section className="sectionlogin">
        <h1 className="h1login">Register</h1>
        <form className="formlogin" onSubmit={handleSubmit}>
          <div className="flexformname">
            <div className="input-wrapper">
              <label htmlFor="First name">First name</label>
              <input
                className="forminput"
                type="text"
                placeholder="First name"
                id="First name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="Last name">Last name</label>
              <input
                className="forminput"
                type="text"
                placeholder="Last name"
                id="Last name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-wrapper">
            <label htmlFor="email">Email</label>
            <input
              className="forminput"
              placeholder="Your email address"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              className="forminput"
              type="password"
              placeholder="Your password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button className="button" text="Register" />
        </form>
        {message && <p>{message}</p>}
        <p>
          Already have an account ? <NavLink to={"/login"}> Login</NavLink>
        </p>
        <FlowerImage />
      </section>
    </main>
  );
};

export default Register;
