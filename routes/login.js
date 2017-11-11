var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('login');
});

router.post('/', function (req, res, next) {

    var Connection = require('tedious').Connection;
    var Request = require('tedious').Request;

    var username = req.body.inputEmail;
    var password = req.body.inputSenha;

    var config = {
        userName: 'firstfive',
        password: 'MmP300rV50',
        server: 'firstfive.database.windows.net',
        options: {
            database: 'firstfive',
            encrypt: true
        }
    };
    
    var connection = new Connection(config);
    
    connection.on('connect', function(err) {
    
        if(err) {
         
            console.log('DEU UM ERRO!');
            console.log(err);   
            return;
            
        } else {
            
            console.log('DEU CERTO!');

            if((typeof username === "undefined") || (typeof password === "undefined")) {
                
                console.log('NAO MANDOU USER OU SENHA, MANÉ');
                res.render('erro-login');
                
            } else {

                var query = "SELECT * FROM dbo.TB_USER WHERE username = '" + username + "' AND password = '" + password + "'";
    
                var request = new Request(query, function(err, rowCount) {
                        if (err) {
                            console.log(err);
                        } else {
                            
                            if(rowCount>0) {
                            
                                res.render('home');  
                                
                            } else {
                                
                                res.render('erro-login');
                            }
                            
                        }
                    });
                                        
                    connection.execSql(request);
                }
                
            }

    }
    );



/*
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
    
        if (err) {
         
            console.log('ENTROU AQUI!');
            console.log(err);
            return;   
            
        }

        // create Request object
        var request = new sql.Request();
        
        var username = req.body.username;
        var password = req.body.password;
        
        // Se não passou o username e a senha
        if(username == "" || password == "") {

            console.log('Não passou username ou senha');
            res.render('erro-login');

        } else {
            
            // query to the database and get the records
            var query = "SELECT * FROM TB_USER WHERE username = '" + username + "' AND password = '" + password + "'";
            console.log(query);
            request.query(query, function (err, recordset) {
                
                if (err) {
                  
                    console.log(err);
                    res.render('erro-login');  
                    
                } else {
                    
                    // send records as a response
                    res.send(recordset);
                                    
                }
    
            });            
                        
        }
           
    });
    */
});

module.exports = router;