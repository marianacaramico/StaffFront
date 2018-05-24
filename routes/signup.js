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
    console.log(req);
    res.render("signup", {
        title: 'Cadastre-se para utilizar o Staff',
        script: 'signup'
    });
});

router.post('/', function (req, res, next) {

    var database = new Database();

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

    var connection = database.connect();

    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            if(name == null || email == null || password == null || cpf == null || cep == null ||
                rua  == null || numero == null || bairro == null || cidade == null || estado == null) {
                console.log("Dados inválidos");
                res.json({
                    code: 0,
                    result: "Dados inválidos",
                });
            } else {
                var queryVerify = "SELECT * FROM dbo.TB_USER WHERE username = @username";
                var requestVerify = database.query(queryVerify, connection, function(err, rowCount, rows) {
                    if (!rowCount) {
                        var query = "INSERT INTO dbo.TB_USER(name, username, password, cpf, cep, rua, numero, bairro, cidade, estado) VALUES (@name, @username, @password, @cpf, @cep, @rua, @numero, @bairro, @cidade, @estado); SELECT @@identity";
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
                        request.addParameter('username', TYPES.VarChar, email);
                        request.addParameter('password', TYPES.VarChar, password);
                        request.addParameter('cpf', TYPES.VarChar, cpf);
                        request.addParameter('cep', TYPES.VarChar, cep);
                        request.addParameter('rua', TYPES.VarChar, rua);
                        request.addParameter('numero ', TYPES.VarChar, numero);
                        request.addParameter('bairro', TYPES.VarChar, bairro);
                        request.addParameter('cidade', TYPES.VarChar, cidade);
                        request.addParameter('estado', TYPES.VarChar, estado);
                        connection.execSql(request);
                    } else {
                        connection.close();
                        res.json({
                            code: 0,
                            result: "E-mail já cadastrado"
                        });
                    }
                });
                requestVerify.addParameter("username", TYPES.VarChar, email);
                connection.execSql(requestVerify);
            }
        }
    });
});

router.put('/', function (req, res, next) {
    res.json({ error: "Function not implemented" });
});

module.exports = router;
