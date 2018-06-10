var express = require('express');
var Task = require('../models/Task');
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

router.get('/accept/:id', function (req, res, next) {
    var taskid = parseInt(req.params.id) || 0;
    var userid = parseInt(req.session.userid) || 0;

    if (taskid > 0 && userid > 0) {
        Task.acceptTask(taskid, userid, {
            onSuccess: function onSuccess(response) {
                res.json(response);
            },
            onFail: function onFail(err, responseJson) {
                console.log("ERRO");
                console.log(err);
                res.json(responseJson);
            }
        });
    } else {
        res.json({
            code: 0,
            result: "Invalid parameters"
        });
    }
});

router.get('/create', function (req, res, next) {
    res.render('create-task', {
        title: 'Staff - Solicitar Nova Tarefa',
        script: 'tasks'
    });
});

router.post('/create', function (req, res, next) {
    var _deadline = new Date(req.body.deadline || "");

    var title = req.body.title;
    var description = req.body.description;
    var value = parseFloat(req.body.value) || 0;
    var deadline = _deadline.getDate() ? _deadline : new Date();
    var userid = parseInt(req.session.userid) || 0;
    var taskType = parseInt(req.body.taskType) || 0;

    if(!(title && description && value >= 0 && deadline && userid > 0 && taskType > 0)) {
        console.log(title, description, value, deadline, userid, taskType);
        return res.json({
            code: 0,
            result: "Dados inválidos"
        });
    }

    Task.create(title, description, value, deadline, userid, taskType, {
        onSuccess: function onSuccess(response) {
            res.json(response);
        },
        onFail: function onFail(err, responseJson) {
            console.log(err);
            res.json(responseJson);
        }
    });
});

router.get('/delete/:id', function (req, res, next) {
    var taskid = parseInt(req.params.id) || 0;
    var userid = parseInt(req.session.userid) || 0;

    if (taskid > 0 && userid > 0) {
        Task.deleteTask(taskid, userid, {
            onSuccess: function onSuccess(response) {
                res.json(response);
            },
            onFail: function onFail(err, responseJson) {
                console.log("ERRO NA TASK");
                console.log(err);
                res.json(responseJson);
            }
        });
    } else {
        next();
    }
});

router.get('/edit/:id', function (req, res, next) {
    var taskid = parseInt(req.params.id) || 0;
    var userid = parseInt(req.session.userid) || 0;

    if (taskid > 0 && userid > 0) {
        Task.getTask(taskid, userid, {
            onSuccess: function onSuccess(response) {
                if (response.code == 1) {
                    res.render('edit-task', {
                        title: 'Staff - Editando Uma Tarefa',
                        script: 'tasks',
                        task: response.task
                    });
                } else {
                    next();
                }
            },
            onFail: function onFail(err, responseJson) {
                console.log("ERRO NA TASK");
                console.log(err);
                next();
            }
        });
    } else {
        next();
    }
});

