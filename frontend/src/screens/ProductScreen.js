import { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Rating from "../components/Rating";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const navegate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ error, loading, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    product: [],
  });

  const fetchData = async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const response = await fetch(`/api/products/slug/${slug}`);
      if (!response.ok) {
        throw new Error("Product not found");
      }
      const products = await response.json();
      dispatch({ type: "FETCH_SUCCESS", payload: products });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: getError(error) });
    }
  };
  useEffect(() => {
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async (e) => {
    e.preventDefault();
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const data = await fetch(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: quantity },
    });
    navegate("/cart");
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} alt={product.name} className="img-large" />
        </div>
        <div className="col-md-3">
          <ul className="list-group">
            <li className="list-group-item">
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </li>
            <li className="list-group-item">
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </li>
            <li className="list-group-item">Price : ${product.price}</li>
            <li className="list-group-item">
              Description:
              <p>{product.description}</p>
            </li>
          </ul>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item">
                  <div className="row">
                    <div className="col">Price:</div>
                    <div className="col">${product.price}</div>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="row">
                    <div className="col">Status:</div>
                    <div className="col">
                      {product.countInStock > 0 ? (
                        <span className="badge bg-success">In Stock</span>
                      ) : (
                        <span className="badge bg-danger">Unavailable</span>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-group-item">
                  {product.countInStock > 0 && (
                    <div className="list-group-item">
                      <div className="d-grid">
                        <a
                          onClick={addToCartHandler}
                          href=""
                          className="btn btn-primary"
                        >
                          Add to Cart
                        </a>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;
