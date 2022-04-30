import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
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
        <a href="" className="btn btn-primary">
          Add to cart
        </a>
      </div>
    </div>
  );
};

export default Product;
