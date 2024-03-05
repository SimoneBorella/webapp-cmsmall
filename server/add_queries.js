'use strict';

const sqlite = require('sqlite3');
const db = require('./db') ;


// const sql = 'INSERT INTO users(email, name, role, salt, password) VALUES(?,?,?,?,?)';
// db.run(sql, ["muffonemarisa67@gmail.com", "Muffone Marisa", "user", "c4bb5f51b84844a9", "6fec27b94a96acedcb31b84f80753865153721529e0262344595577826671f63"], (err) => {
//     if (err)
//         console.log(err.message)
// });

// const sql = 'INSERT INTO websitename(name) VALUES(?)';
// db.run(sql, ["CMSmalllll"], (err) => {
//     if (err)
//         console.log(err.message)
// });



// const sql = `UPDATE websitename SET name=?` ;

// db.run(sql, ["MyWebSite"], (err) => {
//     if (err)
//         console.log(err.message)
// });