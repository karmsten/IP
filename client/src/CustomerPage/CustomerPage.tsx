import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Auth from "../Auth/Auth";

interface CustomerPageProps {
  auth: Auth;
}

const CustomerPage: React.FC<CustomerPageProps> = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assuming you have an API endpoint to fetch customer details by ID
    fetch(`/api/customers/${customerId}`) // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        setCustomerDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching customer details:", error);
        setLoading(false);
      });
  }, [customerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Customer Details</h1>
      {customerDetails ? (
        <>
          <p>Customer ID: {customerDetails.customerId}</p>
          <p>Full Name: {customerDetails.fullName}</p>
          <p>Email: {customerDetails.email}</p>
          {/* Display more customer details here */}
        </>
      ) : (
        <p>Customer not found</p>
      )}
    </div>
  );
};

export default CustomerPage;
