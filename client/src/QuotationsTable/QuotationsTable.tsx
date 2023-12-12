import React from "react";

interface Quotation {
  sales_quotation_id: number;
  company_id: number;
  created_date: string;
  organisation_id: number;
  qty: number;
  product_id: number;
  // Add other quotation fields as needed
}

interface QuotationsTableProps {
  quotations: Quotation[];
  onQuotationClick: (sales_quotation_id: number) => void; // Function to handle quotation click
}

const QuotationsTable: React.FC<QuotationsTableProps> = ({
  quotations,
  onQuotationClick,
}) => {
  const formatCreatedDate = (createdDate: string) => {
    const dateParts = createdDate.split("T");
    return dateParts[0];
  };

  const handleRowClick = (salesQuotationId: number) => {
    // Call the onQuotationClick function with the clicked quotation ID
    onQuotationClick(salesQuotationId);
  };

  return (
    <table className="quotations-table">
      <thead>
        <tr>
          <th className="table-header">Quotation ID</th>
          <th className="table-header">Organization ID</th>
          <th className="table-header">Created at</th>
          <th className="table-header">Quantity</th>
          <th className="table-header">Product ID</th>
          {/* Add other headers if needed */}
        </tr>
      </thead>
      <tbody>
        {quotations.map((quotation) => (
          <tr
            key={quotation.sales_quotation_id}
            className="table-row"
            onClick={() => handleRowClick(quotation.sales_quotation_id)}
          >
            <td className="table-cell">{quotation.sales_quotation_id}</td>
            <td className="table-cell">{quotation.organisation_id}</td>
            <td className="table-cell">
              {formatCreatedDate(quotation.created_date)}
            </td>
            <td className="table-cell">{quotation.qty}</td>
            <td className="table-cell">{quotation.product_id}</td>
            {/* Add other cells if needed */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QuotationsTable;
