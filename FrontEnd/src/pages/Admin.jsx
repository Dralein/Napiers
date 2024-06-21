import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import { logoutUser } from "../redux/slice/loginSlice";
import { useNavigate } from "react-router-dom";
import Users from "../components/Users";
import Products from "../components/Products";

const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userProfil, userToken } = useSelector((state) => state.login);
  const [activeTab, setActiveTab] = useState("users");
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const logOut = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <main className="mainprofile">
      <section className="sectionprofile">
        <div className="accountpresentation">
          <div className="accountname">
            My account<h1>Hi {userProfil.firstName} </h1>
          </div>
          <Button text="Log Out" className={"button"} onClick={logOut} />
        </div>
        <nav className="navprofile">
          <ul className="ulprofile">
            <li
              className={`liorderprofile ${
                activeTab === "users" ? "active" : ""
              }`}
              onClick={() => setActiveTab("users")}>
              Users
            </li>
            <li
              className={`liaccountprofile ${
                activeTab === "products" ? "active" : ""
              }`}
              onClick={() => setActiveTab("products")}>
              Products
            </li>
          </ul>
        </nav>
        {activeTab === "users" && (
          <Users
            userToken={userToken}
            updateTrigger={updateTrigger}
            setUpdateTrigger={setUpdateTrigger}
          />
        )}
        {activeTab === "products" && (
          <Products
            userToken={userToken}
            updateTrigger={updateTrigger}
            setUpdateTrigger={setUpdateTrigger}
          />
        )}
      </section>
    </main>
  );
};

export default Admin;
