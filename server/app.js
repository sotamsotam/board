const express = require('express');
const app = express();
const session = require('express-session');

app.use(session({
    secret: 'secret code',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 //쿠기 유효시간 1시간
    }
}));

app.use(express.json({
    limit: '50mb'
}));

const server = app.listen(3000, () => {
    console.log('Server started. port 3000.');
});

let sql = require('./sql.js');

const db = {
    database: "board",
    connectionLimit: 10,
    host: "127.0.0.1",
    user: "root",
    password: "mariadb"
  };


const dbPool = require('mysql').createPool(db);

app.post('/api/login', async (requset, res) => {
    res.send('ok');
});

app.post('/api/logout', async (requset, res) => {

});

app.post('/api/:alias', async (request, res) => {
    try {
      res.send(await req.db(request.params.alias, request.body.param, request.body.where));
    } catch (err) {
      res.status(500).send({
        error: err
      });
    }
});

const req = {
    async db(alias, param = [], where = '') {
      return new Promise((resolve, reject) => dbPool.query(sql[alias].query + where, param, (error, rows) => {
        if (error) {
          if (error.code != 'ER_DUP_ENTRY')
            console.log(error);
          resolve({
            error
          });
        } else resolve(rows);
      }));
    }
  };