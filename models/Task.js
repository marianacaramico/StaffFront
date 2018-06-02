var TYPES = require('tedious').TYPES;
var Database = require('../helpers/Database');

function validFunction(param) {
    if (typeof param === "function") {
        return param;
    } else {
        return (function(){});
    }
}

function acceptTask(taskid, userid, callbackFunctions = {}) {
    var database = new Database();
    var connection = database.connect();

    callbackFunctions.onSuccess = validFunction(callbackFunctions.onSuccess);
    callbackFunctions.onFail = validFunction(callbackFunctions.onFail);

    connection.on('connect', function(err) {
        if (err) {
            callbackFunctions.onFail(err, {
                code: 0,
                result: "Failed to connect to database"
            });
        } else {
            var queryVerify = "SELECT T.id_task FROM TB_TASK T " +
                "LEFT JOIN TB_AGREEMENT A ON T.id_task = A.id_task " +
                "WHERE T.id_task = @taskid " +
                "AND (T.id_user_owner <> @userid) AND (A.id_task IS NULL) AND (T.status = 'A') " +
                "AND CAST(T.due_date AS DATE) >= CAST(GETDATE() AS DATE)";
            var requestVerify = database.query(queryVerify, connection, function(err, rowCount, rows) {
                if (rowCount) {
                    var query = "INSERT INTO TB_AGREEMENT(id_task, id_user, creation_date, conclusion_date, receipt) VALUES(@taskid, @userid, GETDATE(), GETDATE(), 'Eu faço!'); SELECT @id = @@identity";
                    var responseJson = {
                        code: 0,
                        result: 'Function uninitialized'
                    };
                    var request = database.query(query, connection, function(err, rowCount, rows) {
                        if (err) {
                            responseJson.code = 0;
                            responseJson.result = err;
                        } else {
                            if (rowCount) {
                                responseJson.code = 1;
                                responseJson.result = "Tarefa aceita!";
                            } else {
                                responseJson.code = 0;
                                responseJson.result = "Algo deu errado!";
                            }
                        }
                        connection.close();
                        callbackFunctions.onSuccess(responseJson);
                    });
                    request.addParameter('taskid', TYPES.Int, taskid);
                    request.addParameter('userid', TYPES.Int, userid);
                    // request.addParameter('receipt', Types.VarChar, receipt);
                    request.addOutputParameter('id', TYPES.Int);
                    request.on('returnValue', function(parameterName, value, metadata) {
                        responseJson[parameterName] = value;
                    });
                    connection.execSql(request);
                } else {
                    connection.close();
                    callbackFunctions.onSuccess({
                        code: 0,
                        result: "Tarefa não encontrada!"
                    });
                }
            });
            requestVerify.addParameter("userid", TYPES.Int, userid);
            requestVerify.addParameter("taskid", TYPES.Int, taskid);
            connection.execSql(requestVerify);
        }
    });
}

