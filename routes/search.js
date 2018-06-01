var express = require('express');
var Task = require('../models/Task.js');
var router = express.Router();

router.get('*', function(req, res, next) {
    if (req.session.userid) {
        next();
    } else {
        res.redirect("/login");
    }
});

/* GET home page. */
router.get('/', function (req, res, next) {
    var userid = parseInt(req.session.userid) || 0;

    if (!userid) {
        return res.redirect('/login');
    }

    Task.getTasks(userid, "", {
        onSuccess: function onSuccess(response) {
            var data = {
                title: "Pesquisa - Staff",
                script: "search",
                css: ["search", "tasks"],
                tasks: (response.code == 1) ? response.tasks : []
            };
            res.render('search', data);
        },
        onFail: function onFail(err) {
            console.log(err);
            next();
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