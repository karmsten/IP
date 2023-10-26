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

app.get('/api/customers/:customerId', function (req, res) {
  const customerId = req.params.customerId;

  const sql = 'SELECT * FROM customers WHERE customer_id = ?';
  
  db.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error('Error fetching customer details:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (Array.isArray(results) && results.length === 0) {
      // No customer found with the provided ID
      res.status(404).json({ error: 'Customer not found' });
    } else {
      if (Array.isArray(results)) {
        // Customer details found
        const customer = results[0];
        res.json(customer);
      } else {
        // Handle other result types if needed
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

