import React from "react";
import { Link } from "react-router-dom";
import "./ProductDetails.css";

interface ProductDetailsProps {
  product: {
    product_id: number;
    basename: string;
    note: string;
  };
  onClose: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onClose,
}) => {
  return (
    <div className="product-details-overlay">
      <div className="product-details-content">
        <h2>Product Details</h2>
        <p>Product ID: {product.product_id}</p>
        <p>Product name: {product.basename}</p>
        <p>notes: {product.note}</p>
        <button onClick={onClose}>Close</button>
        <Link to={`/product/${product.product_id}`}>
          <button>Go To Product</button>
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;
