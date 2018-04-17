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
    res.status(501);
    res.json({
        code: 0,
        result: "Function not implemented"
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
    console
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

router.get('/:id', function (req, res, next) {
    var result = {};
    var id = Number(req.params.id);

    switch(id) {
        case 1:
            result = {
                id_task: 1,
                id_task_type: 1,
                id_user_owner: 1,
                title: "entregar um documento no centro de sao paulo",
                description: "entregar um documento na rua sao bento, 10, ate as 14h de hoje",
                creation_date: "2017-09-15 20:43:00",
                due_date: "2017-09-15 21:43:00",
                value: 150.90,
                status: "open"
            };
            break;
        default:
            next();
            break;
    }

    res.json(result);
});

router.get('*', function(req, res, next) {
    res.status(404);
    res.render('error', {
        title: 'Erro'
    });
});

module.exports = router;