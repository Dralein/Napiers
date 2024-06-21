import { useState, useEffect } from 'react';
import { IoIosSearch } from "react-icons/io";
import { BsPersonFill } from "react-icons/bs";
import { NavLink } from 'react-router-dom';
import Logo from '../assets/Logo';
import Sidenav from '../components/Sidenav';
import Cart from "./Cart";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";

const Header = () => {
  const logged = useSelector((state) => state.login.logged);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="header">
      <div className='hamburgerlogo'>
        {windowWidth < 1024 && <Sidenav className="sidenav" />}
        <NavLink to={"/"}><Logo className="headerlogo" /></NavLink>
      </div>
      <nav className="nav">
        <ul className="navul">
          <li className='navli'>
            <IoIosSearch onClick={() => setShowSearch(!showSearch)} size={24} label="Show search" />
            {windowWidth >= 1024 && <span>Search</span>}
            {showSearch && <SearchBar />}
          </li>
          <li className='navli'>
            <NavLink to={logged ? "profile" : "login"}>
              <BsPersonFill size={24} label={logged ? "Show profile page" : "Show login page"} />
              {windowWidth >= 1024 && <span>Account</span>}
            </NavLink>
          </li>
          <Cart />
        </ul>
      </nav>
    </header>
  );
};

export default Header;
