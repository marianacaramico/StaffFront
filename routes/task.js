var express = require('express');
var router = express.Router();
var Database = require('../helpers/Database');
var TYPES = require('tedious').TYPES;

/* GET Task */
router.get('*', function(req, res, next) {
    if (!req.session.userid) {
        res.redirect("/login");
    } else {
        next();
    }
});

router.get('/', function (req, res, next) {
    var result = {};
    result = {
        count: 2,
        tasks: [
            {
                id_task: 1,
                id_task_type: 1,
                id_user_owner: 1,
                title: "entregar um documento no centro de sao paulo",
                description: "entregar um documento na rua sao bento, 10, ate as 14h de hoje",
                creation_date: "2017-09-15 20:43:00",
                due_date: "2017-09-15 21:43:00",
                value: 150.90,
                status: "open"
            },
            {
                id_task: 2,
                id_task_type: 2,
                id_user_owner: 2,
                title: "bolo de chocolate para uma festa",
                description: "fazer um bolo de chocolate e entregar dia 16 ao meio dia na rua haddock lobo, 595",
                creation_date: "2017-09-15 20:43:00",
                due_date: "2017-09-15 21:43:00",
                "value": 200,
                status: "open"
            }
        ]};

    res.json(result);
});

router.get('/create', function (req, res, next) {
    res.render('create-task', {
        title: 'Staff - Solicitar Nova Tarefa',
        script: 'tasks'
    });
});

router.post('/create', function (req, res, next) {
    var database = new Database();

    var _deadline = new Date(req.body.deadline || "");

    var title = req.body.title;
    var description = req.body.description;
    var value = parseFloat(req.body.value) || 0;
    var deadline = _deadline.getDate() ? _deadline : new Date();
    var userid = parseInt(req.session.userid) || 0;

    var connection = database.connect();

    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            if(!(title && description && value && deadline && userid > 0)) {
                console.log(title, description, value, deadline, userid);
                res.json({
                    code: 0,
                    result: "Dados inválidos"
                });
            } else {
                var queryVerify = "SELECT id_user FROM dbo.TB_USER WHERE id_user = @userid";
                var requestVerify = database.query(queryVerify, connection, function(err, rowCount, rows) {
                    if (rowCount) {
                        var query = "INSERT INTO dbo.TB_TASK(id_task_type, id_user_owner, title, description, creation_date, due_date, value, status) VALUES (1, @userid, @title, @description, GETDATE(), @deadline, @value, 'A'); SELECT @id = @@identity";
                        var responseJson = {
                            code: 0,
                            result: 'Function uninitialized'
                        };
                        var request = database.query(query, connection, function(err, rowCount, rows) {
                            if (err) {
                                responseJson.code = 0;
                                responseJson.result = err;
                                res.json(responseJson);
                            } else {
                                if (rowCount) {
                                    responseJson.code = 1;
                                    responseJson.result = "Tarefa cadastrada com sucesso";
                                    res.json(responseJson);
                                } else {
                                    responseJson.code = 0;
                                    responseJson.result = "Algo deu errado!";
                                    res.json(responseJson);
                                }
                            }
                            connection.close();
                        });
                        request.addParameter('userid', TYPES.Int, userid);
                        request.addParameter('title', TYPES.VarChar, title);
                        request.addParameter('description', TYPES.VarChar, description);
                        request.addParameter('deadline', TYPES.Date, deadline);
                        request.addParameter('value', TYPES.Decimal, value);
                        request.addOutputParameter('id', TYPES.Int);
                        request.on('returnValue', function(parameterName, value, metadata) {
                            responseJson[parameterName] = value;
                        });
                        connection.execSql(request);
                    } else {
                        connection.close();
                        res.json({
                            code: 0,
                            result: "Usuário inválido"
                        });
                    }
                });
                requestVerify.addParameter("userid", TYPES.Int, userid);
                connection.execSql(requestVerify);
            }
        }
    });
});

