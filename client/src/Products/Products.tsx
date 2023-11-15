import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ProductsTable from "../ProductsTable/ProductsTable";
import Auth from "../Auth/Auth";
import ProductDetails from "../ProductDetails/ProductDetails";

interface ProductsProps {
  auth: Auth; // Assuming Auth is required for authentication
}

const Products: React.FC<ProductsProps> = ({ auth }) => {
  const [productsData, setProductsData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null); // State for selected customer
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [databaseData, setDatabaseData] = useState<any[]>([]);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const accessToken = await auth.getAccessToken();

        const response = await fetch("/private", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          console.error("Response status:", response.status);
          throw new Error("Network response was not ok.");
        }

        const contentType = response.headers.get("Content-Type");
        console.log("contentType: ", contentType);

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setProductsData(data);
        } else {
          console.error("Unexpected response format:", contentType);
        }
      } catch (err: any) {
        console.error("Products API fetch error:", err);
        setError(err.message);
      }
    };

    if (auth.isAuthenticated()) {
      fetchProducts();
    }
  }, [auth]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/fetchProducts`)
      .then((response) => {
        if (!response.ok) {
          console.log("Database response status:", response.status);
          throw new Error("Database API response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        setDatabaseData(data);
      })
      .catch((err) => {
        console.error("Database API fetch error:", err);
        setError(err.message);
      });
  }, []);

  const handleProductClick = (productId: number) => {
    console.log(`Product clicked: ${productId}`);
    const selected = databaseData.find(
      (product) => product.product_id === productId
    );
    setSelectedProduct(selected);
  };

  const handleAddProductClick = () => {
    setIsAddFormVisible(true);
  };

  const filteredData = databaseData.filter(
    (product) =>
      product &&
      product.basename &&
      product.basename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const productName = formData.get("basename") as string; // Assuming "basename" is the name input's name attribute
    const note = formData.get("note") as string; // Get the note from the form data

    try {
      const requestBody = {
        basename: productName,
        company_id: 1, // Assuming a default company ID
        note: note, // Add the note to the request body
      };

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/addProduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error adding product:", errorMessage);
        throw new Error(`Failed to add product - ${errorMessage}`);
      }

      const addedProduct = await response.json();
      console.log("Product added successfully:", addedProduct);

      // Close the form
      setIsAddFormVisible(false);

      // Update productsData state with the newly added product
      setProductsData([...productsData, addedProduct]);

      // Show success toast
      toast.success("Product successfully added", {
        position: "top-center",
      });
    } catch (error: any) {
      console.error("Error adding product:", error);
      // Handle error, show error message or toast
      toast.error(error.message || "Failed to add product", {
        position: "top-center",
      });
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <button onClick={handleAddProductClick}>Add Product</button>
      {isAddFormVisible && (
        <div>
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Product Name"
              name="basename"
              // Add other input fields as needed
            />
            <br />
            <textarea
              placeholder="Add a note"
              name="note"
              maxLength={100}
              style={{ resize: "none" }}
              rows={3} // Number of visible text lines (adjust as needed)
              cols={50} // Number of visible text columns (adjust as needed)
            ></textarea>
            <br />
            <button type="submit">Add</button>
            <button onClick={() => setIsAddFormVisible(false)}>Cancel</button>
          </form>
        </div>
      )}
      <input
        type="text"
        placeholder="Search Products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ProductsTable
        products={filteredData}
        onProductClick={handleProductClick}
      />
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      {error && <p>Error fetching products: {error}</p>}
    </div>
  );
};

export default Products;
