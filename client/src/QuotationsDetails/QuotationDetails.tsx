import React from "react";
import { Link } from "react-router-dom";
import "./QuotationDetails.css";

interface QuotationDetailsProps {
  quotation: {
    sales_quotation_id: number;
    company_id: number;
    created_date: string;
    organisation_id: number;
    qty: number;
    product_id: number;
  };
  onClose: () => void;
}

const QuotationDetails: React.FC<QuotationDetailsProps> = ({
  quotation,
  onClose,
}) => {
  return (
    <div className="quotation-details-overlay">
      <div className="quotation-details-content">
        <h2>Quotation Details</h2>
        <p>Quotation ID: {quotation.sales_quotation_id}</p>
        <p>Company ID: {quotation.company_id}</p>
        <p>Created date: {quotation.created_date}</p>
        <p>Organisation ID: {quotation.organisation_id}</p>
        <p>Quantity: {quotation.qty}</p>
        <p>Product ID: {quotation.product_id}</p>
        <button onClick={onClose}>Close</button>
        <Link to={`/quotation/${quotation.sales_quotation_id}`}>
          <button>Go To Quotation</button>
        </Link>
      </div>
    </div>
  );
};

export default QuotationDetails;
