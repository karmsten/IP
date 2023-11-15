import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { jwtCheck, db, corsOptions } from "./middlewares";


dotenv.config();

const app = express();

const port = process.env.PORT || 3001;


db.connect((err) => {
  if (err) {
    console.error("Database connection error: ", err)
    return;
  }
  console.log("Connected to MariaDB database")
})


app.use(cors(corsOptions));

// Create a middleware function to log request bodies
app.use(express.json()); // This middleware is needed to parse JSON request bodies

app.use((req, res, next) => {
  console.log('Request body:', req.body);
  next(); // Continue processing the request
});


app.get("/public", function (req, res) {
  res.json({
    message: "Hello from a public API!",
  });
});

app.get("/private", jwtCheck, function (req: any, res) {
  try {
    console.log("Reached /private route");
    console.log("req.user:", req.user);

    // Simulate a JSON response for testing
    const data = {
      message: "Hello from a private API on port 3001",
    };

    // Send a JSON response
    res.json(data);
  } catch (err) {
    console.error("Error in /private route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//not in use
app.get("/fetchCustomers", function (req, res) {
  console.log("customers fetched successfully")
  db.query("SELECT * FROM customers", (err, results) => {
    if(err) {
      console.error("Error fetching data: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  })
})

app.get("/fetchOrganisations", function (req, res) {
  console.log("organisations fetched successfully")
  db.query("SELECT * FROM organisations", (err, results) => {
    if(err) {
      console.error("Error fetching data: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  })
})

app.get("/fetchProducts", function (req, res) {
  console.log("products fetched successfully")
  db.query("SELECT * FROM products", (err, results) => {
    if(err) {
      console.error("Error fetching data: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  })
})

app.post("/addOrganisation", (req, res) => {

  const { full_name } = req.body;
  if (!full_name) {
    return res.status(400).json({ error: "full_name is required in the request body" });
  }

  const sql = `
  INSERT INTO organisations
(full_name, company_id, created_date, created_by, changed_date, changed_by)
VALUES (?, NULL, current_timestamp(), 1, NULL, NULL);
  `;

  db.query(sql, [full_name], (err, result) => {
    if (err) {
      console.error("Error adding organization:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    console.log("Organization added successfully");
    res.status(200).json({ message: "Organization added successfully" });
  });
});

app.post("/addProduct", (req, res) => {
  const { basename, note, company_id } = req.body;
  if (!basename || !company_id) {
    return res.status(400).json({ error: "basename and company_id are required in the request body" });
  }

  const sql = `
    INSERT INTO zterp01.products
    (basename, note, company_id, product_type_id)
    VALUES (?, ?, ?, NULL);
  `;

  db.query(sql, [basename, note, company_id], (err, result) => {
    if (err) {
      console.error("Error adding product:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    console.log("Product added successfully");
    return res.status(200).json({ message: "Product added successfully" });
  });
});

app.get('/api/customers/:customerId', function (req, res) {
  const customerId = req.params.customerId;
  console.log("customerId: ", customerId)
  // Modify the SQL query to select the organization based on organization_id
  const sql = 'SELECT * FROM organisations WHERE organisation_id = ?';

  db.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error('Error fetching customer details:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (Array.isArray(results) && results.length === 0) {
      // No organization found with the provided ID
      res.status(404).json({ error: 'Organization not found' });
    } else {
      if (Array.isArray(results)) {
        // Organization details found
        const organization = results[0];

        // Set the content type header to "application/json" before sending the JSON response
        res.setHeader("Content-Type", "application/json");

        // Send a JSON response with the organization details
        res.json(organization);
      } else {
        // Handle other result types if needed
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });
});

app.delete('/api/customers/:customerId', function (req, res) {
  const customerId = req.params.customerId;

  const sql = 'DELETE FROM organisations WHERE organisation_id = ?';

  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error('Error deleting customer:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  
    // Check the type of result to determine if 'affectedRows' is available
    if ('affectedRows' in result && typeof result.affectedRows === 'number') {
      if (result.affectedRows === 0) {
        // No customer found with the provided ID
        res.status(404).json({ error: 'Customer not found' });
      } else {
        // Customer deleted successfully
        res.status(200).json({ message: 'Customer deleted successfully' });
      }
    } else {
      // Handle other result types if needed
      res.status(500).json({ error: 'Internal server error' });
    }
  });
})

app.get('/api/products/:productId', function (req, res) {
  const productId = req.params.productId;
  console.log("productId: ", productId)
  // Modify the SQL query to select the product based on product_id
  const sql = 'SELECT * FROM products WHERE product_id = ?';

  db.query(sql, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching product details:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (Array.isArray(results) && results.length === 0) {
      // No product found with the provided ID
      res.status(404).json({ error: 'Product not found' });
    } else {
      if (Array.isArray(results)) {
        // Product details found
        const product = results[0];

        // Set the content type header to "application/json" before sending the JSON response
        res.setHeader("Content-Type", "application/json");

        // Send a JSON response with the product details
        res.json(product);
      } else {
        // Handle other result types if needed
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });
});

app.delete('/api/products/:productId', function (req, res) {
  const productId = req.params.productId;

  const sql = 'DELETE FROM products WHERE product_id = ?';

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  
    // Check the type of result to determine if 'affectedRows' is available
    if ('affectedRows' in result && typeof result.affectedRows === 'number') {
      if (result.affectedRows === 0) {
        // No product found with the provided ID
        res.status(404).json({ error: 'Product not found' });
      } else {
        // Product deleted successfully
        res.status(200).json({ message: 'Product deleted successfully' });
      }
    } else {
      // Handle other result types if needed
      res.status(500).json({ error: 'Internal server error' });
    }
  });
})

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

