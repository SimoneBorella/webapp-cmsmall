'use strict';

const db = require('./db') ;

function getName() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM websitename';
        db.get(sql, (err, row) => {
            if (err)
                reject(err)
            else {
                const name = {"name": row.name}
                resolve(name);
            }
        });
    });
}

function editName(name) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE websitename SET name=?` ;

        db.run(sql, [name], (err)=>{
            if(err) {
                reject(err) ;
            } else {
                resolve(true) ;
            }
        }) ;
    })
}

exports.getName = getName;
exports.editName = editName;