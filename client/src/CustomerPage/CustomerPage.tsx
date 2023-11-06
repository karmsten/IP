import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Auth from "../Auth/Auth";
import { errors } from "jose";

interface CustomerPageProps {
  auth: Auth;
  customerDetails?: {
    // Make customerDetails an optional prop
    organisation_id: number;
    full_name: string;
    created_date: string;
    // Add more properties as needed
  };
}

const CustomerPage: React.FC<CustomerPageProps> = ({ auth }) => {
  const { customerId } = useParams<{ customerId: string }>();
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  console.log("customerId here", customerId);
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      // Handle unauthenticated user (e.g., redirect to login)
      return;
    }

    fetch(
      import.meta.env.VITE_REACT_APP_API_URL + `/api/customers/${customerId}`
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
        setCustomerDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching customer details:", error);
        setLoading(false);
      });
  }, [customerId, auth]);

  const handleDeleteCustomer = () => {
    if (!customerId) {
      return;
    }

    fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/customers/${customerId}`,
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
        console.log("Customer deleted successfully: ", data);
        history.push("/customers");
      })
      .catch((error) => {
        // Handle error
        console.log("Error deleting customer: ", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Customer Details</h2>
      {customerDetails ? (
        <>
          <h1>{customerDetails.full_name}</h1>
          <p>Customer ID: {customerDetails.organisation_id}</p>
          <p>Email: {customerDetails.created_date}</p>
          <button onClick={handleDeleteCustomer}>Delete Customer</button>
        </>
      ) : (
        <p>Customer not found</p>
      )}
    </div>
  );
};

export default CustomerPage;
