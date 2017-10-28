var express = require('express');

var sql = require('mssql')

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('login');
});

router.post('/', function (req, res, next) {
    // config for your database
    var config = {
        userName: 'firstfive',
        password: 'MmP300rV50',
        server: 'firstfive.database.windows.net',
        options: {
            database: 'firstfive',
            encrypt: true
        }
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
        
        var username = req.body.username;
        var password = req.body.password;
           
        // query to the database and get the records
        var query = "SELECT * FROM TB_USER WHERE username = '" + username + "' AND password = '" + password + "'";
        console.log(query);
        request.query(query, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            
        });
    });
});

module.exports = router;