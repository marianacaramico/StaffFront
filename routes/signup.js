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
    console.log(req);
    res.render("signup", {
        title: 'Cadastre-se para utilizar o Staff',
        script: 'signup'
    });
});

router.post('/', function (req, res, next) {
    var name = req.body.name;
    var email = req.body.username;
    var password = req.body.password;
    var cpf = req.body.cpf;
    var cep = req.body.cep;
    var rua = req.body.rua;
    var numero = req.body.numero;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var estado = req.body.estado;

    if (!(name && email && password && cpf && cep && rua && numero && bairro && cidade && estado)) {
        console.log("DADOS INVÁLIDOS");
        return res.json({
            code: 0,
            result: "Dados inválidos"
        });
    }

    User.signup(name, email, password, cpf, cep, rua, numero, bairro, cidade, estado, {
        onSuccess: function onSuccess(response) {
            res.json(response);
        },
        onFail: function onFail(err, responseJson) {
            console.log(err);
            res.json(responseJson);
        }
    });
});

router.put('/', function (req, res, next) {
    res.json({ error: "Function not implemented" });
});

module.exports = router;
