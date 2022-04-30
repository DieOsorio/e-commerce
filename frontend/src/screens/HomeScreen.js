import { useEffect, useReducer } from "react";
import Product from "../components/Product";
// import data from "../data";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomeScreen = () => {
  //const [products, setProducts] = useState([]);
  const [{ error, loading, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    products: [],
  });

  const fetchData = async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const response = await fetch("/api/products");
      const result = await response.json();
      dispatch({ type: "FETCH_SUCCESS", payload: result });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: err.message });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <h1>Feature Products</h1>
      <div className="products">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="row">
            {products.map((product) => (
              <div key={product.slug} className="col-6 col-md-4 col-lg-3 mb-3">
                <Product product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
