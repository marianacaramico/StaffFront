var bcrypt = require('bcrypt');
var TYPES = require('tedious').TYPES;
var Database = require('../helpers/Database');

function validFunction(param) {
    if (typeof param === "function") {
        return param;
    } else {
        return (function(){});
    }
}

function login(username, password, callbackFunctions = {}) {
    var database = new Database();
    var connection = database.connect();

    callbackFunctions.onSuccess = validFunction(callbackFunctions.onSuccess);
    callbackFunctions.onFail = validFunction(callbackFunctions.onFail);

    connection.on('connect', function(err) {
        if (err) {
            callbackFunctions.onFail(err, {
                code: 0,
                result: 'Failed to connect to database'
            });
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
                            callbackFunctions.onSuccess({
                                code: 1,
                                result: {
                                    redirect: '/home',
                                    session_id: id
                                }
                            });
                        } else {
                            callbackFunctions.onFail(err, {
                                code: 2,
                                result: 'Something went wrong'
                            });
                        }
                    } else {
                        callbackFunctions.onFail(err, {
                            code: 2,
                            result: 'Email ou senha inválidos'
                        });
                    }
                });
            });
            connection.execSql(request);
        }
    });
}

function getUser(userid, callbackFunctions = {}) {
    var database = new Database();
    var connection = database.connect();

    callbackFunctions.onSuccess = validFunction(callbackFunctions.onSuccess);
    callbackFunctions.onFail = validFunction(callbackFunctions.onFail);

    connection.on('connect', function (err) {
        if (err) {
            callbackFunctions.onFail(err, {
                code: 0,
                result: "Failed to connect to database"
            });
        } else {
            var queryString = "SELECT @id = id_user, @name = name, @username = username FROM dbo.TB_USER WHERE id_user = @userid";
            var request = database.query(queryString, connection);
            var result = {};
            request.addParameter('userid', TYPES.Int, userid);
            request.addOutputParameter('id', TYPES.Int);
            request.addOutputParameter('name', TYPES.VarChar);
            request.addOutputParameter('username', TYPES.VarChar);
            request.on('returnValue', function(parameterName, value, metadata) {
                result[parameterName] = value;
            });
            request.on('requestCompleted', function() {
                if (result.id) {
                    callbackFunctions.onSuccess({
                        code: 1,
                        result: result
                    });
                } else {
                    callbackFunctions.onSuccess({
                        code: 0,
                        result: "Usuário não encontrado"
                    });
                }
            });
            connection.execSql(request);
        }
    });
}

function signup(name, email, password, cpf, cep, rua, numero, bairro, cidade, estado, callbackFunctions = {}) {
    var database = new Database();
    var connection = database.connect();

    callbackFunctions.onSuccess = validFunction(callbackFunctions.onSuccess);
    callbackFunctions.onFail = validFunction(callbackFunctions.onFail);

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
                        callbackFunctions.onFail(err, {
                            code: 0,
                            result: "Something went wrong"
                        });
                    } else if (!rowCount) {
                        var query = "INSERT INTO dbo.TB_USER(name, username, password, cpf, cep, rua, numero, bairro, cidade, estado) VALUES (@name, @username, @password, @cpf, @cep, @rua, @numero, @bairro, @cidade, @estado); SELECT @@identity";
                        var request = database.query(query, connection, function(err, rowCount, rows) {
                            connection.close();
                            if (err) {
                                callbackFunctions.onFail(err, {
                                    code: 0,
                                    result: "Something went wrong"
                                });
                            } else {
                                if (rowCount) {
                                    callbackFunctions.onSuccess({
                                        code: 1,
                                        result: "Usuário cadastrado com sucesso"
                                    });
                                } else {
                                    callbackFunctions.onSuccess({
                                        code: 0,
                                        result: "Failed to create new user"
                                    });
                                }
                            }
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
                        callbackFunctions.onSuccess({
                            code: 0,
                            result: "E-mail já cadastrado"
                        });
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
    getUser,
    signup
};

module.exports = User;