router.post('/edit/:id', function (req, res, next) {
    var taskid = parseInt(req.params.id) || 0;
    var userid = parseInt(req.session.userid) || 0;

    var _deadline = new Date(req.body.deadline || "");

    var title = req.body.title;
    var description = req.body.description;
    var value = parseFloat(req.body.value) || 0;
    var deadline = _deadline.getDate() ? _deadline : new Date();
    var taskType = parseInt(req.body.taskType) || 0;

    if(!(taskid > 0 && userid > 0 && title && description && value >= 0 && deadline && taskType > 0)) {
        console.log(taskid, userid, title, description, value, deadline, taskType);
        return res.json({
            code: 0,
            result: "Dados inválidos"
        });
    }

    Task.edit(taskid, userid, title, description, value, deadline, taskType, {
        onSuccess: function onSuccess(response) {
            res.json(response);
        },
        onFail: function onFail(err, responseJson) {
            console.log(err);
            res.json(responseJson);
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

router.get('/finish/:id', function (req, res, next) {
    var taskid = parseInt(req.params.id) || 0;
    var userid = parseInt(req.session.userid) || 0;

    if (taskid > 0 && userid > 0) {
        Task.finish(taskid, userid, {
            onSuccess: function onSuccess(response) {
                res.json(response);
            },
            onFail: function onFail(err, responseJson) {
                console.log("ERRO NA TASK");
                console.log(err);
                res.json(responseJson);
            }
        });
    } else {
        res.json({
            code: 0,
            result: 'Parâmetros inválidos'
        });
    }
});

router.get('/finished', function (req, res, next) {
    res.render('finished-tasks', {
        title: 'Tarefas Concluídas - Staff',
        script: "tasks",
        css: "tasks"
    });
});

router.get('/myfinishedtasks', function (req, res, next) {
    var user_id = parseInt(req.session.userid);

    if (!user_id) {
        return res.json({
            code: 0,
            result: 'Usuário não encontrado'
        });
    }

    Task.getMyFinishedTasks(user_id, {
        onSuccess: function onSuccess(response) {
            res.json(response);
        },
        onFail: function onFail(err, responseJson) {
            console.log("DEU UM ERRO!");
            console.log(err);
            res.json(responseJson);
        }
    });
});

router.get('/tasksfinishedbyme', function (req, res, next) {
    var user_id = parseInt(req.session.userid);

    if (!user_id) {
        return res.json({
            code: 0,
            result: 'Usuário não encontrado'
        });
    }

    Task.getTasksFinishedByMe(user_id, {
        onSuccess: function onSuccess(response) {
            res.json(response);
        },
        onFail: function onFail(err, responseJson) {
            console.log("DEU UM ERRO!");
            console.log(err);
            res.json(responseJson);
        }
    });
});

router.get('/unassigned', function(req, res, next) {
    var user_id = parseInt(req.session.userid);

    if (!user_id) {
        return res.json({
            code: 0,
            result: 'Usuário não encontrado'
        });
    }

    Task.getUnassigned(user_id, {
        onSuccess: function onSuccess(response) {
            res.json(response);
        },
        onFail: function onFail(err, responseJson) {
            console.log("DEU UM ERRO!");
            console.log(err);
            res.json(responseJson);
        }
    });
});

router.get('/assigned', function(req, res, next) {
    var user_id = parseInt(req.session.userid);

    if (!user_id) {
        return res.json({
            code: 0,
            result: "Usuário não encontrado!"
        });
    }

    Task.getAssigned(user_id, {
        onSuccess: function onSuccess(response) {
            res.json(response);
        },
        onFail: function onFail(err, responseJson) {
            console.log('DEU UM ERRO!');
            console.log(err);
            res.json(responseJson);
        }
    });
});

router.get('/withyou', function(req, res, next) {
    var user_id = parseInt(req.session.userid);

    if (!user_id) {
        return res.json({
            code: 0,
            result: "Usuário não encontrado!"
        });
    }

    Task.getWithYou(user_id, {
        onSuccess: function onSuccess(response) {
            res.json(response);
        },
        onFail: function onFail(err, responseJson) {
            console.log('DEU UM ERRO!');
            console.log(err);
            res.json(responseJson);
        }
    });
});

router.get('/types', function(req, res, next) {
    Task.types({
        onSuccess: function onSuccess(response) {
            res.json(response);
        },
        onFail: function onFail(err, responseJson) {
            console.log(err);
            res.json(responseJson);
        }
    });
});

router.get('/:id', function (req, res, next) {
    var taskid = parseInt(req.params.id) || 0;
    var user_id = parseInt(req.session.userid);

    if (!(user_id && taskid > 0)) {
        next();
    }

    Task.getTask(taskid, user_id, {
        onSuccess: function onSuccess(response) {
            if (response.code == 1) {
                res.json(response);
            } else {
                next();
            }
        },
        onFail: function onFail(err, responseJson) {
            console.log(err);
            res.json(responseJson);
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