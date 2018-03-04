var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    userName: 'firstfive',
    password: 'MmP300rV50',
    server: 'firstfive.database.windows.net',
    options: {
        database: 'firstfive',
        encrypt: true
    }
};

var myFunc = function myFunc(err) {
    if (err) {
        console.log(err);
    } else {
       queryDatabase("SELECT * FROM teste");
    }
};

var connection = new Connection(config);
connection.on('connect', myFunc);

function queryDatabase(query) {
    var request = new Request(query, function(err, rowCount, rows) {
        console.log(rowCount + ' row(s) returned');
        process.exit();
    });
    
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log(column);
        });
    });
    
    connection.execSql(request);
}