function create(title, description, value, deadline, userid, taskType, callbackFunctions = {}) {
    var database = new Database();
    var connection = database.connect();

    callbackFunctions.onSuccess = validFunction(callbackFunctions.onSuccess);
    callbackFunctions.onFail = validFunction(callbackFunctions.onFail);

    connection.on('connect', function(err) {
        if (err) {
            callbackFunctions.onFail(err, {
                code: 0,
                result: "Failed to connect to database"
            });
        } else {
            var queryVerify = "SELECT id_user FROM dbo.TB_USER WHERE id_user = @userid";
            var requestVerify = database.query(queryVerify, connection, function(err, rowCount, rows) {
                if (rowCount) {
                    var query = "INSERT INTO dbo.TB_TASK(id_task_type, id_user_owner, title, description, creation_date, due_date, value, status) VALUES (@taskType, @userid, @title, @description, GETDATE(), @deadline, @value, 'A'); SELECT @id = @@identity";
                    var responseJson = {
                        code: 0,
                        result: 'Function uninitialized'
                    };
                    var request = database.query(query, connection, function(err, rowCount, rows) {
                        if (err) {
                            responseJson.code = 0;
                            responseJson.result = err;
                        } else {
                            if (rowCount) {
                                responseJson.code = 1;
                                responseJson.result = "Tarefa cadastrada com sucesso";
                            } else {
                                responseJson.code = 0;
                                responseJson.result = "Algo deu errado!";
                            }
                        }
                        connection.close();
                        callbackFunctions.onSuccess(responseJson);
                    });
                    request.addParameter('taskType', TYPES.Int, taskType);
                    request.addParameter('userid', TYPES.Int, userid);
                    request.addParameter('title', TYPES.VarChar, title);
                    request.addParameter('description', TYPES.VarChar, description);
                    request.addParameter('deadline', TYPES.Date, deadline);
                    request.addParameter('value', TYPES.Float, value);
                    request.addOutputParameter('id', TYPES.Int);
                    request.on('returnValue', function(parameterName, value, metadata) {
                        responseJson[parameterName] = value;
                    });
                    connection.execSql(request);
                } else {
                    connection.close();
                    callbackFunctions.onSuccess({
                        code: 0,
                        result: "Usuário inválido"
                    });
                }
            });
            requestVerify.addParameter("userid", TYPES.Int, userid);
            connection.execSql(requestVerify);
        }
    });
}

function getAssigned(user_id, callbackFunctions = {}) {
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
            var query = "SELECT T.id_task_type, T.id_user_owner, " +
                "T.title, T.description, T.creation_date, " +
                "T.due_date, T.value, T.status " +
                "FROM TB_TASK T INNER JOIN TB_AGREEMENT A ON T.id_task = A.id_task " +
                "WHERE (T.id_user_owner = @userid) AND (T.status = 'A')";
            var request = database.query(query, connection);
            var result = [];
            request.addParameter("userid", TYPES.Int, user_id);
            request.on('row', function (columns) {
                var _obj = {};
                columns.forEach(column => {
                    _obj[column.metadata.colName] = column.value;
                });
                result.push(_obj);
            });
            request.on('requestCompleted', function () {
                if (result.length) {
                    callbackFunctions.onSuccess({
                        code: 1,
                        tasks: result
                    });
                } else {
                    callbackFunctions.onSuccess({
                        code: 0,
                        result: "Nenhum registro encontrado"
                    });
                }
            });
            connection.execSql(request);
        }
    });
}

function getTask(taskid, user_id, callbackFunctions = {}) {
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
            var query = "SELECT T.id_task, T.id_task_type, T.id_user_owner, " +
                "T.title, T.description, T.creation_date, " +
                "T.due_date, T.value, T.status " +
                "FROM TB_TASK T WHERE (T.id_task = @taskid)";
            var request = database.query(query, connection);
            var result = {};
            request.addParameter("taskid", TYPES.Int, taskid);
            request.on('row', function (columns) {
                columns.forEach(column => {
                    result[column.metadata.colName] = column.value;
                });
            });
            request.on('requestCompleted', function () {
                if (result.id_task) {
                    callbackFunctions.onSuccess({
                        code: 1,
                        task: result
                    });
                } else {
                    callbackFunctions.onSuccess({
                        code: 0,
                        result: "Nenhum registro encontrado"
                    });
                }
            });
            connection.execSql(request);
        }
    });
}

