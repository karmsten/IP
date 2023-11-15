import React from "react";
import "./ProductsTable.css"; // Import your CSS for styling

interface ProductsTableProps {
  products: Array<{
    product_id: number;
    basename: string;
  }>;
  onProductClick: (productId: number) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onProductClick,
}) => {
  return (
    <table className="products-table">
      <thead>
        <tr>
          <th className="table-header">Product ID</th>
          <th className="table-header">Product Name</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr
            key={product.product_id}
            className="table-row"
            onClick={() => onProductClick(product.product_id)}
          >
            <td className="table-cell">{product.product_id}</td>
            <td className="table-cell">{product.basename}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductsTable;
