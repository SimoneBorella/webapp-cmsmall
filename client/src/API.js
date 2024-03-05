const APIURL = 'http://localhost:3000/api'

import { Page, Content } from "./pc";


async function login(username, password) {
    try {
        const response = await fetch(APIURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}


async function logout() {
    try {
        const response = await fetch(APIURL + '/logout', {
            method: 'POST',
            credentials: 'include'
        });
        if (response.ok) {
            return true ;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}



async function listUsers() {
    try {
        const response = await fetch(APIURL + '/users',{
            credentials: 'include'
        });
        if (response.ok) {
            const res = await response.json();
            return res;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}


async function getWebSiteName() {
    try {
        const response = await fetch(APIURL + `/websitename`,{
            credentials: 'include'
        });
        if (response.ok) {
            const websitename = await response.json();
            return websitename.name;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}




async function editWebSiteName(name) {
    try {
        const response = await fetch(APIURL + `/websitename`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "name": name
            }),
            credentials: 'include'
        });
        if (response.ok) {
            return true;
        } else {
            const message = response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}



async function addPage(title, author, creationDate, pubDate) {
    try {
        const response = await fetch(APIURL + `/pages`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "title": title,
                "author": author,
                "creationDate": creationDate,
                "pubDate": pubDate
            }),
            credentials: 'include'
        });
        if (response.ok) {
            const id = Number(await response.text());
            return id;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}



async function listPages() {
    try {
        const response = await fetch(APIURL + '/pages',{
            credentials: 'include'
        });
        if (response.ok) {
            const pages = await response.json();
            return pages.map((p) => new Page(p.id, p.title, p.author, p.creationDate, p.pubDate));
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}

async function getPage(pageId) {
    try {
        const response = await fetch(APIURL + `/pages/${pageId}`,{
            credentials: 'include'
        });
        if (response.ok) {
            const page = await response.json();
            return new Page(page.id, page.title, page.author, page.creationDate, page.pubDate);

        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}



async function editPage(pageId, title, author, pubDate) {
    try {
        const response = await fetch(APIURL + `/pages/${pageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "title": title,
                "author": author,
                "pubDate": pubDate
            }),
            credentials: 'include'
        });
        if (response.ok) {
            return true;
        } else {
            const message = response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}



async function deletePage(pageId) {
    try {
        const response = await fetch(APIURL + `/pages/${pageId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            return true;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}


async function addContent(type, value, sortOrder, pageId) {
    try {
        const response = await fetch(APIURL + `/pages/${pageId}/contents`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "type": type,
                "value": value,
                "sortOrder": sortOrder
            }),
            credentials: 'include'
        });
        if (response.ok) {
            const id = Number(await response.text());
            return id;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}


async function listContents(pageId) {
    try {
        const response = await fetch(APIURL + `/pages/${pageId}/contents`,{
            credentials: 'include'
        });
        if (response.ok) {
            const contents = await response.json();
            return contents.map(c => new Content(c.id, c.type, c.value, c.sortOrder, pageId));
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}


async function editContent(contentId, type, value, sortOrder, pageId) {
    try {
        const response = await fetch(APIURL + `/contents/${contentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "type": type,
                "value": value,
                "sortOrder": sortOrder,
                "pageId": pageId
            }),
            credentials: 'include'
        });
        if (response.ok) {
            return true;
        } else {
            const message = response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}


async function deleteContent(contentId) {
    try {
        const response = await fetch(APIURL + `/contents/${contentId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            return true;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}

export { login, logout, listUsers, getWebSiteName, editWebSiteName, addPage, listPages, getPage, editPage, deletePage, addContent, listContents, editContent, deleteContent};