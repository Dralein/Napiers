/* eslint-disable react/no-unescaped-entities */
import { NavLink } from "react-router-dom";
import Button from "./../components/Button";
import { MdOutlineStarPurple500 } from "react-icons/md";


const Home = () => {


  return (
    <main>
      <section className="mainsectionlanding">
        <h1>Herbal Wellness, Skincare & Remedies</h1>
        <h2>
          For 164 years we've been formulating exceptional herbal products
        </h2>
        <NavLink to={"/products"}>
          <Button text="Shop Now" className={"button"} />
        </NavLink>
        <div className="sectionrating">
          <MdOutlineStarPurple500 color="white" />
          <MdOutlineStarPurple500 color="white" />
          <MdOutlineStarPurple500 color="white" />
          <MdOutlineStarPurple500 color="white" />
          <MdOutlineStarPurple500 color="white" />
        </div>
        <blockquote>
          <p>
            "A trusted and reliable supplier of quality products who has served
            me well over many years."
          </p>
          <footer>Paul , 03 Apr 2024</footer>
        </blockquote>
      </section>
    </main>
  );
};

export default Home;
