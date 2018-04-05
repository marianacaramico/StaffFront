var express = require('express');
var router = express.Router();
var TYPES = require('tedious').TYPES;
var Database = require('../helpers/Database');

/* GET USER */
router.get('/:id', function (req, res, next) {
    var id = parseInt(req.params.id) || 0;
    var result = {};

    var database = new Database();
    var connection = database.connect();
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
            next();
        } else {
            var queryString = "SELECT @id = id_user, @name = name, @username = username FROM dbo.TB_USER WHERE id_user = " + id;
            var request = database.query(queryString);
            request.addOutputParameter('id', TYPES.Int);
            request.addOutputParameter('name', TYPES.VarChar);
            request.addOutputParameter('username', TYPES.VarChar);
            request.on('returnValue', function(parameterName, value, metadata) {
                result[parameterName] = value;
            });
            request.on('requestCompleted', function() {
                if (result.id) {
                    res.render('user', {
                        title: result.name + " - Staff",
                        css: "user",
                        script: "tasks",
                        result: result
                    });
                } else {
                    next();
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