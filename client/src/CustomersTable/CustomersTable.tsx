import React from "react";
import "./CustomersTable.css";

interface CustomerTableProps {
  customers: Array<{
    organisation_id: number;
    full_name: string;
    created_date: string;
  }>;
  onCustomerClick: (customerId: number) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onCustomerClick,
}) => {
  const formatCreatedDate = (createdDate: string) => {
    const dateParts = createdDate.split("T");
    return dateParts[0];
  };

  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th className="table-header">Organisation ID</th>
          <th className="table-header">Full Name</th>
          <th className="table-header">Created at</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr
            key={customer.organisation_id}
            className="table-row"
            onClick={() => onCustomerClick(customer.organisation_id)}
          >
            <td className="table-cell">{customer.organisation_id}</td>
            <td className="table-cell">{customer.full_name}</td>
            <td className="table-cell">
              {formatCreatedDate(customer.created_date)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomerTable;
