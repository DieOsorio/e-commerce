import { useContext } from "react";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import Rating from "./Rating";

const Product = ({ product }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const response = await fetch(`/api/products/${item._id}`);
    const data = await response.json();
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  return (
    <div className="card">
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product.slug}`}>
          <p className="card-title">{product.name}</p>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <p className="card-text">${product.price}</p>
        {product.countInStock === 0 ? (
          <button className="btn btn-light" disabled>
            Out of stock
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => addToCartHandler(product)}
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
