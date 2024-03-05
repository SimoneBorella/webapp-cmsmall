'use strict';
const dayjs = require('dayjs');

function Content(id, type, value, sortOrder, pageId) {
    this.id = id;
    this.type = type;
    this.value = value;
    this.sortOrder = sortOrder;
    this.pageId = pageId;
}

function Page(id, title, author, creationDate, pubDate) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.creationDate = dayjs(creationDate);
    this.pubDate = (pubDate? dayjs(pubDate) : undefined);
}

exports.Content = Content ;
exports.Page = Page ;