router.get('/open', function (req, res, next) {
    res.render('open-tasks', {
        title: 'Tarefas em Aberto - Staff',
        script: "tasks",
        css: "tasks"
    });
});

router.get('/unassigned', function(req, res, next) {

    var database = new Database();

    // definir como pegar o usuario corrente
    // req.session.userid
    var user_id = 1;

    var connection = database.connect();

    connection.on('connect', function(err) {
        if (err) {
            console.log('DEU UM ERRO!');
            console.log(err);
            return;
        } else {
            console.log('DEU CERTO!');

            var query = "SELECT T.id_task_type, T.id_user_owner, " +
                "T.title, T.description, T.creation_date, " +
                "T.due_date, T.value, T.status " +
                "FROM TB_TASK T LEFT JOIN TB_AGREEMENT A ON T.id_task = A.id_task " +
                "WHERE (T.id_user_owner = @userid)";
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
                    res.json({
                        code: 1,
                        tasks: result
                    });
                } else {
                    res.json({
                        code: 0,
                        result: "Nenhum registro encontrado"
                    });
                }
            });
            connection.execSql(request);
        }
    });
});

router.get('/assigned', function(req, res, next) {

    var database = new Database();

    // definir como pegar o usuario corrente
    // req.session.userid
    var user_id = 1;

    var connection = database.connect();

    connection.on('connect', function(err) {
        if (err) {
            console.log('DEU UM ERRO!');
            console.log(err);
            return;
        } else {
            console.log('DEU CERTO!');

            var query = "SELECT T.id_task_type, T.id_user_owner, " +
                "T.title, T.description, T.creation_date, " +
                "T.due_date, T.value, T.status " +
                "FROM TB_TASK T INNER JOIN TB_AGREEMENT A ON T.id_task = A.id_task " +
                "WHERE (T.id_user_owner = @userid)";
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
                    res.json({
                        code: 1,
                        tasks: result
                    });
                } else {
                    res.json({
                        code: 0,
                        result: "Nenhum registro encontrado"
                    });
                }
            });
            connection.execSql(request);
        }
    });
});

router.get('/types', function(req, res, next) {

    var database = new Database();

    var connection = database.connect();

    connection.on('connect', function(err) {
        if (err) {
            console.log('DEU UM ERRO!');
            console.log(err);
            return;
        } else {
            console.log('DEU CERTO!');

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
                    res.json({
                        code: 1,
                        tasks: result
                    });
                } else {
                    res.json({
                        code: 0,
                        result: "Nenhum registro encontrado"
                    });
                }
            });
            connection.execSql(request);
        }
    });
});

router.get('/:id', function (req, res, next) {
    var taskid = parseInt(req.params.id) || 0;
    var database = new Database();

    // definir como pegar o usuario corrente
    // req.session.userid
    var user_id = 1;

    var connection = database.connect();

    connection.on('connect', function(err) {
        if (err) {
            console.log('DEU UM ERRO!');
            console.log(err);
            return;
        } else {
            console.log('DEU CERTO!');

            var query = "SELECT T.id_task, T.id_task_type, T.id_user_owner, " +
                "T.title, T.description, T.creation_date, " +
                "T.due_date, T.value, T.status " +
                "FROM TB_TASK T WHERE (T.id_task = @taskid)";
            var request = database.query(query, connection);
            var result = [];
            request.addParameter("taskid", TYPES.Int, taskid);
            request.on('row', function (columns) {
                var _obj = {};
                columns.forEach(column => {
                    _obj[column.metadata.colName] = column.value;
                });
                result.push(_obj);
            });
            request.on('requestCompleted', function () {
                if (result.length) {
                    res.json({
                        code: 1,
                        tasks: result
                    });
                } else {
                    res.json({
                        code: 0,
                        result: "Nenhum registro encontrado"
                    });
                }
            });
            connection.execSql(request);
        }
    });

});

router.get('*', function(req, res, next) {
    res.status(404);
    res.render('error', {
        title: 'Erro'
    });
});

module.exports = router;