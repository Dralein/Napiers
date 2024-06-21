import { Twirl as Hamburger } from "hamburger-react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Sidenav = () => {
  const [isOpen, setOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth >= 1024) {
      setOpen(false);
    }
  }, [windowWidth]);

  const toggleNav = () => {
    setOpen(!isOpen);
  };

  const closeNav = () => {
    setOpen(false);
  };

  return (
    <>
      <Hamburger
        toggled={isOpen}
        toggle={toggleNav}
        size={18}
        label="Show menu"
      />
      <div className={`sidenav ${isOpen ? "open" : ""}`}>
        <nav className="sidenav-nav">
          <ul className="sidenav-ul">
            <li className="sidenav-li">
              <NavLink to="/products" onClick={closeNav}>
                Shop
              </NavLink>
            </li>
            <li className="sidenav-li" onClick={closeNav}>
              Prescriptions
            </li>
            <li className="sidenav-li" onClick={closeNav}>
              Napiers
            </li>
            <li className="sidenav-li" onClick={closeNav}>Book</li>
            <li className="sidenav-li" onClick={closeNav}>
              Blog
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidenav;
