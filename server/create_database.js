const sqlite3 = require('sqlite3').verbose();

// Create a new database connection
const db = new sqlite3.Database('pages.sqlite');

// SQL statement to create a table

// const createTablePages = `
//   CREATE TABLE IF NOT EXISTS pages (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     title TEXT NOT NULL,
//     author TEXT NOT NULL,
//     creationDate DATE NOT NULL,
//     pubDate DATE
//   )
// `;


// Execute the SQL statement to create the table
// db.run(createTablePages, (error) => {
//   if (error) {
//     console.error('Error creating table:', error.message);
//   } else {
//     console.log('Table created successfully');
//   }
// });



// const createTableContents = `
//   CREATE TABLE IF NOT EXISTS contents (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     type TEXT NOT NULL,
//     value TEXT NOT NULL,
//     sortOrder INTEGER NOT NULL,
//     pageId INTEGER NOT NULL
//   )
// `;

// // Execute the SQL statement to create the table
// db.run(createTableContents, (error) => {
//   if (error) {
//     console.error('Error creating table:', error.message);
//   } else {
//     console.log('Table created successfully');
//   }
// });



// const createTableUsers = `
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     email TEXT NOT NULL,
//     name TEXT NOT NULL,
//     role TEXT NOT NULL,
//     salt TEXT NOT NULL,
//     password TEXT NOT NULL
//   )
// `;

// // Execute the SQL statement to create the table
// db.run(createTableUsers, (error) => {
//   if (error) {
//     console.error('Error creating table:', error.message);
//   } else {
//     console.log('Table created successfully');
//   }
// });




// const dropTableQuery = `
//   DROP TABLE IF EXISTS pages2
// `;

// db.run(dropTableQuery, (error) => {
//   if (error) {
//     console.error('Error dropping table:', error.message);
//   } else {
//     console.log('Table dropped successfully');
//   }
// });




// const createTableWebSiteName = `
//   CREATE TABLE IF NOT EXISTS websitename (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL
//   )
// `;

// // Execute the SQL statement to create the table
// db.run(createTableWebSiteName, (error) => {
//   if (error) {
//     console.error('Error creating table:', error.message);
//   } else {
//     console.log('Table created successfully');
//   }
// });


// Close the database connection
db.close();