import React, { useState, useEffect } from "react";
import Auth from "./Auth/Auth";
/* import { sec } from "./Auth/security"; */ //not in use
import CustomersTable from "./CustomersTable";
import CustomerDetails from "./CustomerDetails"; // Import the CustomerDetails component

interface PrivateProps {
  auth: Auth;
}

const Private: React.FC<PrivateProps> = ({ auth }) => {
  const [backendMessage, setBackendMessage] = useState<string>("");
  const [databaseData, setDatabaseData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null); // State for selected customer
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

  console.log(backendMessage, error); // only to be able to build (needs a proper solution)

  useEffect(() => {
    // Make an API call to the backend (port 3001) to get a message
    fetch("/private", {
      headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Response status:", response.status);
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        setBackendMessage(data.message);
      })
      .catch((err) => {
        console.error("Backend API fetch error:", err);
        setError(err.message);
      });
  }, [auth]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/fetchOrganisations`)
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

  const handleAddOrganization = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const full_name = formData.get("full_name");

    // Send a POST request to your backend to add the organization
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/addOrganisation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ full_name }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Error adding organization:", response.status);
          throw new Error("Failed to add organization");
        }
        return response.json();
      })
      /* .then((data) => {
        console.log("Organization added successfully");
        setIsAddFormVisible(false); // Close the form
        // Optionally, you can update the displayed list of organizations here
      }) */
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const handleCustomerClick = (customerId: number) => {
    const selected = databaseData.find(
      (customer) => customer.organisation_id === customerId
    );
    setSelectedCustomer(selected);
  };
  /*   const handleCloseDetails = () => {
    setSelectedCustomer(null);
  }; */
  const handleAddButtonClick = () => {
    setIsAddFormVisible(true);
  };

  const filteredData = databaseData.filter((customer) =>
    customer.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <button onClick={handleAddButtonClick}>Add Organization</button>
      {isAddFormVisible && (
        <div>
          <form onSubmit={handleAddOrganization}>
            <input
              type="text"
              placeholder="Full Name"
              name="full_name"
              // Add other input fields as needed
            />
            <button type="submit">Add</button>
            <button onClick={() => setIsAddFormVisible(false)}>Cancel</button>
          </form>
        </div>
      )}
      <input
        type="text"
        placeholder="Search Customers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <CustomersTable
        customers={filteredData}
        onCustomerClick={handleCustomerClick}
      />
      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default Private;
