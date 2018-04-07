var express = require('express');
var router = express.Router();
var TYPES = require('tedious').TYPES;
var Database = require('../helpers/Database');

router.get('*', function(req, res, next) {
    if (!req.session.userid) {
        next();
    } else {
        res.redirect("/login");
    }
});

router.get('/', function (req, res, next) {
    res.render("signup", {
        title: 'Cadastre-se para utilizar o Staff'
    });
});

router.post('/', function (req, res, next) {
    var database = new Database();

    var name = req.body.name;
    var username = req.body.email;
    var password = req.body.password;
    /**
    *   TODO: implementar novos campos para o usuario
    *   var cpf = req.body.cpf;
    *   var cep = req.body.cep;
    *   var rua = req.body.rua;
    *   var numero = req.body.numero;
    *   var bairro = req.body.bairro;
    *   var cidade = req.body.cidade;
    *   var estado = req.body.estado;
    */

    var connection = database.connect();

    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            if(name == null || username == null || password == null) {
                console.log('NAO MANDOU NOME, USER OU SENHA, MANÉ');
                res.json({
                    code: 0,
                    result: "Dados inválidos"
                });
            } else {
                var queryVerify = "SELECT * FROM dbo.TB_USER WHERE username = @username";
                var requestVerify = database.query(queryVerify, connection, function(err, rowCount, rows) {
                    if (!rowCount) {
                        var query = "INSERT INTO dbo.TB_USER(name, username, password) VALUES (@name, @username, @password); SELECT @@identity";
                        var request = database.query(query, connection, function(err, rowCount, rows) {
                            if (err) {
                                res.json({
                                    code: 0,
                                    result: err
                                });
                            } else {
                                if (rowCount) {
                                    res.json({
                                        code: 1,
                                        result: "Usuário cadastrado com sucesso"
                                    });
                                } else {
                                    res.json({
                                        code: 0,
                                        result: "Algo deu errado!"
                                    });
                                }
                            }
                            connection.close();
                        });
                        request.addParameter('name', TYPES.VarChar, name);
                        request.addParameter('username', TYPES.VarChar, username);
                        request.addParameter('password', TYPES.VarChar, password);
                        connection.execSql(request);
                    } else {
                        connection.close();
                        res.json({
                            code: 0,
                            result: "E-mail já cadastrado"
                        });
                    }
                });
                requestVerify.addParameter("username", TYPES.VarChar, username);
                connection.execSql(requestVerify);
            }
        }
    });
});

router.put('/', function (req, res, next) {
    res.json({ error: "Function not implemented" });
});

module.exports = router;