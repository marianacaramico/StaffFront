var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

function Database() {
    var config = {
        userName: 'firstfive',
        password: 'MmP300rV50',
        server: 'firstfive.database.windows.net',
        options: {
            database: 'firstfive',
            encrypt: true
        }
    };

    var connect = function connect() {
        return new Connection(config);
    }

    var query = function query(queryString = "", callback = defaultCallback) {
        return new Request(queryString, callback);
    }

    function defaultCallback(err, rowCount, rows) {
        if (err) {
            console.log(err);
        } else {
            console.log(rowCount + ' row(s) returned');
        }
    }

    return {
        connect,
        query
    };
}

module.exports = Database;