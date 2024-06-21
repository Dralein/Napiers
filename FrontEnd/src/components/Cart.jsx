import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import { updateQuantity, removeItem } from "../redux/slice/cartSlice";
import Button from "./Button";

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCart = () => setIsOpen(!isOpen);

  const handleQuantityChange = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeItem({ id }));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      <li className="navli">
        <MdOutlineShoppingCart
          size={24}
          onClick={toggleCart}
          label="Show shopping cart"
        />
        {windowWidth >= 1024 && <span>Cart</span>}
      </li>
      {isOpen && <div className="shadow-background" onClick={toggleCart}></div>}
      <div className={`cart ${isOpen ? "open" : ""}`}>
        <FaXmark className="close-button" size={36} onClick={toggleCart} />
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <>
              <h1>Your cart is currently empty</h1>
              <div>There are no items in your cart.</div>
              <NavLink onClick={toggleCart} to="/products">
                <Button text="Continue Shopping" className="button" />
              </NavLink>
            </>
          ) : (
            <>
              <h1>My Basket</h1>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-card-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-card-item-image"
                  />
                  <div className="cart-item-details">
                    <p>{item.name}</p>
                    <p>{(item.price * item.quantity).toFixed(2)}€</p>
                    <div className="input-remove">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                      min="1"
                    />
                    <p onClick={() => dispatch(removeItem({ id: item.id }))}>
                      Remove
                    </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="cart-total">
                <NavLink onClick={toggleCart} to="/checkout">
                  <Button
                    text={`Checkout ${totalPrice.toFixed(2)}€`}
                    className="button"
                  />
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
