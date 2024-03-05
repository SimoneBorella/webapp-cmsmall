'use strict';

const { Page, Content } = require('./pc');

const dayjs = require('dayjs');
const sqlite = require('sqlite3');
const db = require('./db') ;


function createPage(page) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO pages(title, author, creationDate, pubDate) VALUES(?,?,?,?)';
        db.run(sql, [page.title, page.author, page.creationDate.toISOString(), (page.pubDate? page.pubDate.toISOString(): undefined)], function(err) {
            if (err)
                reject(err.message);
            else
                resolve(this.lastID);
        });
    });
}

function listPages() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pages';
        db.all(sql, (err, rows) => {
            if (err)
                reject(err)
            else {
                const pages = rows.map((p) => new Page(p.id, p.title, p.author, dayjs(p.creationDate), (p.pubDate? dayjs(p.pubDate) : undefined)));
                resolve(pages);
            }
        });
    });
}

function getPage(pageId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pages WHERE id=?';
        db.get(sql, [pageId], (err, row) => {
            if (err)
                reject(err)
            else {
                if(row){
                    const page = new Page(row.id, row.title, row.author, dayjs(row.creationDate), (row.pubDate? dayjs(row.pubDate) : undefined));
                    resolve(page);
                }
                else
                    resolve({});
            }
        });
    });
}


function editPage(pageId, page) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE pages
        SET title=?, author=?, pubDate=?
        WHERE id=?` ;

        db.run(sql, [page.title, page.author, (page.pubDate? page.pubDate.toISOString(): undefined), pageId], (err)=>{
            if(err) {
                reject(err) ;
            } else {
                resolve(true) ;
            }
        }) ;
    })
}


function deletePage(pageId) {
    return new Promise((resolve, reject) => {
        const sql1 = 'DELETE FROM pages WHERE id=?';
        db.run(sql1, [pageId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });

        const sql2 = 'DELETE FROM contents WHERE pageId=?';
        db.run(sql2, [pageId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    })
}



function createContent(pageId, content) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO contents(type, value, sortOrder, pageId) VALUES(?,?,?,?)';
        db.run(sql, [content.type, content.value, content.sortOrder, pageId], (err) => {
            if (err)
                reject(err.message);
            else
                resolve(true);
        });
    });
}

function listContents(pageId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM contents WHERE pageId = ?';
        db.all(sql, [pageId],(err, rows) => {
            if (err)
                reject(err)
            else {
                const contents = rows.map((c) => new Content(c.id, c.type, c.value, c.sortOrder, c.pageId));
                resolve(contents);
            }
        });
    });
}


function editContent(contentId, content) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE contents
        SET type=?, value=?, sortOrder=?
        WHERE id=?` ;

        db.run(sql, [content.type, content.value, content.sortOrder, contentId], (err)=>{
            if(err) {
                reject(err) ;
            } else {
                resolve(true) ;
            }
        }) ;
    })
}


function deleteContent(contentId) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM contents WHERE id=?';
        db.run(sql, [contentId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    })
}


exports.createPage = createPage;
exports.listPages = listPages;
exports.getPage = getPage;
exports.editPage = editPage;
exports.deletePage = deletePage;
exports.createContent = createContent;
exports.listContents = listContents;
exports.editContent = editContent;
exports.deleteContent = deleteContent;