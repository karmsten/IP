import React from "react";
import "./CustomerDetails.css";

interface CustomerDetailsProps {
  customer: {
    organisation_id: number;
    full_name: string;
    created_date: string;
    // Add more properties as needed
  };
  onClose: () => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer,
  onClose,
}) => {
  return (
    <div className="customer-details-overlay">
      <div className="customer-details-content">
        <h2>Customer Details</h2>
        <p>Organisation ID: {customer.organisation_id}</p>
        <p>Full Name: {customer.full_name}</p>
        <p>Created Date: {customer.created_date}</p>
        {/* Add more details as needed */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CustomerDetails;
