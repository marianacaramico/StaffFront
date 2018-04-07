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