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


app.get("/public", function (req, res) {
  res.json({
    message: "Hello from a public API!",
  });
});

app.get("/private", jwtCheck, function (req, res) {
  console.log("Reached /private route");
  console.log("req.user:", req.user);
  res.json({
    message: "Hello from a private API on port 3001",
  });
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
  // Extract organization data from the request body
  const { full_name } = req.body;

  // SQL query to insert data into the organisations table with company_id set to NULL
  const sql = `
    INSERT INTO organisations (full_name, create_date, created_by)
    VALUES (?, CURRENT_TIMESTAMP(), 1)
  `;

  // Execute the query with data (only full_name is provided)
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

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

