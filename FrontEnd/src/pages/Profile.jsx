/* eslint-disable react/no-unescaped-entities */
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import { logoutUser } from "../redux/slice/loginSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
Loading;

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userProfil } = useSelector((state) => state.login);

  const logOut = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  if (!userProfil) {
    return <Loading />;
  }

  return (
    <main className="mainprofile">
      <section className="sectionprofile">
        <div className="accountpresentation">
          <div className={`accountname ${userProfil.firstName}`}>
            My account<h1>Hi {userProfil.firstName} </h1>
          </div>
          <Button text="Log Out" className={"button"} onClick={logOut} />
        </div>
        <nav className="navprofile">
          <ul className="ulprofile">
            <li>
              <a className="liorderprofile">My Orders</a>
            </li>
            <li>
              <a className="liaccountprofile">My Account</a>
            </li>
          </ul>
        </nav>
        <h2 className="h2profile">Order History</h2>
        <div className="order">
          <div className="orderbox">
            <p className="orderboxtext">You haven't placed any orders yet.</p>
          </div>
        </div>
        <div className="accountdetail">
          <h3>Account details</h3>
          <ul className="accountinfo">
            <li>First name : {userProfil.firstName}</li>
            <li>Last name : {userProfil.lastName}</li>
            <li>Email : {userProfil.email}</li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Profile;
