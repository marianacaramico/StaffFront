var express = require('express');
var router = express.Router();
var TYPES = require('tedious').TYPES;
var Database = require('./helpers/Database');

router.get('/', function(req, res, next) {
    var database = new Database();
    var connection = database.connect();

    connection.on('connect', function(err) {
        if (err) {
            res.json(err);
        } else {
            var result = {};
            var request = database.query("SELECT @username=username, FROM dbo.TB_USER WHERE username = 'mateus.larrubia99@gmail.com' AND password = '1234'", connection);
            request.addOutputParameter('username', TYPES.VarChar);
            request.on('returnValue', function(parameterName, value, metadata) {
                result[parameterName] = value;
            });
            request.on('requestCompleted', function() {
                res.json(result);
            });
            connection.execSql(request);
        }
    });
});

module.exports = router;
