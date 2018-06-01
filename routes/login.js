var express = require('express');
var router = express.Router();
var User = require('../models/User');

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
    var username = req.body.inputEmail;
    var password = req.body.inputSenha;

    if (!(username && password)) {
        console.log("NAO MANDOU USERNAME OU SENHA");
        return res.json({
            code: 2,
            result: "Invalid parameters"
        });
    }

    User.login(username, password, {
        onSuccess: function onSuccess(response) {
            req.session.userid = response.result.session_id;
            res.redirect(response.result.redirect);
        },
        onFail: function onFail(error, responseJson = null) {
            console.log("DEU ERRO!");
            console.log(error);
            res.json(responseJson);
        }
    });
});

module.exports = router;
