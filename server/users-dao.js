'use strict';

const crypto = require('crypto');
const db = require('./db') ;

function getUser(username, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email=?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (!row) {
                    reject('Invalid username or password');
                } else {
                    crypto.scrypt(password, row.salt, 32, (err, computed_hash) => {
                        if (err) {
                            reject(err);
                        } else {
                            const equal = crypto.timingSafeEqual(computed_hash, Buffer.from(row.password, 'hex'));
                            if (equal) {
                                resolve(row);
                            } else {
                                reject('Invalid username or password');
                            }
                        }
                    });
                }
            }
        });
    });
}


function listUsers() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT email, name, role FROM users';
        db.all(sql, (err, rows) => {
            if (err)
                reject(err)
            else {
                resolve(rows);
            }
        });
    });
}

exports.getUser = getUser;
exports.listUsers = listUsers;