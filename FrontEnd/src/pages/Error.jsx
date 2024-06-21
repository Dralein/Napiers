import { NavLink } from "react-router-dom";
import Button from "../components/Button";

const Error = () => {
  return (
    <main className="errormain">
    <section className="error">
      <h1 className="errorh1">
      404
      </h1>
      <p>Looks like this page doesn’t exist.</p>
      <NavLink to={"/"}><Button text="Return Home" className={"button"} /></NavLink>
    </section>
    </main>
  );
};

export default Error;