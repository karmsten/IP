import express, { Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import { jwtCheck, dbp, corsOptions } from "./middlewares";


dotenv.config();
const app = express();
const port = process.env.PORT || 3001;


/* db.connect((err) => {
  if (err) {
    console.error("Database connection error: ", err)
    return;
  }
  console.log("Connected to MariaDB database")
}) */

dbp.getConnection((err) => {
  if (err) {
    console.error("Database connection error from dbp: ", err)
    return;
  }
  console.log("Connected to MariaDB through pool")
})


app.use(cors(corsOptions));
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

app.get("/fetchOrganisations", function (req, res) {
  console.log("organisations fetched successfully")
  dbp.query("SELECT * FROM organisations", (err, results) => {
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
  dbp.query("SELECT * FROM products", (err, results) => {
    if(err) {
      console.error("Error fetching data: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  })
})

app.get("/fetchQuotations", function (req, res) {
  console.log("quotations fetched successfully")
  dbp.query("SELECT * FROM sales_quotations", (err, results) => {
    if(err) {
      console.error("Error fetching data: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  })
})

app.get("/fetchQuotationsWithLines", function (req, res) {
  console.log("Quotations with lines fetched successfully");

  const sqlQuery = `
  SELECT
  sq.sales_quotation_id,
  sq.organisation_id,
  sq.created_date,
  sql_lines.qty,
  sql_lines.product_id
FROM sales_quotations sq
LEFT JOIN sales_quotation_lines sql_lines ON sq.sales_quotation_id = sql_lines.sales_quotation_id
`;

  dbp.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching data: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
});

app.get("/api/quotation/:quotationId", function (req, res) {
  const { quotationId } = req.params;
  console.log("Fetching quotation details for ID:", quotationId);

  const sqlQuery = `
    SELECT
      sq.sales_quotation_id,
      sq.organisation_id AS company_id,
      sq.created_date,
      sql_lines.qty,
      sql_lines.product_id
    FROM sales_quotations sq
    LEFT JOIN sales_quotation_lines sql_lines ON sq.sales_quotation_id = sql_lines.sales_quotation_id
    WHERE sq.sales_quotation_id = ?
  `;

  dbp.query(sqlQuery, [quotationId], (err, results) => {
    if (err) {
      console.error("Error fetching quotation details:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (!Array.isArray(results) || results.length === 0) {
      // If results are not an array or no results found for the given ID
      res.status(404).json({ message: "Quotation not found" });
      return;
    }

    // Assuming results is an array and extracting the first (and presumably only) result
    const quotationDetails = results[0];
    res.json(quotationDetails);
  });
});

app.post("/api/quotations", function (req, res) {
  const {
    company_id,
    organisation_id,
    qty,
    product_id,
    line_no
  } = req.body;

  const insertQuotationQuery = `INSERT INTO sales_quotations (company_id, organisation_id)
  VALUES (?, ?)`;

  dbp.query(insertQuotationQuery, [company_id, organisation_id], (err, results) => {
    if (err) {
      console.error("Error inserting into sales_quotations table:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  
    // Add a type assertion here
    const sales_quotation_id = (results as any).insertId;
  
    const insertQuotationLinesQuery = `
      INSERT INTO sales_quotation_lines (sales_quotation_id, qty, product_id, line_no)
      VALUES (?, ?, ?, ?)
    `;
  
    dbp.query(insertQuotationLinesQuery, [sales_quotation_id, qty, product_id, line_no], (err, results) => {
      if (err) {
        console.error("Error inserting into sales_quotation_lines table:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      
      res.status(200).json({ message: "Data added successfully to both tables" });
    });
  });
});

app.delete("/api/quotation/:quotationId", function (req, res) {
  const { quotationId } = req.params;

  const deleteLinesSqlQuery = `DELETE FROM sales_quotation_lines WHERE sales_quotation_id = ?`;
  const deleteQuotationSqlQuery = `DELETE FROM sales_quotations WHERE sales_quotation_id = ?`;

  dbp.query(deleteLinesSqlQuery, [quotationId], (err, results) => {
    if (err) {
      console.error("Error deleting quotation lines: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    dbp.query(deleteQuotationSqlQuery, [quotationId], (err, results) => {
      if (err) {
        console.error("Error deleting quotation: ", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json({ message: "Quotation deleted successfully" });
    });
  });
});

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

  dbp.query(sql, [full_name], (err, result) => {
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

  dbp.query(sql, [basename, note, company_id], (err, result) => {
    if (err) {
      console.error("Error adding product:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    console.log("Product added successfully");
    return res.status(200).json({ message: "Product added successfully" });
  });
});

app.post("/addQuotation", (req, res) => {
  const { company_id, organisation_id, created_by } = req.body;

  const sql = `INSERT INTO sales_quotations (company_id, organisation_id, created_by, created_date) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *`;

  dbp.query(sql, [company_id, organisation_id, created_by], (err, result) => {
    if(err) {
      console.error("Error adding quotation: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    console.log("Quotation added successfully");
    return res.status(200).json({ message: "Quotation added successfully" });
  });
});

app.post("/addQuotationLines", (req, res) => {
  const { sales_quotation_id, created_by, line_type, qty, product_id, line_text, line_no } = req.body;

  const sql = `INSERT INTO sales_quotation_lines (sales_quotation_id, created_by, line_type, qty, product_id, line_text, line_no, created_date) VALUES ($1, $2, $3, $4, $5, $6, $7, current_timestamp)`;

  dbp.query(sql, [sales_quotation_id, created_by, line_type, qty, product_id, line_text, line_no], (err, result) => {
    if(err) {
      console.error("Error adding quotationLines: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    console.log("QuotationLines added successfully");
    return res.status(200).json({ message: "QuotationLines added successfully" });
  });
});

app.get('/api/customers/:customerId', function (req, res) {
  const customerId = req.params.customerId;
  console.log("customerId: ", customerId)
  // Modify the SQL query to select the organization based on organization_id
  const sql = 'SELECT * FROM organisations WHERE organisation_id = ?';

  dbp.query(sql, [customerId], (err, results) => {
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

  dbp.query(sql, [customerId], (err, result) => {
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

  dbp.query(sql, [productId], (err, results) => {
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

  dbp.query(sql, [productId], (err, result) => {
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

