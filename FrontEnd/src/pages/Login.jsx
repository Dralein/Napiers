/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { storeToken, infoUser, setAdmin, setLogged } from "../redux/slice/loginSlice.js";
import { logUser, getUserProfile } from "../api/api.js";
import Button from "../components/Button";
import FlowerImage from "../assets/Flower.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await logUser(email, password);
      
      if (userData && userData.token) {
        const token = userData.token;
        dispatch(storeToken(token));
    
        const userInfo = await getUserProfile(token);
    
        dispatch(
          infoUser({
            email: userInfo.email,
            firstName: userInfo.firstname,
            lastName: userInfo.lastname,
            admin: userInfo.admin,
          })
        );

        dispatch(setLogged());
    
        if (userInfo.admin === true) {
          dispatch(setAdmin(true));
        }
    
        navigate("/profile");
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error) {
      setMessage("Identifiants incorrects");
    }
  };

  return (
    <main className="mainlogin">
      <section className="sectionlogin">
        <h1 className="h1login">Login</h1>
        <form className="formlogin" onSubmit={handleLogin}>
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
          <Button className="button" text="Login" />
        </form>
        {message && <p>{message}</p>}
        <p>
          Don't have an account?{" "}
          <NavLink to={"/register"}> Create account</NavLink>
        </p>
        <FlowerImage />
      </section>
    </main>
  );
};

export default Login;
