var express = require('express');
var router = express.Router();
var Task = require('../models/Task');
var User = require('../models/User');

router.get('*', function (req, res, next) {
    if (!req.session.userid) {
        res.redirect('/login');
    } else {
        next();
    }
});

/* GET USER */
router.get('/:id', function (req, res, next) {
    var userid = parseInt(req.params.id) || 0;
    var myUserid = parseInt(req.session.userid);

    if (!myUserid) {
        return next();
    }

    User.getUser(userid, {
        onSuccess: function onSuccess(response) {
            if (Number(response.code) === 1) {
                Task.getTasksFinishedByMe(userid, {
                    onSuccess: function onInnerSuccess(innerSuccess) {
                        res.render('user', {
                            title: response.result.name + " - Staff",
                            css: ["user", "tasks"],
                            script: ["search", "tasks"],
                            result: response.result,
                            isMyProfile: userid === myUserid,
                            finishedTasks: innerSuccess.tasks || [],
                            userid
                        });
                    },
                    onFail: function onInnerFail(err, responseJson) {
                        console.log(err);
                        next();
                    }
                });
            } else {
                next();
            }
        },
        onFail: function onFail(err, responseJson) {
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