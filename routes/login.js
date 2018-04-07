var express = require('express');
var router = express.Router();
var Database = require('../helpers/Database');
var TYPES = require('tedious').TYPES;

router.get('*', function(req, res, next) {
    if (req.session.userid) {
        res.redirect("/home");
    } else {
        next();
    }
});

router.get('/', function (req, res, next) {
    res.render('login', {
        title: 'Entre em sua conta para usar o Staff'
    });
});

router.post('/', function (req, res, next) {
    var database = new Database();

    var username = req.body.inputEmail;
    var password = req.body.inputSenha;

    var connection = database.connect();

    connection.on('connect', function(err) {
        if (err) {
            console.log('DEU UM ERRO!');
            console.log(err);
            return;
        } else {
            console.log('DEU CERTO!');
            if((username == null) || (password == null)) {
                console.log('NAO MANDOU USER OU SENHA, MANÉ');
                res.render('erro-login', {
                    title: 'Ops, não conseguimos fazer o login'
                });
            } else {
                var query = "SELECT @id = id_user FROM dbo.TB_USER WHERE username = '" + username + "' AND password = '" + password + "'";
                var request = database.query(query, connection);
                var result = {};
                request.addOutputParameter('id', TYPES.Int);
                request.on('returnValue', function(parameterName, value, metadata) {
                    result[parameterName] = value;
                });
                request.on('requestCompleted', function() {
                    if (result.id) {
                        req.session.userid = result.id;
                        res.redirect("/home");
                    }
                });
                connection.execSql(request);
            }
        }
    });
});

module.exports = router;
