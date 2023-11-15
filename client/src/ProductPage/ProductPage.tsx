import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Auth from "../Auth/Auth";

interface ProductPageProps {
  auth: Auth;
  productDetails?: {
    product_id: number;
    basename: string;
    note: string;
  };
}

const ProductPage: React.FC<ProductPageProps> = ({ auth }) => {
  const { productId } = useParams<{ productId: string }>();
  const [productDetails, setProductDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  console.log("productId here", productId);
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      // Handle unauthenticated user (e.g., redirect to login)
      return;
    }

    fetch(import.meta.env.VITE_REACT_APP_API_URL + `/api/products/${productId}`)
      .then((response) => {
        if (!response.ok) {
          console.log("Response status:", response.status);
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.json(); // Parse response body as JSON
      })
      .then((data) => {
        console.log("Data received:", data);
        setProductDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setLoading(false);
      });
  }, [productId, auth]);

  const handleDeleteProduct = () => {
    if (!productId) {
      return;
    }

    fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Handle success
        console.log("Product deleted successfully: ", data);
        history.push("/products");
      })
      .catch((error) => {
        // Handle error
        console.log("Error deleting product: ", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {productDetails ? (
        <>
          <h1>{productDetails.basename}</h1>
          <p>Product ID: {productDetails.product_id}</p>
          <p>{productDetails.note}</p>
          <button onClick={handleDeleteProduct}>Delete Product</button>
        </>
      ) : (
        <h2>Product not found</h2>
      )}
    </div>
  );
};

export default ProductPage;
