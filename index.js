// const express = require('express');
// const mysql2 = require('mysql2');
// const app = express();
// const PORT = 3000;


// // Database connection pool
// const pool = mysql2.createPool({
//   host: 'localhost',      // change as needed
//   user: 'root',           // change as needed
//   password: '',           // change as needed
//   database: 'pendulum'     // change as needed
// });


// // Middleware (optional)
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// //CORS Middleware
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin',  ' http://localhost:8081'); 
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//   next();
// });



// // Route
// app.get('/', (req, res) => {
//   res.send('Backend Works!!');
// });



// // SIGN UP HANDLER
// //Manufacturer Registration
// app.post('/register-m', (req, res) => {
//   const { company_name, company_service, phone, email, country, address, password, company_registration, tax_compliance } = req.body;
  
//  pool.query(
//     'INSERT INTO manufacturer_registration (company_name, company_services, phone, email, country, address, company_registration, tax_compliance, password) VALUES (?, ?, ?, ?, ?, ? , ?, ?, ?)',
//     [company_name, company_service, phone, email, country, address, company_registration, tax_compliance, password ],
//     (err, results) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error creating Manufacturer.');
//       } else {
//         res.status(200).send('Manufacturer created successfully.');
//       }
//     }
//   );
// });


// //Individual Registration
// app.post('/api/signup', async (req, res) => {
//   const { firstname, lastname, phone, email, country, address, password, policies } = req.body;

//   pool.query(
//     'INSERT INTO individual_registration (firstname, lastname, phone, email, country, address, password, policies) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//     // ["firstname", "lastname", "3235566", "email@gmai.com", "country", "address", "password", "policies"],
//     [firstname, lastname, phone, email, country, address, password, policies],
//     (err, results) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error creating Individual.');
//       } else {
//         res.status(200).send('Individual created successfully.');
//       }
//     }
//   );
// });



// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });




// index.js
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Database connection pool
const pool = mysql.createPool({
  host: "localhost",       // change if needed
  user: "root",            // change if needed
  password: "",            // change if needed
  database: "pendulum",    // change if needed
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:8081", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Test route
app.get("/", (req, res) => {
  res.send("Backend Works!!");
});

// Manufacturer Registration
app.post("/register-m", async (req, res) => {
  try {
    const {
      company_name,
      company_service,
      phone,
      email,
      country,
      address,
      password,
      company_registration,
      tax_compliance,
    } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO manufacturer_registration
      (company_name, company_services, phone, email, country, address, company_registration, tax_compliance, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      company_name,
      company_service,
      phone,
      email,
      country,
      address,
      company_registration,
      tax_compliance,
      hashedPassword,
    ];

    await pool.query(sql, values);
    res.status(200).send("Manufacturer created successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating Manufacturer.");
  }
});

// Individual Registration
app.post("/api/signup", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      phone,
      email,
      country,
      address,
      password,
      policies,
    } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO individual_registration
      (firstname, lastname, phone, email, country, address, password, policies)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      "firstname",
      "lastname",
      "45678",
      "email",
      "country",
      "address",
      "hashedPassword",
      "policies",
    ];

    await pool.query(sql, values);
    res.status(200).send("Individual created successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating Individual.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
