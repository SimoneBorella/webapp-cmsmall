'use strict';

const PORT = 3000;

const express = require('express');

const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');

const wsndao = require('./wsn-dao')
const usersdao = require('./users-dao');
const dao = require('./pc-dao');
const { Page, Content } = require('./pc');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));



const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy((username, password, callback) => {
    usersdao.getUser(username, password).then((user) => {
        return callback(null, { id: user.id, email: user.email, name: user.name , role:user.role});
    }).catch((err) => {
        return callback(null, false, err);
    });
}));

passport.serializeUser((user, callback) => {
    callback(null, { id: user.id, email: user.email, name: user.name , role:user.role});
});
passport.deserializeUser((user, callback) => {
    return callback(null, user);
});



app.use(session({
    secret: 'secretsession',
    resave: false,
    saveUninitialized: true
}));


app.use(passport.authenticate('session'));


const isLogged = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(500).send("Not authenticated");
    }
}


app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
});

app.post('/api/logout', (req, res) => {
    req.logout(()=>{res.end()});
})

app.get('/api/websitename', (req, res) => {
    wsndao.getName().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

app.get('/api/pages', (req, res) => {
    dao.listPages().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});


app.get('/api/pages/:pageId', (req, res) => {
    const pageId = req.params.pageId;
    dao.getPage(pageId).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});


app.get('/api/pages/:pageId/contents', async (req, res) => {
    const pageId = req.params.pageId;

    dao.listContents(pageId).then((result) => {
        res.json(result);
    }).catch ((error) => {
        res.status(500).send(error.message);
    })
});










app.use(isLogged);

app.get('/api/users', (req, res) => {
    usersdao.listUsers().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});




app.post('/api/websitename', (req, res) => {
    const name = req.body.name;
    wsndao.editName(name).then((result) => {
        res.end();
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});



app.post('/api/pages', (req, res) => {
    const page = new Page(null, req.body.title, req.body.author, req.body.cerationDate, req.body.pubDate);
    dao.createPage(page).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});





app.put('/api/pages/:pageId', async (req, res) => {
    const pageId = req.params.pageId;
    const page = new Page(pageId, req.body.title, req.body.author, undefined, req.body.pubDate);

    dao.editPage(pageId, page).then((result) => {
        res.end();
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});


app.delete('/api/pages/:pageId', async (req, res) => {
    const pageId = req.params.pageId;

    dao.deletePage(pageId).then((result)=>{
        res.end();
    }).catch((error)=>{
        res.status(500).send(error.message);
    })
});



app.post('/api/pages/:pageId/contents', async (req, res) => {
    const pageId = req.params.pageId;
    const content = new Content(null, req.body.type, req.body.value, req.body.sortOrder, pageId);

    dao.createContent(pageId, content).then((result) => {
        res.end();
    }).catch((error) => {
        res.status(500).send(error.message);
    })
});





app.put('/api/contents/:contentId', async (req, res) => {
    const contentId = req.params.contentId;
    const content = new Content(contentId, req.body.type, req.body.value, req.body.sortOrder, req.body.pageId);

    dao.editContent(contentId, content).then((result)=>{
        res.end();
    }).catch((error)=>{
        res.status(500).send(error.message);
    })
});

app.delete('/api/contents/:contentId', async (req, res) => {
    const contentId = req.params.contentId;

    dao.deleteContent(contentId).then((result)=>{
        res.end();
    }).catch((error)=>{
        res.status(500).send(error.message);
    })
});



app.listen(PORT, () => { console.log(`Server started on http://localhost:${PORT}/`) });