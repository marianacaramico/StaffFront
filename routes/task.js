var express = require('express');

var router = express.Router();

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

            var query = "SELECT @id_task_type = T.id_task_type, @id_user_owner = T.id_user_owner, " + 
                        "@title = T.title, @description = T.description, @creation_date = T.creation_date, " + 
                        "@due_date = T.due_date, @value = T.value, @status = T.status " + 
                        "FROM TB_TASK T LEFT JOIN TB_AGREEMENT A ON T.id_task = A.id_task " + 
                        "WHERE (T.id_user_owner = @userid)";
            var request = database.query(query, connection);
            request.addParameter("userid", TYPES.Int, user_id);
            var result = {};
            request.addOutputParameter('id_task_type', TYPES.Int);
            request.addOutputParameter('id_user_owner', TYPES.Int);
            request.addOutputParameter('title', TYPES.VarChar);
            request.addOutputParameter('description', TYPES.Text);
            request.addOutputParameter('creation_date', TYPES.DateTime);
            request.addOutputParameter('due_date', TYPES.DateTime);
            request.addOutputParameter('value', TYPES.Int);
            request.addOutputParameter('status', TYPES.Char);

            request.on('returnValue', function(parameterName, value, metadata) {
                result[parameterName] = value;
            });
            request.on('requestCompleted', function() {
                if (result.id_task_type) {
                    req.session.id_task_type = result.id_task_type;
                    req.session.id_user_owner = result.id_user_owner;
                    req.session.title = result.title;
                    req.session.description = result.description;
                    req.session.creation_date = result.creation_date;
                    req.session.due_date = result.due_date;
                    req.session.value = result.value;
                    req.session.status = result.status;
                    res.redirect("/open");
                } else {
                    res.render('erro-login', {
                        title: 'Ops, não conseguimos fazer o login'
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