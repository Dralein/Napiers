import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Profile from "../pages/Profile";
import Error404 from "../pages/Error";
import Privatelogin from "../routes/Privatelogin";
import Privateprofile from "../routes/Privateprofile";
import Privateadmin from "../routes/Privateadmin";
import Admin from "../pages/Admin";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <Privatelogin>
              <Login />
            </Privatelogin>
          }
        />
        <Route
          path="/register"
          element={
            <Privatelogin>
              <Register />
            </Privatelogin>
          }
        />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route
          path="/profile"
          element={
            <Privateprofile>
              <Profile />
            </Privateprofile>
          }
        />
        <Route path="*" element={<Error404 />} />
        <Route
          path="/admin"
          element={
            <Privateadmin>
              <Admin />
            </Privateadmin>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
