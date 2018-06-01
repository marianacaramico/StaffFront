var bcrypt = require('bcrypt');
var TYPES = require('tedious').TYPES;
var Database = require('../helpers/Database');

function login(username, password, callbackFunctions = {}) {
    var database = new Database();
    var connection = database.connect();

    connection.on('connect', function(err) {
        if (err) {
            if (typeof callbackFunctions.onFail === "function") {
                callbackFunctions.onFail(err, {
                    code: 0,
                    result: 'Failed to connect to database'
                });
            }
        } else {
            var result = {};
            var query = "SELECT @id = id_user, @password = password FROM dbo.TB_USER WHERE username = @username";
            var request = database.query(query, connection);
            request.addParameter("username", TYPES.VarChar, username);
            request.addOutputParameter('id', TYPES.Int);
            request.addOutputParameter('password', TYPES.VarChar);
            request.on('returnValue', function(parameterName, value, metadata) {
                result[parameterName] = value;
            });
            request.on('requestCompleted', function() {
                bcrypt.compare(password, result.password, (err, comparison) => {
                    if (comparison) {
                        var id = Number(result.id) || 0;
                        if (id) {
                            if (typeof callbackFunctions.onSuccess === "function") {
                                callbackFunctions.onSuccess({
                                    code: 1,
                                    result: {
                                        redirect: '/home',
                                        session_id: id
                                    }
                                });
                            }
                        } else {
                            if (typeof callbackFunctions.onFail === "function") {
                                callbackFunctions.onFail(err, {
                                    code: 2,
                                    result: 'Invalid username or password'
                                });
                            }
                        }
                    } else {
                        if (typeof callbackFunctions.onFail === "function") {
                            callbackFunctions.onFail(err, {
                                code: 2,
                                result: 'Something went wrong'
                            });
                        }
                    }
                });
            });
            connection.execSql(request);
        }
    });
}

function signup(name, email, password, cpf, cep, rua, numero, bairro, cidade, estado, callbackFunctions = {}) {
    var database = new Database();
    var connection = database.connect();

    connection.on('connect', function(err) {
        if (err) {
            if (typeof callbackFunctions.onFail === "function") {
                callbackFunctions.onFail(err, {
                    code: 0,
                    result: "Failed to connect to database"
                });
            }
        } else {
            bcrypt.hash(password, 10, (err, passwordHash) => {
                var queryVerify = "SELECT * FROM dbo.TB_USER WHERE username = @username";
                var requestVerify = database.query(queryVerify, connection, function(err, rowCount, rows) {
                    if (err) {
                        if (typeof callbackFunctions.onFail === "function") {
                            callbackFunctions.onFail(err, {
                                code: 0,
                                result: "Something went wrong"
                            });
                        }
                    } else if (!rowCount) {
                        var query = "INSERT INTO dbo.TB_USER(name, username, password, cpf, cep, rua, numero, bairro, cidade, estado) VALUES (@name, @username, @password, @cpf, @cep, @rua, @numero, @bairro, @cidade, @estado); SELECT @@identity";
                        var request = database.query(query, connection, function(err, rowCount, rows) {
                            if (err) {
                                if (typeof callbackFunctions.onFail === "function") {
                                    callbackFunctions.onFail(err, {
                                        code: 0,
                                        result: "Something went wrong"
                                    });
                                }
                            } else {
                                if (rowCount) {
                                    if (typeof callbackFunctions.onSuccess === "function") {
                                        callbackFunctions.onSuccess({
                                            code: 1,
                                            result: "Usuário cadastrado com sucesso"
                                        });
                                    }
                                } else {
                                    if (typeof callbackFunctions.onSuccess === "function") {
                                        callbackFunctions.onSuccess({
                                            code: 0,
                                            result: "Failed to create new user"
                                        });
                                    }
                                }
                            }
                            connection.close();
                        });
                        request.addParameter('name', TYPES.VarChar, name);
                        request.addParameter('username', TYPES.VarChar, email);
                        request.addParameter('password', TYPES.VarChar, passwordHash);
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
                        if (typeof callbackFunctions.onSuccess === "function") {
                            callbackFunctions.onSuccess({
                                code: 0,
                                result: "E-mail já cadastrado"
                            });
                        }
                    }
                });
                requestVerify.addParameter("username", TYPES.VarChar, email);
                connection.execSql(requestVerify);
            });
        }
    });
}

var User = {
    login,
    signup
};

module.exports = User;