function getTasks(userid, description = "", callbackFunctions = {}) {
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
            var query = "SELECT T.id_task, T.id_task_type, T.id_user_owner, " +
                "T.title, T.description, T.creation_date, " +
                "T.due_date, T.value, T.status " +
                "FROM TB_TASK T LEFT JOIN TB_AGREEMENT A ON T.id_task = A.id_task " +
                "WHERE (T.id_user_owner <> @userid) AND (A.id_task IS NULL) AND (T.status = 'A') " +
                "AND CAST(T.due_date AS DATE) >= CAST(GETDATE() AS DATE)";
            if (description) query += " AND T.title LIKE CONCAT('%', @description, '%')";
            var request = database.query(query, connection);
            var result = [];
            request.addParameter("userid", TYPES.Int, userid);
            if (description) request.addParameter("description", TYPES.VarChar, description);
            request.on('row', function (columns) {
                var _obj = {};
                columns.forEach(column => {
                    _obj[column.metadata.colName] = column.value;
                });
                result.push(_obj);
            });
            request.on('requestCompleted', function () {
                if (result.length) {
                    callbackFunctions.onSuccess({
                        code: 1,
                        tasks: result
                    });
                } else {
                    callbackFunctions.onSuccess({
                        code: 0,
                        result: "Nenhum registro encontrado"
                    });
                }
            });
            connection.execSql(request);
        }
    });
}

function getUnassigned(user_id, callbackFunctions = {}) {
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
            var query = "SELECT T.id_task, T.id_task_type, T.id_user_owner, " +
                "T.title, T.description, T.creation_date, " +
                "T.due_date, T.value, T.status " +
                "FROM TB_TASK T LEFT JOIN TB_AGREEMENT A ON T.id_task = A.id_task " +
                "WHERE (T.id_user_owner = @userid) AND (A.id_task IS NULL) AND (T.status = 'A')";
            var request = database.query(query, connection);
            var result = [];
            request.addParameter("userid", TYPES.Int, user_id);
            request.on('row', function (columns) {
                var _obj = {};
                columns.forEach(column => {
                    _obj[column.metadata.colName] = column.value;
                });
                result.push(_obj);
            });
            request.on('requestCompleted', function () {
                if (result.length) {
                    callbackFunctions.onSuccess({
                        code: 1,
                        tasks: result
                    });
                } else {
                    callbackFunctions.onSuccess({
                        code: 0,
                        result: "Nenhum registro encontrado"
                    });
                }
            });
            connection.execSql(request);
        }
    });
}

function getWithYou(user_id, callbackFunctions = {}) {
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
            var query = "SELECT T.id_task_type, T.id_user_owner, " +
                "T.title, T.description, T.creation_date, " +
                "T.due_date, T.value, T.status " +
                "FROM TB_TASK T LEFT JOIN TB_AGREEMENT A ON T.id_task = A.id_task " +
                "WHERE (T.id_user_owner <> @userid) AND (A.id_user = @userid) AND (T.status = 'A')";
            var request = database.query(query, connection);
            var result = [];
            request.addParameter("userid", TYPES.Int, user_id);
            request.on('row', function (columns) {
                var _obj = {};
                columns.forEach(column => {
                    _obj[column.metadata.colName] = column.value;
                });
                result.push(_obj);
            });
            request.on('requestCompleted', function () {
                if (result.length) {
                    callbackFunctions.onSuccess({
                        code: 1,
                        tasks: result
                    });
                } else {
                    callbackFunctions.onSuccess({
                        code: 0,
                        result: "Nenhum registro encontrado"
                    });
                }
            });
            connection.execSql(request);
        }
    });
}

function types(callbackFunctions = {}) {
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
            var query = "SELECT T.id_task_type, T.description FROM TB_TASK_TYPE T";
            var request = database.query(query, connection);
            var result = [];
            request.on('row', function (columns) {
                var _obj = {};
                columns.forEach(column => {
                    _obj[column.metadata.colName] = column.value;
                });
                result.push(_obj);
            });
            request.on('requestCompleted', function () {
                if (result.length) {
                    callbackFunctions.onSuccess({
                        code: 1,
                        tasks: result
                    });
                } else {
                    callbackFunctions.onSuccess({
                        code: 0,
                        result: "Nenhum registro encontrado"
                    });
                }
            });
            connection.execSql(request);
        }
    });
}

var Task = {
    acceptTask,
    create,
    getAssigned,
    getTask,
    getTasks,
    getUnassigned,
    getWithYou,
    types
};

module.exports = Task;