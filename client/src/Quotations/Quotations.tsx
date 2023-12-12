import React, { useState, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import Auth from "../Auth/Auth";
import QuotationsTable from "../QuotationsTable/QuotationsTable";
import QuotationDetails from "../QuotationsDetails/QuotationDetails";

interface QuotationsProps {
  auth: Auth;
}

const Quotations: React.FC<QuotationsProps> = ({ auth }) => {
  const [databaseData, setDatabaseData] = useState<any[]>([]);
  const [backendMessage, setBackendMessage] = useState<string>("");
  const [selectedQuotation, setSelectedQuotation] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await auth.getAccessToken();

        // Make an API call to the backend to get a message
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
          setBackendMessage(data.message);
        } else {
          // Handle non-JSON responses, e.g., HTML or other content types
          console.error("Unexpected response format:", contentType);
          // You can choose to handle this case differently, e.g., show an error message.
        }
      } catch (err: any) {
        console.error("Backend API fetch error:", err);
        setError(err.message);
      }
    };

    if (auth.isAuthenticated()) {
      fetchData();
    }
  }, [auth]);

  useEffect(() => {
    const fetchQuotationsWithLines = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/fetchQuotationsWithLines`
        );
        console.log("response from fetchquotationswithlines: ", response);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setDatabaseData(data); // Update state with the fetched data
      } catch (error: any) {
        console.error("Error fetching data:", error);
        // Handle error condition
        setError(error.message);
      }
    };

    fetchQuotationsWithLines();
  }, []);

  const handleAddQuotation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Get a reference to the form elements
    const target = event.target as typeof event.target & {
      company_id: { value: string };
      organisation_id: { value: string };
      qty: { value: string };
      product_id: { value: string };
      line_no: { value: string };
    };

    // Get the form data
    const company_id = target.company_id.value;
    const organisation_id = target.organisation_id.value;
    const qty = target.qty.value;
    const product_id = target.product_id.value;
    const line_no = target.line_no.value;

    // Create the quotation data object
    const quotationData = {
      company_id,
      organisation_id,
      qty,
      product_id,
      line_no,
    };

    // Send the POST request
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/quotations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quotationData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsAddFormVisible(false);
        // Refresh the quotations data
      })
      .catch((error) => {
        console.error("Error adding quotation:", error);
      });
  };

  const handleQuotationClick = (sales_quotation_id: number) => {
    const selected = databaseData.find(
      (quotation) => quotation.sales_quotation_id === sales_quotation_id
    );
    setSelectedQuotation(selected);
  };

  const handleAddButtonClick = () => {
    setIsAddFormVisible(true);
  };

  const filteredData = databaseData.filter((quotation) =>
    Object.values<any>(quotation).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div>
      <h1>Quotations</h1>
      <button onClick={handleAddButtonClick}>Add Quotation</button>
      {isAddFormVisible && (
        <div>
          <form onSubmit={handleAddQuotation}>
            <label htmlFor="company_id">Company ID:</label>
            <input type="text" id="company_id" name="company_id" />

            <label htmlFor="organisation_id">Organization ID:</label>
            <input type="text" id="organisation_id" name="organisation_id" />

            <label htmlFor="created_by">Created By:</label>
            <input type="text" id="created_by" name="created_by" />

            {/* Additional input fields for other necessary quotation data */}
            {/* Add fields for sales_quotation_lines table */}
            <label htmlFor="qty">Quantity:</label>
            <input type="text" id="qty" name="qty" />

            <label htmlFor="product_id">Product ID:</label>
            <input type="text" id="product_id" name="product_id" />

            <label htmlFor="line_no">Line No:</label>
            <input type="text" id="line_no" name="line_no" />

            {/* Adjust these according to your backend requirements */}

            <button type="submit">Add</button>
            <button onClick={() => setIsAddFormVisible(false)}>Cancel</button>
          </form>
        </div>
      )}

      <input
        type="text"
        placeholder="Search Quotations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Render a table or list of quotations */}

      <QuotationsTable
        quotations={filteredData}
        onQuotationClick={handleQuotationClick}
      />

      {/* Render details of a selected quotation */}
      {selectedQuotation && (
        <QuotationDetails
          quotation={selectedQuotation}
          onClose={() => setSelectedQuotation(null)}
        />
      )}
    </div>
  );
};

export default Quotations;
