const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 3000;


// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',      // change as needed
  user: 'root',           // change as needed
  password: '',           // change as needed
  database: 'pendulum'     // change as needed
});


// Middleware (optional)
app.use(express.json());


//CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin',  ' http://localhost:8081'); // 
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});



// Route
app.get('/', (req, res) => {
  res.send('Backend Works!!');
});



// SIGN UP HANDLER
//Manufacturer Registration
app.post('/register-m', (req, res) => {
  const { company_name, company_service, phone, email, country, address, password, company_registration, tax_compliance } = req.body;
  
 pool.query(
    'INSERT INTO manufacturer_registration (company_name, company_services, phone, email, country, address, company_registration, tax_compliance, password) VALUES (?, ?, ?, ?, ?, ? , ?, ?, ?)',
    [company_name, company_service, phone, email, country, address, company_registration, tax_compliance, password ],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error creating Manufacturer.');
      } else {
        res.status(200).send('Manufacturer created successfully.');
      }
    }
  );
});


//Individual Registration
app.post('/register-i', (req, res) => {
  const { firstname, lastname, phone, email, country, address, password, policies } = req.body;
  
  pool.query(
    'INSERT INTO individual_registration (firstname, lastname, phone, email, country, address, password, policies) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [firstname, lastname, phone, email, country, address, password, policies],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error creating Individual.');
      } else {
        res.status(200).send('Individual created successfully.');
      }
    }
  );
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});