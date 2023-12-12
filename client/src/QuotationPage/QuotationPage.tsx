import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Auth from "../Auth/Auth";

interface QuotationPageProps {
  auth: Auth;
  quotationDetails?: {
    sales_quotation_id: number;
    company_id: number;
    created_date: string;
    organisation_id: number;
    qty: number;
    product_id: number;
  };
}

const QuotationPage: React.FC<QuotationPageProps> = ({ auth }) => {
  const { quotationId } = useParams<{ quotationId: string }>();
  const [quotationDetails, setQuotationDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();

  console.log("quotationId here", quotationId);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      // Handle unauthenticated user (e.g., redirect to login)
      return;
    }

    fetchQuotationDetails();
  }, [quotationId, auth]);

  const fetchQuotationDetails = () => {
    fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/quotation/${quotationId}`
    )
      .then((response) => {
        if (!response.ok) {
          console.log("Response status:", response.status);
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.json(); // Parse response body as JSON
      })
      .then((data) => {
        console.log("Data received:", data);
        setQuotationDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quotation details:", error);
        setLoading(false);
      });
  };

  const handleDeleteQuotation = () => {
    if (!quotationId) {
      return;
    }

    fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/quotation/${quotationId}`,
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
        console.log("Quotation deleted successfully: ", data);
        history.push("/quotations"); // Redirect to quotations page after deletion
      })
      .catch((error) => {
        // Handle error
        console.log("Error deleting quotation: ", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {quotationDetails ? (
        <>
          <h1>Quotation ID: {quotationDetails.sales_quotation_id}</h1>
          <p>Company ID: {quotationDetails.company_id}</p>
          <p>Created date: {quotationDetails.created_date}</p>
          <p>Organisation ID: {quotationDetails.organisation_id}</p>
          <p>Quantity: {quotationDetails.qty}</p>
          <p>Product ID: {quotationDetails.product_id}</p>

          {/* Display other quotation details as needed */}
          <button onClick={handleDeleteQuotation}>Delete Quotation</button>
        </>
      ) : (
        <h2>Quotation not found</h2>
      )}
    </div>
  );
};

export default QuotationPage;
