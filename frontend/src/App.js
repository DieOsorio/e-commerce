import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import { LinkContainer } from "react-router-bootstrap";
import { useContext } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <nav className="navbar navbar-dark bg-dark">
            <div className="container">
              <LinkContainer className="point" to="/">
                <div className="navbar-brand">amazona</div>
              </LinkContainer>
              <nav className="nav me-auto">
                <Link to="/cart" className="nav-link link-color">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <span className="badge bg-danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                  )}
                </Link>
                {userInfo ? (
                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle bg-dark link-color"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ border: "none" }}
                    >
                      {userInfo.name}
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          User Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/orderhistory">
                          Order History
                        </Link>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          to="#signout"
                          onClick={signoutHandler}
                        >
                          Sign Out
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <Link className="nav-link link-color" to="/signin">
                    Sign In
                  </Link>
                )}
              </nav>
            </div>
          </nav>
        </header>
        <main>
          <div className="container mt-3">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
            </Routes>
          </div>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
